```markdown
# Design System Document: High-End Monochrome Editorial

## 1. Overview & Creative North Star
**The Creative North Star: "The Kinetic Monolith"**

This design system moves away from the cluttered, neon-soaked tropes of fitness apps. Instead, it draws inspiration from high-end horology and brutalist architecture. The experience is designed to feel like a premium physical space—a darkened, private gym where focus is absolute. 

We break the "standard app" feel through **intentional scale shifts**. By pairing oversized, aggressive typography with expansive negative space, we create a sense of cinematic weight. The layout is not a grid of boxes, but a curated flow of information where depth is felt through tonal shifts rather than seen through lines.

---

## 2. Colors & Surface Logic

The palette is a sophisticated range of near-blacks and metallic charcoals. It relies on the physics of light to create hierarchy.

### The "No-Line" Rule
**Prohibit 1px solid borders for sectioning.** 
In this system, boundaries are organic. To separate content, transition from `surface` (#131318) to `surface-container-low` (#1B1B20). A section should never be "boxed in"; it should simply "exist" on a different tonal plane.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-polished obsidian sheets.
*   **Base Layer:** `surface` (#131318) — The void.
*   **Primary Content:** `surface-container` (#1F1F24) — Main workout cards.
*   **Elevated Interaction:** `surface-container-high` (#2A292F) — Modals and active states.
*   **Nesting:** When placing an element inside a card (like a specific lift metric), use `surface-container-lowest` (#0E0E13) to "carve out" the space, creating an inset, machined look.

### The "Glass & Gradient" Rule
To prevent the UI from feeling flat or "dead," use **Glassmorphism** for floating headers and tab bars. 
*   **Formula:** `surface-container` @ 70% opacity + 20px Backdrop Blur.
*   **Signature Glow:** For primary CTAs, apply a subtle radial gradient using `primary` (#FFFFFF) to `primary-container` (#D4D4D4) at a 15-degree angle. This adds a "cool white" metallic sheen.

---

## 3. Typography: The Editorial Voice

We use a high-contrast pairing: **Space Grotesk** for technical data and headers, and **Manrope** for functional UI and body text.

*   **Display-LG (3.5rem):** Use for "Hero Metrics" (e.g., total weight lifted). It should feel massive and undeniable.
*   **Headline-LG (2rem):** Used for section titles. Give these significant top-margin spacing to let the "Editorial" feel breathe.
*   **Body-MD (0.875rem):** The workhorse. Always use `on-surface-variant` (#C6C6C6) to keep the primary white text reserved for critical information.
*   **Label-SM (0.6875rem):** All-caps with 5-10% letter spacing for technical labels (e.g., "REP CONSISTENCY").

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Stacking**. 
*   **Level 0:** `surface` (Background)
*   **Level 1:** `surface-container-low` (Secondary content/Background sections)
*   **Level 2:** `surface-container` (Standard Cards)
*   **Level 3:** `surface-container-highest` (Pop-overs/Floating Action Buttons)

### Ambient Shadows
Shadows must be "ghost-like." Use a blur radius of 40px–60px with the color `surface-container-lowest` (#0E0E13) at 40% opacity. This creates a soft "lift" rather than a harsh drop shadow.

### The "Ghost Border" Fallback
If a visual separator is required for accessibility, use the `outline-variant` (#474747) at **15% opacity**. It should be felt more than seen.

---

## 5. Components

### Buttons
*   **Primary:** Solid `primary` (#FFFFFF) with `on-primary` (#1A1C1C) text. High-gloss, `rounded-full` (9999px).
*   **Secondary:** Ghost style. No background, `outline-variant` border at 20% opacity, `primary` text.
*   **Circular Icon Buttons:** `surface-container-high` background, `rounded-full`, with 24px icons.

### Cards (The Core Pattern)
*   **Corner Radius:** `rounded-lg` (2rem) for main cards; `rounded-md` (1.5rem) for nested elements.
*   **Composition:** No dividers. Use **Spacing 8** (2.75rem) to separate content blocks within a card.
*   **Metric Display:** Large `display-sm` numbers paired with `label-sm` technical data.

### Input Fields
*   **Style:** Minimalist underline or "carved" inset.
*   **State:** Focused state should use a soft `F2F2F4` outer glow (4px blur) rather than a heavy border.

### Contextual Components for FormCheck
*   **AI Analysis Overlay:** Use a semi-transparent `surface-container-highest` with a 10px backdrop blur to overlay biomechanical data over camera feeds.
*   **The "Pulse" Indicator:** A soft, breathing opacity animation on a `primary` (#FFFFFF) dot to indicate active AI tracking.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme vertical whitespace (Spacing 12 or 16) between major sections to maintain a luxury feel.
*   **Do** use asymmetrical layouts (e.g., a large metric on the left, a small label tucked on the right).
*   **Do** use "Optical Sizing"—ensure that at large scales, letter spacing is slightly tightened.

### Don't:
*   **Don't** use pure black (#000000). It kills the "soft charcoal" luxury depth.
*   **Don't** use icons with varying stroke weights. Stick to a consistent 1.5pt or 2pt line.
*   **Don't** use standard 16px padding. Start with **Spacing 5** (1.7rem) as your "tight" baseline.
*   **Don't** use alert colors (Red/Yellow) unless it is a critical biomechanical failure. Even then, prefer `error` (#FFB4AB) muted against the dark background.

---
*Director's Note: Every pixel must feel intentional. If an element doesn't have a reason to be there, remove it. Silence is the ultimate luxury.*```