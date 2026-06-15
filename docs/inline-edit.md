# Inline Editable Text

Implement a text field (like label) which is editable on click.
Place in `src/lib/features/dashboard/InlineEditableTextField.svelte`

It renders a label (like html span) by default. On hover it shows a pencil icon at the right end.
On clicking the icon if turns into a text box (identical size, font), and when the user either (A) moves away focus (and the text is also modified) OR (B) Hits enter (irrespective of the text was modified or not), then the box immediately becomes non-editable and the pencil icon is replaced by a spinner and it fires an edit api. The api is out of scope and handled by the prop function:

`onEditText(text: string) => string | Error`

The API contract is that it will update the corresponding text in db (handled by caller), upon success return the new text (should be same as the arg), or error.
In case of error, it shows a red error icon for 5 sec, and reverts to the old text.

It derives the text color, background as inherit.
Make this a reusable Svelte-5 component, add storybook page with relevant stories.
