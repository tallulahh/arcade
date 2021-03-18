const board_border = 'black';
const board_background = 'black';
const snake_col = 'lightblue';
const snake_border = 'darkblue';

const LEFT_KEY = 37;
const RIGHT_KEY = 39;
const UP_KEY = 38;
const DOWN_KEY = 40;

let snake = [{
  x: 200,
  y: 200
}, {
  x: 190,
  y: 200
}, {
  x: 180,
  y: 200
}, {
  x: 170,
  y: 200
}, {
  x: 160,
  y: 200
}];

let foodX;
let foodY;
let score = 0;
let changingDirection = false;
let dx = 10;
let dy = 0;
let interval;

const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext('2d');
var playAgain = document.querySelector(".playAgain");

document.addEventListener("keydown", changeDirection);

function main() {
  if (hasGameEnded()) {
    playAgain.style.display = "flex";
    canvas.style.visibility = "hidden";
    $(".keypad").css("display", "none");
    interval = clearInterval(interval);
  } else {
    changingDirection = false;
  }
}

function draw() {
  clearCanvas();
  moveSnake();
  drawSnake();
  drawFood();
  drawScore();
  // Call main again
  main();
}

function clearCanvas() {
  ctx.fillStyle = board_background;
  ctx.strokeStyle = board_border;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
  ctx.fillStyle = snake_col;
  ctx.strokeStyle = snake_border;
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    const hasCollided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
    if (hasCollided) {
      return true;
    }
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) {
  if (changingDirection) {
    return;
  }
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function randomFood(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function generateFood() {
  foodX = randomFood(0, canvas.width - 10);
  foodY = randomFood(0, canvas.height - 10);
  snake.forEach(function hasSnakeEatenFood(part) {
    const hasEaten = part.x == foodX && part.y == foodY;
    if (hasEaten) {
      generateFood();
    }
  })
}

function drawFood() {
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'darkgreen';
  ctx.fillRect(foodX, foodY, 10, 10);
  ctx.strokeRect(foodX, foodY, 10, 10);
}

function moveSnake() {
  const head = {
    x: snake[0].x + dx,
    y: snake[0].y + dy
  };
  snake.unshift(head);
  const hasEatenFood = snake[0].x === foodX && snake[0].y === foodY;
  if (hasEatenFood) {
    score += 10;
    generateFood();
  } else {
    snake.pop();
  }
}

function drawScore() {
  ctx.font = "bold 16px Raleway";
  ctx.fillStyle = "yellow";
  ctx.fillText("Score: " + score, canvas.width / 2 - 20, canvas.height - 10);
}

function startGame() {
  var start = document.querySelector(".start");
  start.style.display = "none";
  canvas.style.visibility = "visible";
  interval = setInterval(draw, 100);
  generateFood();
}

window.addEventListener("keydown", function(e) {
  console.log(e.keyCode);
  if (e.keyCode == 110 || e.keyCode == 78) {
    startGame();
  }
});

$(".start").on("touchstart", function() {
  startGame();
  $(".keypad").css("display", "block");
});

var keypad = document.querySelector(".keypad");
$(keypad).on("touchstart mousedown", "i", function(e) {
  var id = e.target.id;
  switch (id) {
    case 'up':
      keyPressed = UP_KEY;
      break;
    case 'down':
      keyPressed = DOWN_KEY;
      break;
    case 'left':
      keyPressed = LEFT_KEY;
      break;
    case 'right':
      keyPressed = RIGHT_KEY;
      break;
    default:
  }
  mobileChangeDirection(keyPressed);
})
$(".key").on("touchstart mousedown", function(e) {
  var id = e.target.id;
  switch (id) {
    case 'up':
      keyPressed = UP_KEY;
      break;
    case 'down':
      keyPressed = DOWN_KEY;
      break;
    case 'left':
      keyPressed = LEFT_KEY;
      break;
    case 'right':
      keyPressed = RIGHT_KEY;
      break;
    default:
  }
  mobileChangeDirection(keyPressed);
})

function mobileChangeDirection(key) {
  if (changingDirection) {
    return;
  }
  changingDirection = true;
  const keyPressed = key;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}
