# Search Blueprint

## Purpose
To provide a lightning-fast, highly tolerant, and universally accessible global search across all ADQ knowledge domains.

## Primary User Intentions
- Find a specific Ayah by English translation or Arabic keyword.
- Jump quickly to a specific Surah or Hadith collection.
- Look up a Fiqh ruling or historical event.

## First-Screen Experience
- **Global Overlay**: Summoned via `Ctrl/Cmd + K` or a prominent search icon. Blurs the background to focus entirely on the search task.
- **Zero-State**: Before typing, shows "Recent Searches" and "Suggested Topics".

## Navigation Hierarchy
- **Level 1**: Search Input & Live Results
- **Level 2**: Deep link to specific Node (Universal Reader)

## Reading / Task Flow
1. User opens search and types "Fasting".
2. Results are grouped instantly by Module (Quran, Hadith, Fiqh).
3. User navigates results via Keyboard Arrows (Desktop) or touch.
4. Hitting Enter opens the node.

## Universal Knowledge Component Usage
- **KnowledgeCard**: Used in a heavily compacted form for search results to fit maximum information vertically.

## Reader Integration
Search results always open in the Universal Reader. The Reader should highlight the search term that triggered the result.

## Search Integration
*This is the Search module.*

## Library Integration
Searches prioritize matching the user's personal notes and bookmarks before searching the global database.

## Accessibility Considerations
- Full keyboard navigation (Arrows, Esc, Enter) is mandatory.
- Screen readers must announce "X results found" dynamically as the user types.

## Desktop vs Mobile Behavior
- **Desktop**: A floating command-palette style dialog in the center of the screen.
- **Mobile**: Expands to take over the entire screen, bringing up the software keyboard immediately.

## Progressive Disclosure Strategy
- Initially shows top 3 results per module. Users must click "See all Fiqh results" to expand a specific domain.

## Future Roadmap (v2/v3)
- **v2**: NLP (Natural Language Processing) to handle queries like "What does the Quran say about the ocean?".
- **v3**: Arabic phonetic search (typing "Bismillah" in English alphabet matches the Arabic text).
