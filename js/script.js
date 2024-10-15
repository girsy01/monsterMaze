window.onload = () => {
  //*************************/
  //SETTINGS
  const numberOfRowsArray = [7, 10, 15];
  const numberOfColumsArray = [7, 10, 15];
  const numberOfMonstersArray = [2, 5, 8];
  let selectedSizeOption = 1;
  let numberOfRows = numberOfRowsArray[selectedSizeOption];
  let numberOfColums = numberOfColumsArray[selectedSizeOption];
  let numberOfMonsters = numberOfMonstersArray[selectedSizeOption];

  //*************************/
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
    myGame = new Game(numberOfRows, numberOfColums, numberOfMonsters, myAudio);
    myGame.start();
  };

  retryBtnElement.onclick = () => {
    const gameFieldElement = document.getElementById("game-field");
    const allFields = gameFieldElement.querySelectorAll(".field");
    allFields.forEach((e) => e.remove());
    const endScreen = document.getElementById("end-screen");
    const endWidth = endScreen.offsetWidth;
    endScreen.style.display = "none";
    const titleElement = document.getElementById("title");
    titleElement.style.display = "flex";
    audioButtonsElement.style.display = "flex";
    myAudio.gameStarted = true;
    myAudio.soundBackgroundMusic.currentTime = 0;
    myAudio.soundGameover.pause();
    myAudio.soundGameover.currentTime = 0;
    myGame = new Game(numberOfRows, numberOfColums, numberOfMonsters, myAudio);
    myGame.start(endWidth);
  };

  // Function to update the button states
  const updateButtonStates = (selectedIndex) => {
    fieldSizeButtonElements.forEach((button, index) => {
      const btnElement = button.querySelector("button");
      if (index === selectedIndex) {
        btnElement.classList.add("selected");
        btnElement.classList.remove("active");
        const sizeId = btnElement.id;
        if (sizeId === "small") selectedSizeOption = 0;
        if (sizeId === "medium") selectedSizeOption = 1;
        if (sizeId === "large") selectedSizeOption = 2;
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
    numberOfRows = numberOfRowsArray[selectedSizeOption];
    numberOfColums = numberOfColumsArray[selectedSizeOption];
    numberOfMonsters = numberOfMonstersArray[selectedSizeOption];
  };
};
