window.onload = () => {
  const startBtnElement = document.getElementById("start-btn");
  const musicButtonElement = document.getElementById("music-btn");
  const soundEffectsButtonElement = document.getElementById("soundEffects-btn");
  const retryBtnElement = document.getElementById("retry-btn");

  let myGame;
  myGame = new Game(10, 10, 50, 5); //rows, columns, fieldsize, #monsters

  startBtnElement.onclick = () => {
    myGame.start();
  };

  let handleMusic = () => {
    myGame.musicOn = !myGame.musicOn;
    musicButtonElement.classList.toggle("active");
  };

  let handleSounds = () => {
    myGame.audioOn = !myGame.audioOn;
    soundEffectsButtonElement.classList.toggle("active");
  };

  musicButtonElement.onclick = () => handleMusic();
  soundEffectsButtonElement.onclick = () => handleSounds();

  document.addEventListener("keydown", (event) => {
    console.log(event);
    if (event.code === "s" || event.code === "S") handleSounds();
    if (event.code === "m" || event.code === "M") handleMusic();
  });

  retryBtnElement.onclick = () => {
    window.location.reload();
  };
};
