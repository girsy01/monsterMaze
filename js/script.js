window.onload = () => {
  const startBtnElement = document.getElementById("start-btn");
  startBtnElement.onclick = () => {
    const myGame = new Game(25, 15, 50);
    myGame.start();
  };
};
