DIRECTION_UP = 0;
DIRECTION_LEFT = 1;
DIRECTION_DOWN = 2;
DIRECTION_RIGHT = 3;

square_size = 40;
player_size = 20;
margin_size = 20;
num_squares = 19;

var stepCounter = 0;

var playerPos;
var lastPosList = [];
var canUseUsedPos = false;
var candidatePosList = [];
var usedPosList = [];

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
  [0, 0, 0, 0, 14, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 20]
] //18.sıra

var usedMatrix = []

// Processing method - Baslangicta bir kez
function setup() {
  frameRate(60);
  createCanvas(800, 800);
  colorMode(HSB, 360, 100, 100);
  noStroke();
  for (let i = 0; i < num_squares; i++) {
    usedMatrix.push([]);
    for (let j = 0; j < num_squares; j++) {
      usedMatrix[i].push(0);
    }
  }
  findFirstPos();
  addPosToList(playerPos, lastPosList);
  drawGameArea();
}

function addPosToList(pos, list) {
  list.push(copyPos(pos));
}

function copyPos(pos) {
  return JSON.parse(JSON.stringify(pos));
}

// Processing method - Her frame de
function draw() {
  console.log(candidatePosList.length);
  updateCandidatePosList();
  if (candidatePosList.length > 0) {
    pos = candidatePosList.pop();
    addPosToList(copyPos(pos), usedPosList);
    playerPos = copyPos(pos);
    playerMove();
  }
  drawGameArea();
}


function keyReleased() {
  if (keyCode === RIGHT_ARROW) {
    loop()
  }
  if (keyCode === LEFT_ARROW) {
    noLoop();
  }
}

function updateCandidatePosList() {
  var nextPos = findNextPos(playerPos);
  if (checkPos(nextPos)) {
    if (!candidateExists(nextPos)) {
      addPosToList(nextPos, candidatePosList);
    }
  }

  var rightPos = turnRight();
  nextPos = findNextPos(rightPos);
  if (checkPos(nextPos)) {
    if (!candidateExists(nextPos)) {
      addPosToList(nextPos, candidatePosList);
    }
  }

  var leftPos = turnLeft();
  nextPos = findNextPos(leftPos);
  if (checkPos(nextPos)) {
    if (!candidateExists(nextPos)) {
      addPosToList(nextPos, candidatePosList);
    }
  }

}

function isEqualPos(pos1, pos2) {
  return pos1.row == pos2.row && pos1.column == pos2.column && pos1.direction == pos2.direction;
}

function candidateExists(pos, dir) {
  for (let i = 0; i < candidatePosList.length; i++) {
    if (isEqualPos(candidatePosList[i], pos))
      return true;
  }
  for (let i = 0; i < usedPosList.length; i++) {
    if (isEqualPos(usedPosList[i], pos))
      return true;
  }
  return false;
}

function isPosUsed(pos) {
  for (var i = 0; i < last_path.length; i++) {
    if (last_path[i][0] == pos[0] && last_path[i][1] == pos[1])
      return true;
  }
  return false;
}


// hareket edip edemeyecegini kontrol ediyor
function checkPos(pos) {
  if (candidateExists(pos))
    return false;

  if (pos.row < 0 || pos.row >= num_squares || pos.column < 0 || pos.column >= num_squares)
    return false;
  if (squares[pos.row][pos.column] == 1)
    return false;
  return true;
}


function findNextPos(pos) {
  var nextPos = copyPos(pos);
  switch (pos.direction) {
    case DIRECTION_UP:
      nextPos.row--;
      break;
    case DIRECTION_LEFT:
      nextPos.column--;
      break;
    case DIRECTION_DOWN:
      nextPos.row++;;
      break;
    case DIRECTION_RIGHT:
      nextPos.column++;
      break;
  }
  return nextPos;
}



function drawMaze() {
  for (var i = 0; i < num_squares; i++) {
    for (var j = 0; j < num_squares; j++) {
      if (squares[i][j] == 0) {
        b = usedMatrix[i][j] * 10;
        if (b > 100)
          b = 100;
        fill(0, b, 60);
      } else if (squares[i][j] == 1)
        fill(0, 0, 20);
      else if (squares[i][j] > 10 && squares[i][j] <= 20) {
        var goldDegree = squares[i][j] - 10;
        fill(84, goldDegree * 10, 60);
      } else if (squares[i][j] == 3)
        fill(240, 93, 39);
      rect(j * square_size + margin_size, i * square_size + margin_size, square_size, square_size);
    }
  }
}

function drawGameArea() {
  background(0, 97, 18);
  drawMaze();
  //drawLastPosList();
  drawPlayer();
}

// Gectigin yerlerin isaretlenmesi icin yapilan fonksiyonu
function drawLastPosList() {
  for (var i = 0; i < lastPosList.length; i++) {
    fill(Math.random() * 100, 50, 100);
    drawPos(lastPosList[i]);
  }
}

function drawPos(pos) {
  var x = pos.column * square_size + margin_size + 10;
  var y = pos.row * square_size + margin_size + 10;

  switch (pos.direction) {
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
  drawPos(playerPos);
}

//sağa hareket ettiğimiz fonksiyon player pos'un ilk indexi
function playerMove() {
  lastPosList.push(playerPos);
  usedMatrix[playerPos.row][playerPos.column]++;
}

// Yönünü sağa doğru değiştir
function turnRight() {
  pos = copyPos(playerPos);
  pos.direction = (pos.direction + 3) % 4;
  return pos;
}

// Yönünü sola doğru değiştir
function turnLeft() {
  pos = copyPos(playerPos);
  pos.direction = (pos.direction + 1) % 4;
  return pos;
}


function findFirstPos() {
  for (var i = 0; i < num_squares; i++) {
    for (var j = 0; j < num_squares; j++) {
      if (squares[i][j] == 3)
        playerPos = new Position(i, j, DIRECTION_UP);
    }
  }
}