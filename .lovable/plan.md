
# CivilMate – Smart Assistant for Civil Engineering Freshers

A mobile-first responsive web app helping junior site engineers execute concrete & RCC tasks confidently with quick standards lookup, step-by-step checklists, and instant calculators. **No login required** — open access for fastest adoption on-site.

## Design direction
- Mobile-first, large tap targets, glove-friendly buttons (built for site conditions)
- Clean, professional palette: deep construction blue + safety amber accents, high-contrast white cards
- Bottom tab navigation (Home · Standards · Checklists · Calculators)
- Inter font, clear hierarchy, minimal clutter — built to be readable in bright daylight

## Pages & navigation
1. **Home** — Quick search bar, "Today's tasks" suggestions, shortcut tiles to the 3 modules, recently used items
2. **Standards** — Browsable list of key IS code values (concrete grade ratios, slump limits, cover, curing days, lap length, etc.), each as a tappable card with simplified plain-English explanation + the official IS reference
3. **Checklists** — Step-by-step execution guides with checkboxes (progress saved in browser locally) for: slab concreting, column concreting, beam concreting, footing, curing, formwork removal, cover block placement, slump test
4. **Calculators** — Tabbed calculator hub
5. **Detail pages** for each standard / checklist / calculator

## Calculators (all 3)
- **Concrete estimator** — input volume + grade (M15/M20/M25/M30), outputs cement (bags), sand, aggregate, water, with wastage %
- **Brickwork & plaster** — input wall area/thickness, outputs brick count, mortar, cement, sand
- **Steel** — bar weight per meter (6–32mm), total weight from length & quantity, lap/development length helper

Each calculator: clean form → instant results card → "copy result" button for sharing on WhatsApp.

## MVP content (Concrete & RCC focus)
- ~15 standards entries (mix ratios, slump, cover, curing, cube test, formwork removal times, etc.)
- ~8 execution checklists for common concrete/RCC tasks
- 3 calculators above

## Out of scope (per PRD)
AR, AI assistant, full project management.

## Tech
Pure frontend React + Tailwind. Checklist progress saved in browser localStorage. No backend needed for MVP.
