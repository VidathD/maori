const destination = 'https://www.facebook.com/share/p/18GUnT3urx/';
const redirectSection = document.querySelector('#redirect-section');
const countdown = document.querySelector('#countdown-number');
const stopButton = document.querySelector('#stop-countdown');
let secondsLeft = 5;
let timer = null;
let hasStarted = false;

function startRedirect() {
  if (hasStarted) return;

  hasStarted = true;
  timer = window.setInterval(() => {
    secondsLeft -= 1;
    countdown.textContent = secondsLeft;

    if (secondsLeft <= 0) {
      window.clearInterval(timer);
      window.location.assign(destination);
    }
  }, 1000);
}

stopButton.addEventListener('click', () => {
  window.clearInterval(timer);
  countdown.textContent = '—';
  stopButton.textContent = 'Redirect stopped';
  stopButton.disabled = true;
});

const redirectObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting) return;

  startRedirect();
  redirectObserver.disconnect();
}, { threshold: 0.5 });

redirectObserver.observe(redirectSection);
