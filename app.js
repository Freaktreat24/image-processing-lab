// All effects are per-pixel RGB transforms. Parameters match the operations described below.
const filters = [
  { name: 'Paris', description: 'A softly lit, gentle look with a faint rosy warmth. Lower contrast and saturation keep the palette quiet.', steps: ['Lift brightness slightly', 'Soften contrast', 'Add a rosy color offset', 'Reduce saturation'], formula: "C₁ = 0.94C + [8, 4, 7]\nC₂ = S₀.₉₁(C₁)", variables: 'C = [R,G,B] pixel · Sₛ = saturation interpolation by factor s · clamp to 0–255', why: 'A small red and blue offset creates a pink warmth. Soft contrast and lower saturation compress color differences for a gentle finish.', p: { brightness: 8, contrast: .94, saturation: .91, offset: [8, 4, 7] } },
  { name: 'Los Angeles', description: 'A golden, vivid treatment that brightens the image and emphasizes warm highlights with firmer contrast.', steps: ['Add brightness', 'Increase contrast', 'Shift channels toward gold', 'Boost saturation'], formula: "C₁ = 1.12C + [9, 4, −7]\nC₂ = S₁.18(C₁)", variables: 'C = [R,G,B] pixel · warmer shift adds red/green and reduces blue · Sₛ = saturation factor', why: 'The red and green channel lift adds a golden cast, while the contrast and saturation increase make colors feel more vivid.', p: { brightness: 9, contrast: 1.12, saturation: 1.18, offset: [9, 4, -7] } },
  { name: 'Tokyo', description: 'A cool, crisp look with a blue-cyan cast and deeper tonal separation.', steps: ['Lower brightness a little', 'Increase contrast', 'Shift toward cyan-blue', 'Slightly boost saturation'], formula: "C₁ = 1.16C + [−5, 2, 12]\nC₂ = S₁.05(C₁)", variables: 'C = [R,G,B] pixel · blue offset cools the balance · contrast is centered on channel value 128', why: 'Increasing blue while reducing red shifts the white balance cooler. Higher contrast darkens shadows and brightens highlights.', p: { brightness: -5, contrast: 1.16, saturation: 1.05, offset: [-5, 2, 12] } },
  { name: 'Melbourne', description: 'An airy, bright and muted treatment with softened contrast and quieter colors.', steps: ['Lift brightness', 'Reduce contrast', 'Lower saturation', 'Apply a subtle warm lift'], formula: "C₁ = 0.90C + [8, 7, 3]\nC₂ = S₀.82(C₁)", variables: 'C = [R,G,B] pixel · contrast is centered on 128 · Sₛ blends color toward luminance', why: 'Lower contrast compresses the tonal range, while reduced saturation mutes colors and a small channel lift brightens the result.', p: { brightness: 8, contrast: .90, saturation: .82, offset: [8, 7, 3] } },
  { name: 'Oslo', description: 'A cool, faded mood with a light blue lift, restrained color and gentle contrast.', steps: ['Brighten the image', 'Soften contrast', 'Add a blue-cyan shift', 'Reduce saturation'], formula: "C₁ = 0.91C + [3, 7, 14]\nC₂ = S₀.72(C₁)", variables: 'C = [R,G,B] pixel · blue offset cools the image · Sₛ reduces color distance from luminance', why: 'A blue channel lift cools the image; reduced contrast and saturation give it a softer, faded appearance.', p: { brightness: 3, contrast: .91, saturation: .72, offset: [3, 7, 14] } },
  { name: 'Clarendon', description: 'A punchy effect with stronger contrast, lively colors and a small brightness lift.', steps: ['Lift brightness slightly', 'Strengthen contrast', 'Boost saturation', 'Add a subtle cool highlight'], formula: "C₁ = 1.20C + [3, 3, 5]\nC₂ = S₁.25(C₁)", variables: 'C = [R,G,B] pixel · contrast is centered on 128 · saturation factor 1.25 increases color distance', why: 'Contrast expands values around mid-gray and increased saturation makes each pixel’s color more distinct.', p: { brightness: 3, contrast: 1.20, saturation: 1.25, offset: [3, 3, 5] } },
  { name: 'Juno', description: 'A warm, saturated effect that brings red and amber tones forward with added contrast.', steps: ['Add warm channel offsets', 'Increase contrast', 'Boost saturation', 'Lift brightness slightly'], formula: "C₁ = 1.08C + [12, 4, −5]\nC₂ = S₁.22(C₁)", variables: 'C = [R,G,B] pixel · channel offsets add warmth · Sₛ = saturation factor', why: 'Adding more red than blue creates warmth, while saturation and contrast give the palette a stronger presence.', p: { brightness: 2, contrast: 1.08, saturation: 1.22, offset: [12, 4, -5] } },
  { name: 'Lark', description: 'A bright, open look that lifts shadows, softens contrast and keeps colors gently lively.', steps: ['Increase brightness', 'Reduce contrast a little', 'Add a green-yellow lift', 'Slightly increase saturation'], formula: "C₁ = 0.94C + [11, 10, 4]\nC₂ = S₁.08(C₁)", variables: 'C = [R,G,B] pixel · channel offsets lift tones · Sₛ = saturation factor', why: 'The broad channel lift brightens the image; slightly compressed contrast keeps it soft as color stays lively.', p: { brightness: 11, contrast: .94, saturation: 1.08, offset: [2, 0, 0] } },
  { name: 'Gingham', description: 'A nostalgic faded look with low contrast, muted colors and a delicate warm tint.', steps: ['Reduce contrast', 'Fade saturation', 'Raise brightness', 'Add a light warm tint'], formula: "C₁ = 0.84C + [11, 8, 4]\nC₂ = S₀.68(C₁)", variables: 'C = [R,G,B] pixel · contrast is centered on 128 · Sₛ blends color toward luminance', why: 'Lower contrast and saturation flatten strong colors and tones; the gentle red-yellow lift supplies a warm vintage cast.', p: { brightness: 4, contrast: .84, saturation: .68, offset: [7, 5, 1] } },
  { name: 'Moon', description: 'A monochrome treatment with pronounced contrast and a subtle faded lift in the shadows.', steps: ['Convert RGB to luminance grayscale', 'Increase contrast', 'Add a small brightness lift'], formula: 'Y = 0.299R + 0.587G + 0.114B\nG = 1.13(Y − 128) + 128 + 4', variables: 'R,G,B = source channels · Y = Rec. 601 luma estimate · output RGB channels all equal G', why: 'Luma-weighted grayscale preserves perceived brightness. Contrast then separates dark and light regions for a cinematic monochrome image.', p: { grayscale: true, brightness: 4, contrast: 1.13, saturation: 1, offset: [0, 0, 0] } }
];

const fileInput = document.querySelector('#image-file');
const originalCanvas = document.querySelector('#original-canvas');
const outputCanvas = document.querySelector('#output-canvas');
const originalContext = originalCanvas.getContext('2d', { willReadFrequently: true });
const outputContext = outputCanvas.getContext('2d', { willReadFrequently: true });
const filterList = document.querySelector('#filter-list');
const intensity = document.querySelector('#intensity');
const intensityValue = document.querySelector('#intensity-value');
const workspace = document.querySelector('#workspace');
const errorMessage = document.querySelector('#error-message');
const downloadButton = document.querySelector('#download-button');
const MAX_SIDE = 1600;
let sourcePixels = null;
let activeFilter = 0;
let renderQueued = false;

// Build the displayed equations from the same parameters used by transformPixel.
filters.forEach((filter) => {
  const { p } = filter;
  filter.formula = p.grayscale
    ? 'Y = 0.299R + 0.587G + 0.114B\nG = α(Y − 128) + 128 + β + B\nO = (1 − t)C + t clamp(G, 0, 255)'
    : 'C₁ = α(C − 128) + 128 + β + B\nC₂ = Y + s(C₁ − Y)\nO = (1 − t)C + t clamp(C₂, 0, 255)';
  filter.variables = `α = ${p.contrast} · β = ${p.brightness} · B = [${p.offset.join(', ')}] · s = ${p.saturation} · t = intensity (0–1) · Y = 0.299R + 0.587G + 0.114B`;
});

filters.forEach((filter, index) => {
  const button = document.createElement('button');
  button.className = 'filter-option';
  button.type = 'button';
  button.textContent = filter.name;
  button.disabled = true;
  button.setAttribute('aria-pressed', index === activeFilter ? 'true' : 'false');
  button.addEventListener('click', () => selectFilter(index));
  filterList.append(button);
});

function selectFilter(index) {
  activeFilter = index;
  [...filterList.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
  updateTheory();
  render();
}

function updateTheory() {
  const filter = filters[activeFilter];
  document.querySelector('#theory-name').textContent = filter.name;
  document.querySelector('#theory-overview').textContent = filter.description;
  document.querySelector('#theory-steps').replaceChildren(...filter.steps.map((step) => {
    const item = document.createElement('li'); item.textContent = step; return item;
  }));
  document.querySelector('#theory-formula').textContent = filter.formula;
  document.querySelector('#formula-vars').textContent = `${filter.variables}${filter.p.grayscale ? ' · grayscale applied first' : ''}`;
  document.querySelector('#theory-why').textContent = filter.why;
  document.querySelector('.theory-index').textContent = `${String(activeFilter + 1).padStart(2, '0')} / 10`;
}

function clamp(value) { return Math.max(0, Math.min(255, value)); }

// Saturation is a linear interpolation between luma (gray) and the color vector.
function transformPixel(r, g, b, p) {
  let red = r, green = g, blue = b;
  if (p.grayscale) {
    const luma = .299 * r + .587 * g + .114 * b;
    red = green = blue = luma;
  }
  const channels = [red, green, blue].map((channel, i) =>
    (channel - 128) * p.contrast + 128 + p.brightness + p.offset[i]);
  const luma = .299 * channels[0] + .587 * channels[1] + .114 * channels[2];
  return channels.map((channel) => clamp(luma + (channel - luma) * p.saturation));
}

function render() {
  if (!sourcePixels || renderQueued) return;
  renderQueued = true;
  requestAnimationFrame(() => {
    renderQueued = false;
    const source = sourcePixels;
    const output = new ImageData(new Uint8ClampedArray(source.data.length), source.width, source.height);
    const amount = Number(intensity.value) / 100;
    const params = filters[activeFilter].p;
    for (let i = 0; i < source.data.length; i += 4) {
      const [r, g, b] = transformPixel(source.data[i], source.data[i + 1], source.data[i + 2], params);
      output.data[i] = source.data[i] + (r - source.data[i]) * amount;
      output.data[i + 1] = source.data[i + 1] + (g - source.data[i + 1]) * amount;
      output.data[i + 2] = source.data[i + 2] + (b - source.data[i + 2]) * amount;
      output.data[i + 3] = source.data[i + 3]; // Keep source transparency unchanged.
    }
    outputContext.putImageData(output, 0, 0);
    document.querySelector('#output-meta').textContent = `${filters[activeFilter].name} · ${intensity.value}% intensity`;
  });
}

function loadImage(file) {
  errorMessage.hidden = true;
  if (!file) return;
  if (!['image/jpeg', 'image/png'].includes(file.type) && !/\.(jpe?g|png)$/i.test(file.name)) {
    errorMessage.textContent = 'Unsupported file. Please choose a JPG, JPEG or PNG image.';
    errorMessage.hidden = false;
    return;
  }
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => {
    const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));
    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));
    originalCanvas.width = outputCanvas.width = width;
    originalCanvas.height = outputCanvas.height = height;
    originalContext.clearRect(0, 0, width, height);
    originalContext.drawImage(image, 0, 0, width, height);
    sourcePixels = originalContext.getImageData(0, 0, width, height);
    document.querySelectorAll('.image-stage').forEach(stage => stage.classList.add('loaded'));
    workspace.hidden = false;
    downloadButton.disabled = false;
    filterList.querySelectorAll('button').forEach(button => button.disabled = false);
    document.querySelector('#original-meta').textContent = `${image.naturalWidth} × ${image.naturalHeight} px · ${file.name}`;
    document.querySelector('#canvas-note').textContent = scale < 1 ? `Preview scaled to ${width} × ${height} px to keep processing responsive; original dimensions are shown.` : `Processing ${width} × ${height} pixels locally in your browser.`;
    URL.revokeObjectURL(url);
    render();
  };
  image.onerror = () => {
    errorMessage.textContent = 'This image could not be opened. Try another JPG or PNG file.';
    errorMessage.hidden = false;
    URL.revokeObjectURL(url);
  };
  image.src = url;
}

fileInput.addEventListener('change', event => loadImage(event.target.files[0]));
intensity.addEventListener('input', () => { intensityValue.value = `${intensity.value}%`; intensityValue.textContent = `${intensity.value}%`; render(); });
document.querySelector('#reset-button').addEventListener('click', () => {
  intensity.value = 0;
  intensityValue.value = '0%'; intensityValue.textContent = '0%';
  selectFilter(0);
});
downloadButton.addEventListener('click', () => {
  if (!sourcePixels) return;
  const link = document.createElement('a');
  link.download = 'filtered-image.png';
  link.href = outputCanvas.toDataURL('image/png');
  link.click();
});
const uploadRow = document.querySelector('.upload-row');
uploadRow.addEventListener('dragover', event => { event.preventDefault(); uploadRow.classList.add('dragging'); });
uploadRow.addEventListener('dragleave', () => uploadRow.classList.remove('dragging'));
uploadRow.addEventListener('drop', event => { event.preventDefault(); uploadRow.classList.remove('dragging'); loadImage(event.dataTransfer.files[0]); });
updateTheory();
