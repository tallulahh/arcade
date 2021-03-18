const canvas = document.getElementById("tetrisCanvas");
const ctx = canvas.getContext("2d");


var score = 0;
ctx.scale(20,20);

function arenaSweep() {
  for(let y = arena.length-1; y >= 0; y--){
    const row = arena[y];
    let filled = true;

    for(let x = 0; x < row.length; x++){
      if (row[x] === 0) {
        filled = false;

        break;
      }
    }

    if (filled) {

      arena.splice(y,1);
      row.fill(0);
      arena.unshift(row);
      y++;
      score += 10;


    }
  };
}

function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for( let y = 0; y < m.length; y++){
    for(let x = 0; x < m[y].length; x++){
      if(m[y][x] !== 0 && (arena [y + o.y] && arena[y + o.y][x + o.x])!== 0){
        return true;
      }
    }
  }
  return false;
}

function createMatrix(w, h){
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));

  }
  return matrix;
}

function createPiece(type){
  if(type === 'T'){
    return [
      [0, 0, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  } else if (type === 'O') {
    return [
      [2, 2],
      [2, 2],
    ];
  } else if (type === 'L') {
    return [
      [0, 3, 0],
      [0, 3, 0],
      [0, 3, 3],
    ];
  } else if (type === 'J') {
    return [
      [0, 4, 0],
      [0, 4, 0],
      [4, 4, 0],
    ];
  } else if (type === 'I') {
    return [
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
      [0, 5, 0, 0],
    ];
  } else if (type === 'S') {
    return [
      [0, 6, 6],
      [6, 6, 0],
      [0, 0, 0],
    ];
  } else if (type === 'Z') {
    return [
      [7, 7, 0],
      [0, 7, 7],
      [0, 0, 0],
    ];
  }
}

function draw() {
  ctx.fillStyle = "black";
ctx.fillRect(0,0,canvas.width, canvas.height);
  drawMatrix(arena, {x: 0, y: 0});
  drawMatrix(player.matrix, player.pos);

}

function drawScore() {
  ctx.font = "bold 1px Raleway";
  ctx.fillStyle = "yellow";
  ctx.fillText("Score: "+ score, 1, 2);
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
  row.forEach((value, x) => {
    if (value !== 0) {
      ctx.fillStyle = colors[value];
      ctx.fillRect(x + offset.x, y + offset.y, 1, 1);
    }
  })
})
}

function merge(arena, player){
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0){
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    })
  })
}

function playerDrop(){
  player.pos.y++;
  if (collide(arena, player)){

    player.pos.y--;
    merge(arena, player);
    playerReset();
    arenaSweep();
  }
  dropscoreer = 0;

}
let dropscoreer = 0;
let dropInterval = 1000;
let lastTime = 0;

function playerMove(dir){
  player.pos.x += dir;
  if (collide(arena, player)){
    player.pos.x -= dir;
  }
}

function playerReset() {

  const pieces = 'ILJOTSZ';
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
  player.pos.y = 0;
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
  if (collide(arena, player)){
    arena.forEach(row => row.fill(0));
    $(".playAgain").css("display", "flex");
    canvas.style.display = "none";
    $(".keypad").css("display", "none");
  }

}

function playerRotate(dir){
  const pos = player.pos.x;
  let offset = 1;
  rotate(player.matrix, dir);
  while(collide(arena, player)){
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x -= pos;
      return;
    }
  }
}

function rotate (matrix, dir) {
  for (let y = 0; y < matrix.length; y++){
    for (let x = 0; x < y; x++){
      [
        matrix[x][y],
        matrix[y][x],
      ] = [
        matrix[y][x],
        matrix[x][y],
      ];


    }
  }
  if (dir > 0) {
    matrix.forEach(row => row.reverse())
  } else {
    matrix.reverse();
  }
}

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;
  dropscoreer += deltaTime;
  if (dropscoreer > dropInterval) {
    playerDrop();
  }
  draw();
  drawScore();
  requestAnimationFrame(update);
}

const colors = [
  null,
  "#cf0000", //red
  "blue",    //blue
  "#83d9dc",  //light blue
  "#38963c",    //green
  "#ebcc34", //pink,
  "#7b2db3", //purple
  "#fa0cd6" //yellow
];

const arena = createMatrix(12, 20);

const player = {
  pos: {x: 5, y:5},
  matrix: createPiece('T'),
}

document.addEventListener('keydown', event => {
  if (event.keyCode === 37) {
    playerMove(-1);
  }
  else if (event.keyCode === 39) {
    playerMove(1)
  }
  else if (event.keyCode === 40) {
    playerDrop();
  } else if (event.keyCode === 81){
    playerRotate(-1);
  }

})

function startGame(){
  var start = document.querySelector(".start");
  start.style.display = "none";
  canvas.style.display = "block";
  update();
}

window.addEventListener("keydown", function(e){
  console.log(e.keyCode);
  if (e.keyCode == 110 || e.keyCode == 78){
    startGame();
  }
});

$(".start").on("touchend", function(){
  startGame();
  $(".keypad").css("display", "block");
});

var keypad = document.querySelector(".keypad");
$(keypad).on("touchstart mousedown", "i", function(e){
  var id = e.target.id;
  switch(id) {
    case 'down':
    playerDrop();
    break;
    case 'left':
    playerMove(-1);
    break;
    case 'right':
    playerMove(1);
    break;

    default:
  }
  // mobileChangeDirection(keyPressed);
})

$(keypad).on("touchend mousedown", "p", function(e){
  var id = e.target.id;
  if (id === 'q'){
    playerRotate(-1);
  }
})
