class Game {
  constructor(fieldsInRow, fieldsInCol, monsters, myAudio) {
    this.startScreenElement = document.getElementById("start-screen");
    this.gameScreenElement = document.getElementById("game-screen");
    this.endScreenElement = document.getElementById("end-screen");
    this.audioButtonsElement = document.getElementById("audio-btns");
    this.levelElement = document.getElementById("level");
    this.coinsElement = document.getElementById("coins");
    this.livesElement = document.getElementById("lives");
    this.gameFieldElement = document.getElementById("game-field");
    this.messageLevelElement = document.getElementById("message-level");
    this.messageLevelImgElement = document.getElementById("message-level-img");
    this.endScoreElement = document.getElementById("end-score");
    this.endLevelElement = document.getElementById("end-levels");
    this.titleElement = document.getElementById("title");
    this.instructionsElement = document.getElementById("instructions");
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 20;
    this.frequencyOfMonstersMovement = 10; //every ... iteration the monsters are moving (small number -> faster)
    this.fieldsInCol = fieldsInCol;
    this.fieldsInRow = fieldsInRow;
    this.gameOver = false;
    this.levelCompleted = false;
    this.levelCount = 1;
    this.counter = 0;
    this.totalCoins = 0;
    this.coinsCollected = 0; //just in this level, to check if level completed
    this.coinsToNewLife = 100;
    if (this.fieldsInCol < 10 || this.fieldsInRow < 10) this.coinsToNewLife = 50;
    this.fieldSize = this.setFieldSize();
    this.myAudio = myAudio;
    this.fieldsMatrix = []; //fields matrix [][]
    this.allFields = []; //all fields in one array
    this.wallFields = [];
    this.pathFields = [];
    this.player = null;
    this.playerElement = null;
    this.currentFieldPlayer = null;
    this.numberOfMonsters = monsters;
    this.monsters = [];
    this.monsterElements = [];
    this.currentFieldsMonsters = [];
  }

  initialize() {
    this.gameScreenElement.style.display = "flex";
    const titleImage = this.titleElement.querySelector("img");
    titleImage.style.width = "70%";
    this.titleElement.style.marginTop = "0";
    this.titleElement.style.marginBottom = "50px";
    //initialize the game field
    //create empty fields
    for (let i = 0; i < this.fieldsInCol; i++) {
      this.fieldsMatrix[i] = [];
      for (let j = 0; j < this.fieldsInRow; j++) {
        const field = new Field(i, j, this.fieldSize);
        this.gameFieldElement.style.width = `${this.fieldsInCol * this.fieldSize}px`;
        this.gameFieldElement.style.height = `${this.fieldsInRow * this.fieldSize}px`;
        this.fieldsMatrix[i].push(field);
        this.allFields.push(field);
        this.gameFieldElement.appendChild(field.element);
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
    this.initializeKeyListeners();
    //add statistics to DOM
    this.coinsElement.innerText = this.player.coins;
    this.livesElement.innerText = this.player.lives;
    //adjust event handler for music button
    this.myAudio.musicButtonElement.onclick = () => this.myAudio.handleMusic();
    //start loop
    this.gameLoop();
  }

  setFieldSize(endWidth) {
    // Get actual width of game container
    let gameWidth = this.startScreenElement.offsetWidth;

    //in case of retry, take endWidth
    if (endWidth) gameWidth = endWidth;

    //calc max height of game container
    const titleHeight = this.titleElement.offsetHeight;
    const statHeight = 400;
    const audioBtnsHeight = this.audioButtonsElement.offsetHeight;
    const gameHeightMax = window.innerHeight - (titleHeight + statHeight + audioBtnsHeight);

    const fieldWidth = Math.floor(gameWidth / this.fieldsInRow);
    const fieldHeight = Math.floor(gameHeightMax / this.fieldsInCol);

    const size = Math.min(fieldWidth, fieldHeight, 75);
    return size;
  }

  start(endWidth = undefined) {
    this.fieldSize = this.setFieldSize(endWidth);
    this.startScreenElement.style.display = "none";
    this.instructionsElement.style.display = "none";
    this.initialize();
    this.startLoop();
  }

  startLoop() {
    // console.log("loop started");
    this.gameIntervalId = setInterval(() => {
      //start music if wanted
      if (this.myAudio.musicOn) this.myAudio.soundBackgroundMusic.play();
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  pauseLoop(delay = 1500) {
    clearInterval(this.gameIntervalId);
    setTimeout(() => {
      this.startLoop();
    }, delay);
  }

  gameLoop() {
    // console.log("game loop");
    this.update();
  }

  handleGameOver() {
    // console.log("Game over.");
    this.titleElement.style.display = "none";

    clearInterval(this.gameIntervalId);
    this.myAudio.soundBackgroundMusic.pause();
    if (this.myAudio.audioOn) this.myAudio.soundGameover.play();
    this.myAudio.gameStarted = false;

    this.gameScreenElement.style.display = "none";
    this.audioButtonsElement.style.display = "none";
    this.endScreenElement.style.display = "flex";

    this.endScoreElement.innerText = this.player.coins;
    this.endLevelElement.innerText = this.levelCount - 1;

    const retryBtnElement = document.getElementById("retry-btn");
    retryBtnElement.focus();
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
    this.monsterElements.forEach((e) => e.remove());

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
      if (this.myAudio.audioOn) this.myAudio.soundLevel.play();
      clearInterval(this.gameIntervalId);
      // this.messageLevelImgElement.src = ``;
      this.messageLevelElement.style.display = "block";
      // console.log("level completed");
      this.levelCount++;
      this.levelElement.innerText = this.levelCount;
      setTimeout(() => this.startNewLevel(), 2000);
    }

    //monsters move just in a certain interval
    this.counter++;
    if (this.counter % this.frequencyOfMonstersMovement === 0) {
      this.moveMonsters();
    }
  }

  generateMaze() {
    let mazeValid = false;
    do {
      // Reset necessary arrays
      this.wallFields = [];
      this.pathFields = [];
      this.allFields.forEach((field) => field.element.classList.remove("isWall"));

      //Generate new maze
      // const maze = this.mazeAlgorithmDFS();
      const maze = this.mazeAlgorithmKruskal();

      // Apply the generated maze to the fieldsMatrix
      for (let i = 0; i < this.fieldsInCol; i++) {
        for (let j = 0; j < this.fieldsInRow; j++) {
          const currentField = this.fieldsMatrix[i][j];
          if (maze[i][j] === 1) {
            currentField.element.classList.add("isWall");
            this.wallFields.push(currentField);
            currentField.isWall = true;
          } else {
            this.pathFields.push(currentField);
            currentField.isWall = false;
          }
        }
      }

      // Run safety check to ensure no islands exist
      mazeValid = !this.safetyCheck();
      // //TODO: remove this alert
      // if (!mazeValid) alert("unvalid maze was genereated and is now regenerated.");
    } while (!mazeValid); // Regenerate maze until no islands are found
  }

  addPlayer() {
    this.playerElement = document.createElement("img");
    this.playerElement.classList.add("isPlayer");
    const randomImg = Math.floor(Math.random() * 10);
    this.playerElement.src = `img/player${randomImg}.png`;
    this.playerElement.style.fontSize = `${this.fieldSize * 0.7}px`;
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    // console.log(randomIndex, this.currentField);
    this.player = new Player(this.currentFieldPlayer, this.fieldsInCol, this.fieldsInRow);
    // console.log(this.player);
    // this.update();
  }

  addMonsters(num) {
    const getValidField = () => {
      let isValid = false;
      let field;
      while (!isValid) {
        //pick random path-field
        const index = parseInt(Math.random() * this.pathFields.length);
        field = this.pathFields[index];
        if (Math.abs(field.x - this.player.x) >= 2 && Math.abs(field.y - this.player.y) >= 2) {
          isValid = true;
        }
      }
      return field;
    };

    for (let i = 0; i < num; i++) {
      const newField = getValidField(); //make sure monsters are in min distance of 2
      this.currentFieldsMonsters.push(newField); //random field
      this.monsters.push(new Monster(newField, this.fieldsInCol, this.fieldsInRow));
      const newElement = document.createElement("img");
      const randomImg = Math.floor(Math.random() * 17);
      newElement.src = `img/monster${randomImg}.png`;
      this.monsterElements.push(newElement);
      newElement.classList.add("isMonster");
    }
  }

  initializeKeyListeners() {
    document.addEventListener("keydown", (event) => {
      if (
        event.code === "ArrowUp" ||
        event.code === "ArrowDown" ||
        event.code === "ArrowRight" ||
        event.code === "ArrowLeft"
      ) {
        this.player.moveX = 0;
        this.player.moveY = 0;

        if (event.code === "ArrowUp") this.player.moveY = -1;
        if (event.code === "ArrowDown") this.player.moveY = 1;
        if (event.code === "ArrowRight") this.player.moveX = 1;
        if (event.code === "ArrowLeft") this.player.moveX = -1;

        this.movePlayer();
      }
    });
  }

  movePlayer() {
    const isValidMove = (x, y) => {
      return (
        x >= 0 &&
        x < this.fieldsInCol &&
        y >= 0 &&
        y < this.fieldsInRow &&
        !this.fieldsMatrix[x][y].isWall
      );
    };

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
          nx < this.fieldsInCol &&
          ny >= 0 &&
          ny < this.fieldsInRow &&
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
      if (Math.random() < 0.7) {
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
      if (this.myAudio.audioOn) this.myAudio.soundCoin.play();
      if (this.player.coins % this.coinsToNewLife === 0) {
        if (this.myAudio.audioOn) this.myAudio.soundLife.play();
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
      //play audio
      if (this.myAudio.audioOn) {
        this.myAudio.soundCollision.pause();
        this.myAudio.soundCollision.currentTime = 0;
        this.myAudio.soundCollision.play();
      }
      //remove monster
      this.monsters.splice(collisionIndex, 1);
      this.currentFieldsMonsters.splice(collisionIndex, 1);
      this.monsterElements[collisionIndex].remove();
      this.monsterElements.splice(collisionIndex, 1);
      //adjust lives
      this.player.lives--;
      if (this.player.lives === 0) this.gameOver = true;
      if (this.player.lives < 0) this.player.lives = 0; //can happen because of overlapping happenings -> should not be visible for player
      this.livesElement.innerText = this.player.lives;
      //add new monster
      this.addMonsters(1);
    }
    // console.log(this.player.lives, this.gameOver);
    if (this.gameOver) {
      this.handleGameOver();
    }
  }

  relocatePlayer() {
    console.log("Current field:", this.player.currentField);
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    console.log("New field:", this.player.currentField);
  }

  startNewLevel() {
    this.messageLevelElement.style.display = "none";

    //remove everything from DOM
    this.allFields.forEach((e) => e.element.classList.remove("isWall"));
    this.monsterElements.forEach((e) => {
      e.remove();
    });

    //empty all arrays
    this.levelCompleted = false;
    this.counter = 0;
    this.totalCoins = 0;
    this.coinsCollected = 0;
    // this.fieldsMatrix = []; //fields matrix [][]
    // this.allFields = []; //all fields in one array
    this.wallFields = [];
    this.pathFields = [];
    this.currentFieldPlayer = null;
    this.monsters = [];
    this.monsterElements = [];
    this.currentFieldsMonsters = [];

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
    if ((this.levelCount + 1) % 2 === 0) this.numberOfMonsters++;
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    this.player.x = this.currentFieldPlayer.x;
    this.player.y = this.currentFieldPlayer.y;
    this.addMonsters(this.numberOfMonsters);
    this.update();
    //add statistics to DOM
    this.coinsElement.innerText = this.player.coins;
    this.livesElement.innerText = this.player.lives;
    //start loop
    this.startLoop();
  }

  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************
  // ***********************************************************************************************

  mazeAlgorithmDFS() {
    // Create a maze filled with walls (1)
    const maze = Array.from({ length: this.fieldsInCol }, () => Array(this.fieldsInRow).fill(1));

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
    const startX = Math.floor(Math.random() * this.fieldsInCol);
    const startY = Math.floor(Math.random() * this.fieldsInRow);
    maze[startX][startY] = 0; // Start position as a path
    generatePath(startX, startY);

    return maze;
  }

  mazeAlgorithmKruskal() {
    // Initialize maze with walls (1s)
    let maze = Array.from({ length: this.fieldsInRow * 2 + 1 }, () =>
      Array(this.fieldsInCol * 2 + 1).fill(1)
    );

    let sets = []; // Each cell will be part of a set
    let edges = []; // List of all potential edges (walls)

    // Initialize sets and list of edges (walls) between cells
    let setId = 0;
    for (let row = 1; row < this.fieldsInRow * 2; row += 2) {
      for (let col = 1; col < this.fieldsInCol * 2; col += 2) {
        // Assign a unique set id to each cell
        sets.push({ row, col, setId });

        // Add vertical and horizontal edges (walls)
        if (col < this.fieldsInCol * 2 - 1) {
          edges.push({ row, col: col + 1, direction: "horizontal" }); // Horizontal edge
        }
        if (row < this.fieldsInRow * 2 - 1) {
          edges.push({ row: row + 1, col, direction: "vertical" }); // Vertical edge
        }

        setId++;
      }
    }

    // Helper function to find a cell's set
    const findSet = (cell) => {
      return sets.find((set) => set.row === cell.row && set.col === cell.col);
    };

    // Helper function to union two sets
    const unionSets = (cell1, cell2) => {
      const set1 = findSet(cell1);
      const set2 = findSet(cell2);

      if (set1.setId !== set2.setId) {
        // Update all cells in set2 to have set1's ID
        sets.forEach((cell) => {
          if (cell.setId === set2.setId) {
            cell.setId = set1.setId;
          }
        });
      }
    };

    // Shuffle an array
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // Shuffle the edges array to process walls randomly
    edges = shuffle(edges);

    // Carve paths in the maze based on Kruskal's algorithm
    edges.forEach((edge) => {
      const { row, col, direction } = edge;

      // Find the two cells that this wall separates
      let cell1, cell2;

      if (direction === "horizontal") {
        cell1 = { row, col: col - 1 }; // Left cell
        cell2 = { row, col: col + 1 }; // Right cell
      } else {
        cell1 = { row: row - 1, col }; // Top cell
        cell2 = { row: row + 1, col }; // Bottom cell
      }

      const set1 = findSet(cell1);
      const set2 = findSet(cell2);

      if (set1.setId !== set2.setId) {
        // If the two cells are in different sets, remove the wall and union the sets
        maze[row][col] = 0;
        maze[cell1.row][cell1.col] = 0;
        maze[cell2.row][cell2.col] = 0;
        unionSets(cell1, cell2);
      }
    });

    return maze;
  }

  mazeAlgorithmWilson() {
    // Initialize maze with walls (1s)
    let maze = Array.from({ length: this.fieldsInRow * 2 + 1 }, () =>
      Array(this.fieldsInCol * 2 + 1).fill(1)
    );

    // Directions for moving up, down, left, and right
    const directions = [
      { row: -2, col: 0, betweenRow: -1, betweenCol: 0 }, // Up
      { row: 2, col: 0, betweenRow: 1, betweenCol: 0 }, // Down
      { row: 0, col: -2, betweenRow: 0, betweenCol: -1 }, // Left
      { row: 0, col: 2, betweenRow: 0, betweenCol: 1 }, // Right
    ];

    // Helper function to check if a cell is within the maze bounds
    const isInBounds = (row, col) => {
      return row > 0 && row < maze.length - 1 && col > 0 && col < maze[0].length - 1;
    };

    // Create a set of visited cells
    let visited = new Set();

    // Select a random starting cell and mark it as part of the maze
    let startRow = Math.floor(Math.random() * this.fieldsInRow) * 2 + 1;
    let startCol = Math.floor(Math.random() * this.fieldsInCol) * 2 + 1;
    maze[startRow][startCol] = 0;
    visited.add(`${startRow},${startCol}`);

    // Helper function to perform a random walk with loop erasure
    const randomWalk = (startRow, startCol) => {
      let walkPath = [];
      let currentRow = startRow;
      let currentCol = startCol;
      let visitedWalk = new Set();

      while (!visited.has(`${currentRow},${currentCol}`)) {
        walkPath.push({ row: currentRow, col: currentCol });

        // Mark the current cell as visited in this walk
        visitedWalk.add(`${currentRow},${currentCol}`);

        // Randomly select a direction to move
        const direction = directions[Math.floor(Math.random() * directions.length)];
        const newRow = currentRow + direction.row;
        const newCol = currentCol + direction.col;

        // Ensure the new cell is within bounds
        if (isInBounds(newRow, newCol)) {
          currentRow = newRow;
          currentCol = newCol;

          // If we encounter a loop, erase it
          const loopIndex = walkPath.findIndex(
            (cell) => cell.row === currentRow && cell.col === currentCol
          );
          if (loopIndex !== -1) {
            walkPath = walkPath.slice(0, loopIndex + 1); // Erase the loop
          }
        }
      }

      return walkPath;
    };

    // Add new cells to the maze until all cells are connected
    for (let row = 1; row < this.fieldsInRow * 2; row += 2) {
      for (let col = 1; col < this.fieldsInCol * 2; col += 2) {
        // Skip if the cell is already visited
        if (visited.has(`${row},${col}`)) {
          continue;
        }

        // Perform a loop-erased random walk starting from the unvisited cell
        const walkPath = randomWalk(row, col);

        // Carve the path into the maze and mark cells as visited
        for (let i = 0; i < walkPath.length - 1; i++) {
          const current = walkPath[i];
          const next = walkPath[i + 1];

          // Carve the path by removing the wall between the current and next cells
          maze[(current.row + next.row) / 2][(current.col + next.col) / 2] = 0;
          maze[current.row][current.col] = 0;
          visited.add(`${current.row},${current.col}`);
        }

        // Mark the final cell as visited
        const last = walkPath[walkPath.length - 1];
        visited.add(`${last.row},${last.col}`);
        maze[last.row][last.col] = 0;
      }
    }

    // Safety check: Ensure all path cells are connected using BFS
    const safetyCheck = () => {
      const visitedPaths = new Set();
      const queue = [];
      let startPathFound = false;

      // Find the first path cell (0) to start BFS
      for (let row = 1; row < maze.length - 1; row++) {
        for (let col = 1; col < maze[0].length - 1; col++) {
          if (maze[row][col] === 0) {
            queue.push({ row, col });
            visitedPaths.add(`${row},${col}`);
            startPathFound = true;
            break;
          }
        }
        if (startPathFound) break;
      }

      // Perform BFS to mark all reachable path cells
      while (queue.length > 0) {
        const { row, col } = queue.shift();

        // Check all 4 possible neighbors (up, down, left, right)
        const deltas = [
          { row: -1, col: 0 }, // Up
          { row: 1, col: 0 }, // Down
          { row: 0, col: -1 }, // Left
          { row: 0, col: 1 }, // Right
        ];

        for (const delta of deltas) {
          const newRow = row + delta.row;
          const newCol = col + delta.col;

          if (isInBounds(newRow, newCol) && maze[newRow][newCol] === 0) {
            const key = `${newRow},${newCol}`;
            if (!visitedPaths.has(key)) {
              visitedPaths.add(key);
              queue.push({ row: newRow, col: newCol });
            }
          }
        }
      }

      // After BFS, turn all unvisited path cells into walls
      for (let row = 1; row < maze.length - 1; row++) {
        for (let col = 1; col < maze[0].length - 1; col++) {
          if (maze[row][col] === 0 && !visitedPaths.has(`${row},${col}`)) {
            maze[row][col] = 1; // Convert to wall
          }
        }
      }
    };

    // Run the safety check to eliminate any isolated paths
    safetyCheck();

    return maze;
  }

  safetyCheck() {
    // Initialize a set to keep track of all reachable paths
    let reachablePaths = new Set();
    let queue = [];

    // Find the first path cell to start the BFS
    if (this.pathFields.length === 0) return true; // If no paths exist, it's an automatic failure

    for (let i = 0; i < this.pathFields.length; i++) {
      const startField = this.pathFields[i];
      queue.push(startField);
      reachablePaths.add(`${startField.x},${startField.y}`);
      break; // Start BFS from the first path field found
    }

    // Perform BFS to explore all connected path cells
    while (queue.length > 0) {
      const currentField = queue.shift();

      // Define directions to move (up, down, left, right)
      const directions = [
        { dx: 1, dy: 0 }, // Down
        { dx: -1, dy: 0 }, // Up
        { dx: 0, dy: 1 }, // Right
        { dx: 0, dy: -1 }, // Left
      ];

      for (let dir of directions) {
        const newX = currentField.x + dir.dx;
        const newY = currentField.y + dir.dy;

        // Check if the new coordinates are within bounds and not a wall
        if (
          newX >= 0 &&
          newX < this.fieldsInCol &&
          newY >= 0 &&
          newY < this.fieldsInRow &&
          !this.fieldsMatrix[newX][newY].isWall &&
          !reachablePaths.has(`${newX},${newY}`)
        ) {
          // Add the reachable field to the BFS queue
          reachablePaths.add(`${newX},${newY}`);
          queue.push(this.fieldsMatrix[newX][newY]);
        }
      }
    }

    // Now check if all path fields were visited
    let foundIsland = false;
    this.pathFields.forEach((field) => {
      if (!reachablePaths.has(`${field.x},${field.y}`)) {
        // If the field is not reachable, we found an island
        foundIsland = true;
      }
    });

    return foundIsland;
  }
}
