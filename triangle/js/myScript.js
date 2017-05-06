// triangle:
//          B
//        /  \
//       /    \
//      K      L
//     /  * O * \
//    /  *    *  \
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
  var canvas_width = 500;
  var canvas_height = 500;
  var ctx = document.querySelector('canvas').getContext('2d');
  ctx.clearRect(0, 0, canvas_width, canvas_height); // clear canvas before drawing new frame
  ctx.save();
  ctx.translate(50, 50); // move origin of coordinat

  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(120, 0);
  ctx.lineTo(400, 400);
  ctx.lineTo(0, 400);
  ctx.strokeStyle = 'black';
  ctx.stroke();


  k_coord = linearMotion(120, 0, 0, 400, distance / 400);
  l_coord = linearMotion(120, 0, 400, 400, distance / 400);

  ctx.moveTo(k_coord.x, k_coord.y);
  ctx.lineTo(400, 400);
  ctx.moveTo(l_coord.x, l_coord.y);
  ctx.lineTo(0, 400);
  ctx.stroke();

  ctx.fillStyle = 'green';
  ctx.fillRect(k_coord.x - 3, k_coord.y - 2, 5, 5);

  ctx.fillStyle = 'red';
  ctx.fillRect(l_coord.x - 1, l_coord.y - 2, 5, 5);

  // decide position for the next frame if it equals length then reverse direction
  if (direction === 1) {
    if (distance < 400) {
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
function linearMotion(x0, y0, x1, y1, distance) {
dx = x1 - x0;
dy = y1 - y0;
xi = x0 + dx * distance;
yi = y0 + dy * distance;
return { x: xi, y: yi };
}

// computes color from area, smaller the area resuls darker color
function areaToColor(x, y, full_area) {
  var color = Math.floor(20 + (x * y / full_area) * 170);
  return "rgb(" + color + ", " + color + ", " + 255 + ")";
}

rectangle.init();
