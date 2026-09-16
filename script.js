const destination = 'https://www.facebook.com/share/p/18GUnT3urx/';
const countdown = document.querySelector('#countdown-number');
const stopButton = document.querySelector('#stop-countdown');
const previousPhoto = document.querySelector('#previous-photo');
const nextPhoto = document.querySelector('#next-photo');
const backgroundLayers = document.querySelectorAll('.hero-image');
const desktopImages = ['1.jpeg', '2.jpeg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg'];
const mobileImages = ['1.jpeg', '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg', '9.jpeg', '10.jpeg', '3.jpeg', '4.jpeg', '2.jpeg'];
const mobileQuery = window.matchMedia('(max-width: 720px)');
let backgroundImages = mobileQuery.matches ? mobileImages : desktopImages;
let secondsLeft = 10;
let timer = null;
let currentImage = 0;
let activeLayer = 0;
let slideshowTimer = null;

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
  nextLayer.style.backgroundImage = `url('${backgroundImages[currentImage]}')`;
  nextLayer.style.opacity = '1';
  backgroundLayers[activeLayer === 0 ? 1 : 0].style.opacity = '0';
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

stopButton.addEventListener('click', () => {
  window.clearInterval(timer);
  countdown.textContent = '—';
  stopButton.textContent = 'Redirect stopped';
  stopButton.disabled = true;
});

startRedirect();
