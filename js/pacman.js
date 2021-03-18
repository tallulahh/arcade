//Key Code Variables
const KEY_CODE_RIGHT = 39;
const KEY_CODE_LEFT = 37;
const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;

const PLAYER_MAX_SPEED = 100;

const INSET = 1;

//Canvas
const canvas = document.getElementById("pacmanBoard");
const ctx = canvas.getContext("2d");

//Board Variables
let tileSize = 25;
canvas.width = tileSize * 19;
canvas.height = tileSize * 23;

const GAME_STATE = {
  lastTime: Date.now(),
  leftPressed: false,
  rightPressed: false,
  upPressed: false,
  downPressed: false,
  playerRadius: 9,
  score: 0,
  lives: 3,
  pelletsEaten: 0
}

//Board Map
const layout = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 4, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 4, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
  [2, 2, 2, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 2, 2, 2],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 3, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [2, 2, 2, 2, 1, 1, 1, 0, 3, 3, 3, 0, 1, 1, 1, 2, 2, 2, 2],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [2, 2, 2, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 2, 2, 2],
  [0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0],
  [0, 4, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 4, 0],
  [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0],
  [0, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let randomDirection;
var interval;
var seconds = 4;


var board = document.querySelector("#board");
var gameOverDisplay = document.querySelector(".gameOver");

//Add data and position for each brick made of map
var bricks = [];
for (var c = 0; c < layout.length; c++) {
  bricks[c] = [];
  for (var r = 0; r < layout[c].length; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      isEaten: false
    };
  }
}

//Basic function to create random ghost movement
function getDirection() {
  var directions = {
    0: "up",
    1: "right",
    2: "down",
    3: "left"
  };
  var randomNumber = Math.floor(Math.random() * 4);
  randomDirection = directions[randomNumber];
  return randomDirection;
}

//Player Information
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2 + 25,
  vx: 2,
  vy: 2,
  direction: "right",
  prevPos: {},
  isDead: false,
  updatePosition: function(layout) {
    this.prevPos = {
      x: this.x,
      y: this.y
    };
    if (GAME_STATE.leftPressed) {
      // this.x -= dt * PLAYER_MAX_SPEED;
      this.x -= this.vx;
      this.direction = "left";
    }
    if (GAME_STATE.rightPressed) {
      // this.x += dt * PLAYER_MAX_SPEED
      this.x += this.vx;
      this.direction = "right";
    }
    if (GAME_STATE.upPressed) {
      // this.y -= dt * PLAYER_MAX_SPEED;
      this.y -= this.vy;
      this.direction = "up";
    }
    if (GAME_STATE.downPressed) {
      // this.y += dt * PLAYER_MAX_SPEED;
      this.y += this.vy;
      this.direction = "down";
    }

  },
  draw: function(ctx, tileSize) {
    var angle1 = {
      start: 0,
      end: 0,
      drawDir: false
    };
    var angle2 = {
      start: 0,
      end: 0,
      drawDir: false
    };

    if (this.direction === "right") {
      angle1 = {
        start: 0.25,
        end: 1.25,
        drawDir: false
      };
      angle2 = {
        start: 0.75,
        end: 1.75,
        drawDir: false
      };
    }
    if (this.direction === "left") {
      angle1 = {
        start: 0.25,
        end: 1.25,
        drawDir: true
      };
      angle2 = {
        start: 0.75,
        end: 1.75,
        drawDir: true
      };
    }
    if (this.direction === "up") {
      angle1 = {
        start: 1.25,
        end: 0.25,
        drawDir: true
      };
      angle2 = {
        start: 0.75,
        end: 1.75,
        drawDir: true
      };
    }
    if (this.direction === "down") {
      angle1 = {
        start: 0.75,
        end: 1.75,
        drawDir: false
      };
      angle2 = {
        start: 1.25,
        end: 0.25,
        drawDir: false
      };
    }
    ctx.beginPath();
    ctx.arc(player.x, player.y, GAME_STATE.playerRadius, angle1.start * Math.PI, angle1.end * Math.PI, angle1.drawDir);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(player.x, player.y, GAME_STATE.playerRadius, angle2.start * Math.PI, angle2.end * Math.PI, angle2.drawDir);
    ctx.fill();
  }
}

//Ghost Information
class Ghost {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = 2;
    this.vy = 2;
    this.radius = 8;
    this.prevPos = {};
    this.isScared = false;
    this.isEatable = false;
    this.direction = "right";
  }
  draw() {
    if (this.isScared === true) {
      ctx.beginPath();
      ctx.fillStyle = "blue";
      ctx.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.arc(this.x + this.radius / 2, this.y + this.radius, this.radius * 0.5, 0, Math.PI);
      ctx.arc(this.x + this.radius / 2 - this.radius, this.y + this.radius, this.radius * 0.5, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "blue";
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.fillStyle = this.color;
      ctx.arc(this.x, this.y, this.radius, Math.PI, 2 * Math.PI);
      ctx.lineTo(this.x + this.radius, this.y + this.radius);
      ctx.arc(this.x + this.radius / 2, this.y + this.radius, this.radius * 0.5, 0, Math.PI);
      ctx.arc(this.x + this.radius / 2 - this.radius, this.y + this.radius, this.radius * 0.5, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
  }
  move() {
    this.prevPos = {
      x: this.x,
      y: this.y
    };
    if (this.direction === "up") {
      this.y -= this.vy;
    } else if (this.direction === "down") {
      this.y += this.vy;
    } else if (this.direction === "left") {
      this.x -= this.vx;
    } else if (this.direction === "right") {
      this.x += this.vx;
    }
  }
  stop() {
    this.vx = 0;
    this.vy = 0;
  }
  changeDirection() {
    if (this.direction === getDirection()) {
      getDirection();
    } else {
      this.direction = randomDirection;
    }
  }
}

var inky = new Ghost(canvas.width / 2, canvas.height / 2 - 76, "lightBlue");
var blinky = new Ghost(canvas.width / 2, canvas.height / 2 - 76, "red");
var pinky = new Ghost(canvas.width / 2, canvas.height / 2 - 76, "pink");
var clyde = new Ghost(canvas.width / 2, canvas.height / 2 - 76, "yellow");

var ghosts = [inky, blinky, pinky, clyde];

//Pellet Information
const pellet = {
  draw: function(ctx, layout, pelletX, pelletY, tileSize) {
    ctx.beginPath();
    ctx.arc(pelletX, pelletY, 3, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  },
  remove: function(ctx, layout, x, y, tileSize) {
    ctx.fillStyle = "black";
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}

//Power Pellet Information
const powerPellet = {
  radius: 0,
  draw: function(ctx, layout, powerPelletX, powerPelletY, tileSize) {
    ctx.beginPath();
    ctx.arc(powerPelletX, powerPelletY, this.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "white";
    ctx.fill();
  },

  remove: function(ctx, layout, x, y, tileSize) {
    ctx.fillStyle = "black";
    ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
  }
}

//Power Pellet Movement
function dilate() {
  var fps = 10;
  setTimeout(function() {
    requestAnimationFrame(dilate);

    // ... Code for Drawing the Frame ...
    if (++powerPellet.radius > 5) {
      while (powerPellet.radius > 0) {
        powerPellet.radius--;
      }
      powerPellet.radius++;
    }
  }, 1000 / fps);
}

function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.strokeStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawScore() {
  ctx.font = "bold 15px Raleway";
  ctx.fillStyle = "yellow";
  ctx.fillText("Score: " + GAME_STATE.score, 10, canvas.height - 7);
}

function drawLives() {
  var positions = [
    canvas.width / 2 - tileSize,
    canvas.width / 2,
    canvas.width / 2 + tileSize
  ];
  var lives = {
    x: 0,
    y: canvas.height - GAME_STATE.playerRadius
  }
  for (var i = 0; i < GAME_STATE.lives; i++) {
    lives.x = positions[i];
    ctx.beginPath();
    ctx.arc(lives.x, lives.y, GAME_STATE.playerRadius, 0.25 * Math.PI, 1.25 * Math.PI, false);
    ctx.fillStyle = "rgb(255, 255, 0)";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lives.x, lives.y, GAME_STATE.playerRadius, 0.75 * Math.PI, 1.75 * Math.PI, false);
    ctx.fill();
  }
}

function drawBoard() {
  for (let c = 0; c < layout.length; c++) {
    for (let r = 0; r < layout[c].length; r++) {
      if (layout[c][r] === 0) {
        var brickX = r * tileSize;
        var brickY = c * tileSize;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        bricks[c][r].type = "wall";
        drawWall(ctx, layout, brickX, brickY);
      } else if (layout[c][r] === 1) {
        var pelletX = r * tileSize + tileSize / 2;
        var pelletY = c * tileSize + tileSize / 2;
        bricks[c][r].x = pelletX;
        bricks[c][r].y = pelletY;
        bricks[c][r].type = "pellet";
        if (bricks[c][r].isEaten) {
          pellet.remove(ctx, layout, pelletX, pelletY, tileSize);
        } else {
          pellet.draw(ctx, layout, pelletX, pelletY, tileSize);
        }
      } else if (layout[c][r] === 4) {
        var powerPelletX = r * tileSize + tileSize / 2;
        var powerPelletY = c * tileSize + tileSize / 2;
        bricks[c][r].x = powerPelletX;
        bricks[c][r].y = powerPelletY;
        bricks[c][r].type = "powerPellet";
        if (bricks[c][r].isEaten) {
          powerPellet.remove(ctx, layout, powerPelletX, powerPelletY, tileSize);
        } else {
          powerPellet.draw(ctx, layout, powerPelletX, powerPelletY, tileSize);
        }
      }
    }
  }
}

function drawWall(ctx, layout, brickX, brickY) {

  ctx.fillStyle = "#0000ff";
  ctx.fillRect(brickX, brickY, tileSize, tileSize);
  ctx.strokeRect(brickX, brickY, tileSize, tileSize);
}

function drawGhosts() {
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].draw();
  }
}

function moveGhosts() {
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].move();
  }
}

function collision() {
  for (var c = 0; c < layout.length; c++) {
    for (var r = 0; r < layout[c].length; r++) {
      var b = bricks[c][r];

      //check if ghost collides with walls & pacman
      for (var i = 0; i < ghosts.length; i++) {
        if (ghosts[i].x + ghosts[i].radius > b.x && ghosts[i].x < b.x + tileSize + ghosts[i].radius && ghosts[i].y + ghosts[i].radius > b.y - 5 && ghosts[i].y < b.y + tileSize + ghosts[i].radius && b.type === "wall") {
          ghosts[i].x = ghosts[i].prevPos.x;
          ghosts[i].y = ghosts[i].prevPos.y;
          ghosts[i].changeDirection();
        }
        //check if player collides with ghost
        if (player.x + GAME_STATE.playerRadius > ghosts[i].x && player.x < ghosts[i].x + tileSize && player.y + GAME_STATE.playerRadius > ghosts[i].y && player.y < ghosts[i].y + tileSize && !player.isDead) {
          if (!ghosts[i].isScared) {
            player.isDead = true;

            ghosts[i].x = ghosts[i].prevPos.x;
            ghosts[i].y = ghosts[i].prevPos.y;
            player.x = player.prevPos.x;
            player.y = player.prevPos.y;
            GAME_STATE.lives -= 1;
            checkGameOver();
          } else if (ghosts[i].isEatable) {
            ghosts[i].isEatable = false;
            ghosts[i].x = canvas.width / 2;
            ghosts[i].y = canvas.height / 2 - 76;
            ghosts[i].direction = "right";
            GAME_STATE.score += 200;
          }
        }
      }

      //check if player collides with wall
      if (player.x + GAME_STATE.playerRadius > b.x && player.x < b.x + tileSize + GAME_STATE.playerRadius && player.y > b.y - GAME_STATE.playerRadius && player.y < b.y + tileSize + GAME_STATE.playerRadius) {
        if (b.type === "wall") {
          if (GAME_STATE.leftPressed) {
            player.x += player.vx;
          }
          if (GAME_STATE.rightPressed) {
            player.x -= player.vx;
          }
          if (GAME_STATE.upPressed) {
            player.y += player.vy;
          }
          if (GAME_STATE.downPressed) {
            player.y -= player.vy;
          }
        }
      }

      //check if player collides with pellets and powerPellets
      if (player.x + GAME_STATE.playerRadius > b.x && player.x < b.x + GAME_STATE.playerRadius && player.y > b.y - GAME_STATE.playerRadius && player.y < b.y + GAME_STATE.playerRadius && !b.isEaten) {
        if (b.type === "pellet" || b.type === "powerPellet") {
          b.isEaten = true;
          GAME_STATE.score += 10;
          GAME_STATE.pelletsEaten += 1;
          checkGameWin();
          if (b.type === "powerPellet") {
            for (var i = 0; i < ghosts.length; i++) {
              if (ghosts[i].isScared) {
                interval = clearTimeout(interval);
                interval = setTimeout(unScareGhost, 10000);
              } else {
                ghosts[i].isScared = true;
                ghosts[i].isEatable = true;
                interval = setTimeout(unScareGhost, 10000);
              }
            }
          }
        }
      }
      if (player.x > canvas.width) {
        player.x = 1;
      } else if (player.x < 1) {
        player.x = canvas.width - 1;
      }
    }
  }
}

function unScareGhost() {
  for (var i = 0; i < ghosts.length; i++) {
    ghosts[i].isScared = false;
  }
}

function checkGameOver() {
  if (player.isDead) {
    console.log("live lost");
    player.isDead = false;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2 + 25;
    if (GAME_STATE.lives < 1) {
      console.log("GAME OVER");
      gameOver();
    }
  }
}

function checkGameWin() {
  if (GAME_STATE.pelletsEaten === 182) {
    for (var i = 0; i < ghosts.length; i++) {
      ghosts[i].stop();
    }
    window.cancelAnimationFrame(update);
    console.log("You won!");
    canvas.style.visibility = "hidden";
    $(".playAgain").css("display", "flex");
    $(".keypad").css("display", "none");
  }
}

function gameOver() {
  player.isDead = false;
  board.style.display = "none";
  gameOverDisplay.style.display = "flex";
}

function update(e) {
  player.updatePosition(layout);
  moveGhosts();
  clearCanvas();
  drawBoard();
  drawGhosts();
  drawScore();
  drawLives();
  player.draw(ctx, tileSize);
  collision();
  window.requestAnimationFrame(update);
}

function onKeyDown(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = true;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = true;
  } else if (e.keyCode === KEY_CODE_UP) {
    GAME_STATE.upPressed = true;
  } else if (e.keyCode === KEY_CODE_DOWN) {
    GAME_STATE.downPressed = true;
  }
}

function onKeyUp(e) {
  if (e.keyCode === KEY_CODE_LEFT) {
    GAME_STATE.leftPressed = false;
  } else if (e.keyCode === KEY_CODE_RIGHT) {
    GAME_STATE.rightPressed = false;
  } else if (e.keyCode === KEY_CODE_UP) {
    GAME_STATE.upPressed = false;
  } else if (e.keyCode === KEY_CODE_DOWN) {
    GAME_STATE.downPressed = false;
  }
}

function startGame() {
  var start = document.querySelector(".start");
  start.style.display = "none";
  canvas.style.visibility = "visible";
  window.requestAnimationFrame(update);
  dilate();
}

window.addEventListener('keydown', onKeyDown);
window.addEventListener('keyup', onKeyUp);
window.addEventListener("keypress", function(e) {
  console.log(e.keyCode);
  if (e.keyCode == 110) {
    startGame();
  }
});

$(".start").on("click", function() {
  startGame();
  $(".keypad").css("display", "block");
});

var keypad = document.querySelector(".keypad");
$(keypad).on("mousedown", "i", function(e) {
  var id = e.target.id;
  switch (id) {
    case 'up':
      GAME_STATE.upPressed = true;
      break;
    case 'down':
      GAME_STATE.downPressed = true;
      break;
    case 'left':
      GAME_STATE.leftPressed = true;
      break;
    case 'right':
      GAME_STATE.rightPressed = true;
      break;

    default:
  }
})
$(keypad).on("mouseup", "i", function(e) {
  var id = e.target.id;
  switch (id) {
    case 'up':
      GAME_STATE.upPressed = false;
      break;
    case 'down':
      GAME_STATE.downPressed = false;
      break;
    case 'left':
      GAME_STATE.leftPressed = false;
      break;
    case 'right':
      GAME_STATE.rightPressed = false;
      break;

    default:
  }
})
