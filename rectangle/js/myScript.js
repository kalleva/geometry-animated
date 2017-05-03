var rectangle = {};

rectangle.init = function init() {
  window.requestAnimationFrame(function(timestamp){
    next_frame(timestamp, 200, 200, true, true);
  });
};

function next_frame(timestamp, x, y, to_right, to_bottom) {
  if (timestamp === undefined) {
    return undefined;
  } else {
    draw(x, y, to_right, to_bottom);
  }
}

function draw(x, y, to_right, to_bottom) {
  var canvas_width = 500;
  var canvas_height = 500;
  var rect_width = 400;
  var rect_height = 400;
  var ctx = document.querySelector('canvas').getContext('2d');
  ctx.clearRect(0, 0, canvas_width, canvas_height); // clear canvas before drawing new frame
  ctx.save();
  ctx.translate(50, 50); // move origin of coordinats

  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, rect_width, rect_height);

  ctx.fillStyle = 'green';
  ctx.fillRect(0, 0, x, y); // upper left rectangle

  ctx.fillStyle = 'red';
  ctx.fillRect(x, 0, rect_width - x, y); // upper right rectangle

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, y, x, rect_height - y); // lower left rectangle

  ctx.fillStyle = 'yellow';
  ctx.fillRect(x, y, rect_width - x, rect_height - y); // lower right rectangle

  // logic to decide animation for the next frame
  if (to_right) {
    if (x + 1 <= rect_width) {
      x++;
    } else {
      x--;
      to_right = false;
    }
  } else {
    if (x - 1 >= 0) {
      x--;
    } else {
      x++;
      to_right = true;
    }
  }

  if (to_bottom) {
    if (y + 1 <= rect_height) {
      y++;
    } else {
      y--;
      to_bottom = false;
    }
  } else {
    if (y - 1 >= 0) {
      y--;
    } else {
      y++;
      to_bottom = true;
    }
  }

  ctx.restore();
  window.requestAnimationFrame(function(timestamp) {
    next_frame(timestamp, x, y, to_right, to_bottom);
  });
}

rectangle.init();
