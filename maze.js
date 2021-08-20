square_size = 20;

function setup() {
  createCanvas(800, 800);
  background(150, 150, 150);

  fill(180, 180, 180);
  for(var i = 0; i < 100 ; i++){
    for(var j = 0; j < 100 ; j++){
      if (Math.random() > 0.4)
        fill(180, 180, 180);
      else
        fill(10, 10, 10);
      rect(i*square_size, j*square_size, square_size, square_size);
    }
  }
}

function draw() {


}
