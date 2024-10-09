class Game {
  constructor(fieldsInRow, fieldsInCol, fieldSize) {
    this.gameScreenElement = document.getElementById("game-screen");
    this.coinsElement = document.getElementById("coins");
    this.livesElement = document.getElementById("lives");
    this.gameField = document.getElementById("game-field");
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 20;
    this.frequencyOfMonstersMovement = 10; //every ... iteration the monsters are moving (small number -> faster)
    this.gameOver = false;
    this.levelCompleted = false;
    this.counter = 0;
    this.totalCoins = 0;
    this.coinsCollected = 0;
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
    this.gameScreenElement.style.display = "block";
    //initialize the game field
    //empty fields
    for (let i = 0; i < this.fieldsInRow; i++) {
      this.fieldsMatrix[i] = [];
      for (let j = 0; j < this.fieldsInCol; j++) {
        const field = new Field(i, j, this.fieldSize);
        this.fieldsMatrix[i].push(field);
        this.allFields.push(field);
        this.gameField.appendChild(field.element);
      }
    }
    //add walls
    this.generateMaze();
    //add coins to paths
    this.pathFields.forEach((e) => {
      const coinElement = document.createElement("div");
      coinElement.classList.add("coin");
      e.element.appendChild(coinElement);
      e.hasCoin = true;
      this.totalCoins++;
    });
    //add Player and Monster
    this.addPlayer();
    this.addMonsters(this.numberOfMonsters);
    this.update();
    //add event-listeners for Arrow-keys to move player
    this.initializeArrowMovementPlayer();
    //add statistics to DOM
    this.coinsElement.innerText = this.player.coins;
    this.livesElement.innerText = this.player.lives;
    //start loop
    this.gameLoop();
  }

  start() {
    this.initialize();

    this.startLoop();
  }

  gameLoop() {
    // console.log("game loop");
    this.update();
  }

  //update is called in each iteration of the game-loop
  update() {
    //collect coin
    this.collectCoin();

    //check for collision
    this.checkForCollision();

    // console.log("update");
    //remove elements from DOM
    this.playerElement.remove();
    this.monsterElements.forEach((e) => e.remove);

    //add elements to new fieldElements
    this.currentFieldPlayer.element.appendChild(this.playerElement);
    this.currentFieldsMonsters.forEach((e, i) => e.element.appendChild(this.monsterElements[i]));

    //update current field of player due to movement per arrow keys
    this.pathFields.forEach((e) => {
      if (e.x === this.player.x && e.y == this.player.y) {
        this.currentFieldPlayer = e;
      }
    });

    if (this.levelCompleted) {
      // this.startNewLevel();
      console.log("level completed");
      clearInterval(this.gameIntervalId);
    }

    //monsters move just in a certain interval
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

  startLoop() {
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  pauseLoop(delay = 1500) {
    clearInterval(this.gameIntervalId);
    setTimeout(() => {
      this.startLoop();
    }, delay);
  }

  addPlayer() {
    this.playerElement = document.createElement("div");
    this.playerElement.classList.add("isPlayer");
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    // console.log(randomIndex, this.currentField);
    this.player = new Player(this.currentFieldPlayer, this.fieldsInRow, this.fieldsInCol);
    // console.log(this.player);
    // this.update();
  }

  addMonsters(num) {
    for (let i = 0; i < num; i++) {
      const randomIndex = parseInt(Math.random() * this.pathFields.length);
      const newField = this.pathFields[randomIndex];
      this.currentFieldsMonsters.push(newField); //random field
      this.monsters.push(new Monster(newField, this.fieldsInRow, this.fieldsInCol));
      const newElement = document.createElement("div");
      const r = Math.floor(Math.random() * 100) + 150;
      const g = Math.floor(Math.random() * 50);
      const b = Math.floor(Math.random() * 50);
      newElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
      this.monsterElements.push(newElement);
      newElement.classList.add("isMonster");
      // console.log(this.monsters[this.monsters.length - 1]);
    }
    // console.log("Current Monsters:", this.monsters);
    // console.log("Current Fields of Monsters after adding them:", this.currentFieldsMonsters);
    // console.log("Current Monster Elements:", this.monsterElements);
    // this.update();
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
    // console.log("\n\nLET THE FUN BEGIN!");
    this.currentFieldsMonsters.forEach((currentField, index) => {
      // console.log("\nCurrent Monster:", this.monsters[index], "\nCurrent Field:", currentField);

      const directions = [
        [1, 0], // Down
        [-1, 0], // Up
        [0, 1], // Right
        [0, -1], // Left
      ];

      let nx, ny, dx, dy;

      const updateIfValid = (nx, ny) => {
        // Check if the new position is valid
        if (
          nx >= 0 &&
          nx < this.fieldsInRow &&
          ny >= 0 &&
          ny < this.fieldsInCol &&
          !this.fieldsMatrix[nx][ny].isWall && // Check if not a wall
          !this.currentFieldsMonsters.filter((e) => e.x === nx && e.y === ny).length //is not field of other monster
        ) {
          // Update monster's position
          // console.log("Checking for validity. Movement is valid. New current Field:", `[${nx},${ny}]`);
          this.currentFieldsMonsters[index] = this.fieldsMatrix[nx][ny]; // Update field
          return true;
        }
        // console.log("Checking for validity. Movement NOT valid.");
        return false;
      };

      //in 75% of the cases the monster keeps moving in the same direction
      if (Math.random() < 0.85) {
        // console.log("Trying to keep going in current direction:", this.monsters[index].currentDirection);

        dx = this.monsters[index].currentDirection[0];
        dy = this.monsters[index].currentDirection[1];
        nx = currentField.x + dx; // New x-coordinate
        ny = currentField.y + dy; // New y-coordinate
        const check = updateIfValid(nx, ny);
        if (check) return;
      }
      // console.log("Still here!");

      // Shuffle directions for random movement
      for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
      }

      // console.log("Directions after shuffling: ", directions);

      //in 25% of the cases or if continuing is not possible:
      // Try to move in one of the random directions
      for (const [dx, dy] of directions) {
        // console.log("Checking this direction now:", `[${dx},${dy}]`);
        nx = currentField.x + dx; // New x-coordinate
        ny = currentField.y + dy; // New y-coordinate
        const check = updateIfValid(nx, ny);
        if (check) {
          // console.log("Valid movement!");
          this.monsters[index].currentDirection = [dx, dy];
          break;
        }
      }
    });

    // Update monster elements in the DOM
    this.monsterElements.forEach((element, index) => {
      const monsterField = this.currentFieldsMonsters[index];
      monsterField.element.appendChild(element); // Move the monster to its new field
    });
  }

  collectCoin() {
    if (this.currentFieldPlayer.hasCoin) {
      const coinElement = this.currentFieldPlayer.element.querySelector(".coin");
      coinElement.remove();
      this.currentFieldPlayer.hasCoin = false;
      this.player.coins++;
      this.coinsCollected++;
      if (this.player.coins % 100 === 0) {
        this.player.lives++;
        this.livesElement.innerText = this.player.lives;
      }
      this.coinsElement.innerText = this.player.coins;
      //check if all coins have been collected
      if (this.totalCoins === this.coinsCollected) this.levelCompleted = true;
    }
  }

  checkForCollision() {
    let collisionIndex = null;
    this.currentFieldsMonsters.forEach((e, index) => {
      if (e === this.currentFieldPlayer) {
        // console.log("Collision!");
        // this.pauseLoop(500);
        //save index of collision monster
        collisionIndex = index;
      }
    });
    //if collision occurred, remove monster, adjust lives and add new monster
    if (collisionIndex !== null) {
      //remove monster
      this.monsters.splice(collisionIndex, 1);
      this.currentFieldsMonsters.splice(collisionIndex, 1);
      this.monsterElements[collisionIndex].remove();
      this.monsterElements.splice(collisionIndex, 1);
      //adjust lives
      this.player.lives--;
      this.livesElement.innerText = this.player.lives;
      if (this.player.lives === 0) this.gameOver = true;
      //add new monster
      this.addMonsters(1);
    }
    console.log(this.player.lives, this.gameOver);
    if (this.gameOver) {
      console.log("Game over.");
      clearInterval(this.gameIntervalId);
      //TODO: GAME OVER
    }
  }

  relocatePlayer() {
    console.log("Current field:", this.player.currentField);
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    console.log("New field:", this.player.currentField);
  }
}
