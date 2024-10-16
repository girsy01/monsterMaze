# MONSTER MAZE

<a href='https://girsy01.github.io/monsterMaze/'>
<img src="./img/monster8.png"
     alt="Markdown Monster icon"
     style="height: 80px;" />
</a>

# [**Play the game!**](https://girsy01.github.io/monsterMaze/)


# Description
**Monster Maze** is an exciting escape adventure where the player must avoid monsters while navigating the maze using the arrow keys. The goal is to collect all the coins scattered along the paths. Once all coins are gathered, the level is completed, and the player advances to the next stage.

Be careful! If a monster catches you, you'll lose a life. When all lives are lost, the game ends, and your total collected coins and completed levels are displayed.



# Main Functionalities
- player can chose between three different maze sizes (small, medium, large)
- maze size reflects the number of fields in each row and column
- the resulting field size adapts automatically to the viewport size (length of each field)
- a random maze is generated with the [Kruskal Algorithm](#kruskals-algorithm-for-maze-generation)
- player moves by using arrow keys up/down/left/right on the keyboard
- monsters move randomly in the maze
- on each field of the path there is one coin
- as soon as all coins are collected by the player, the level ends
- when colliding with a monster, the player loses one live and the monster is added to the maze at another random position
- after every second completed level, one additional monster is added to the maze
- monsters are added to the maze with minimum distance of 2 to the player
- when all lives are ost, the game ends and you can try again
- music and sound effects are on by default, player can toggle them off/on by clicking the corresponding buttons or simply press M (for music) or S (for sound effects) on the keyboard

## Kruskal's Algorithm for Maze Generation

In this game, Kruskal's Algorithm is used to create random mazes for the player to navigate. The algorithm works by treating the maze as a grid of cells, where all cells start off separated by walls. The goal is to remove walls between cells in such a way that all cells are connected, forming a solvable maze.

Here’s a simplified version of how it works in the game:

1. **Start with all walls** between the cells.
2. **Randomly choose walls** and remove them, but only if doing so connects two previously unconnected areas of the maze.
3. **Continue removing walls** until all cells are connected and the maze is fully generated.

This process ensures that there is always a path between any two points in the maze, while avoiding loops or isolated sections.


# Backlog
- implement input fields for custom field size (#rows, #columns)


# Technologies Used
- **HTML**
- **CSS**
- **JavaScript**
- **DOM Manipulation**
- **JS Classes**
- **JS `Audio()` and JS `Image()`**

# States
- **Start Screen**
- **Game Screen**
- **Game Over Screen**

# Project Structure

## `index.html`
- Contains the HTML structure for the game, including elements for the start screen, game screen, and end screen.
- Elements:
  - `#start-screen`
  - `#game-screen`
  - `#end-screen`
  - `#game-field`
  - `#audio-btns`
  - `#coins`
  - `#lives`
  - `#level`
  - `#end-score`
  - `#end-levels`
  - `#title`
  - `#instructions`

## `game.js`
- **Game Properties:**
  - `this.startScreenElement`
  - `this.gameScreenElement`
  - `this.endScreenElement`
  - `this.audioButtonsElement`
  - `this.levelElement`
  - `this.coinsElement`
  - `this.livesElement`
  - `this.gameFieldElement`
  - `this.messageLevelElement`
  - `this.messageLevelImgElement`
  - `this.endScoreElement`
  - `this.endLevelElement`
  - `this.titleElement`
  - `this.instructionsElement`
  - `this.gameIntervalId`
  - `this.gameLoopFrequency`
  - `this.frequencyOfMonstersMovement`
  - `this.fieldsInCol`
  - `this.fieldsInRow`
  - `this.gameOver`
  - `this.levelCompleted`
  - `this.levelCount`
  - `this.counter`
  - `this.totalCoins`
  - `this.coinsCollected`
  - `this.coinsToNewLife`
  - `this.fieldSize`
  - `this.myAudio`
  - `this.fieldsMatrix`
  - `this.allFields`
  - `this.wallFields`
  - `this.pathFields`
  - `this.player`
  - `this.playerElement`
  - `this.currentFieldPlayer`
  - `this.numberOfMonsters`
  - `this.monsters`
  - `this.monsterElements`
  - `this.currentFieldsMonsters`

- **Functions:**
  - `start()`
  - `initialize()`
  - `startLoop()`
  - `pauseLoop()`
  - `gameLoop()`
  - `update()`
  - `generateMaze()`
  - `addPlayer()`
  - `addMonsters()`
  - `initializeKeyListeners()`
  - `movePlayer()`
  - `moveMonsters()`
  - `collectCoin()`
  - `checkForCollision()`
  - `handleGameOver()`
  - `startNewLevel()`

## `field.js`
- **Properties:**
  - `this.x`
  - `this.y`
  - `this.size`
  - `this.element`
  - `this.isWall`
  - `this.hasCoin`

- **Functions:**
  - Constructor: creates and initializes the field with size, position, and state (wall or path).

## `figure.js`
- **Properties:**
  - `this.x`
  - `this.y`
  - `this.moveX`
  - `this.moveY`
  - `this.fieldsInRow`
  - `this.fieldsInCol`

- **Functions:**
  - Constructor: sets the position and movement directions for game figures like the player and monsters.

## `player.js`
- **Properties:**
  - `this.coins`
  - `this.lives`

- **Functions:**
  - Extends `Figure`: inherits the position and movement properties from `Figure`.

## `monster.js`
- **Properties:**
  - `this.currentDirection`

- **Functions:**
  - Extends `Figure`: inherits the position and movement properties from `Figure`.

## `audio.js`
- **Properties:**
  - `this.gameStarted`
  - `this.musicOn`
  - `this.audioOn`
  - `this.musicButtonElement`
  - `this.soundEffectsButtonElement`
  - `this.soundBackgroundMusic`
  - `this.soundLife`
  - `this.soundCoin`
  - `this.soundLevel`
  - `this.soundCollision`
  - `this.soundGameover`

- **Functions:**
  - `handleMusic()`
  - `handleSounds()`

## `script.js`
- **Functions:**
  - `window.onload`: sets up event listeners, starts the game, and handles audio interactions.
  - `updateButtonStates()`: updates field size options.
  - `updateGameSettings()`: updates game settings when the field size is changed.

## `style.css`
- Contains the styles for various game elements, including buttons, fields, screens, and text.
- **Main sections:**
  - General element styles (`*`, `body`, `h1`, `p`)
  - Button styles (`button`, `#audio-btns button`)
  - Screen and field styles (`#start-screen`, `#game-screen`, `#game-field`, `.field`, `.isPlayer`, `.isMonster`, `.isWall`, `.coin`)
  - Responsive styles for different screen sizes.
