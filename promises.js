(function() {

  var requestAnimationFrame_ = window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

  function animationFrame() {
    return new Promise(function(resolve) {
      requestAnimationFrame_(resolve);
    });
  }

  function timer(interval) {
    return new Promise(function(resolve) {
      window.setTimeout(resolve, interval);
    });
  }

  window.Promises = {
    animationFrame: animationFrame,
    timer: timer,
  };

})();

function repeat_until(body, condition) {
  function loop() {
    return body().then(function() {
      if (!condition())
        return loop();
    });
  }
  return loop();
}

function handle_error(error) {
  throw error;
}
