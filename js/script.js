window.onload = () => {
  const startBtnElement = document.getElementById("start-btn");
  const musicButtonElement = document.getElementById("music-btn");
  const soundEffectsButtonElement = document.getElementById("soundEffects-btn");

  let myGame;
  myGame = new Game(10, 10, 50, 5); //rows, columns, fieldsize, #monsters

  startBtnElement.onclick = () => {
    myGame.start();
  };

  musicButtonElement.onclick = () => {
    myGame.musicOn = !myGame.musicOn;
    musicButtonElement.classList.toggle("active");
  };
  soundEffectsButtonElement.onclick = () => {
    myGame.audioOn = !myGame.audioOn;
    soundEffectsButtonElement.classList.toggle("active");
  };
};
