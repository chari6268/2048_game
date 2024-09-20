import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board")
const scoreDisplay = document.getElementById("score")
const highScoreDisplay = document.getElementById("heigh-score") // Get high score display element
let score = 0; // Initialize score
let highScore = localStorage.getItem('highScore') || 0; // Retrieve high score from local storage

const grid = new Grid(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

setupInput()
setupTouch()
updateScoreDisplay(); // Initial score display
updateHighScoreDisplay(); // Initial high score display

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
}

function setupTouch() {
  let startX, startY, endX, endY

  gameBoard.addEventListener("touchstart", e => {
    const touch = e.touches[0]
    startX = touch.clientX
    startY = touch.clientY
  })

  gameBoard.addEventListener("touchend", e => {
    const touch = e.changedTouches[0]
    endX = touch.clientX
    endY = touch.clientY

    handleSwipe()
  })

  function handleSwipe() {
    const deltaX = endX - startX
    const deltaY = endY - startY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > 0) {
        handleInput({ key: "ArrowRight" })
      } else {
        handleInput({ key: "ArrowLeft" })
      }
    } else {
      if (deltaY > 0) {
        handleInput({ key: "ArrowDown" })
      } else {
        handleInput({ key: "ArrowUp" })
      }
    }
  }
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput()
        return
      }
      await moveUp()
      break
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput()
        return
      }
      await moveDown()
      break
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput()
        return
      }
      await moveLeft()
      break
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput()
        return
      }
      await moveRight()
      break
    default:
      setupInput()
      return
  }

  grid.cells.forEach(cell => cell.mergeTiles())

  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      alert("You lose")
    })
    return
  }

  setupInput()
}

function moveUp() {
  return slideTiles(grid.cellsByColumn)
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
            score += lastValidCell.tile.value; // Update score
            updateScoreDisplay(); // Update score display
            updateHighScore(); // Check and update high score
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`; // Update score display
}

function updateHighScore() {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('highScore', highScore); // Store new high score in local storage
    updateHighScoreDisplay();
  }
}

function updateHighScoreDisplay() {
  highScoreDisplay.textContent = `High Score: ${highScore}`; // Update high score display
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}

function canMoveLeft() {
  return canMove(grid.cellsByRow)
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}
