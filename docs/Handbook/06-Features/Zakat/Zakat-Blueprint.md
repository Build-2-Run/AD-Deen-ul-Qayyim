# Zakat Blueprint

## Purpose
To provide a private, highly accurate, and mathematically sound calculator and ledger for fulfilling the obligation of Zakat.

## Primary User Intentions
- Calculate Zakat accurately across various asset classes (Gold, Fiat, Stocks, Business Inventory).
- Understand the Fiqh rules governing these calculations.
- Track Zakat payments over multiple years.

## First-Screen Experience
- **The Ledger**: A clean summary of total Zakatable assets, liabilities, and the final Zakat due.
- **Action**: A prominent "Start Calculation / Update Assets" button.

## Navigation Hierarchy
- **Level 1**: Zakat Dashboard
- **Level 2**: Asset Input Forms (Cash, Gold, Silver, Investments)
- **Level 3**: Fiqh Explanations

## Reading / Task Flow
1. User enters the calculator flow.
2. Step-by-step wizard collects asset data.
3. System outputs the final calculation.

## Universal Knowledge Component Usage
- **KnowledgePanel**: Used extensively to explain the Fiqh behind a specific input field (e.g., "What is the Nisab for Gold?").

## Reader Integration
The Universal Reader is used for deep-dive tutorials on Zakat principles.

## Search Integration
Searching "Zakat on Stocks" bypasses the general Fiqh rulings and links directly to the specific input field in the Zakat calculator.

## Library Integration
Calculation summaries are saved securely to the user's local Library (no cloud sync for privacy).

## Accessibility Considerations
- Input fields must be massive, with clear localized currency formatting.
- Error states (e.g., negative numbers) must use inline validation as per the Feedback System.

## Desktop vs Mobile Behavior
- **Desktop**: Forms and real-time calculation summary are shown side-by-side.
- **Mobile**: The summary sticks to the bottom of the screen while the user scrolls through the input form.

## Progressive Disclosure Strategy
- Complex asset classes (e.g., Agricultural produce, Livestock) are hidden behind an "Advanced Assets" toggle to keep the UI clean for the 95% of users who only have fiat and gold.

## Future Roadmap (v2/v3)
- **v2**: Live API integration for real-time Gold/Silver Nisab prices and currency conversion.
- **v3**: End-to-end encrypted cloud sync for multi-device ledger tracking.
