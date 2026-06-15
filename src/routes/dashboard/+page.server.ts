import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

interface ThumbnailsByDocId {
  [documentId: string]: Array<{
    id: string;
    sequence_number: number;
    file_name: string;
    mime_type: string;
    size_bytes: number;
    storage_path: string;
    created_at: string;
    thumbnail_url: string | null;
  }>;
}

export const load: PageServerLoad = async ({ locals, url }) => {
  const { user } = await locals.safeGetSession();

  if (!user) {
    throw redirect(303, '/login');
  }

  const { data: documents, error } = await locals.supabase
    .from('documents')
    .select('id, title, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    return {
      documents: [],
      documentsError: error.message,
      thumbnailsByDocId: {}
    };
  }

  const docList = documents ?? [];
  
  // Choose strategy based on query param: fetchAllThumbnails=true (strategy 1) or false (strategy 2)
  const fetchAllThumbnails = url.searchParams.get('fetchAllThumbnails') === 'true';
  let thumbnailsByDocId: ThumbnailsByDocId = {};

  if (fetchAllThumbnails) {
    // Strategy 1: Fetch ALL doc thumbnails, organize in FE
    const { data: allThumbnails, error: thumbError } = await locals.supabase
      .from('doc_thumbnails')
      .select('id, document_id, sequence_number, file_name, mime_type, size_bytes, storage_path, created_at')
      .order('sequence_number', { ascending: true });

    if (!thumbError && allThumbnails) {
      // Generate signed URLs and group by document_id
      for (const thumb of allThumbnails) {
        const { data: urlData } = await locals.supabase.storage
          .from('user-media')
          .createSignedUrl(thumb.storage_path, 3600);

        if (!thumbnailsByDocId[thumb.document_id]) {
          thumbnailsByDocId[thumb.document_id] = [];
        }
        thumbnailsByDocId[thumb.document_id].push({
          id: thumb.id,
          sequence_number: thumb.sequence_number,
          file_name: thumb.file_name,
          mime_type: thumb.mime_type,
          size_bytes: thumb.size_bytes,
          storage_path: thumb.storage_path,
          created_at: thumb.created_at,
          thumbnail_url: urlData?.signedUrl ?? null
        });
      }
    }
  } else {
    // Strategy 2: Fetch thumbnails for explicit list of doc IDs
    if (docList.length > 0) {
      const docIds = docList.map(d => d.id);
      const { data: docThumbnails, error: thumbError } = await locals.supabase
        .from('doc_thumbnails')
        .select('id, document_id, sequence_number, file_name, mime_type, size_bytes, storage_path, created_at')
        .in('document_id', docIds)
        .order('sequence_number', { ascending: true });

      if (!thumbError && docThumbnails) {
        // Generate signed URLs and group by document_id
        for (const thumb of docThumbnails) {
          const { data: urlData } = await locals.supabase.storage
            .from('user-media')
            .createSignedUrl(thumb.storage_path, 3600);

          if (!thumbnailsByDocId[thumb.document_id]) {
            thumbnailsByDocId[thumb.document_id] = [];
          }
          thumbnailsByDocId[thumb.document_id].push({
            id: thumb.id,
            sequence_number: thumb.sequence_number,
            file_name: thumb.file_name,
            mime_type: thumb.mime_type,
            size_bytes: thumb.size_bytes,
            storage_path: thumb.storage_path,
            created_at: thumb.created_at,
            thumbnail_url: urlData?.signedUrl ?? null
          });
        }
      }
    }
  }

  return {
    documents: docList,
    documentsError: null,
    thumbnailsByDocId
  };
};

export const actions: Actions = {
  createDocument: async ({ locals, request }) => {
    const { user } = await locals.safeGetSession();

    if (!user) {
      throw redirect(303, '/login');
    }

    const formData = await request.formData();
    const title = String(formData.get('title') ?? '').trim();

    if (!title) {
      return fail(400, { createError: 'Provide a title before creating a design.' });
    }

    const defaultPayload = {
      layers: [
        {
          id: crypto.randomUUID(),
          name: "Background",
          type: "rectangle",
          width: 512,
          height: 512,
          x: 0,
          y: 0,
          fill: "#FF0000"
        }
      ],
      canvas: {
        width: 512,
        height: 512
      }
    };

    const { data, error } = await locals.supabase
      .from('documents')
      .insert({
        owner_id: user.id,
        title,
        content: 'Starter canvas document created from the dashboard bootstrap flow.',
        doc_payload: defaultPayload
      })
      .select('id')
      .single();

    if (error || !data) {
      return fail(500, { createError: error?.message ?? 'Document creation failed.' });
    }

    throw redirect(303, `/editor/${data.id}`);
  }
};