# Component Guidelines

This document defines the reusable visual components for the ADQ platform. Components are the building blocks of the UI. Their behavior must remain consistent regardless of which product module they are placed in.

*(Note: This document describes purpose and behavior, not implementation code.)*

---

## 1. Buttons
- **Purpose:** Trigger actions (e.g., Save, Next, Calculate).
- **Behavior:** 
  - **Primary Buttons:** Solid background (e.g., ADQ Emerald). Used for the single most important action on a screen.
  - **Secondary Buttons:** Outlined or subtle background. Used for alternative actions.
  - **Tertiary/Ghost Buttons:** Text only with no border. Used for low-priority actions (e.g., "Cancel") to reduce visual noise.
- **Constraints:** Must provide clear hover and focus states (opacity shift or subtle shadow).

## 2. Cards
- **Purpose:** Group related information into a single distinct block.
- **Behavior:**
  - Used heavily in Dashboards (e.g., a "Daily Salah" card).
  - Cards should have a subtle border or a very soft drop shadow to lift them slightly off the background.
  - **Hover:** Interactive cards (acting as large buttons) lift slightly on hover.

## 3. Lists
- **Purpose:** Display homogeneous data vertically.
- **Behavior:**
  - Used in Settings menus or Table of Contents (e.g., listing Surahs).
  - List items must have clear dividing lines (hairlines) or distinct background hover states to ensure horizontal tracking for the user's eye.

## 4. Panels (Sidebars, Bottom Sheets)
- **Purpose:** Display secondary or contextual information without leaving the current view.
- **Behavior:**
  - Panels slide in smoothly.
  - They must include a clear, accessible "Close" (X) button.
  - Background content often dims slightly (scrim) to focus attention on the panel, unless the panel is designed to be used simultaneously with the main text.

## 5. Reader Blocks (Knowledge Nodes)
- **Purpose:** The core presentation of a canonical text (e.g., an Ayah or Hadith).
- **Behavior:**
  - Arabic text sits prominent and right-aligned (RTL).
  - Translations sit below, left-aligned (LTR).
  - Action icons (Bookmark, Copy, Play Audio) remain invisible or highly dimmed until the user hovers or taps the block, preventing reading distraction.

## 6. Search Results
- **Purpose:** Display matches for user queries.
- **Behavior:**
  - Results are rendered as truncated snippets.
  - The exact search term must be highlighted in the snippet using bolding or a mild background highlight.
  - Results explicitly show their domain origin (e.g., a small "Quran" or "Hadith" badge).

## 7. Forms and Inputs
- **Purpose:** Collect data (e.g., Zakat calculations, Search queries).
- **Behavior:**
  - Inputs must be large, with clear placeholder text and visible focus rings.
  - Labels must sit persistently above the input field (do not rely solely on placeholder text which vanishes).

## 8. Tables
- **Purpose:** Display dense, multi-dimensional data (e.g., Fiqh rulings, inheritance matrices).
- **Behavior:**
  - Tables must be fully responsive (horizontal scroll on mobile).
  - Rows should alternate in color (zebra striping) subtly if the table is wide, aiding horizontal eye tracking.

## 9. Dialogs (Modals)
- **Purpose:** Interrupt the user for critical decisions or destructive actions (e.g., "Delete all bookmarks?").
- **Behavior:**
  - Should be used sparingly. Most interactions should use contextual panels instead.
  - Requires explicit confirmation or cancellation.

## 10. Illustration Containers
- **Purpose:** Frame visual learning assets securely.
- **Behavior:**
  - Images, SVG diagrams, and maps sit inside containers with gentle corner radii matching the global border-radius.
  - Must include a caption area below for academic attribution.
