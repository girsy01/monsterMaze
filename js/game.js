class Game {
  constructor(fieldsInRow, fieldsInCol, fieldSize) {
    this.gameScreen = document.getElementById("game-screen");
    this.fieldsInRow = fieldsInRow;
    this.fieldsInCol = fieldsInCol;
    this.fieldSize = fieldSize;
    this.fieldsMatrix = []; //fields matrix [][]
    this.allFields = []; //all fields in one array
    this.wallFields = [];
    this.pathFields = [];
    this.currentField = null;
    this.player = null;
    this.monsters = [];
  }

  initialize() {
    //initialize the game field
    //empty fields
    for (let i = 0; i < this.fieldsInRow; i++) {
      this.fieldsMatrix[i] = [];
      for (let j = 0; j < this.fieldsInCol; j++) {
        const field = new Field(i, j, this.fieldSize);
        this.fieldsMatrix[i].push(field);
        this.allFields.push(field);
        this.gameScreen.appendChild(field.element);
      }
    }
    //add walls
    this.generateMaze();
    //add Player
    this.addPlayer();

    //event-listeners for Arrow-keys to move player
    document.addEventListener("keydown", (event) => {
      this.player.moveX = 0;
      this.player.moveY = 0;
      if (event.code === "ArrowUp") this.player.moveY = -1;
      if (event.code === "ArrowDown") this.player.moveY = 1;
      if (event.code === "ArrowRight") this.player.moveX = 1;
      if (event.code === "ArrowLeft") this.player.moveX = -1;
      this.movePlayer();
      this.update();
    });
    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowUp") this.player.moveY = 0;
      if (event.code === "ArrowDown") this.player.moveY = 0;
      if (event.code === "ArrowRight") this.player.moveX = 0;
      if (event.code === "ArrowLeft") this.player.moveX = 0;
      this.movePlayer();
      this.update();
    });
  }

  update() {
    this.currentField.element.classList.add("playerOnField");
    this.allFields.forEach((e) => {
      if (e.x === this.player.x && e.y == this.player.y) {
        this.currentField.element.classList.remove("playerOnField");
        this.currentField = e;
        this.currentField.element.classList.add("playerOnField");
      }
    });
  }

  generateMaze() {
    // Create a maze filled with walls (1)
    const maze = Array.from({ length: this.fieldsInRow }, () => Array(this.fieldsInCol).fill(1));

    // Randomized DFS to create paths (0)
    const isValidMove = (x, y) =>
      x >= 0 && x < maze.length && y >= 0 && y < maze[0].length && maze[x][y] === 1;

    const generatePath = (x, y) => {
      const directions = [
        [1, 0], // Down
        [-1, 0], // Up
        [0, 1], // Right
        [0, -1], // Left
      ];

      // Shuffle directions
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      for (const [dx, dy] of directions) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;

        if (isValidMove(nx, ny)) {
          // Create paths
          maze[x + dx][y + dy] = 0; // Create a path between cells
          maze[nx][ny] = 0; // Create a path to the new cell
          generatePath(nx, ny); // Recursively generate the maze
        }
      }
    };

    // Start generating the maze from a random position
    const startX = Math.floor(Math.random() * this.fieldsInRow);
    const startY = Math.floor(Math.random() * this.fieldsInCol);
    maze[startX][startY] = 0; // Start position as a path
    generatePath(startX, startY);

    // Apply the generated maze to the fieldsMatrix
    for (let i = 0; i < this.fieldsInRow; i++) {
      for (let j = 0; j < this.fieldsInCol; j++) {
        const currentField = this.fieldsMatrix[i][j];
        if (maze[i][j] === 1) {
          currentField.element.classList.add("isWall");
          this.wallFields.push(currentField);
          currentField.isWall = true;
        } else this.pathFields.push(currentField);
      }
    }
    // console.log('All Wall Fields:', this.wallFields);
    // console.log('All Path Fields:', this.pathFields);
  }

  addPlayer() {
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentField = this.pathFields[randomIndex]; //random field
    console.log(randomIndex, this.currentField);
    this.player = new Player(this.currentField, this.fieldsInRow, this.fieldsInCol);
    console.log("Player", this.player);
    this.update();
  }

  movePlayer() {
    const isValidMove = (x, y) =>
      x >= 0 &&
      x < this.fieldsInRow &&
      y >= 0 &&
      y < this.fieldsInCol &&
      !this.fieldsMatrix[x][y].isWall;

    const nx = this.player.x + this.player.moveX;
    const ny = this.player.y + this.player.moveY;

    if (isValidMove(nx, ny)) {
      this.player.x += this.player.moveX;
      this.player.y += this.player.moveY;
    }
    // console.log("Moved to:", this.player.x, this.player.y);
  }
}
