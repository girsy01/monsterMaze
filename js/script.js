window.onload = () => {
  const startBtnElement = document.getElementById("start-btn");
  const retryBtnElement = document.getElementById("retry-btn");
  const audioButtonsElement = document.getElementById("audio-btns");
  const musicButtonElement = document.getElementById("music-btn");
  const soundEffectsButtonElement = document.getElementById("soundEffects-btn");

  let myGame;
  const myAudio = new MyAudio();
  // Attach event listeners
  musicButtonElement.onclick = () => myAudio.handleMusic();
  soundEffectsButtonElement.onclick = () => myAudio.handleSounds();

  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyM") myAudio.handleMusic();
    else if (event.code === "KeyS") myAudio.handleSounds();
  });

  startBtnElement.onclick = () => {
    myAudio.gameStarted = true;
    myGame = new Game(10, 10, 50, 5, myAudio); //rows, columns, fieldsize, #monsters, audio-object
    myGame.start();
  };

  retryBtnElement.onclick = () => {
    const gameFieldElement = document.getElementById("game-field");
    const allFields = gameFieldElement.querySelectorAll(".field");
    console.log("All fields:", allFields);
    allFields.forEach((e) => e.remove());
    const endScreen = document.getElementById("end-screen");
    endScreen.style.display = "none";
    audioButtonsElement.style.display = "flex";
    myAudio.gameStarted = true;
    myGame = new Game(10, 10, 50, 5, myAudio);
    myGame.start();
  };
};
