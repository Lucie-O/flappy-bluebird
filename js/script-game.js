// LINK TO HOME PAGE
const title = document.querySelector("header");

function handleTitleClick(e) {
  if (state.gameMode !== "running") {
    window.location.assign("index.html");
  }
}

// GAME
// CONSTS, VARS & STATE
const ctrls = localStorage.getItem("controls");

const canvas = document.querySelector("#screen");
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const ctx = canvas.getContext("2d");

var game; // Needed as a global variable

var state = {
  gameMode: "startScreen",
  birdX: canvas.width * .1,
  birdY: canvas.height * .58,
  birdWidth: canvas.width * .1,
  birdHeight: canvas.width * .1 * .76,
  gravity: canvas.height * .01,
  boostUp: canvas.height * .066,
  pipeWidth: canvas.width * .05,
  pipesProperties: [],
  score: 0,
  highScore: localStorage.getItem("highScore"),
};

if (state.highScore === null) {
  localStorage.setItem("highScore", 0);
  state.highScore = localStorage.getItem("highScore");
}

const birdImg = document.querySelector("#birdImage");

// DRAWING ON CANVAS
function displayText(text, yPosition) {
  if (yPosition === undefined) {
    yPosition = canvas.height/2;
  }
  ctx.font = "1.75em Lemonada";
  ctx.fillStyle = "#0161c1";
  ctx.textAlign = "center";
  ctx.fillText(text, canvas.width/2, yPosition);
}

function displayScore() {
  ctx.font = "1em Lemonada";
  ctx.fillStyle = "#0161c1";
  ctx.textAlign = "right";
  ctx.fillText("Score: " + state.score + "  High Score: " + state.highScore, canvas.width * .99, canvas.height * .07);
}

function drawBird() {
  // Background for testing basic "rectangle" collision
  // ctx.fillStyle = "#fff";
  // ctx.fillRect(state.birdX, state.birdY, state.birdWidth, state.birdHeight);
  ctx.drawImage(birdImg, state.birdX, state.birdY, state.birdWidth, state.birdHeight);
}

function drawBackground() {
  ctx.fillStyle = "#F0F8FF";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#41D3BD";
  ctx.fillRect(0, canvas.height*.99, canvas.width, canvas.height);
}

function drawPipe(pipeInfo) {
  var pipeY = canvas.height - pipeInfo.h;
  ctx.fillStyle = "#41D3BD";
  ctx.fillRect(pipeInfo.x, pipeY, state.pipeWidth, pipeInfo.h);
  ctx.fillRect(pipeInfo.x, 0, state.pipeWidth, canvas.height - pipeInfo.h - canvas.height*.3);
}

// MOVING PARTS
function pipeGenerator() {
  for (var i = 0; i < state.pipesProperties.length; i++) {
    var pipe = state.pipesProperties[i];
    drawPipe(pipe);
  }
}

function gravity() {
  state.birdY += state.gravity;
}

function movePipe() {
  for (var i = 0; i < state.pipesProperties.length; i++) {
    if (state.score <= 30) {
      state.pipesProperties[i].x -= canvas.width * .008;
    } else if (state.score <= 60) {
      state.pipesProperties[i].x -= canvas.width * .010;
    } else {
      state.pipesProperties[i].x -= canvas.width * .012;
    }
  }
  if (state.pipesProperties[0].x <= -canvas.width * .05) {
    var lastPipe = state.pipesProperties[i-1];
    state.pipesProperties.shift();
    state.pipesProperties.push({x: lastPipe.x + canvas.width*.4,
      h: canvas.height * (Math.random() *.5 + .1),
      inScore: false,});
  }
}

// GENERAL GAME MECHANICS
function countScore() {
  var firstPipe = state.pipesProperties[0];
  if (firstPipe.x < state.birdX && firstPipe.inScore === false) {
    state.pipesProperties[0].inScore = true;
    state.score += 1;
  }
}

function resetGame() {
  state.gameMode = "startScreen";
  state.birdY = canvas.height * .58;
  state.pipesProperties = [{x: canvas.width * .4, h: canvas.height * (Math.random() *.2 + .14), inScore: false,}, // Otherwise first pipe sometimes impossible to pass due to initial birdY
    {x: canvas.width * .8, h: canvas.height * (Math.random() *.5 + .1), inScore: false,},
    {x: canvas.width * 1.2, h: canvas.height * (Math.random() *.5 + .1), inScore: false,}];
  state.score = 0;
  drawBackground();
  drawBird();
  if (ctrls === "keys") {
    displayText("Press 'Enter' To Play");
  } else if (ctrls === "touch") {
    displayText("Touch To Play");
  }
}

function gameOver() {
  clearInterval(game);
  state.gameMode = "gameOver";
  displayText("Game Over");
  if (state.score > state.highScore) {
    localStorage.setItem("highScore", state.score);
    state.highScore = localStorage.getItem("highScore");
    displayText("New High Score: " + state.highScore, canvas.height*.67);
  }
  setTimeout(resetGame, 2500);
}

function birdPipeOverlap() {
  // Simple overlap: the bird as a rectangle
//   var pipeX = state.pipesProperties[0].x;
//   var pipeHeight = state.pipesProperties[0].h;
//   if (pipeX <= state.birdX + state.birdWidth && pipeX + state.pipeWidth >= state.birdX) {
//     // Bottom Edge Overlap
//     if (state.birdY + state.birdHeight >= canvas.height - pipeHeight) {
//       return true;
//     }
//     // Top Edge Overlap
//     else if (state.birdY <= canvas.height - pipeHeight - canvas.height*.3) {
//       return true;
//     }
//   }
//   return false;
// }

  // More accurate overlap: the bird's edges as a series of horizontal & diagonal lines (see images/bird-function-guidelines.png)
  var pipeX = state.pipesProperties[0].x;
  var pipeHeight = state.pipesProperties[0].h;

  // Top Edge Overlap
  if (pipeX <= state.birdX + state.birdWidth && pipeX >= state.birdX + state.birdWidth*.75) {
    var birdTopEdge = state.birdY + (0.72 * (pipeX - state.birdX) - state.birdHeight*.7073);
  } else if (pipeX < state.birdX + state.birdWidth*.75 && pipeX + state.pipeWidth >= state.birdX + state.birdWidth*.5) {
    var birdTopEdge = state.birdY;
  } else if (pipeX + state.pipeWidth < state.birdX + state.birdWidth*.5 && pipeX + state.pipeWidth >= state.birdX + state.birdWidth*.1) {
    var birdTopEdge = state.birdY + state.birdHeight*.4;
  } else if (pipeX + state.pipeWidth < state.birdX + state.birdWidth*.1 && pipeX + state.pipeWidth >= state.birdX) {
    var birdTopEdge = state.birdY + state.birdHeight*.5;
  }
  if (birdTopEdge <= canvas.height - pipeHeight - canvas.height*.3) {
    return true;
  }

  // Bottom Edge Overlap
  if (pipeX <= state.birdX + state.birdWidth && pipeX >= state.birdX + state.birdWidth*.82) {
    var birdBottomEdge = state.birdY + (-1.49 * (pipeX - state.birdX) + state.birdHeight*2.327);
  } else if (pipeX < state.birdX + state.birdWidth*.82 && pipeX >= state.birdX + state.birdWidth*.5) {
    var birdBottomEdge = state.birdY + (-0.63 * (pipeX - state.birdX) + state.birdHeight*1.397);
  } else if (pipeX < state.birdX + state.birdWidth*.5 && pipeX + state.pipeWidth >= state.birdX + state.birdWidth*.5) {
    var birdBottomEdge = state.birdY + state.birdHeight;
  } else if (pipeX + state.pipeWidth < state.birdX + state.birdWidth*.5 && pipeX + state.pipeWidth >= state.birdX) {
    var birdBottomEdge = state.birdY + (0.45 * (pipeX + state.pipeWidth - state.birdX) + state.birdHeight*.6897);
  }
  if (birdBottomEdge >= canvas.height - pipeHeight) {
    return true;
  }
  return false;
}

function checkGameOver() {
  if (birdPipeOverlap() === true) {
    gameOver();
  } else if (state.birdY + state.birdHeight >= canvas.height*.99) {
    gameOver();
  }
}

function runGame() {
  drawBackground();
  drawBird();
  pipeGenerator();
  displayScore();
  checkGameOver();
  countScore();
  gravity();
  movePipe();
}

// HANDLING PLAYER INTERACTIONS
function startGame() {
  state.gameMode = "running";
  game = setInterval(runGame, 50);
}

function pauseGame() {
  if (state.gameMode === "running") {
    clearInterval(game);
    displayText("Pause");
    state.gameMode = "paused";
  } else if (state.gameMode === "paused") {
    game = setInterval(runGame, 50);
    state.gameMode = "running";
  }
}

function moveBird() {
  if (state.birdY > state.birdHeight) {
    state.birdY -= state.boostUp;
  } else {
    state.birdY = 0;
  }
}

function handleKeyDown(e) {
  if (e.key === " " && state.gameMode === "running") {
    moveBird();
  } else if (e.key === "p") {
    pauseGame();
  } else if (e.key === "Enter" && state.gameMode === "startScreen") {
    startGame();
  }
}

function handleClick(e) {
  if (e.target.id !== "pauseBtn" && state.gameMode === "running") {
    moveBird();
  } else if (e.target.id === "pauseBtn") {
    pauseGame();
  } else if (e.target.id === "screen" && state.gameMode === "startScreen") {
    startGame();
  }
}

function init() {
  // DISPLAY RELEVANT HTML ELEMENTS
  if (ctrls === "keys") {
    document.querySelector(".keys").style.display = "block";
  } else if (ctrls === "touch") {
    document.querySelectorAll(".touch")[0].style.display = "block";
    document.querySelectorAll(".touch")[1].style.display = "block";
    document.querySelector("body").style.cursor = "pointer"; // makes click events work on mobile Safari
  }
  // ADD EVENT LISTENERS
  title.addEventListener("click", handleTitleClick);
  if (ctrls === "keys") {
    document.addEventListener("keydown", handleKeyDown);
  } else if (ctrls === "touch") {
    document.addEventListener("click", handleClick);
    document.querySelector("button").addEventListener("touchstart", function() {}); // makes css :active pseudo-class work on mobile Safari
  }
  resetGame();
}

window.onload = init;
