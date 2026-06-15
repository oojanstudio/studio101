# Media storage plan

This starter keeps media strategy explicit early because the editor will eventually combine static templates, user uploads, worker pipelines, and export jobs.

## Template media

Use the `template-media` storage bucket for curated images, videos, overlays, and starter packs.

1. Treat template assets as release-managed content, not user uploads.
2. Store metadata in a future `template_assets` table with fields such as `id`, `kind`, `path`, `thumbnail_path`, `tags`, `license`, `width`, `height`, `duration_ms`, and `status`.
3. Publish via public bucket URLs or a CDN layer because these assets are shared across many users.
4. Keep original files immutable and generate derivatives for previews, poster frames, or editor-friendly transcodes.

## User media

Use the `user-media` storage bucket for uploads and derived exports that belong to a specific account.

1. Keep the bucket private by default.
2. Organize object keys by user and resource type, for example `users/<user-id>/uploads/<asset-id>/original` and `users/<user-id>/exports/<document-id>/<job-id>.mp4`.
3. Track metadata in a future `user_assets` table so editor documents reference asset IDs instead of raw storage paths.
4. Prefer signed URLs for delivery and short-lived upload tokens for large direct uploads.
5. Record transcoding or thumbnail jobs separately so worker failures do not corrupt the base asset record.

## Document linkage

Add a junction table once the editor persists placed media.

1. `document_assets`: `document_id`, `asset_id`, `asset_source`, `placement_json`, `timeline_json`, `created_at`.
2. Keep `asset_source` explicit, for example `template` or `user`, so migrations to separate services stay straightforward.
3. Avoid storing long storage URLs in documents. Store stable asset IDs and resolve URLs at read time.

## Document payload

The `documents` table includes a `doc_payload` column of type `jsonb` for storing design content.

1. Schema is open and not validated at the database level; shape is application-defined.
2. Typical payload includes:
   - `layers`: Array of layer objects with properties like `id`, `name`, `type`, `x`, `y`, `width`, `height`, `fill`, etc.
   - `canvas`: Canvas dimensions and metadata.
   - Additional metadata or properties as needed by the editor.
3. Payload is NOT fetched in dashboard (only fetched when viewing/editing a single document).
4. New documents are created with a default payload containing a single background layer (512×512, red).
5. Users can edit payload via the editor interface; updates are validated client-side (JSON parse check) and stored directly without schema validation.
