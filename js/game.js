class Game {
  constructor(width, height, fieldSize) {
    this.gameScreen = document.getElementById("game-screen");
    this.width = width;
    this.height = height;
    this.fieldSize = fieldSize;
    this.fields = [];
    this.currentField = null;
    this.player = null;
  }

  initialize() {
    //initialize the game field
    for (let i = 0; i <= this.width; i += this.fieldSize) {
      for (let j = 0; j <= this.height; j += this.fieldSize) {
        const field = new Field(i, j, this.fieldSize);
        this.fields.push(field);
        this.gameScreen.appendChild(field.element);
      }
    }
    //add Player
    this.currentField = this.fields[15];
    this.player = new Player(this.currentField);
    console.log("Player", this.player);
    this.update();

    //event-listeners for Arrow-keys to move player
    document.addEventListener("keydown", (event) => {
      if (event.code === "ArrowUp") this.player.moveY = -1;
      if (event.code === "ArrowDown") this.player.moveY = 1;
      if (event.code === "ArrowRight") this.player.moveX = -1;
      if (event.code === "ArrowLeft") this.player.moveX = 1;
      this.player.move();
      this.update();
    });
    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowUp") this.player.moveY = 0;
      if (event.code === "ArrowDown") this.player.moveY = 0;
      if (event.code === "ArrowRight") this.player.moveX = 0;
      if (event.code === "ArrowLeft") this.player.moveX = 0;
      this.player.move();
    });
  }

  update() {
    this.currentField.element.classList.add("playerOnField");
    
  }
}
