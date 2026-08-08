# Fiqh Experience Blueprint

## Purpose
To provide clear, actionable Islamic jurisprudence (Fiqh) rulings and explanations in a structured, comparative, and highly accessible format.

## Primary User Intentions
- Find the ruling on a specific everyday issue (e.g., Wudu, fasting rules).
- Understand the evidence (Dalil) behind a ruling.
- Compare views across different Madhahib (Schools of Thought) if desired.

## First-Screen Experience
- **Search-Centric**: A large, prominent search bar ("What ruling are you looking for?").
- **Categories**: Grid of primary Fiqh topics (Taharah, Salah, Zakat, Sawm, Hajj, Nikah, Buyu').

## Navigation Hierarchy
- **Level 1**: Fiqh Home (Search & Topic Grid)
- **Level 2**: Sub-topic List (e.g., Taharah -> Rules of Wudu)
- **Level 3**: The Fiqh Node (Ruling & Evidence)

## Reading / Task Flow
1. User browses to a topic or searches a question.
2. The user reads a structured breakdown: Summary -> Detailed Ruling -> Evidence -> Exceptions.

## Universal Knowledge Component Usage
- **KnowledgeBreadcrumb**: Essential for showing the path (e.g., Fiqh > Worship > Fasting > Nullifiers).
- **RelatedKnowledge**: Highly utilized to link related rulings (e.g., linking "Missed Fasts" to "Fidyah").

## Reader Integration
Fiqh nodes use a highly structured Universal Reader format with clear headings, bullet points, and inline `CitationPreview` components linking back to Quran/Hadith.

## Search Integration
Intense focus on keyword synonyms (e.g., "Ablution" pointing to "Wudu"). 

## Library Integration
Users save rulings to their Personal Library for quick reference.

## Accessibility Considerations
- Highly scannable text. 
- Use of clear icons (e.g., Checkmarks for permitted, X for forbidden) paired with bold text.

## Desktop vs Mobile Behavior
- **Desktop**: Table of contents (TOC) floats on the right side of the Reader for long, complex rulings.
- **Mobile**: TOC is accessible via a sticky bottom bar or collapsible top menu.

## Progressive Disclosure Strategy
- The "Summary Ruling" is shown immediately.
- The "Detailed Evidence" (Quran/Hadith citations) and "Scholarly Differences" are hidden behind accordions or the `KnowledgePanel`.

## Future Roadmap (v2/v3)
- **v2**: Madhab toggles (allow users to set a default school of thought to prioritize those rulings).
- **v3**: Interactive Q&A flow to arrive at a ruling based on user-provided variables.
