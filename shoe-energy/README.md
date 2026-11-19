# Shoe Energy Lab v2.6 — audited trail backfill

This release preserves the published v2.5 road dataset and adds a source-audited RunRepeat trail catalogue snapshot dated 19 November 2026.

## Coverage

- 496 shoe identities: 317 road and 179 trail.
- 179 unique official RunRepeat trail catalogue slugs across six catalogue pages.
- 179 exact original-review slug and official Trail-fact checks.
- 132 trail shoes with a same-source RunRepeat ER% and whole-shoe-weight pair.
- 179 complete heel/forefoot stack pairs, 178 lug-depth observations, and 78 forefoot-traction observations.
- No heel-traction observations are currently available.
- Zero exact trail-slug matches in `rocker1904/shoe-lab` at commit `83f9f54aa8d1c86903c2d2fe1a206e101637872b`; no trail value was taken from that mirror.

Missing values remain unavailable rather than zero. Branded foam names are not polymer proof. Chemistry families are recorded only when the original review text explicitly names them, and trail eligibility remains pending until layer assignment is supported.

## Interface

The Rankings page now provides Road, Trail and All terrain views. Trail mode uses RunRepeat and includes ER/g, energy return, weight, stack, lug depth, forefoot traction and heel shock-absorption rankings. Shoe details expose the original review, method version, audit state, stack, foam evidence and trail-specific measurements.

RTINGS and RunRepeat remain separate laboratory sources. Combined ER/g is an explicitly `NOT_HARMONIZED` arithmetic mean of the two independently calculated source-specific ratios and is unavailable for trail-only records.

## Version and update discipline

The v2.6 audited SQLite stores the exact original v2.5 road payload for every road identity and adds trail observations with source and review-page hashes. Versioned CSV, ranking and spreadsheet exports accompany the database outside this Pages repository.

The existing daily update automation and version history are not changed by this release. Future data-only refreshes should preserve `index.html` and `app.js`, regenerate `data.js` from an audited database, retain unavailable values as missing, and create a new version rather than overwriting an archival release.
