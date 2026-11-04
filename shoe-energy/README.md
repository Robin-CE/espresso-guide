# Shoe Energy Lab — GitHub Pages mobile site

Static, mobile-first viewer using a versioned audited SQLite snapshot.

Build: `python build_site.py <audited.sqlite> <output-site-directory>`

Deploy the files `index.html`, `app.js`, and `data.js` to a GitHub Pages project directory (e.g. `shoe-energy/`) in a Pages-enabled repo.

- Weight filter: selected laboratory's measured whole-shoe weight (g), no averaging.
- Stack-height filter: heel or forefoot (mm) from RunRepeat, exact matching review slug via public third-party shoe-lab mirror, **not independently verified for every shoe**. No stack data added to audited SQLite. Missing stack values remain missing and are excluded when stack filter active.
- ER/g: same laboratory's forefoot or heel energy (%) divided by its corresponding whole-shoe weight (g).
- RTINGS and RunRepeat are not harmonized; neither cross-lab averaging nor cross-lab weights drive rankings.
- Audit parent `shoe_energy_return_rtings_full_2026-11-04.sqlite` is immutable; audited v1.2 used for this snapshot.
- Updating `data.js` via a new audited snapshot and re-deploying is required for new measurements; daily automated deployment to GitHub Pages is not yet configured.
- Stack mirror: https://github.com/rocker1904/shoe-lab (numeric measurements are the original RunRepeat lab's; attribution and verification limitations disclosed).