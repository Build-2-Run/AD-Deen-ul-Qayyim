# Mirath (Inheritance) Blueprint

## Purpose
To demystify the complex mathematics of Islamic Inheritance (Mirath/Fara'id) into a simple, visual, and educational flow.

## Primary User Intentions
- Calculate the exact fractional shares for a specific family structure.
- Understand the Quranic verses that mandate these shares.

## First-Screen Experience
- **Family Builder**: A visual, tree-like interface starting with the deceased, prompting the user to add surviving relatives.

## Navigation Hierarchy
- **Level 1**: Mirath Builder
- **Level 2**: Results Dashboard (Fractions and visual pie charts)
- **Level 3**: Evidence (`KnowledgePanel`)

## Reading / Task Flow
1. User answers binary questions (e.g., "Is the father alive?", "How many sons?").
2. The engine calculates the shares and handles blocking rules (Hajb).
3. The user views the result as a clean data visualization.

## Universal Knowledge Component Usage
- **KnowledgeCard**: Used to display the final result for a specific relative, including their share (e.g., 1/8th) and the reason.
- **CitationPreview**: Linked heavily to Surah An-Nisa (4:11-12) to show the exact textual proof for a calculation.

## Reader Integration
Minimal. Mirath is highly interactive, so the Reader is only used for introductory articles on the philosophy of Islamic wealth distribution.

## Search Integration
"Mirath" or "Inheritance" routes directly to the builder tool.

## Library Integration
Users can save specific family structures (scenarios) to their Library for study or reference.

## Accessibility Considerations
- Data tables must be provided as alternatives to pie charts and visual trees for screen readers.
- High contrast for fraction typography.

## Desktop vs Mobile Behavior
- **Desktop**: The Family Tree builder and the Results chart update simultaneously on a wide screen.
- **Mobile**: A step-by-step wizard flow replaces the visual tree to save screen real estate.

## Progressive Disclosure Strategy
- The complex algorithmic steps (e.g., calculating the base problem "Asl al-Mas'alah" or handling "Awal") are hidden by default. Only the final shares are shown unless the user clicks "Show Calculation Steps."

## Future Roadmap (v2/v3)
- **v2**: Export to PDF functionality for legal reference.
- **v3**: Edge-case calculators (e.g., missing persons, hermaphrodites, simultaneous deaths).
