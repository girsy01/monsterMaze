# MONSTER MAZE

<a href='https://girsy01.github.io/monsterMaze/'>
<img src="./img/monster8.png"
     alt="Markdown Monster icon"
     style="height: 80px;" />
</a>

# [**Play the game!**](https://girsy01.github.io/monsterMaze/)

# Description

**Monster Maze** is a thrilling escape adventure where the player must outsmart and evade monsters while navigating through a maze. Using the arrow keys, the player collects all the coins scattered along the paths. Once all the coins are gathered, the level is completed, and the player advances to the next stage.

Beware of the monsters! If they catch you, you'll lose a life. The game ends when all lives are lost, at which point your total collected coins and completed levels will be displayed.

Please note: **This game requires a keyboard to play.** If you're on a touch device, you won't be able to control the game. Enjoy the challenge of Monster Maze on a desktop or laptop for the best experience.

# Main Functionalities

- The player can choose between three different maze sizes: small, medium, or large.
- The maze size determines the number of fields in each row and column.
- The size of each field automatically adjusts to fit the viewport.
- A random maze is generated using the [Kruskal Algorithm](#kruskals-algorithm-for-maze-generation).
- A safety check ensures that the generated maze has no isolated paths or unreachable areas, guaranteeing a solvable maze.
- The player moves through the maze using the arrow keys (up, down, left, right).
- The player and monsters are assigned a random image each time they are generated, adding visual variety to each playthrough.
- Monsters move randomly within the maze, with movement occurring at intervals.
- Each path field contains a coin.
- The level ends when the player collects all the coins.
- If the player collides with a monster, they lose one life, and the monster respawns at a random position.
- Players gain extra lives by collecting a certain number of coins, which varies depending on the maze size.
- After every two completed levels, an additional monster is added to the maze.
- Monsters are placed at a minimum distance of 2 fields from the player.
- A message is displayed after each completed level, providing feedback before progressing to the next stage.
- The game ends when all lives are lost, but players can try again.
- Audio feedback plays during key events like coin collection, collisions, and game over.
- Music and sound effects are enabled by default. The player can toggle them on/off by clicking the respective buttons or pressing **M** (for music) and **S** (for sound effects) on the keyboard.

## Kruskal's Algorithm for Maze Generation

In this game, Kruskal's Algorithm is used to create random mazes for the player to navigate. The algorithm works by treating the maze as a grid of cells, where all cells start off separated by walls. The goal is to remove walls between cells in such a way that all cells are connected, forming a solvable maze.

Here’s a simplified version of how it works in the game:

1. **Start with all walls** between the cells.
2. **Randomly choose walls** and remove them, but only if doing so connects two previously unconnected areas of the maze.
3. **Continue removing walls** until all cells are connected and the maze is fully generated.

This process ensures that there is always a path between any two points in the maze, avoiding isolated sections. However, in smaller mazes, isolated path fields occasionally appeared, making the level unsolvable. To prevent this, an additional check was implemented to regenerate the maze whenever this issue occurs.

Initially, the maze was generated using the DFS (Depth-First Search) algorithm. However, this often resulted in very long dead-ends, making the game more difficult as monsters would frequently get stuck in these areas, and it became challenging for the player to navigate. To improve gameplay, the maze generation was switched to Kruskal’s Algorithm, which creates more balanced mazes and ensures a more enjoyable experience.

# Backlog

- Improve the design and overall responsiveness of the game, ensuring it adapts well to different screen sizes and devices
- Implement input fields for custom field size (#rows, #columns)
- Introduce different monster types with unique behaviors (e.g., faster movement, monsters that chase the player, or those with unpredictable patterns)
- Implement time-based scoring, rewarding players for completing levels faster
- Increase monster movement speed as players reach higher levels to raise the difficulty progressively
- Implement a version of the game that supports touch devices, allowing play without a keyboard

# Technologies Used

- **HTML**
- **CSS**
- **JavaScript**
- **DOM Manipulation**
- **JS Classes**
- **Locale Storage**
- **JS `Audio()` and JS `Image()`**

## States

- **Start Screen**
- **Game Screen**
- **Game Over Screen**

## Touch Device Detection

This game requires a keyboard to play. Users on touch devices (phones, tablets, etc.) will see a message indicating that it is not possible to play without a keyboard. The game elements are disabled for touch users.

## Project Structure

### `index.html`

- Contains the HTML structure for the game, including elements for the start screen, game screen, and end screen.
- A new `div` with the ID `#touch-warning` is added to display the warning message for users on touch devices.

### `game.js`

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
  - **Touch Detection:**
    - `isTouchDevice()`: Detects whether the user is on a touch device.
    - Shows the `#touch-warning` message if a touch device is detected and disables the start button.

### `field.js`

- **Properties:**
  - `this.x`
  - `this.y`
  - `this.size`
  - `this.element`
  - `this.isWall`
  - `this.hasCoin`

### `figure.js`

- **Properties:**
  - `this.x`
  - `this.y`
  - `this.moveX`
  - `this.moveY`
  - `this.fieldsInRow`
  - `this.fieldsInCol`

### `player.js`

- **Properties:**
  - `this.coins`
  - `this.lives`

### `monster.js`

- **Properties:**
  - `this.currentDirection`

### `audio.js`

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

### `script.js`

- **Functions:**
  - `window.onload`: sets up event listeners, starts the game, handles audio interactions, and detects touch devices.
  - `updateButtonStates()`: updates field size options.
  - `updateGameSettings()`: updates game settings when the field size is changed.

### `style.css`

- Contains the styles for various game elements, including buttons, fields, screens, and text.
- **Main sections:**
  - General element styles (`*`, `body`, `h1`, `p`)
  - Button styles (`button`, `#audio-btns button`)
  - Screen and field styles (`#start-screen`, `#game-screen`, `#game-field`, `.field`, `.isPlayer`, `.isMonster`, `.isWall`, `.coin`)
  - Responsive styles for different screen sizes.
  - **Touch Warning Message Styling**: New styles for `#touch-warning` to display a centered message on touch devices.
