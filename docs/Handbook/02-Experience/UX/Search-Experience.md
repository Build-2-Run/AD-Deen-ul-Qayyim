# Search Experience (UX)

The ADQ Search is a global, omnipresent utility designed for immediate answers and deep exploration.

## Interaction Philosophy

1. **Keyboard-First & Omnipresent**
   - Search should be accessible from anywhere without traversing menus.
   - **Desktop**: `Cmd/Ctrl + K` instantly opens the search overlay.
   - **Mobile**: A persistent search icon in the bottom navigation or top app bar.

2. **Overlay vs. Page**
   - Search is an overlay (`Dialog`), not a destination page. This preserves the user's current context (e.g., maintaining their place in a Surah while they quickly look up a Hadith).

3. **Progressive States**
   - **Empty State**: Immediately upon opening, before typing, present actionable value:
     - *Recent Searches*: Allow quick resumption of past queries.
     - *Suggested Topics*: Curated entry points (e.g., "Zakat Calculator", "Morning Adhkar").
   - **Typing State (As-you-type)**: Results populate instantly without requiring a hard `Enter` press.

4. **Grouped Results**
   - Results are never a flat list. They are categorized by domain (Quran, Hadith, Tools, History) to provide immediate context.
   - Each result uses rich iconography to visually distinguish its type.

5. **Navigation**
   - Fully keyboard navigable (`Arrow Up/Down` to select, `Enter` to navigate).
   - Visual focus rings must be prominent and conform to the ADQ Design System colors.
