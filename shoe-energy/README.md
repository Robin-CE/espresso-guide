# Shoe Energy Lab v1.9 — Combined ER/g mode

This is a presentation-only release that adds **Combined** alongside **RTINGS** and **RunRepeat**. No SQLite or underlying `data.js` observations were changed.

## Calculation

For each matching shoe and zone (`forefoot` or `heel`):

- `rtings_ratio = rtings_energy_return_percent / rtings_whole_shoe_weight_g`
- `runrepeat_ratio = runrepeat_energy_return_percent / runrepeat_whole_shoe_weight_g`
- `combined_ratio = (rtings_ratio + runrepeat_ratio) / 2`

A shoe ranks in **Combined** only if *both* laboratory ratios are valid for the selected zone; same-source stored ratios must match ER/weight within 0.0001 and nonzero weights are required. Percentages, weights, and laboratory methods are **never averaged, harmonized, or used to create a physical combined measurement**. Combined is an intentionally user-requested, uncalibrated, equal-weight index marked `NOT_HARMONIZED`. Different lab protocols can materially affect the ranking.

Combined mode disables the irrelevant single-source `Energy return %` and `Lightest shoe` sort choices. Stack and name sorts remain available but include only shoes with both laboratory ratios. Weight filtering in Combined requires *both* lab weights to independently satisfy the bounds; it never invents an average weight. Clicking a shoe shows each original source and the combined calculation. Cross-source provenance, lab-specific verification status, and flags remain available.

## Coverage (2026-11-04 dataset)

- 312 shoe identities.
- 76 have valid forefoot and heel ratios in both labs.
- 64 of those meet the provisionally eligible non-EVA and >=30 mm heel-stack screen.
- The RTINGS user-pasted table is a provisional snapshot, and the RunRepeat mirror has unverified provenance; the Combined index is NOT_HARMONIZED.

## Files and future builds

Published source paths in `Robin-CE/espresso-guide`:

- `shoe-energy/index.html` — responsive selectors, warnings, documented method.
- `shoe-energy/app.js` — client-only Combined ratio computation and mobile interactions.
- `shoe-energy/data.js` — UNCHANGED from v1.8 (sha256 should match the prior version).

The archived `apply_combined_v19.py` applies the v1.9 UI patch to v1.8 source files; `test_combined_v19.py` validates arithmetic and interactions with headless Chromium at 375, 390, 430, 768 and 1440px.

When new verified database observations arrive, the existing daily automation should regenerate only `shoe-energy/data.js`, maintaining the present index/app files; preserve the archival database and historical measurements. Subsequent full UI rebuilds must reapply v1.9 patch or a semantically equivalent verified Combined feature.