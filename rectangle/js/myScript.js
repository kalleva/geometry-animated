var rectangle = {};

rectangle.init = function init() {
  window.requestAnimationFrame(function(timestamp){
    next_frame(timestamp, 200, 200, true, true, 1, 1);
  });
};

function next_frame(timestamp, x, y, to_right, to_bottom, side_step, down_step) {
  if (timestamp === undefined) {
    return undefined;
  } else {
    draw(x, y, to_right, to_bottom, side_step, down_step);
  }
}

function draw(x, y, to_right, to_bottom, side_step, down_step) {
  // debugger;
  var canvas_width = 500;
  var canvas_height = 500;
  var rect_width = 400;
  var rect_height = 400;
  var rect_area = rect_width * rect_height;
  var color = 0;

  var ctx = document.querySelector('canvas').getContext('2d');
  ctx.clearRect(0, 0, canvas_width, canvas_height); // clear canvas before drawing new frame
  ctx.save();
  ctx.translate(50, 50); // move origin of coordinats

  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, rect_width, rect_height);

  ctx.fillStyle = areaToColor(x, y, rect_area);
  ctx.fillRect(0, 0, x, y); // upper left rectangle

  ctx.fillStyle = areaToColor(rect_width - x, y, rect_area);
  ctx.fillRect(x, 0, rect_width - x, y); // upper right rectangle

  ctx.fillStyle = areaToColor(x, rect_height - y, rect_area);
  ctx.fillRect(0, y, x, rect_height - y); // lower left rectangle

  ctx.fillStyle = areaToColor(rect_width - x, rect_height - y, rect_area);
  ctx.fillRect(x, y, rect_width - x, rect_height - y); // lower right rectangle

  // logic to decide animation for the next frame
  if (to_right) {
    if (x + 1 <= rect_width) {
      x += side_step;
    } else {
      side_step = getRandomInt(1, 4);
      x -= side_step;
      to_right = false;
    }
  } else {
    if (x - 1 >= 0) {
      x -= side_step;
    } else {
      side_step = getRandomInt(1, 4);
      x += side_step;
      to_right = true;
    }
  }

  if (to_bottom) {
    if (y + 1 <= rect_height) {
      y += down_step;
    } else {
      down_step = getRandomInt(1, 4);
      y -= down_step;
      to_bottom = false;
    }
  } else {
    if (y - 1 >= 0) {
      y -= down_step;
    } else {
      down_step = getRandomInt(1, 4);
      y += down_step;
      to_bottom = true;
    }
  }

  ctx.restore();
  window.requestAnimationFrame(function(timestamp) {
    next_frame(timestamp, x, y, to_right, to_bottom, side_step, down_step);
  });
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// computes color from area, smaller the area resuls darker color
function areaToColor(x, y, full_area) {
  var color = Math.floor(30 + (x * y / full_area) * 150);
  return "rgb(" + color + ", " + color + ", " + 255 + ")";
}

rectangle.init();
