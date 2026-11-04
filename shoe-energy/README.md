# Shoe Energy Lab — GitHub Pages

Mobile-first static shoe laboratory explorer: https://robin-ce.github.io/espresso-guide/shoe-energy/

## Current release

- **UI:** v1.7 mobile filter redesign, November 4, 2026.
- **Dataset:** the existing audited v1.6 classified working snapshot, **312 shoe identities** (unchanged by the UI redesign).
- **Source code:** `shoe-energy/index.html`, `shoe-energy/app.js`, `shoe-energy/data.js` in `Robin-CE/espresso-guide`.

### Mobile UI

- Always visible: laboratory selector (RTINGS / RunRepeat), forefoot/heel toggle, ranking sort, full-width search, subtle reset, eligibility dropdown and non-scrolling two-column purpose grid.
- Collapsed initially: *More filters* (brand, plate, measured weight, heel/forefoot stack) and *Data & methodology* (eligibility, RTINGS table and stack notes).
- The results area has a live active-filter summary. Active advanced filters show their count even when collapsed.
- Reset restores RTINGS, forefoot, ER/g ranking, Eligible, All purposes, and blank advanced filters. Compared shoes are retained.
- Filtering and ranking continue entirely client-side; no external code dependencies.

### Methodology and data caveats

- RTINGS and RunRepeat remain **separate laboratories**. ER/g is forefoot/heel measured percent divided by that same lab's measured whole-shoe grams. Never average laboratory results.
- Non-EVA foam and >=30 mm measured heel stack define provisional eligibility; records with missing or unverified source data retain their pending status.
- RTINGS user-pasted table rows are provisional and lack individual review revision/date provenance. The last column labeled forefoot stack was actually **heel-to-toe drop** and is not used as forefoot stack.
- RunRepeat stack measurements are partly from a public, independently unverified third-party mirror, not necessarily the primary review.
- *EVA/other daily trainers* is a purpose-display catch-all for excluded **and pending** records; it does not imply all such shoes contain EVA.
- The original archival parent `shoe_energy_return_rtings_full_2026-11-04.sqlite` is immutable. Do not publish database originals, private files or credentials to GitHub Pages.

## Updating data without regressing the interface

- **For measurements-only updates**, regenerate only `shoe-energy/data.js` from the newest audited working SQLite + staged RTINGS catalogue, matching the structure of v1.6. Commit **only** changed data.js and verify the Pages deployment. Keep index.html and app.js from v1.7.
- **If the whole website is rebuilt from the older v1.6 generator**, run `apply_ui_v17.py` on the generated `index.html` and `app.js` before publication, and then validate at 375, 390, 430, 768 and 1440 px. The reusable patch is archived in ChatGPT Library under `/Running Shoe Energy Return/Mobile App/GitHub Pages/apply_ui_v1.7.py`.
- No changed verified data => no database write, GitHub commit, deployment or no-news notification.
- Test both lab switches, zone switch, rank sort, search, purpose/eligibility filter interaction, weight/stack filters, reset, shoe detail and comparison. Ensure no viewport-level horizontal scrolling. Preserve full original sources and audit flags.

The v1.7 deployment changed `index.html`, `app.js`, and this README. **`data.js` was intentionally not changed**.