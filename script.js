const destination = 'https://www.facebook.com/share/p/18GUnT3urx/';
const countdown = document.querySelector('#countdown-number');
const stopButton = document.querySelector('#stop-countdown');
const previousPhoto = document.querySelector('#previous-photo');
const nextPhoto = document.querySelector('#next-photo');
const backgroundLayers = document.querySelectorAll('.hero-image');
const desktopImages = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'];
const mobileImages = ['1', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '2', '3'];
const mobileQuery = window.matchMedia('(max-width: 720px)');
let backgroundImages = mobileQuery.matches ? mobileImages : desktopImages;
let secondsLeft = 10;
let timer = null;
let currentImage = 0;
let activeLayer = 0;
let slideshowTimer = null;
const loadedHighRes = new Set();
const layerRequests = new Map();

function imagePath(imageId, isHighResolution) {
  return `${imageId}${isHighResolution ? '' : '_low'}.jpeg`;
}

function loadImage(imageId, isHighResolution) {
  const path = imagePath(imageId, isHighResolution);
  const cacheKey = `${imageId}:${isHighResolution ? 'high' : 'low'}`;

  if (isHighResolution && loadedHighRes.has(cacheKey)) return Promise.resolve(path);

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      if (isHighResolution) loadedHighRes.add(cacheKey);
      resolve(path);
    };
    image.onerror = () => resolve(null);
    image.src = path;
  });
}

function warmImage(imageId, isHighResolution) {
  loadImage(imageId, isHighResolution);
}

function warmNeighbors() {
  const neighborIndexes = [-1, 0, 1];
  neighborIndexes.forEach((offset) => {
    const imageId = backgroundImages[(currentImage + offset + backgroundImages.length) % backgroundImages.length];
    warmImage(imageId, false);
    warmImage(imageId, true);
  });
}

function setLayerImage(layer, imageId, layerIndex) {
  const requestId = (layerRequests.get(layerIndex) || 0) + 1;
  layerRequests.set(layerIndex, requestId);
  layer.style.backgroundImage = `url('${imagePath(imageId, false)}')`;
  loadImage(imageId, true).then((path) => {
    if (path && layerRequests.get(layerIndex) === requestId) {
      layer.style.backgroundImage = `url('${path}')`;
    }
  });
}

mobileQuery.addEventListener('change', ({ matches }) => {
  const currentPhoto = backgroundImages[currentImage];
  backgroundImages = matches ? mobileImages : desktopImages;
  currentImage = backgroundImages.indexOf(currentPhoto);
  if (currentImage < 0) currentImage = 0;
});

function startRedirect() {
  timer = window.setInterval(() => {
    secondsLeft -= 1;
    countdown.textContent = secondsLeft;

    if (secondsLeft <= 0) {
      window.clearInterval(timer);
      window.location.assign(destination);
    }
  }, 1000);
}

function showPhoto(nextIndex) {
  currentImage = (nextIndex + backgroundImages.length) % backgroundImages.length;
  activeLayer = activeLayer === 0 ? 1 : 0;
  const nextLayer = backgroundLayers[activeLayer];
  setLayerImage(nextLayer, backgroundImages[currentImage], activeLayer);
  nextLayer.style.opacity = '1';
  backgroundLayers[activeLayer === 0 ? 1 : 0].style.opacity = '0';
  warmNeighbors();
}

function restartSlideshow() {
  window.clearTimeout(slideshowTimer);
  slideshowTimer = window.setTimeout(() => {
    showPhoto(currentImage + 1);
    restartSlideshow();
  }, 4000);
}

previousPhoto.addEventListener('click', () => {
  showPhoto(currentImage - 1);
  restartSlideshow();
});

nextPhoto.addEventListener('click', () => {
  showPhoto(currentImage + 1);
  restartSlideshow();
});

restartSlideshow();

setLayerImage(backgroundLayers[0], backgroundImages[0], 0);
setLayerImage(backgroundLayers[1], backgroundImages[1], 1);
warmNeighbors();

stopButton.addEventListener('click', () => {
  window.clearInterval(timer);
  countdown.textContent = '—';
  stopButton.textContent = 'Redirect stopped';
  stopButton.disabled = true;
});

startRedirect();
