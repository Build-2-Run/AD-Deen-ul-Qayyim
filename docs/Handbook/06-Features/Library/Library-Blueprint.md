# Library Blueprint

## Purpose
To provide the user with a unified, private space for their bookmarks, notes, history, and custom collections across all ADQ modules.

## Primary User Intentions
- Resume reading the Quran or a Hadith book.
- Review personal notes taken during study.
- Access custom collections (e.g., "My Friday Routine").

## First-Screen Experience
- **Tabbed Interface**: Clean tabs for Bookmarks, History, Collections, and Notes.
- **Empty States**: Beautiful, encouraging illustrations if the user has no saved items, explaining how to use the feature.

## Navigation Hierarchy
- **Level 1**: Library Hub (Tabs)
- **Level 2**: Specific Collection View
- **Level 3**: Deep link back to the Universal Reader

## Reading / Task Flow
1. User opens Library.
2. User browses "History" to find an article they read yesterday.
3. Clicking the node transports them seamlessly back to the exact scroll position in the Universal Reader.

## Universal Knowledge Component Usage
- Heavily utilizes the `KnowledgeCollection` component in various modes (`grid`, `comfortable-list`, `compact-list`).
- Ensures visual consistency—a Quran bookmark looks like a Quran card, a Fiqh bookmark looks like a Fiqh card.

## Reader Integration
The Library itself does not use the Reader, but every item in the Library acts as a portal *into* the Reader.

## Search Integration
Local search filters allow the user to instantly search within their own notes and bookmarks.

## Library Integration
*This is the Library.*

## Accessibility Considerations
- Bulk actions (e.g., "Delete all history") must have clear confirmation dialogs.

## Desktop vs Mobile Behavior
- **Desktop**: Grid layouts for Collections.
- **Mobile**: Compact lists to maximize screen space.

## Progressive Disclosure Strategy
- Notes are truncated in the list view; users must click to expand the full note.

## Future Roadmap (v2/v3)
- **v2**: Local JSON export/import of Library data for backup.
- **v3**: Offline-first encrypted cloud sync.
