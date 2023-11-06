let artwork // Variable to store the artwork
let positions = [] // Array to store the positions of the big circles
let CirBgColor = [] // Array to store the background colors of the big circles
let ShapeColor = [] // Array to store the shape colors inside the big circles
// Array to store points for ZipLines
let curve_40 = []
let curve_25 = []
// Scaling factor for axis
let rateX = 1;
let rateY = 1;
let frameRateValue = 5 // Adjust the frame rate value
let Dotscolor //change dots color to ramdom color
let t; // Global variable t for generating noise
let speed; // Global variable speed
let middotscolor; // change colors of dots inside the central circle with perlin noise
let curvedraw;// Create the curve drawing object with trail via tutorial week8 part1

function setup() {
  createCanvas(windowHeight, windowHeight)
  rateX = width / 550.0;
  rateY = height / 550.0;
  noCursor()
  background(60, 80, 110)
  initArtworkData()
  artwork = new Artwork(positions, CirBgColor, ShapeColor)
  frameRate(frameRateValue)// Set the frame rate
  curvedraw = new Curvedraw();// Initialize the curve drawing object
}

// Function to handle window resizing
function windowResized() {
  // Resize the canvas to match the new window dimensions
  resizeCanvas(windowHeight, windowHeight);
  // Update the canvas width and height variables
  rateX = width / 550.0;
  rateY = height / 550.0;
  background(60, 80, 110);
}
function draw() {
  push();
  scale(rateX, rateY);
  artwork.display()
  pop();
  curvedraw.draw();// Draw the curve animation
}

class Curvedraw {
  constructor() {
    this.t = 0;
    this.speed = 0.005;
    this.trail = [];
    this.curves = Curves();// Get curve data
  }

  draw() {
    this.drawTrail();// Draw curve trails
    this.t += this.speed;
    if (this.t > 1) {
      this.t = 0;
    }
  }

  getPointOnCurve(points, t) {
    let n = points.length - 1;
    let x = 0;
    let y = 0;

    for (let i = 0; i <= n; i++) {
      let coefficient =
        this.binomialCoefficient(n, i) * pow(1 - t, n - i) * pow(t, i);
      x += points[i].x * coefficient;
      y += points[i].y * coefficient;
    }

    return createVector(x, y);
  }

  binomialCoefficient(n, k) {
    if (k === 0 || k === n) {
      return 1;
    }
    let result = 1;
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i;
    }
    return result;
  }

  drawTrail() {
    for (let i = 0; i < this.curves.length; i++) {
      let currentPoint = this.getPointOnCurve(this.curves[i], this.t);
      this.trail.push(currentPoint.copy());

      for (let j = 0; j < this.trail.length; j++) {
        ellipse(this.trail[j].x, this.trail[j].y, 5);// Draw trail points
      }

      if (this.trail.length > 20) {
        this.trail.splice(0, 1);// Limit the number of trail points
      }
    }
  }
}

// defines an Artwork class. This class is responsible for generating 
//the visual elements of the artwork.
class Artwork {
  constructor(positions, CirBgColor, ShapeColor) {
    this.positions = positions;
    this.CirBgColor = CirBgColor;
    this.ShapeColor = ShapeColor;

    this.circleId = [0, 1, 4, 9, 10, 11];
    this.dotId = [1, 8, 14];
    this.dotId1 = [1, 3, 6, 8, 15];
    this.ringId = [0, 4, 5, 10, 11, 13];
    this.zipId = [1, 8, 14];
    this.zipId1 = [9];
  }

  //display these components of the artwork
  display() {
    for (let i = 0; i < this.positions.length; i++) {
      let x = this.positions[i].xPos;
      let y = this.positions[i].yPos;
      this.drawCircle(x, y, i); //draw circles at the positions specified by the positions array
      this.drawDotsIn(x, y, i); //draw dots inside the circles
      this.drawRings(x, y, i); //draws rings inside the circles
      this.drawZipLine(x, y, i); //draws lines connecting various points
      this.drawHexagons(x, y, i); //draws a chain of small circles in a hexagonal pattern
    }
    //draws straight lines between two specified points
    this.drawStraightLine(188, 85, 285, 0);
    this.drawStraightLine(193, 488, 315, 405);
  }

  //draw big circles
  drawCircle(x, y, i) {
    // Draw big circles and various smaller circles inside them with different colors
    // and sizes based on their positions.
    fill(this.CirBgColor[i].Out);
    noStroke();
    ellipse(x, y, 150, 150);
    fill(181, 77, 162);
    ellipse(x, y, 85, 85);
    fill(71, 83, 63);
    ellipse(x, y, 45, 45);
    fill(0);
    ellipse(x, y, 25, 25);
    if (this.circleId.indexOf(i) !== -1) {
      fill(34, 151, 66);
      ellipse(x, y, 17, 17);
    } else {
      fill(240, 67, 32);
      ellipse(x, y, 17, 17);
    }
    fill(183, 190, 189);
    ellipse(x, y, 9, 9);
  }

  //draw dots inside of the big circle, with different patterns and colors.
  drawDotsIn(x, y, i) {
    // Change dots color into random color
    Dotscolor = color(random(255), random(255), random(255));
    //outer circle
    if (i !== 1 && i !== 8 && i !== 14) {
      // Change from a fixed number to a random number of circles
      // Use a random function to generate an integer between 1 and 6 to determine the number of circles
      let numCircles = int(random(1, 6))
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let dotX = x + cos(angle * k) * (j * 7 + 45);
          let dotY = y + sin(angle * k) * (j * 7 + 45);
          //change to random color
          fill(Dotscolor);
          ellipse(dotX, dotY, DotRadius, DotRadius);
        }
      }
    }

    //mid circle
    if (this.dotId1.indexOf(i) !== -1) {
      // Check if the current index corresponds to the middle circle
      let seed = i * 0.1;
      // Use Perlin noise to create dynamic color
      middotscolor = color(
        map(noise(t + seed), 0, 1, 0, 255),
        map(noise(t + 1000 + seed), 0, 1, 0, 255),
        map(noise(t + 2000 + seed), 0, 1, 0, 255)
        );      
      let numCircles = 3;
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let dotX = x + cos(angle * k) * (j * 7 + 25);
          let dotY = y + sin(angle * k) * (j * 7 + 25);
          fill(middotscolor)//change fixed color to perlin noise
          ellipse(dotX, dotY, DotRadius, DotRadius);
        }
      }
    }
  }

  //draw rings inside the big circle
  //draw rings inside the big circle
  drawRings(x, y, i) {
    //draw rings at mid circle of the big circle
    if (this.ringId.indexOf(i) != -1) {
      print(i)
      for (let j = 0; j < 3; j++) {
        let radius = (j + 3) * 8;
        noFill();
        stroke(this.ShapeColor[i].Mid);
        strokeWeight(3); // Set the stroke weight to make the outer circle thicker
        ellipse(x, y, radius * 2, radius * 2);
        noStroke(); // Reset the stroke settings to their default values
      }
    }

    //draw rings at inner circle of the big circle
    for (let j = 0; j < 2; j++) {
      let radius = (j + 2.5) * 6;
      noFill();
      stroke(157, 165, 163);
      strokeWeight(3); // Set the stroke weight to make the outer circle thicker
      ellipse(x, y, radius * 2, radius * 2);
      noStroke(); // Reset the stroke settings to their default values
    }
  }

  //draw zip lines in the big circle
  drawZipLine(x, y, i) {
    //draw lines at outer circle of the big circle
    if (this.zipId.indexOf(i) !== -1) {
      let numCircles = 5;
      let curve_70 = [];
      let curve_35 = [];
      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 3.5) * 10;
        // angleMode(DEGREES);
        let angle = 360 / numDot;
        noFill();
        stroke("#ef1e1e");

        for (let k = 0; k < numDot; k++) {
          let zx = x + cos(angle * k) * (j * 7 + 45);
          let zy = y + sin(angle * k) * (j * 7 + 45);
          if (numDot > 70) {
            curve_70.push({ x: zx, y: zy });
          } else if (numDot == 35) {
            curve_35.push({ x: zx, y: zy });
          }
        }

        if (curve_70.length > 0 && curve_35.length > 0) {
          for (var qw = 0; qw < curve_70.length; qw++) {
            var num = qw / 2;
            num = Math.round(num);
            if (num >= curve_35.length - 1) {
              num = curve_35.length - 1;
            }
            line(
              curve_70[qw].x,
              curve_70[qw].y,
              curve_35[num].x,
              curve_35[num].y
            );
          }
        }
      }
    }

    if (curve_40.length > 0 && curve_25.length > 0) {
      for (var qw = 0; qw < curve_40.length; qw++) {
        var num = qw / 2;
        num = Math.round(num);
        if (num >= curve_25.length - 1) {
          num = curve_25.length - 1;
        }
        line(curve_40[qw].x, curve_40[qw].y, curve_25[num].x, curve_25[num].y);
      }
    }

    //draw lines at mid circle of the big cirlce
    if (this.zipId1.indexOf(i) !== -1 && curve_40.length == 0) {
      let numCircles = 3;

      for (let j = 0; j < numCircles; j++) {
        let numDot = (j + 2.5) * 10;
        let DotRadius = 5;
        angleMode(DEGREES);
        let angle = 360 / numDot;
        for (let k = 0; k < numDot; k++) {
          let zx = x + cos(angle * k) * (j * 7 + 25);
          let zy = y + sin(angle * k) * (j * 7 + 25);
          fill(this.ShapeColor[i].Mid);
          if (numDot == 25) {
            curve_25.push({ x: zx, y: zy });
          }
          if (numDot >= 40) {
            curve_40.push({ x: zx, y: zy });
          }
        }
      }
    }
  }

  //draw chain of small circles arranged in a hexagonal pattern.
  drawHexagons(x, y, i) {
    let hexagonRadius = 90;
    let hexagonX = x;
    let hexagonY = y;

    for (let j = 0; j < 6; j++) {
      let angle = (360 / 6) * j;
      let hx = hexagonX + hexagonRadius * cos(angle);
      let hy = hexagonY + hexagonRadius * sin(angle);

      fill(0);
      stroke(221, 97, 40);
      strokeWeight(2);
      ellipse(hx, hy, 7.5, 7.5);
    }

    for (let j = 0; j < 6; j++) {
      let angle1 = (360 / 6) * j;
      let angle2 = (360 / 6) * ((j + 1) % 6); // Next vertex
      for (let k = 0; k < 4; k++) {
        let fraction = k / 4;
        let x = lerp(
          hexagonX + hexagonRadius * cos(angle1),
          hexagonX + hexagonRadius * cos(angle2),
          fraction
        );
        let y = lerp(
          hexagonY + hexagonRadius * sin(angle1),
          hexagonY + hexagonRadius * sin(angle2),
          fraction
        );

        fill(0);
        stroke(221, 97, 40);
        strokeWeight(2);
        ellipse(x, y, 7.5, 7.5);
      }
    }

    for (let j = 0; j < 6; j++) {
      let angle = (360 / 6) * j;
      let x = hexagonX + hexagonRadius * cos(angle);
      let y = hexagonY + hexagonRadius * sin(angle);

      //draw a white inner circle inside the small circle
      fill(255);
      stroke(0);
      ellipse(x, y, 6.5, 6.5);
    }
  }

  // Draw a straight line between two points.
  drawStraightLine(x1, y1, x2, y2) {
    stroke(255, 28, 0);
    strokeWeight(2);
    line(x1, y1, x2, y2);
  }
}

// Initialize positions, background colors, and shape colors for the big circles.
function initArtworkData() {
  //position of each big circle
  positions = [
    //redius: 75, space-between_horizontal: 20, space-between_vertical: 0
    { xPos: 75, yPos: 75 },
    { xPos: 245, yPos: 35 },
    { xPos: 415, yPos: -5 },
    { xPos: 18, yPos: 225 },
    { xPos: 188, yPos: 185 },
    { xPos: 358, yPos: 145 },
    { xPos: 528, yPos: 105 },
    { xPos: -35, yPos: 375 },
    { xPos: 135, yPos: 335 },
    { xPos: 305, yPos: 295 },
    { xPos: 475, yPos: 255 },
    { xPos: 85, yPos: 485 },
    { xPos: 255, yPos: 445 },
    { xPos: 425, yPos: 405 },
    { xPos: 595, yPos: 365 },
    { xPos: 368, yPos: 555 },
    { xPos: 538, yPos: 515 }
  ]

  //Background colors inside each big circle
  CirBgColor = [
    { Out: color(200, 230, 241) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(252, 191, 49) },
    { Out: color(207, 241, 242) },
    { Out: color(248, 197, 56) },
    { Out: color(252, 191, 49) },
    { Out: color(221, 254, 254) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(254, 247, 243) },
    { Out: color(252, 238, 242) },
    { Out: color(252, 191, 49) },
    { Out: color(241, 224, 76) },
    { Out: color(250, 158, 7) },
    { Out: color(252, 238, 242) },
    { Out: color(207, 241, 242) }
  ]

  //Shape colors inside each big circle
  ShapeColor = [
    //line #1
    { Out: color(15, 8, 104), Mid: color(12, 102, 50) },
    { Out: color(227, 13, 2), Mid: color(249, 81, 8) },
    { Out: color(245, 20, 2) },
    //line #2
    { Out: color(21, 95, 151), Mid: color(251, 85, 63) },
    { Out: color(15, 133, 52), Mid: color(251, 85, 63) },
    { Out: color(213, 153, 217), Mid: color(60, 146, 195) },
    { Out: color(21, 95, 151), Mid: color(249, 209, 244) },
    //line #3
    { Out: color(0, 150, 145) },
    { Out: color(227, 13, 2), Mid: color(243, 7, 11) },
    { Out: color(245, 20, 2), Mid: color(251, 85, 63) },
    { Out: color(243, 110, 9), Mid: color(12, 102, 50) },
    //line #4
    { Out: color(245, 20, 2), Mid: color(60, 146, 195) },
    { Out: color(196, 21, 90) },
    { Out: color(20, 112, 185), Mid: color(251, 85, 63) },
    { Out: color(227, 13, 2) },
    //line #5
    { Out: color(245, 20, 2), Mid: color(117, 194, 116) },
    { Out: color(15, 133, 52) }
  ]
}

function Curves() {
  noFill()
  stroke('#E93468')
  strokeWeight(5)
  return [
    [
      { x: 75, y: 75 },
      { x: 67, y: 92 },
      { x: 64, y: 120 },
      { x: 75, y: 145 },
      { x: 95, y: 160 },
      { x: 110, y: 162 }
    ],
    [
      { x: 188, y: 185 },
      { x: 193, y: 172 },
      { x: 208, y: 150 },
      { x: 250, y: 125 },
      { x: 260, y: 130 }
    ],
    [
      { x: 415, y: -5 },
      { x: 420, y: 20 },
      { x: 440, y: 40 },
      { x: 470, y: 45 },
      { x: 495, y: 35 }
    ],
    [
      { x: -35, y: 375 },
      { x: -2.5, y: 360 },
      { x: 20, y: 340 },
      { x: 47, y: 325 },
      { x: 55, y: 327 }
    ],
    [
      { x: 305, y: 295 },
      { x: 325, y: 280 },
      { x: 350, y: 275 },
      { x: 375, y: 275 },
      { x: 405, y: 300 },
      { x: 410, y: 315 }
    ],
    [
      { x: 475, y: 255 },
      { x: 477, y: 240 },
      { x: 485, y: 225 },
      { x: 500, y: 212 },
      { x: 510, y: 205 },
      { x: 530, y: 200 },
      { x: 550, y: 195 }
    ],
    [
      { x: 85, y: 485 },
      { x: 105, y: 510 },
      { x: 130, y: 525 },
      { x: 150, y: 530 },
      { x: 170, y: 528 },
      { x: 190, y: 523 },
      { x: 195, y: 520 }
    ]
  ];
}