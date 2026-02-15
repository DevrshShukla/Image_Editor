const controlsConfig = {
  brightness: { label: "Brightness", min: 0, max: 200, value: 100, unit: "%" },
  contrast: { label: "Contrast", min: 0, max: 200, value: 100, unit: "%" },
  saturation: { label: "Saturation", min: 0, max: 200, value: 100, unit: "%" },
  hue: { label: "Hue Rotate", min: 0, max: 360, value: 0, unit: "deg" },
  blur: { label: "Blur", min: 0, max: 20, value: 0, unit: "px" },
  grayscale: { label: "Grayscale", min: 0, max: 100, value: 0, unit: "%" },
  sepia: { label: "Sepia", min: 0, max: 100, value: 0, unit: "%" },
  opacity: { label: "Opacity", min: 0, max: 100, value: 100, unit: "%" },
  invert: { label: "Invert", min: 0, max: 100, value: 0, unit: "%" },
};

const tmp_controlsConfig = JSON.parse(JSON.stringify(controlsConfig));

const controlsPanel = document.querySelector(".controls-panel");
const imageCanvas = document.querySelector(".image-canvas");
const fileInput = document.getElementById("fileInput");
const ctx = imageCanvas.getContext("2d");
let resetButton = document.getElementById("resetButton");
const downloadBtn = document.getElementById("downloadBtn");

let originalImage = null;

//
// 🔹 Generate sliders dynamically
//
Object.keys(controlsConfig).forEach((key) => {
  const config = controlsConfig[key];

  const div = document.createElement("div");
  div.classList.add("control");

  div.innerHTML = `
    <span class="control-label" id="${key}-value">
      ${config.value}${config.unit}
    </span>
    <label>${config.label}</label>
    <input 
      type="range"
      id="${key}"
      min="${config.min}"
      max="${config.max}"
      value="${config.value}"
    />
  `;

  controlsPanel.appendChild(div);
});

//Apply Filters Function
function applyFilters() {
  if (!originalImage) return;

  ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

  const filterString = `
    brightness(${controlsConfig.brightness.value}%)
    contrast(${controlsConfig.contrast.value}%)
    saturate(${controlsConfig.saturation.value}%)
    hue-rotate(${controlsConfig.hue.value}deg)
    blur(${controlsConfig.blur.value}px)
    grayscale(${controlsConfig.grayscale.value}%)
    sepia(${controlsConfig.sepia.value}%)
    opacity(${controlsConfig.opacity.value}%)
    invert(${controlsConfig.invert.value}%)
  `;

  ctx.filter = filterString;
  ctx.drawImage(originalImage, 0, 0);
}

// 🔹 Slider Event Listener (Event Delegation)
controlsPanel.addEventListener("input", (e) => {
  const key = e.target.id;
  if (!controlsConfig[key]) return;

  const value = e.target.value;
  controlsConfig[key].value = value;

  // Update UI value
  document.getElementById(`${key}-value`).textContent =
    value + controlsConfig[key].unit;

  applyFilters();
});

//
// 🔹 Image Upload
//
fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (event) {
    const img = new Image();

    img.onload = function () {
      imageCanvas.width = img.width;
      imageCanvas.height = img.height;

      originalImage = img;
      ctx.drawImage(originalImage, 0, 0);
    };

    img.src = event.target.result;
  };

  reader.readAsDataURL(file);
});

resetButton.addEventListener("click", () => {

  Object.keys(tmp_controlsConfig).forEach((key) => {
    controlsConfig[key].value = tmp_controlsConfig[key].value;
    document.getElementById(key).value = tmp_controlsConfig[key].value;
    document.getElementById(`${key}-value`).textContent =
      tmp_controlsConfig[key].value + tmp_controlsConfig[key].unit;
  });
  applyFilters();
});

// downalod image
downloadBtn.addEventListener("click", () => {
  if (!originalImage) return;

  // Convert canvas to image data
  const imgUrl = imageCanvas.toDataURL("image/png");
  let link = document.createElement("a");
  link.href = imgUrl
  link.download = "edited-image.png";
  link.click()
});