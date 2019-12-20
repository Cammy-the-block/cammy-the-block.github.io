var colors = [0, 50, 100, 150, 200, 255];
var payouts = [
  [2, 5, 10],
  [0, 0, 15],
  [0, 0, 20],
  [0, 0, 30],
  [0, 0, 50],
  [0, 0, 100],
  [0, 0, 200]
];
var imgs = [];
var imgPaths = ["https://i.ibb.co/X8sHM8M/cherry.jpg", "https://i.ibb.co/zPh5jh1/orange.png",
  "https://i.ibb.co/MSvZ6fd/watermelon.jpg", "https://i.ibb.co/gJHd1S2/bell.jpg",
  "https://i.ibb.co/NKNKHJX/single-bar.jpg", "https://i.ibb.co/zs5s5GQ/double-bar.png",
  "https://i.ibb.co/B40w1hg/triple-bar.jpg"
];

var spinNoise;

Number.prototype.mod = function(b) {

  // Calculate
  return ((this % b) + b) % b;
}
class wheel {

  constructor(items) {
    this.items = items;
    this.total = items.length;
    this.offset = 0;
    this.minLoops = this.total * 1 - 1;
    this.loops = this.minLoops;
    this.currentIndex = 0;
    this.current = this.items[this.currentIndex];
    this.doneLooping = true;
  }

  spin() {
    var oldC = this.currentIndex;
    var oldO = this.offset;
    this.currentIndex = Math.floor(Math.random() * this.total);
    this.current = parseInt(this.items[this.currentIndex]);

    this.around = this.getAround(this.currentIndex);
    this.loops = 0;
    this.offset = (oldC + oldO - this.currentIndex).mod(this.total);
    this.doneLooping = false;
    paidOut = false;
    return this.currentIndex;
  }

  getAround(index) {
    var initial = index - 2;
    var final = index + 3;
    var around = [];

    for (var z = initial; z < final; z++) {
      around.push(this.items[z.mod(this.total)])

    }
    return around;
  }

  draw(xcord) {
    this.drawIndex(xcord, this.currentIndex);
  }

  drawIndex(xcord, index, int) {

    var around = this.getAround(index);
    for (var x = 0; x < around.length; x++) {
      //fill(colors[around[x]]);
      if (this.doneLooping) {
        int = 0;
      }
      noFill();
      noStroke();
      rect(xcord, 20 + (x - int) * 120, 100, 100);
      image(imgs[around[x]], xcord, 20 + (x - int) * 120, 100, 100);
    }
  }

  drawLoop(xcord, i, tot) {
    this.drawIndex(xcord, this.currentIndex + this.offset, i / tot);
  }

  loop() {
    this.offset++;
    this.offset = this.offset % this.total;
  }

  loopIfNecessary() {
    if (this.loops < this.minLoops || this.offset != 0) {
      this.doneLooping = false;
      this.loop();
      this.loops++;
      if (!(this.loops < this.minLoops || this.offset != 0)) {
        this.doneLooping = true;
      }
    }
  }

}
/*
let wheel1 = new wheel([0, 1, 2, 3, 4, 5]);
let wheel2 = new wheel([1, 1, 1, 5, 1, 1]);
let wheel3 = new wheel([0, 1, 2, 3, 4, 5]);
*/
let wheel1 = new wheel([3, 0, 3, 0, 3, 1, 3, 0, 3, 2, 3, 0, 4, 3, 5, 3, 0, 3, 6, 3]);
let wheel2 = new wheel([1, 1, 0, 1, 1, 2, 1, 1, 1, 3, 1, 1, 4, 1, 1, 5, 1, 1, 1, 6]);
let wheel3 = new wheel([2, 5, 2, 2, 2, 6, 2, 2, 0, 2, 2, 1, 2, 2, 2, 3, 2, 2, 4, 2]);


var i = -100;
var offset = 0;
var loops = 10000;
var paidOut = true;
var money = 100;
var delta = 0;
var deltaFrames = 0;
var deltaOn = false;

function setup() {
  createCanvas(1500, 1000);
  button = createButton('SPIN');
  textFont('Ultra');
  button.position(600, 550);
  button.mousePressed(spin);
  button.size(400,150);
  button.style("font-family","Ultra");
  button.style("background-color","#f00");
  button.style("color","#fff");
  button.style("font-size","100");
  spinNoise = loadSound("https://vocaroo.com/embed/bCcUuJ4G0bu");


  for (var x = 0; x < imgPaths.length; x++) {
    imgs[x] = loadImage(imgPaths[x]);
  }

}

function spin() {
  i = 0;
  wheel1.spin();
  wheel2.spin();
  wheel3.spin();
  money -= 1;
  spinNoise.play();
}

function draw() {
  background(255);
  i++;
  if (i >= 5) {
    i = 0;
    wheel1.loopIfNecessary();
    wheel2.loopIfNecessary();
    wheel3.loopIfNecessary();
    if (wheel1.doneLooping & wheel2.doneLooping & wheel3.doneLooping) {
      var currents = [0, 0, 0, 0, 0, 0, 0];
      currents[wheel1.current] += 1;

      currents[wheel2.current] += 1;
      currents[wheel3.current] += 1;
      if (!paidOut) {
        delta = 0;
        for (var x = 0; x < currents.length; x++) {
          if (currents[x] > 0) {
            money += payouts[x][currents[x] - 1];
            delta += payouts[x][currents[x] - 1];
            console.log(money);
          }
        }
        paidOut = true;
        if (delta != 0) {
          deltaOn = true;
        }
      }
    }
  }
  wheel1.drawLoop(220, i, 5);
  wheel2.drawLoop(420, i, 5);
  wheel3.drawLoop(620, i, 5);

  fill(255);
  noStroke();
  rect(200, 0, 540, 120);

  rect(200, 500, 540, 120);
  textSize(200);
  fill(186, 2, 2);
  stroke(0);
  strokeWeight(10);
  textAlign(LEFT);
  var moneyText = "" + money;
  if(money < 100){
    moneyText = "0" + moneyText;
    if(money < 10){
      moneyText = "0" + moneyText;
      if(money==0){
        moneyText = ":(";
      }
    }
  }
  console.log("."+moneyText+".");
  text(moneyText, 775, 375);
  noFill();
  rect(200, 250, 540, 120);

  if (deltaOn) {
    deltaFrames++;
    fill(40, 200, 60);
    textAlign(LEFT);
    textSize(150);
    text("+" + delta, 1230, 350);
    if (deltaFrames > 100) {
      deltaOn = false;
      deltaFrames = 0;
    }
  }


}
