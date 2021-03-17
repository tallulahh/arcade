let interval;
const canvas = document.getElementById("pingCanvas");
const ctx = canvas.getContext("2d");

var x = canvas.width/2;
var y = canvas.height/2;
var dx = 2;
var dy = -2;
var ballRadius = 8;

//Player 1
var cPaddleX = canvas.width/2;
var cPaddleWidth = 60;
var cPaddleHeight = 10;
let player1Lives = 3;

//Player 2
var paddleX = canvas.width/2;
var paddleWidth = 60;
var paddleHeight = 10;
let player2Lives = 3;

var gameOver = document.querySelector(".playAgain");

//Key variables
var rightPressed1 = false;
var leftPressed1 = false;
var rightPressed2 = false;
var leftPressed2 = false;

document.addEventListener("keydown", function(e){
  if (e.keyCode === 37){
    leftPressed1 = true;
  } else if (e.keyCode === 39){
    rightPressed1 = true;
  }
});

document.addEventListener("keyup", function(e){
  if (e.keyCode === 37){
    leftPressed1 = false;
  } else if (e.keyCode === 39){
    rightPressed1 = false;
  }
});

document.addEventListener("keydown", function(e){
  if (e.keyCode === 81){
    leftPressed2 = true;
  } else if (e.keyCode === 82){
    rightPressed2 = true;
  }
});

document.addEventListener("keyup", function(e){
  if (e.keyCode === 81){
    leftPressed2 = false;
  } else if (e.keyCode === 82){
    rightPressed2 = false;
  }
});

function drawBoard(){
  //Background
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,canvas.width, canvas.height);

  //Net line
  ctx.beginPath();
  ctx.moveTo(0, canvas.height/2);
  ctx.lineTo(canvas.width, canvas.height/2);
  ctx.strokeStyle = "#1222D9";
  ctx.stroke();
  ctx.closePath();

  //Player 1
  ctx.font = "bold 16px Raleway";
  ctx.fillStyle = "yellow";
  ctx.fillText("Player 1 ", canvas.width/2 - 10, canvas.height/4);
  ctx.fillText("Lives left:"+player1Lives, 8, 20);
  //Player 2
  ctx.font = "bold 16px Raleway";
  ctx.fillStyle = "yellow";
  ctx.fillText("Player 2 ", canvas.width/2 - 10, canvas.height - (canvas.height/4));
  ctx.fillText("Lives left:"+player2Lives, 8, 492);
}

function drawPlayer(){
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#1222D9";
  ctx.fill();
  ctx.closePath();
}

function drawComputer(){
  ctx.beginPath();
  ctx.rect(cPaddleX, 0, cPaddleWidth, cPaddleHeight);
  ctx.fillStyle = "#1222D9";
  ctx.fill();
  ctx.closePath();
}

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "#C413EC";
  ctx.fill();
  ctx.closePath();
}

function moveBall(){
  if (x + dx + ballRadius > canvas.width || x + dx < ballRadius){
    dx = -dx;
  }
  if (y + dy < ballRadius + cPaddleHeight) {
    if(x > cPaddleX && x < cPaddleX + cPaddleWidth){
      dy = -dy;
      player1Score+=10;
    } else {
      player1Lives--;
      nextRound();
    }

  }
  if (y + dy + ballRadius > canvas.height - paddleHeight){
    if(x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
      player2Score+=10;
    } else {
      player2Lives--;
      nextRound();
    }
  }
  x += dx;
  y += dy;

}

function nextRound(){
  if (player1Lives <= 0 || player2Lives <= 0){
    interval = clearInterval(interval);
    var winner = document.getElementById("winner");
    gameOver.style.display = "block";
    canvas.style.visibility = "hidden";
    if (player1Lives <= 0){
      let player = "Player 2";
      winner.innerHTML = player;
    } else if (player2Lives <=0){
       let player = "Player 1";
       winner.innerHTML = player;
    }

  } else {

    interval = clearInterval(interval);
    x = canvas.width/2;
    y = canvas.height/2;
    interval = setInterval(draw, 10);
  }
}

function draw(){
drawBoard();
drawPlayer();
drawComputer();
drawBall();

moveBall();
  if (rightPressed1 && paddleX + paddleWidth < canvas.width){
    paddleX += 7;
  }
  if (leftPressed1 && paddleX > 0){
    paddleX -= 7;
  }
  if (rightPressed2 && cPaddleX + cPaddleWidth < canvas.width){
    cPaddleX += 7;
  }
  if (leftPressed2 && cPaddleX > 0){
    cPaddleX -= 7;
  }
}

function startGame(){
  x = canvas.width/2;
  y = canvas.height/2;
  clearInterval(interval);
  player1Lives = 3;
  player2Lives = 3;
  gameOver.style.display = "none";
  var welcome = document.querySelector(".start");
  welcome.style.display = "none";
  canvas.style.visibility = "visible";
  interval = setInterval(draw, 10);
};

window.addEventListener("keypress", function(e){
  console.log(e.keyCode);
  if (e.keyCode == 110){
    startGame();
  }
});
