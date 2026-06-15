# Doc thumbnails. - Part 2

In the dasboard page, incorporate the thumbnails loaded from `doc_thumbnails`.
Since one doc can have multiple thumbnails, it is expensive to fire multiple queries one for each doc. Instead, fetch all thumbnails by a single query, group them by doc id, sort by order id, and display them against the doc preview widget in the dashboard page.

There are 2 ways to implement the doc thumbnails query, listed below. Implement both, pick the right one based on args.

- Select _all_ doc thumbnails of all docs, then do the organising in FE.
- Select doc thumbnails for an explicit list of doc ids provided in the query. If using this approach, this query has to be fired after the doc summaries are completely fetched, and cannot be run in paralle.
- Based on a boolean flag (telling which one to use), and an optional explicit list of doc ids, return the thumbnail data necessary to render them in the doc summary widget.

The doc summary widget has to be implemented. Implement this as `DocSummaryBox.svelte` in `src/routes/dashboard`. Use the mockup image image pasted here. It has the first thumbnail, left-right arrows to navigate through the thumbnails. Last edited time (Implement this duration logic in a TS helper / util lib with unit tests), and doc type. For doc type always use "design file" for now. At the top of the summary card there is the title, and checkbox to select the box (e.g. among a grid view of many summary boxes).

Add storybook pages for `DocSummaryBox.svelte`, variations: Single thumbnail, 3 thumbnails, mo thumbnail (use a dummy graphic), selected vs unselected, last edited being xx seconds ago, xx days ago.
