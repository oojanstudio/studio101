# Document Payload

In the supabase document table, we need a payload column to store the design content. Use `jsonb` data type with open schema, i.e. no strict JSON schema validation at db level.
Name the column `doc_payload`, type `jsonb`.

Generate SQL modification section in `db/supabase/init.sql`. Update `docs/media-storage-plan.md` at the end.

The payload is not fetched in the dashboard page where we fetch the summaries of all docs.
It is fetched in the editor page where we edit / view one specific doc.

In the editor page, first do one round of cleanup. Remove the static panels (leftmost redundant column, "Ready for external editor package"). Keep the sections for uploaded media and thumbnails at the right.
In the main panel where it renders the details in a elevated card, it currently shows only the title.
There add below the title summary fields like: `Created`, `Last updated` as timestamp (upto date, HH:MM)

The payload JSON should contain data about layers, each layer has name, dimensions, shapes etc. For now use some dummy data.

Then below it render the payload, in a `<textarea>` for now. Have a `UPDATE` button to let user edit and update the payload. So simple JSON parse check (no schema validation). And of course during page load the payload is fetched and shown in the text area.
And when a new doc is created there also we need some valid payload. Use a dummy content that indicates a single layer of dimension 512x512, background red.

To display the payload implement a component `DocRawPayload.svelte` which contains the initial value, and `onSaveNewPayload(content: string)`. Have storybook page.
