class Game {
  constructor(fieldsInRow, fieldsInCol, fieldSize, monsters) {
    this.startScreenElement = document.getElementById("start-screen");
    this.gameScreenElement = document.getElementById("game-screen");
    this.endScreenElement = document.getElementById("end-screen");
    this.levelElement = document.getElementById("level");
    this.coinsElement = document.getElementById("coins");
    this.livesElement = document.getElementById("lives");
    this.gameFieldElement = document.getElementById("game-field");
    this.messageLevelElement = document.getElementById("message-level");
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 20;
    this.frequencyOfMonstersMovement = 10; //every ... iteration the monsters are moving (small number -> faster)
    this.gameOver = false;
    this.levelCompleted = false;
    this.levelCount = 1;
    this.counter = 0;
    this.totalCoins = 0;
    this.coinsCollected = 0;
    this.coinsToNewLife = 100;
    this.fieldsInCol = fieldsInCol;
    this.fieldsInRow = fieldsInRow;
    this.fieldSize = fieldSize;
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
    this.audioOn = true;
    this.soundLife = new Audio("/sounds/life.wav");
    this.soundCoin = new Audio("/sounds/coin.wav");
    this.soundCoin.playbackRate = 2; // 1.5x faster
    this.soundLevel = new Audio("/sounds/level.wav");
    this.soundCollision = new Audio("/sounds/collision.wav");
    this.soundGameover = new Audio("/sounds/gameover.wav");
    this.soundGameover.playbackRate = 1.2; // 1.5x faster
  }

  initialize() {
    this.gameScreenElement.style.display = "flex";
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
    this.initializeArrowMovementPlayer();
    //add statistics to DOM
    this.coinsElement.innerText = this.player.coins;
    this.livesElement.innerText = this.player.lives;
    //start loop
    this.gameLoop();
  }

  start() {
    this.startScreenElement.style.display = "none";
    this.initialize();
    this.startLoop();
  }

  startLoop() {
    // console.log("loop started");
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
      if (this.audioOn) this.soundLevel.play();
      clearInterval(this.gameIntervalId);
      this.messageLevelElement.style.display = "block";
      console.log("level completed");
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
    // const maze = this.mazeAlgorithmDFS();
    const maze = this.mazeAlgorithmKruskal);
    // console.log(maze);

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
    // console.log('All Wall Fields:', this.wallFields);
    // console.log('All Path Fields:', this.pathFields);
  }

  addPlayer() {
    this.playerElement = document.createElement("img");
    this.playerElement.classList.add("isPlayer");
    const randomImg = Math.floor(Math.random() * 10);
    this.playerElement.src = `../img/player${randomImg}.png`;
    this.playerElement.style.fontSize = `${this.fieldSize * 0.7}px`;
    const randomIndex = parseInt(Math.random() * this.pathFields.length);
    this.currentFieldPlayer = this.pathFields[randomIndex]; //random field
    // console.log(randomIndex, this.currentField);
    this.player = new Player(this.currentFieldPlayer, this.fieldsInCol, this.fieldsInRow);
    // console.log(this.player);
    // this.update();
  }

  addMonsters(num) {
    for (let i = 0; i < num; i++) {
      const randomIndex = parseInt(Math.random() * this.pathFields.length);
      const newField = this.pathFields[randomIndex];
      this.currentFieldsMonsters.push(newField); //random field
      this.monsters.push(new Monster(newField, this.fieldsInCol, this.fieldsInRow));
      const newElement = document.createElement("img");
      const randomImg = Math.floor(Math.random() * 17);
      newElement.src = `../img/monster${randomImg}.png`;
      // const r = Math.floor(Math.random() * 100) + 150;
      // const g = Math.floor(Math.random() * 50);
      // const b = Math.floor(Math.random() * 50);
      // newElement.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
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
      if (this.audioOn) this.soundCoin.play();
      if (this.player.coins % this.coinsToNewLife === 0) {
        if (this.audioOn) this.soundLife.play();
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
      if (this.audioOn) this.soundCollision.play();
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
      console.log("Game over.");
      clearInterval(this.gameIntervalId);
      if (this.audioOn) this.soundGameover.play();
      //TODO: GAME OVER
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

    // console.log("Wall fields:", this.wallFields);
    // console.log("Path fields:", this.pathFields);
    // console.log("Monsters:", this.monsters);
    // console.log("Monster elements:", this.monsterElements);
    // console.log("Monster fields:", this.currentFieldsMonsters);

    //add coins to paths
    this.pathFields.forEach((e) => {
      const coinElement = document.createElement("div");
      coinElement.classList.add("coin");
      e.element.appendChild(coinElement);
      e.hasCoin = true;
      this.totalCoins++;
    });

    //add Player and Monster
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
}
