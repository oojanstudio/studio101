# SvelteKit + Supabase app

Build a SvelteKit (uses Svelte-5 runes) app backed by Supabase for storage, auth etc.

It is a canva like design editor where user can create visually stunning designs using canvas, images, shapes etc, and export to media files.

## Source Layout

This will be a large scale app with various components. Later some of these components will be moved into their own repos / packages, but it is important to keep logical separation from the beginning. Some logical components / features are like:

- Collection of light-interactivity pages for login, dashboard, browse media images and videos, etc.
- One heavy interactivity SPA like page for the actual editor.
- Component libraries, grouped into shared pieces used in various pages, and those used exclusively in the editor.
- It used Web-Worker, so web-worker library for offloaded client side tasks, and client library to manage them (from the main thread).
- Some UI components in the editor opens an iframe in a popup, so the underlying pages for the iframe.
- It also has a pre-built C++ webassembly file (wasm binary and glue JS) used only inside the editor, via a web-worker, dedicated forder for that. However these need not be implemented now. There are already existing repos with many of these functionalities implemented.

So the entrie source directory (`/src`) needs to be organized into many top-level pieces unlike othe Svelte-kit apps. You are required to plan a clean extensible directory layout for source.

Start with initial set of pages (login, home, about, editor). The pages are SvelteKit pages e.g. `+page.svelte`, `+layout.svelte`.

Add starter tests.

## Backend apis

It uses Supabase for auth, backend store, media store.
The top level `/db` folder has the initial sql file describing thhe supabase schemas. The Supabase secrets are read from the `.env` file. See `.env.example` it will be similar.

## Features

- Login page for email login and Google SSO login. The Gmail provider is enabled in supabase, it should call the right supabase api.
- A dummy dashboard bage where user can see his own docs, create a new one or open an existing one.
- The editor page, this will be a complex Svelte-5 app. The editor component is already implemented in a different repo and needs to be integrated here.

## Frameworks used

- Use Node for runtime, `pnpm` as package manager.
- Use the right adapter to run the built version as backend app in cloud VPA server.
- Use vitest for test
- Integrate with storybook for component testing. Add some dummy Svelte-5 components and their storybook pages.
- Set up top level CSS tokens (theme, font etc)
- Have a public dir for assets.

# Side tasks

- Add instructions (in a md file) listing the required steps in Supabase dashboard. An initial sql file is added which gives the current state of the db, add what else ened to be added.
- Plan how to store template media - images and videos
- Plan how to store user media - images and videos

---

I want the users to be able to add their own media files (image, video) to database and use them in the editor. The media files will be scoped to a specific document owned by the user (Similar to how one Canva design file can have many images).

(1) First flesh out the necessary schema changes, bucket creation instructions (on Supabase side). Feel free to augment `db/supabase/init.sql`.

(2) You may add the file upload ferature right inside the editor page. It should upload the file to supabase.

- Take the file name, mime type, size, created timestamp.
- The editor page should also list the available files under that document, and link to delete each.
