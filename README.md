# Image Processing Lab

An Instagram-style filter simulator for a Digital Image Processing class project. It demonstrates explainable color transformations using pixels processed locally in a web browser.

## Project objective

Explore how common image-processing operations change the appearance of a photograph. The project is an academic demonstration, not a social application.

## Features

- Load JPG, JPEG and PNG images from the device, or drag and drop one onto the upload area.
- Compare original and filtered images side by side.
- Try ten distinct filters and adjust a shared intensity slider from 0% to 100%.
- Read each filter's overview, processing steps, formula and explanation.
- Download the current result as `filtered-image.png` or reset the filter and intensity.
- Images remain on the device. Large images are scaled to a maximum 1600 pixels on the longest side to keep pixel processing responsive. PNG alpha is preserved.

## Technologies used

- HTML, CSS and plain JavaScript
- Canvas 2D API and `ImageData`
- No server, package manager, framework or external image-processing service

## How to run

Open `index.html` in a modern browser. No build step or dependency installation is required. The app has no external runtime requests and works offline.

## How the filters work

Each filter has a centralized definition in `app.js` containing its description, parameters, steps, formula and explanation. The processing loop applies the selected parameters to each RGB pixel. Most filters apply contrast about the midpoint, add a brightness and per-channel offset, then adjust saturation by blending the color vector with its luma. Moon first converts each pixel to grayscale. Alpha values are copied from the source unchanged. The intensity control then linearly blends filtered RGB values with their original values.

For non-Moon filters, the implementation is:

```text
C₁ = α(C − 128) + 128 + β + B
Y  = 0.299R₁ + 0.587G₁ + 0.114B₁
C₂ = Y + s(C₁ − Y)
O  = (1 − t)C + t clamp(C₂, 0, 255)
```

`C` is the source RGB vector; `α` is contrast; `β` is brightness; `B` is a channel offset; `Y` is Rec. 601 luma; `s` is saturation; and `t` is intensity between 0 and 1. Values are clamped to the byte range. Moon uses grayscale first: `Y = 0.299R + 0.587G + 0.114B`, then the same contrast, brightness and intensity blending.

## Image Processing Concepts Demonstrated

- Pixel manipulation
- RGB color model
- Brightness transformation
- Contrast transformation
- Saturation adjustment
- Color transformation
- Grayscale conversion
- Linear interpolation
- Image filtering

## Project limitations

- Very large images are downscaled for responsive processing; the download uses the displayed processing resolution.
- Supported formats are JPG, JPEG and PNG.
- These filters are educational recreations inspired by common Instagram-style color effects. They are not Instagram's proprietary filter implementations.
- The browser's Canvas API decodes and scales images; output is PNG.
