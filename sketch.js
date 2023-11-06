let artwork // Variable to store the artwork
let positions = [] // Array to store the positions of the big circles
let CirBgColor = [] // Array to store the background colors of the big circles
let ShapeColor = [] // Array to store the shape colors inside the big circles
// Array to store points for ZipLines
let curve_40 = []
let curve_25 = []
let Dotscolor //change dots color to ramdom color
let t = 0; // Global variable t for generating noise
let middotscolor; // change colors of dots inside the central circle with perlin noise

function setup() {
  createCanvas(windowHeight, windowHeight)
  noCursor()
  background(60, 80, 110)
  initArtworkData()
  artwork = new Artwork(positions, CirBgColor, ShapeColor)
  frameRate(10)// Set the frame rate
  setInitialPositions();
  }

function setInitialPositions() {
  const minDistance = 150; // Minimum distance between big circles

  for (let i = 0; i < positions.length; i++) {
    let validPosition = false;
    let xPos, yPos;

    // Keep generating random positions until a valid position is found
    while (!validPosition) {
      xPos = random(50, width - 50); // Random x coordinate within screen bounds
      yPos = random(50, height - 50); // Random y coordinate within screen bounds

      // Check if the new position is at least 150 pixels away from other circles
      validPosition = true;
      for (let j = 0; j < i; j++) {
        const d = dist(xPos, yPos, positions[j].xPos, positions[j].yPos);
        if (d < minDistance) {
          validPosition = false;
          break;
        }
      }
    }

    // Set the valid position
    positions[i].xPos = xPos;
    positions[i].yPos = yPos;
  }
}


// Function to handle window resizing
function windowResized() {
  // Resize the canvas to match the new window dimensions
  resizeCanvas(windowHeight, windowHeight);
  // Update the canvas width and height variables
  background(60, 80, 110);
  setInitialPositions();
}

function draw() {
  background(60, 80, 110); // Clear the canvas
  artwork.display()

  for (let i = 0; i < positions.length; i++) {
    // Generate a random speed for each circle between 1 and 5
    let speed = random(1, 5);

    positions[i].yPos += speed; // Control the falling speed

    // Ensure that circles don't overlap during their fall
    for (let j = 0; j < positions.length; j++) {
      if (i !== j) {
        let d = dist(positions[i].xPos, positions[i].yPos, positions[j].xPos, positions[j].yPos);
        let minDistance = 150; // Minimum distance between big circles
        if (d < minDistance) {
          // If the distance is too small, adjust the position of the current circle
          let angle = atan2(positions[j].yPos - positions[i].yPos, positions[j].xPos - positions[i].xPos);
          positions[i].xPos = positions[j].xPos - minDistance * cos(angle);
          positions[i].yPos = positions[j].yPos - minDistance * sin(angle);
        }
      }
    }

    // If a big circle goes beyond the bottom of the canvas, reset its position
    if (positions[i].yPos > height) {
      positions[i].xPos = random(width); // Randomly reset the x-coordinate
      positions[i].yPos = random(-200, -100); // Set them off-screen initially
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

if (curve_40.length > 0) {
  for (var qw = 0; qw < curve_40.length; qw++) {
    var num = qw / 2;
    num = Math.round(num);
    if (num >= curve_40.length - 1) {
      num = curve_40.length - 1;
    }
  }
}

    //draw lines at mid circle of the big cirlce
  if (this.zipId1.indexOf(i) !== -1) {
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
}
// Initialize positions, background colors, and shape colors for the big circles.
function initArtworkData() {
  // Position of each big circle
  positions = []; // Clear the position array

  while (positions.length < 17) {
    // Generate a random position
    let xPos = random(50, width - 50); // Random x-coordinate, ensuring it's within the screen
    let yPos = random(50, height - 50); // Random y-coordinate, ensuring it's within the screen
    let validPosition = true; // Flag to mark if the generated position is valid

    // Check the distance between the generated position and existing positions
    for (let i = 0; i < positions.length; i++) {
      let d = dist(xPos, yPos, positions[i].xPos, positions[i].yPos);
      if (d < 160) {
        validPosition = false;
        break; // If the distance is less than 160, the position is invalid, so exit the loop
      }
    }

    if (validPosition) {
      positions.push({ xPos, yPos }); // If the position is valid, add it to the array
    }
  }

  // Background colors inside each big circle
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

  // Shape colors inside each big circle
  ShapeColor = [
    // Line #1
    { Out: color(15, 8, 104), Mid: color(12, 102, 50) },
    { Out: color(227, 13, 2), Mid: color(249, 81, 8) },
    { Out: color(245, 20, 2) },
    // Line #2
    { Out: color(21, 95, 151), Mid: color(251, 85, 63) },
    { Out: color(15, 133, 52), Mid: color(251, 85, 63) },
    { Out: color(213, 153, 217), Mid: color(60, 146, 195) },
    { Out: color(21, 95, 151), Mid: color(249, 209, 244) },
    // Line #3
    { Out: color(0, 150, 145) },
    { Out: color(227, 13, 2), Mid: color(243, 7, 11) },
    { Out: color(245, 20, 2), Mid: color(251, 85, 63) },
    { Out: color(243, 110, 9), Mid: color(12, 102, 50) },
    // Line #4
    { Out: color(245, 20, 2), Mid: color(60, 146, 195) },
    { Out: color(196, 21, 90) },
    { Out: color(20, 112, 185), Mid: color(251, 85, 63) },
    { Out: color(227, 13, 2) },
    // Line #5
    { Out: color(245, 20, 2), Mid: color(117, 194, 116) },
    { Out: color(15, 133, 52) }
  ]
}
