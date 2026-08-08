# History Experience Blueprint

## Purpose
To chronicle Islamic history (Seerah, Caliphates, scientific golden ages) through rich narratives, timelines, and geographical context.

## Primary User Intentions
- Read the biography of the Prophet (ﷺ) or prominent historical figures.
- Understand the chronology of major Islamic events.
- Explore historical maps and artifacts.

## First-Screen Experience
- **Interactive Timeline**: A horizontal scrolling timeline of major eras.
- **Featured Article**: A highly visual `KnowledgeCard` featuring a significant event or biography.

## Navigation Hierarchy
- **Level 1**: Eras (Prophetic Era, Rashidun, Umayyad, Abbasid, etc.)
- **Level 2**: Events / Biographies List
- **Level 3**: Historical Node (Universal Reader)

## Reading / Task Flow
1. User selects an era or figure.
2. The Universal Reader launches, heavily utilizing the `KnowledgeMedia` component for maps and timelines.

## Universal Knowledge Component Usage
- **KnowledgeMedia**: Central to the history experience (maps, diagrams).
- **KnowledgeExplorer**: Used to jump between related events (e.g., Battle of Badr -> Battle of Uhud).

## Reader Integration
Presents history as long-form narrative text. `Citation` buttons link to primary sources (e.g., Sirat Ibn Hisham) in the `KnowledgePanel`.

## Search Integration
Names, places, and dates are heavily indexed.

## Library Integration
Users can collect biographies into custom collections (e.g., "The Ten Promised Paradise").

## Accessibility Considerations
- All historical maps and diagrams in `KnowledgeMedia` must have extensive `alt` text and captioning.
- Timeline navigation must be fully keyboard accessible (Arrow keys).

## Desktop vs Mobile Behavior
- **Desktop**: Timelines are horizontal and sprawling.
- **Mobile**: Timelines convert to vertical, scrolling lists to fit the viewport.

## Progressive Disclosure Strategy
- Primary narrative is shown. Deep genealogical trees or extended footnotes are moved to the `KnowledgePanel`.

## Future Roadmap (v2/v3)
- **v2**: Interactive GIS maps showing the expansion of the Islamic world.
- **v3**: 3D reconstructions of historical sites (e.g., Prophet's Mosque in 1 AH).
