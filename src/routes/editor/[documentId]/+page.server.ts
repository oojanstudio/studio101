import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const BUCKET = 'user-media';

export const load: PageServerLoad = async ({ locals, params }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, '/login');
  }

  const [
    { data: document, error: documentError },
    { data: mediaFiles, error: mediaError },
    { data: thumbnails, error: thumbnailError }
  ] = await Promise.all([
    locals.supabase
      .from('documents')
      .select('id, title, content, doc_payload, created_at, updated_at')
      .eq('id', params.documentId)
      .single(),
    locals.supabase
      .from('document_media')
      .select('id, file_name, mime_type, size_bytes, storage_path, created_at')
      .eq('document_id', params.documentId)
      .order('created_at', { ascending: false }),
    locals.supabase
      .from('doc_thumbnails')
      .select('id, sequence_number, file_name, mime_type, size_bytes, storage_path, created_at')
      .eq('document_id', params.documentId)
      .order('sequence_number', { ascending: true })
  ]);

  if (documentError) {
    throw error(404, documentError.message);
  }

  const mediaFilesWithUrls = await Promise.all(
    (mediaFiles ?? []).map(async (item) => {
      const { data: signedData, error: signedError } = await locals.supabase.storage
        .from(BUCKET)
        .createSignedUrl(item.storage_path, 60 * 60);

      return {
        ...item,
        media_url: signedError ? null : (signedData?.signedUrl ?? null)
      };
    })
  );

  const thumbnailsWithUrls = await Promise.all(
    (thumbnails ?? []).map(async (item) => {
      const { data: signedData, error: signedError } = await locals.supabase.storage
        .from(BUCKET)
        .createSignedUrl(item.storage_path, 60 * 60);

      return {
        ...item,
        thumbnail_url: signedError ? null : (signedData?.signedUrl ?? null)
      };
    })
  );

  return {
    document,
    mediaFiles: mediaFilesWithUrls,
    mediaError: mediaError?.message ?? null,
    thumbnails: thumbnailsWithUrls,
    thumbnailError: thumbnailError?.message ?? null,
    payloadError: null
  };
};

export const actions: Actions = {
  uploadMedia: async ({ locals, params, request }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/login');

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { uploadError: 'No file provided.' });
    }

    const allowedTypes = ['image/', 'video/'];
    if (!allowedTypes.some((prefix) => file.type.startsWith(prefix))) {
      return fail(400, { uploadError: 'Only image and video files are allowed.' });
    }

    const maxBytes = 50 * 1024 * 1024; // 50 MB
    if (file.size > maxBytes) {
      return fail(400, { uploadError: 'File exceeds the 50 MB limit.' });
    }

    const mediaId = crypto.randomUUID();
    const storagePath = `${user.id}/${params.documentId}/${mediaId}/${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: storageError } = await locals.supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: false });

    if (storageError) {
      return fail(500, { uploadError: storageError.message });
    }

    const { error: dbError } = await locals.supabase.from('document_media').insert({
      document_id: params.documentId,
      owner_id: user.id,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath
    });

    if (dbError) {
      // Best-effort: clean up the orphaned storage object
      await locals.supabase.storage.from(BUCKET).remove([storagePath]);
      return fail(500, { uploadError: dbError.message });
    }

    return { uploadSuccess: true };
  },

  uploadThumbnail: async ({ locals, params, request }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/login');

    const formData = await request.formData();
    const file = formData.get('file');
    const sequenceRaw = String(formData.get('sequenceNumber') ?? '').trim();

    if (!(file instanceof File) || file.size === 0) {
      return fail(400, { thumbnailUploadError: 'No screenshot provided.' });
    }

    if (!file.type.startsWith('image/')) {
      return fail(400, { thumbnailUploadError: 'Only image files are allowed for thumbnails.' });
    }

    const maxBytes = 20 * 1024 * 1024; // 20 MB
    if (file.size > maxBytes) {
      return fail(400, { thumbnailUploadError: 'Thumbnail exceeds the 20 MB limit.' });
    }

    let sequenceNumber: number;
    if (sequenceRaw.length > 0) {
      sequenceNumber = Number.parseInt(sequenceRaw, 10);
      if (!Number.isInteger(sequenceNumber) || sequenceNumber < 1) {
        return fail(400, { thumbnailUploadError: 'Sequence must be an integer starting at 1.' });
      }
    } else {
      const { data: maxRow, error: maxError } = await locals.supabase
        .from('doc_thumbnails')
        .select('sequence_number')
        .eq('document_id', params.documentId)
        .order('sequence_number', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (maxError) {
        return fail(500, { thumbnailUploadError: maxError.message });
      }

      sequenceNumber = (maxRow?.sequence_number ?? 0) + 1;
    }

    const thumbnailId = crypto.randomUUID();
    const storagePath = `${user.id}/${params.documentId}/thumbnails/${thumbnailId}/${file.name}`;

    const arrayBuffer = await file.arrayBuffer();
    const { error: storageError } = await locals.supabase.storage
      .from(BUCKET)
      .upload(storagePath, arrayBuffer, { contentType: file.type, upsert: false });

    if (storageError) {
      return fail(500, { thumbnailUploadError: storageError.message });
    }

    const { error: dbError } = await locals.supabase.from('doc_thumbnails').insert({
      document_id: params.documentId,
      owner_id: user.id,
      sequence_number: sequenceNumber,
      file_name: file.name,
      mime_type: file.type,
      size_bytes: file.size,
      storage_path: storagePath
    });

    if (dbError) {
      await locals.supabase.storage.from(BUCKET).remove([storagePath]);
      return fail(500, {
        thumbnailUploadError:
          dbError.code === '23505'
            ? `Sequence ${sequenceNumber} is already used for this document.`
            : dbError.message
      });
    }

    return { thumbnailUploadSuccess: true };
  },

  deleteMedia: async ({ locals, params, request }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/login');

    const formData = await request.formData();
    const mediaId = String(formData.get('mediaId') ?? '').trim();

    if (!mediaId) return fail(400, { deleteError: 'Missing media ID.' });

    const { data: row, error: fetchError } = await locals.supabase
      .from('document_media')
      .select('storage_path')
      .eq('id', mediaId)
      .eq('owner_id', user.id)
      .single();

    if (fetchError || !row) {
      return fail(404, { deleteError: 'Media file not found.' });
    }

    await locals.supabase.storage.from(BUCKET).remove([row.storage_path]);

    const { error: deleteError } = await locals.supabase
      .from('document_media')
      .delete()
      .eq('id', mediaId)
      .eq('owner_id', user.id);

    if (deleteError) {
      return fail(500, { deleteError: deleteError.message });
    }

    return { deleteSuccess: true };
  },

  updatePayload: async ({ locals, params, request }) => {
    const { user } = await locals.safeGetSession();
    if (!user) throw redirect(303, '/login');

    const formData = await request.formData();
    const payloadStr = String(formData.get('payload') ?? '').trim();

    if (!payloadStr) {
      return fail(400, { payloadError: 'Payload cannot be empty.' });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(payloadStr);
    } catch {
      return fail(400, { payloadError: 'Invalid JSON syntax.' });
    }

    const { error: updateError } = await locals.supabase
      .from('documents')
      .update({ doc_payload: payload })
      .eq('id', params.documentId)
      .eq('owner_id', user.id);

    if (updateError) {
      return fail(500, { payloadError: updateError.message });
    }

    return { payloadUpdateSuccess: true };
  }
};