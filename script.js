const destination = 'https://www.facebook.com/share/p/18GUnT3urx/';
const countdown = document.querySelector('#countdown-number');
const stopButton = document.querySelector('#stop-countdown');
const previousPhoto = document.querySelector('#previous-photo');
const nextPhoto = document.querySelector('#next-photo');
const backgroundLayers = document.querySelectorAll('.hero-image');
const backgroundImages = ['1.jpg', '2.jpg', '3.jpeg', '4.jpeg', '5.jpeg', '6.jpeg'];
let secondsLeft = 10;
let timer = null;
let currentImage = 0;
let activeLayer = 0;
let slideshowTimer = null;

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
