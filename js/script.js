window.onload = () => {
  const startBtnElement = document.getElementById("start-btn");
  startBtnElement.onclick = () => {
    const myGame = new Game(10, 10, 50, 5); //rows, columns, fieldsize, #monsters
    myGame.start();
  };
};
