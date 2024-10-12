window.onload = () => {
  //*************************/
  //SETTINGS
  const numberOfRows = 10;
  const numberOfColums = 10;
  const sizeOfFields = 50;
  const numberOfMonsters = 5;
  //*************************/
  //*************************/
  //*************************/
  //*************************/
  //*************************/
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
  //focus start button
  startBtnElement.focus();

  document.addEventListener("keydown", (event) => {
    if (event.code === "KeyM") myAudio.handleMusic();
    else if (event.code === "KeyS") myAudio.handleSounds();
  });

  myGame = new Game(numberOfRows, numberOfColums, sizeOfFields, numberOfMonsters, myAudio);

  startBtnElement.onclick = () => {
    myAudio.gameStarted = true;
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
    myAudio.soundBackgroundMusic.currentTime = 0;
    myAudio.soundGameover.pause();
    myAudio.soundGameover.currentTime = 0;
    myGame = new Game(numberOfRows, numberOfColums, sizeOfFields, numberOfMonsters, myAudio);
    myGame.start();
  };
};
