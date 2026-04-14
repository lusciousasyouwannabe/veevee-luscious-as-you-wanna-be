

## Plan: Edit Product Image in VeeVee Luscious Style

### What will happen

1. Copy the uploaded image (IMG_1286.jpeg) to a working directory
2. Use the AI image editing script to transform the background to match VeeVee Luscious brand aesthetics:
   - Dark black marble surface with gold veins
   - Warm studio lighting
   - Product placed directly on the flat surface
   - No text, labels, pedestals, or props
   - Preserve the exact physical characteristics of the product
3. Save the edited image to `/mnt/documents/` for download

### Technical approach

- Use `google/gemini-2.5-flash-image` model via the AI gateway script
- Prompt focuses on background transformation only, preserving product details

### Output

One edited product photo as a downloadable PNG file.

