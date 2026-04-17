

User wants individual print-ready jar wrap labels matching the reference image (`veeveelables-2.png`) for these 6 body scrubs:
1. Good Girl
2. Beach Boys
3. Very Berry
4. French Vanilla
5. Creme Brulee
6. Myrtille

Reference specs from image: 7.4" W × 2.0" H jar wrap, black marble + gold veins, VeeVee monogram center, "LUSCIOUS AS YOU WANNA BE" tagline, "[PRODUCT NAME] SUGAR SCRUB" / "GENTLY EXFOLIATES • SMOOTHES • RENEWS" / Net Wt. 4 OZ (113g). Left panel: "MADE FOR YOUR MOMENT" + barcode + Galveston, TX + veeveeluscious.com + @veeveeluscious. Right panel: ingredients + warning + 12M/recycle icons.

Output: each label on its own letter-size (8.5" × 11") sheet as individual PDFs so user can print one-at-a-time. Also bundle all 6 in one combined PDF for convenience.

## Plan: Six Print-Ready Sugar Scrub Labels

### What will happen

Generate one print-ready jar wrap label per body scrub, each on its own 8.5" × 11" sheet centered with crop marks, matching the reference design exactly:

- 7.4" W × 2.0" H jar wrap dimensions (as labeled in the reference)
- Black marble background with gold vein borders
- VeeVee monogram circle in gold (center)
- "LUSCIOUS AS YOU WANNA BE" tagline
- Product name + "SUGAR SCRUB" in gold serif
- "GENTLY EXFOLIATES • SMOOTHES • RENEWS"
- Net Wt. 4 OZ (113g)
- Left panel: "MADE FOR YOUR MOMENT" copy, barcode, Galveston TX, veeveeluscious.com, @veeveeluscious
- Right panel: Ingredients list, "FOR EXTERNAL USE ONLY" warning, 12M + recycle icons

### Products

1. Good Girl Sugar Scrub
2. Beach Boys Sugar Scrub
3. Very Berry Sugar Scrub
4. French Vanilla Sugar Scrub
5. Creme Brulee Sugar Scrub
6. Myrtille Sugar Scrub

### Technical approach

1. Use `google/gemini-3-pro-image-preview` to generate each label at 7.4" × 2.0" (300 DPI = 2220 × 600 px), using the reference image's center label as the layout template. Only the product name swaps; everything else stays identical to the reference.
2. Use Python (Pillow + reportlab) to place each generated label centered on an 8.5" × 11" page with light crop marks for cutting.
3. Save individual PDFs to `/mnt/documents/`:
   - `veevee-label-good-girl.pdf`
   - `veevee-label-beach-boys.pdf`
   - `veevee-label-very-berry.pdf`
   - `veevee-label-french-vanilla.pdf`
   - `veevee-label-creme-brulee.pdf`
   - `veevee-label-myrtille.pdf`
4. Also create `veevee-scrub-labels-all.pdf` with all 6 labels (one per page) for batch printing.
5. QA each PDF by rendering to image and inspecting for: correct product name, layout fidelity, no broken text, no third-party branding, proper crop marks.

### Output

- 6 individual single-page PDFs (one label per sheet)
- 1 combined 6-page PDF
- All downloadable from `/mnt/documents/`

