# Change: Brand Studio

## Why

Gym owners need a single place to manage brand identity (logo, colors, fonts) that is used across membership cards, the marketing landing page, and future touchpoints. Today brand-related inputs are scattered (e.g., in the card designer) and there is no central "brand studio" to define and preview a consistent identity before applying it elsewhere.

## What Changes

- Add a Brand Studio page under the dashboard at `/dashboard/brand-studio`.
- Provide a UI-first brand editor: logo upload/preview, primary/secondary color pickers, and optional font or typography tokens, using deterministic mock data.
- Wire the existing "Brand Studio" sidebar entry (currently a placeholder with no route) to the new page.
- Keep save/publish actions disabled until backend persistence exists; focus on live preview and consistency with card designer and landing.

## Impact

- Affected specs: brand-studio (new capability)
- Affected code: App shell navigation, new `/dashboard/brand-studio` route, new Brand Studio page and components (or reuse/align with any existing brand token usage in card designer).
