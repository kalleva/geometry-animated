// triangle ABC, point O is intersection of CK and AL:
//  hB     B
//  |     /  \
//  hL   /    L
//  hK  K    * \
//  hO /  * O   \
//  | /  *    *  \
//   A ---------- C

var rectangle = {};

rectangle.init = function init() {
  window.requestAnimationFrame(function(timestamp){
    next_frame(timestamp, 0, 1);
  });
};

function next_frame(timestamp, distance, direction) {
  if (timestamp === undefined) {
    return undefined;
  } else {
    draw(distance, direction);
  }
}

function draw(distance, direction) {
  // debugger;
  var canvasWidth = 500;
  var canvasHeight = 500;
  var ctx = document.querySelector('canvas').getContext('2d');
  ctx.clearRect(0, 0, canvasWidth, canvasHeight); // clear canvas before drawing new frame
  ctx.save();

  ctx.transform(1, 0, 0, -1, 0, canvasHeight); // flip coordinate axes
  ctx.translate(50, 50); // move origin of coordinat

  var pA = point(0, 0);
  var pB = point(120, 400);
  var pC = point(400, 0);
  var fullDist = 400;


  var fullArea = 1 / 2 * (pB.x + pC.x) * pB.y - 1 / 2 * (pB.x * pB.y);

  pK = linearMotion(pB, pA, distance / fullDist);
  pL = linearMotion(pB, pC, distance / fullDist);

  var pO = intersection(pA, pL, pC, pK);
  // console.log(pO);
  var phO = point(0, pO.y);
  var phK = point(0, pK.y);
  var phL = point(0, pL.y);
  var phB = point(0, pB.y);

  // Computes areas of sectors AOC, AOK, LOC, BLOC
  // To compute areas can use projections of points on vertical line going through
  // point A
  // We can represent areas we wish to find as:
  // s_AOC = s_AhOOC - s_AOhO
  // s_AOK = s_AOhO + s_hKKOhO - s_AKhK
  // s_LOC = s_ACLhL - s_OhOLhL - s_AhOOC
  // s_BLOC = s_OhOLhL + s_hBBLhL - s_hKKOhO - s_BhBhKK

  var s_AOhO = 1 / 2 * (phO.y * pO.x);
  var s_AhOOC = 1 / 2 * (pO.x + pC.x) * phO.y;
  var s_hKKOhO = 1 / 2 * (pK.x + pO.x) * (phK.y - phO.y);
  var s_AKhK = 1 / 2 * (phK.y * pK.x);
  var s_ACLhL = 1 / 2 * (pL.x + pC.x) * phL.y;
  var s_OhOLhL = 1 / 2 * (pL.x + pO.x) * (phL.y - phO.y);
  var s_hBBLhL = 1 / 2 * (pB.x + pL.x) * (phB.y - phL.y);
  var s_BhBhKK = 1 / 2 * (pB.x + pK.x) * (phB.y - phK.y);

  var s_AOC = s_AhOOC - s_AOhO;
  var s_AOK = s_AOhO + s_hKKOhO - s_AKhK;
  var s_LOC = s_ACLhL - s_OhOLhL - s_AhOOC;
  var s_BLOC = s_OhOLhL + s_hBBLhL - s_hKKOhO - s_BhBhKK;

  // draws AOC, AOK, LOC, BLOK and fills them with color wich is computed from
  // ther area
  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pO.x, pO.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.fillStyle = areaToColor(s_AOC, fullArea);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pO.x, pO.y);
  ctx.lineTo(pK.x, pK.y);
  ctx.fillStyle = areaToColor(s_AOK, fullArea);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(pC.x, pC.y);
  ctx.lineTo(pO.x, pO.y);
  ctx.lineTo(pL.x, pL.y);
  ctx.fillStyle = areaToColor(s_LOC, fullArea);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(pB.x, pB.y);
  ctx.lineTo(pL.x, pL.y);
  ctx.lineTo(pO.x, pO.y);
  ctx.lineTo(pK.x, pK.y);
  ctx.fillStyle = areaToColor(s_BLOC, fullArea);
  ctx.fill();

  //draws AL and CK
  ctx.moveTo(pK.x, pK.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.moveTo(pL.x, pL.y);
  ctx.lineTo(pA.x, pA.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(pA.x, pA.y);
  ctx.lineTo(pB.x, pB.y);
  ctx.lineTo(pC.x, pC.y);
  ctx.lineTo(pA.x, pA.y);
  ctx.strokeStyle = 'black';
  ctx.stroke();

  // decide position for the next frame if it equals length then reverse direction
  if (direction === 1) {
    if (distance < fullDist) {
      distance += 1;
    } else {
      direction = -1;
      distance -= 1;
    }
  } else {
    if (distance > 0) {
      distance -= 1;
    } else {
      direction = 1;
      distance += 1;
    }
  }

  ctx.restore();
  window.requestAnimationFrame(function(timestamp) {
    next_frame(timestamp, distance, direction);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}


// input: beginning and end of line and percent of passed distance from lines
// total length
// output: coordinates of the point
function linearMotion(beginning, end, distance) {
dx = end.x - beginning.x;
dy = end.y - beginning.y;
xi = beginning.x + dx * distance;
yi = beginning.y + dy * distance;
return point(xi, yi);
}

// computes color from area, smaller the area resuls darker color
function areaToColor(sector, fullArea) {
  var color = Math.floor(20 + (sector / fullArea) * 170);
  return "rgb(" + color + ", " + color + ", " + 255 + ")";
}

function point(xi, yi) {
  return {x: xi, y: yi};
}

// find intersection of two lines
// fist line - points p11, p12
// second line - points p21, p22
function intersection(p11, p12, p21, p22){
  // debugger;
  var i = point(0, 0);
  var slope1 = (p12.y - p11.y) / (p12.x - p11.x);
  var slope2 = (p22.y - p21.y) / (p22.x - p21.x);
  i.x = (slope1 * p11.x - p11.y - slope2 * p21.x + p21.y) / (slope1 - slope2);
  if (isNaN(i.x)) {
    i.x = (p12.x + p22.x) / 2;
  }
  i.y = slope1 * (i.x - p11.x) + p11.y;
  return i;
}

rectangle.init();
