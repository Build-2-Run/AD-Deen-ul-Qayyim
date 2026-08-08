# Empty States (UX)

Empty states occur when there is no data to display (e.g., a search with no results, an empty bookmarks list, or a feature yet to be used). In ADQ, empty states must be helpful, not dead ends.

## Design Rules

1. **Clear Communication**
   - Explicitly state *why* the screen is empty (e.g., "No bookmarks yet," "No results found for 'xyz'").

2. **Actionable Recovery**
   - Provide a clear next step. 
   - If a search yields no results, suggest checking spelling or provide links to broad categories.
   - If a saved list is empty, provide a button to "Explore Content" to start saving.

3. **Visual Aesthetics**
   - Empty states should look intentional.
   - Use a muted, monochromatic icon (from the standard icon set) centered above the text to anchor the layout visually.
   - Do not use large, cartoonish illustrations. Maintain the calm, elegant aesthetic.

4. **Consistency**
   - Standardize the layout for empty states across the application:
     - Center-aligned.
     - 48px/64px muted icon.
     - `Heading level 3` or `4` for the title.
     - `Body` (secondary variant) for the description.
     - `Button` for the primary recovery action.
