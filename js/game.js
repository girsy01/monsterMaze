class Game {
  constructor(fieldsInRow, fieldsInCol, fieldSize) {
    this.gameScreen = document.getElementById("game-screen");
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 60;
    this.counter = 0;
    this.frequencyOfMonstersMovement = 20; //every ... iteration the monsters are moving (small number -> faster)
    this.fieldsInRow = fieldsInRow;
    this.fieldsInCol = fieldsInCol;
    this.fieldSize = fieldSize;
    this.fieldsMatrix = []; //fields matrix [][]
    this.allFields = []; //all fields in one array
    this.wallFields = [];
    this.pathFields = [];
    this.player = null;
    this.playerElement = null;
    this.currentFieldPlayer = null;
    this.numberOfMonsters = 5;
    this.monsters = [];
    this.monsterElements = [];
    this.currentFieldsMonsters = [];
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
    //add coins to paths
    this.pathFields.forEach((e) => {
      const coinElement = document.createElement("div");
      coinElement.classList.add("coin");
      e.element.appendChild(coinElement);
    });
    //add Player
    this.addPlayer();
    //add Monsters
    this.addMonsters(this.numberOfMonsters);
    //add event-listeners for Arrow-keys to move player
    this.initializeArrowMovementPlayer();
    //start loop
    this.gameLoop();
  }

  start() {
    this.initialize();

    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  gameLoop() {
    // console.log("game loop");
    this.update();
  }

  //update is called in each iteration of the game-loop
  update() {
    //remove elements from DOM
    this.playerElement.remove();
    this.monsterElements.forEach((e) => e.remove);

    //add elements to new fieldElements
    this.currentFieldPlayer.element.appendChild(this.playerElement);
    this.currentFieldsMonsters.forEach((e, i) => e.element.appendChild(this.monsterElements[i]));

    //update current field of player due to movement per arrow keys
    this.allFields.forEach((e) => {
      if (e.x === this.player.x && e.y == this.player.y) {
        this.currentFieldPlayer = e;
      }
    });

    this.counter++;
    if (this.counter % this.frequencyOfMonstersMovement === 0) {
      this.moveMonsters();
    }
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
    this.playerElement = document.createElement("div");
    this.playerElement.classList.add("isPlayer");
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    // console.log(randomIndex, this.currentField);
    this.player = new Player(this.currentFieldPlayer, this.fieldsInRow, this.fieldsInCol);
    // console.log(this.player);
    this.update();
  }

  addMonsters(num) {
    for (let i = 0; i < num; i++) {
      const randomIndex = parseInt(Math.random() * this.pathFields.length);
      this.currentFieldsMonsters[i] = this.pathFields[randomIndex]; //random field
      this.monsters.push(
        new Monster(this.currentFieldsMonsters[i], this.fieldsInRow, this.fieldsInCol)
      );
      this.monsterElements.push(document.createElement("div"));
      this.monsterElements[i].classList.add("isMonster");
      // console.log(this.monsters[i]);
    }
    // console.log('Current Fields of Monsters after adding them:', this.currentFieldsMonsters);
    this.update();
  }

  initializeArrowMovementPlayer() {
    document.addEventListener("keydown", (event) => {
      this.player.moveX = 0;
      this.player.moveY = 0;
      if (event.code === "ArrowUp") this.player.moveY = -1;
      if (event.code === "ArrowDown") this.player.moveY = 1;
      if (event.code === "ArrowRight") this.player.moveX = 1;
      if (event.code === "ArrowLeft") this.player.moveX = -1;
      this.movePlayer();
      // this.update();
    });
    document.addEventListener("keyup", (event) => {
      if (event.code === "ArrowUp") this.player.moveY = 0;
      if (event.code === "ArrowDown") this.player.moveY = 0;
      if (event.code === "ArrowRight") this.player.moveX = 0;
      if (event.code === "ArrowLeft") this.player.moveX = 0;
      this.movePlayer();
      // this.update();
    });
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

  moveMonsters() {
    this.currentFieldsMonsters.forEach((currentField, index) => {
      const directions = [
        [1, 0], // Down
        [-1, 0], // Up
        [0, 1], // Right
        [0, -1], // Left
      ];

      // Shuffle directions for random movement
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      // Try to move in one of the random directions
      for (const [dx, dy] of directions) {
        const nx = currentField.x + dx; // New x-coordinate
        const ny = currentField.y + dy; // New y-coordinate

        // Check if the new position is valid
        if (
          nx >= 0 &&
          nx < this.fieldsInRow &&
          ny >= 0 &&
          ny < this.fieldsInCol &&
          !this.fieldsMatrix[nx][ny].isWall // Check if not a wall
        ) {
          // Update monster's position
          this.currentFieldsMonsters[index] = this.fieldsMatrix[nx][ny]; // Update field
          break; // Exit the loop after moving
        }
      }
    });

    // Update monster elements in the DOM
    this.monsterElements.forEach((element, index) => {
      const monsterField = this.currentFieldsMonsters[index];
      monsterField.element.appendChild(element); // Move the monster to its new field
    });
  }
}
