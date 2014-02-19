(function() {

  var requestAnimationFrame_ = window.webkitRequestAnimationFrame ||
                               window.mozRequestAnimationFrame ||
                               window.msRequestAnimationFrame;

  function animationFrame() {
    return new Promise(function(resolve) {
      requestAnimationFrame_(resolve);
    });
  }

  function defer() {
    var savedResolve;
    var promise = new Promise(function(resolve) {
      savedResolve = resolve;
    });
    return {
      promise: promise,
      resolve: function(result) {
        savedResolve(result);
      }
    };
  }

  function now() {
    return {
      then: function(callback) {
        return callback();
      }
    };
  }

  function timer(interval) {
    return new Promise(function(resolve) {
      window.setTimeout(resolve, interval);
    });
  }

  window.Promises = {
    animationFrame: animationFrame,
    defer: defer,
    now: now,
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
