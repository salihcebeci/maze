DIRECTION_UP = 0;
DIRECTION_LEFT = 1;
DIRECTION_DOWN = 2;
DIRECTION_RIGHT = 3;

square_size = 40;
player_size = 20;
margin_size = 20;
num_squares = 19;


var stepCounter = 0;

var player_pos;
var next_pos;

// baslangic yonu
var player_direction = DIRECTION_UP;

var last_path = [];
var last_directions = [];

var canUseUsedPos = false;

var candidatePaths = [];
var candidateDirections = [];

var usedPaths = [];
var usedDirections = [];

squares = [
  [0, 0, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //0. sıra
  [0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1], //1. sıra
  [0, 0, 3, 0, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2. sıra
  [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], //3. sıra
  [0, 0, 0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 17, 0, 0, 0, 0, 0, 0], //4. sıra
  [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1], //5.sıra
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6.sıra
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1], //7.sıra
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8.sıra
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], //9.sıra
  [0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 12, 0, 0, 0, 0, 1, 0, 1, 0], //10.sıra
  [0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], //11.sıra
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0], //12.sıra
  [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], //13.sıra
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0], //14.sıra
  [0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0], //15.sıra
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0], //16.sıra
  [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0], //17.sıra
  [0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 20]] //18.sıra

// Processing method - Baslangicta bir kez
function setup() {
  frameRate(10);
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  player_pos = findPlayerPos();
  last_path.push(player_pos);
  last_directions.push(player_direction);
  updateCandidatePaths();
  var candidatePathIndex = candidatePaths.length - 1;
  pos = candidatePaths[candidatePathIndex];
  dir = candidateDirections[candidatePathIndex];
  player_pos = pos.slice();
  player_direction = dir;
  drawGameArea();
}

// Processing method - Her frame de
function draw() {
  console.log(candidatePaths.length);
  updateNextPos();
  if (checkPlayerMove()){
    playerMove();
    updateCandidatePaths();
  }
  else {
      updateCandidatePaths();
      var candidatePathIndex = candidatePaths.length - 1;
      pos = candidatePaths[candidatePathIndex];
      dir = candidateDirections[candidatePathIndex];
      usedPaths.push(pos);
      usedDirections.push(dir);
      candidatePaths.splice(candidatePathIndex, 1);
      candidateDirections.splice(candidateDirections, 1);
      player_pos = pos.slice();
      player_direction = dir;
  }
  drawGameArea();
}

function updateCandidatePaths(){

  turnRight();
  updateNextPos();
  if (checkPlayerMove())
  {
    if (!candidateExists(player_pos, player_direction)){
      candidatePaths.push(player_pos);
      candidateDirections.push(player_direction);
    }
  }

  turnRight();
  turnRight();
  updateNextPos();
  if (checkPlayerMove())
  {
    if (!candidateExists(player_pos, player_direction)){
      candidatePaths.push(player_pos);
      candidateDirections.push(player_direction);
    }
  }
  turnRight();
}

function candidateExists(pos, dir){
  for (let i = 0 ; i < candidatePaths.length ; i++){
    if (candidatePaths[i][0] == pos[0] && candidatePaths[i][1] == pos[1] && candidateDirections[i] == dir)
      return true;
  }
  for (let i = 0 ; i < usedPaths.length ; i++){
    if (usedPaths[i][0] == pos[0] && usedPaths[i][1] == pos[1] && usedDirections[i] == dir)
      return true;
  }
  return false;
}

function isPosUsed(pos){
  for (var i = 0; i < last_path.length ; i++){
		if (last_path[i][0] == pos[0] && last_path[i][1] == pos[1])
      return true;
  }
  return false;
}



function updateNextPos() {
  next_pos = findNextPosition();
}

// hareket edip edemeyecegini kontrol ediyor
function checkPlayerMove() {
  if (next_pos[0] < 0 || next_pos[0] >= num_squares || next_pos[1] < 0 || next_pos[1] >= num_squares)
    return false;
  if (squares[next_pos[0]][next_pos[1]] == 1)
    return false;
  return true;
}


function findNextPosition() {
  var next = player_pos.slice();
  switch (player_direction) {
    case DIRECTION_UP:
      next[0] = next[0] - 1;
      break;
    case DIRECTION_LEFT:
      next[1] = next[1] - 1;
      break;
    case DIRECTION_DOWN:
      next[0] = next[0] + 1;
      break;
    case DIRECTION_RIGHT:
      next[1] = next[1] + 1;
      break;
  }
  return next;
}



function drawMaze() {
  for (var i = 0; i < num_squares; i++) {
    for (var j = 0; j < num_squares; j++) {
      if (squares[i][j] == 0)
        fill(0, 0, 71);
      else if (squares[i][j] == 1)
        fill(0, 0, 20);
      else if (squares[i][j] > 10 && squares[i][j] <= 20) {
        var goldDegree = squares[i][j] - 10;
        fill(84, goldDegree * 10, 60);
      }
      else if (squares[i][j] == 3)
        fill(240, 93, 39);
      rect(j * square_size + margin_size, i * square_size + margin_size, square_size, square_size);
    }
  }
}

function drawGameArea() {
  background(0, 97, 18);
  drawMaze();
  drawLastPath();
  drawLastPath();
  drawPlayer();
}

// Gectigin yerlerin isaretlenmesi icin yapilan fonksiyonu
function drawLastPath(){

  for (var i = 0; i < last_path.length ; i++){
    fill(Math.random()*100, 50, 100);
		drawPos(last_path[i], last_directions[i]);
  }
}

function drawPos(pos, direction){
  var x = pos[1] * square_size + margin_size + 10;
  var y = pos[0] * square_size + margin_size + 10;

  switch (direction) {
    case DIRECTION_UP:
      triangle(x, y + player_size, x + player_size, y + player_size, x + player_size / 2, y);
      break;
    case DIRECTION_LEFT:
      triangle(x + player_size, y, x + player_size, y + player_size, x, y + player_size / 2);
      break;
    case DIRECTION_DOWN:
      triangle(x, y, x + player_size, y, x + player_size / 2, y + player_size);
      break;
    case DIRECTION_RIGHT:
      triangle(x, y, x, y + player_size, x + player_size, y + player_size / 2);
      break;
  }
}

function drawPlayer() {
   fill(0, 100, 100);
	drawPos(player_pos, player_direction);
}

//sağa hareket ettiğimiz fonksiyon player pos'un ilk indexi
function playerMove() {
  player_pos = next_pos.slice();
  last_path.push(player_pos);
  last_directions.push(player_direction);
}

// Yönünü sağa doğru değiştir
function turnRight() {
  player_direction = (player_direction + 3) % 4;
  updateNextPos();
}

// Yönünü sola doğru değiştir
function turnLeft() {
  player_direction = (player_direction + 1) % 4;
  updateNextPos();
}


function findPlayerPos() {
  for (var i = 0; i < num_squares; i++) {
    for (var j = 0; j < num_squares; j++) {
      if (squares[i][j] == 3)
        return [i, j];
    }
  }
  return null;
}
