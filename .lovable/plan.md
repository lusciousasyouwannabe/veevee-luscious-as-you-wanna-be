

## Plan: Regenerate All 6 Labels to Match Beach Boys Style

### What will change

Use the **Beach Boys label** (`veevee-label-beach-boys.pdf`) as the new master reference and regenerate the other 5 labels so all 6 are visually identical except for the product name. Specifically:

1. **Logo**: All labels use the exact VeeVee monogram/logo as it appears on the Beach Boys label (same shape, weight, gold finish, ornament).
2. **Remove copy**: Strip the "MADE FOR YOUR MOMENT" heading and the paragraph beneath it from the left panel on every label.
3. **Keep everything else** identical to Beach Boys: black marble background, gold veining, "LUSCIOUS AS YOU WANNA BE" tagline, "[NAME] SUGAR SCRUB", "GENTLY EXFOLIATES • SMOOTHES • RENEWS", "Net Wt. 4 OZ (113g)", barcode, Galveston TX, veeveeluscious.com, @veeveeluscious, ingredients panel, "FOR EXTERNAL USE ONLY", and the 12M / recycle icons.

### Products regenerated

1. Good Girl Sugar Scrub
2. Beach Boys Sugar Scrub *(re-rendered for consistency)*
3. Very Berry Sugar Scrub
4. French Vanilla Sugar Scrub
5. Creme Brulee Sugar Scrub
6. Myrtille Sugar Scrub

### Technical approach

1. Extract the Beach Boys label PNG from the existing PDF and use it as the visual reference image passed to `google/gemini-3-pro-image-preview`.
2. For each product, prompt the model to reproduce the reference 1:1 — only swapping the product name in the headline and removing the "MADE FOR YOUR MOMENT" block (filling that space cleanly with the marble background so the left panel rebalances).
3. Re-render at 7.4" × 2.0" @ 300 DPI (2220 × 600 px).
4. Place each label centered on an 8.5" × 11" sheet with crop marks using `reportlab`.
5. Overwrite the existing PDFs in `/mnt/documents/`:
   - `veevee-label-good-girl.pdf`
   - `veevee-label-beach-boys.pdf`
   - `veevee-label-very-berry.pdf`
   - `veevee-label-french-vanilla.pdf`
   - `veevee-label-creme-brulee.pdf`
   - `veevee-label-myrtille.pdf`
   - `veevee-scrub-labels-all.pdf` (combined)
6. QA each PDF by rendering to image and visually verifying: matching logo, identical layout, correct product name, "MADE FOR YOUR MOMENT" block removed, no third-party branding, clean crop marks.

### Output

- 6 updated single-page PDFs (one label per sheet)
- 1 updated combined 6-page PDF
- All downloadable from the documents panel

