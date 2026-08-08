# Hadith Experience Blueprint

## Purpose
To organize and present the vast collections of prophetic traditions (Ahadith) with academic rigor, ensuring users can verify authenticity and explore commentary without feeling overwhelmed.

## Primary User Intentions
- Look up a specific Hadith by collection and number.
- Read daily or thematic Hadith collections (e.g., Riyad as-Salihin, 40 Nawawi).
- Verify the grading (Sahih, Da'if) and chain of narration (Isnad).

## First-Screen Experience
- **Hero**: "Hadith of the Day" or a highlighted thematic collection.
- **Browse**: The 6 Major Books (Kutub al-Sittah) displayed in a clean `KnowledgeCollectionView` (Grid).

## Navigation Hierarchy
- **Level 1**: Hadith Home (Books & Collections)
- **Level 2**: Book Chapters (e.g., Book of Revelation, Book of Fasting)
- **Level 3**: Hadith Node (Universal Reader)

## Reading / Task Flow
1. User navigates to a Chapter.
2. A continuous scroll of `KnowledgeCard`s displays the Ahadith.
3. Clicking "Read More" or "Explore" opens the Hadith in the Universal Reader.

## Universal Knowledge Component Usage
- **KnowledgeCard**: Primary display for individual Ahadith in lists.
- **MetadataDisplay**: Critically important here for displaying Grading (e.g., *Sahih*) and Authority.

## Reader Integration
The Universal Reader displays the Matn (text) prominently. The Isnad (chain) is visually subdued (smaller, secondary text) to focus the casual reader on the core message.

## Search Integration
Full-text search across all collections. Results display the collection name and number prominently.

## Library Integration
Users can bookmark Ahadith or save them to thematic collections (e.g., "Patience", "Marriage").

## Accessibility Considerations
- Clear color-coding for Hadith gradings (e.g., Green for Sahih, Yellow for Hasan), but always paired with text to ensure color-blind accessibility.

## Desktop vs Mobile Behavior
- **Desktop**: Persistent left sidebar for navigating chapters while reading.
- **Mobile**: Chapter list is tucked into a top dropdown menu to maximize vertical reading space.

## Progressive Disclosure Strategy
- The chain of narrators (Isnad) is abbreviated by default. Users must click to expand the full chain.
- Biographies of narrators are accessed via the `KnowledgePanel`.

## Future Roadmap (v2/v3)
- **v2**: Interactive Isnad graphs (visualizing the narrator chain).
- **v3**: Cross-collection duplication detection (showing where else the Hadith appears).
