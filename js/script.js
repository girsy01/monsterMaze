window.onload = () => {
  //*************************/
  //SETTINGS
  let numberOfRowsArray = [7, 10, 15];
  let numberOfColumsArray = [7, 10, 15];
  let sizeOfFieldsArray = [50, 50, 50];
  let numberOfMonstersArray = [2, 5, 8];
  let numberOfRows = 10;
  let numberOfColums = 10;
  let sizeOfFields = 50;
  let numberOfMonsters = 5;
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
  const fieldSizeButtonElements = document.querySelectorAll(".size-option");
  let selectedSizeOption = "medium";

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

  startBtnElement.onclick = () => {
    myAudio.gameStarted = true;
    myGame = new Game(numberOfRows, numberOfColums, sizeOfFields, numberOfMonsters, myAudio);
    myGame.start();
  };

  retryBtnElement.onclick = () => {
    const gameFieldElement = document.getElementById("game-field");
    const allFields = gameFieldElement.querySelectorAll(".field");
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

  // Function to update the button states
  const updateButtonStates = (selectedIndex) => {
    fieldSizeButtonElements.forEach((button, index) => {
      const btnElement = button.querySelector("button");
      if (index === selectedIndex) {
        btnElement.classList.add("selected");
        btnElement.classList.remove("active");
        selectedSizeOption = btnElement.id;
      } else {
        btnElement.classList.remove("selected");
        btnElement.classList.add("active");
      }
    });
  };

  // Add event listeners to each button
  fieldSizeButtonElements.forEach((button, index) => {
    button.onclick = () => {
      updateButtonStates(index);
      updateGameSettings();
    };
  });

  const updateGameSettings = () => {
    let index;
    if (selectedSizeOption === "small") index = 0;
    else if (selectedSizeOption === "medium") index = 1;
    else if (selectedSizeOption === "large") index = 2;
    numberOfRows = numberOfRowsArray[index];
    numberOfColums = numberOfColumsArray[index];
    sizeOfFields = sizeOfFieldsArray[index];
    numberOfMonsters = numberOfMonstersArray[index];
  };
};
