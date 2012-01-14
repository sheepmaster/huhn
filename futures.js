function arrayify(args) {
  return Array.prototype.slice.apply(args);
}

function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

var unfulfilledFutures = [];

function Future() {
  unfulfilledFutures.push(this);
  this.continuations_ = [];
}
Future.prototype.fulfill = function() {
  if (this.isFulfilled())
    throw new Error('Future is already fulfilled');
  var result = arrayify(arguments);
  this.result_ = result;
  this.continuations_.forEach(function(cont) {
    cont.apply(null, result);
  });
  unfulfilledFutures.splice(unfulfilledFutures.indexOf(this), 1);
  if (unfulfilledFutures.length == 0)
    console.log("No unfulfilled futures left");
  this.continuations_ = [];
};
Future.prototype.then = function(continuation) {
  var args = this.result_;
  if (args) {
    continuation.apply(null, args);
  } else {
    this.continuations_.push(continuation);
  }
  return this;
};
Future.prototype.pipe = function(future) {
  this.then(function() {
    future.fulfill.apply(future, arguments);
  });
};
Future.prototype.defer = function(f) {
  var future = new Future();
  this.then(function() {
    f.apply(null, arguments).pipe(future);
  });
  return future;
};

Future.prototype.isFulfilled = function() {
  return (typeof this.result_ != 'undefined');
};

function ImmediateFuture() {
  this.superClass.constructor.call(this);
  this.fulfill.apply(this, arguments);
}
extend(ImmediateFuture, Future);

function TimedFuture(timeout) {
  this.superClass.constructor.call(this);
  window.setTimeout(this.fulfill.bind(this), timeout);
}
extend(TimedFuture, Future);

var requestAnimationFrame_ = window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame;
function AnimationFuture() {
  this.superClass.constructor.call(this);
  requestAnimationFrame_(this.fulfill.bind(this));
}
extend(AnimationFuture, Future);

function repeat_until(body, condition) {
  var f = new Future();
  loop();
  function loop() {
    body().then(function() {
      if (condition()) {
        f.fulfill();
      } else {
        loop();
      }
    });
  }
  return f;
}
