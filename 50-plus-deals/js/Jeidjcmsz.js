

let timeLeft = 10 * 60;

const display = document.getElementById("countdown");

const timer = setInterval(() => {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;

  display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (timeLeft <= 0) {
    clearInterval(timer);
    display.textContent = "Time's up!";
  }

  timeLeft--;
}, 1000);

