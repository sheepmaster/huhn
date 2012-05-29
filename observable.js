function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

function Observable() {
}

// XXX: Pre-bind subscribe()?
Observable.prototype.subscribe = function(subscriber) {
  function empty() {}
  if (!subscriber.next)
    subscriber.next = empty;
  if (!subscriber.completed)
    subscriber.completed = empty;
  if (!subscriber.error)
    subscriber.error = empty;
  return this.didSubscribe_(subscriber);
};

// TODO: Implement in terms of select?
Observable.prototype.then = function(resolveCallback, rejectCallback) {
  if (!resolveCallback) {
    resolveCallback = function(value) {
      return value;
    };
  }
  if (!rejectCallback) {
    rejectCallback = function(reason) {
      return Observable.error(reason);
    };
  }
  var value;
  var result = Promise.defer();  // XXX: Use underlying implementation instead?
  self.subscribe({
    next: function(v) {
      if (typeof value !== 'undefined')
        throw new Error('Trying to fulfill a promise more than once');
      value = v;
    },
    completed: function() {
      try {
        result.resolve(resolveCallback(value));
      } catch (e) {
        result.reject(e);
      }
    },
    error: function(error) {
      try {
        result.resolve(rejectCallback(error));
      } catch (e) {
        result.reject(e);
      }
    },
  });
  return result.promise;
};

Observable.withCallback = function(callback) {
  var o = new Observable();
  o.didSubscribe_ = callback;
  return o;
};

Observable.now = function() {
  return Observable.withCallback(function(subscriber) {
    subscriber.completed();
  });
};

Observable.return = function(value) {
  return Observable.withCallback(function(subscriber) {
    subscriber.next(value);
    subscriber.completed();
  });
};

Observable.timer = function(interval) {
  return Observable.withCallback(function(subscriber) {
    var id = window.setTimeout(subscriber.completed.bind(subscriber), interval);
    return window.clearTimeout.bind(window, id);
  });
};

var requestAnimationFrame_ = window.webkitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame ||
                             window.msRequestAnimationFrame;
var cancelAnimationFrame_ = window.webkitCancelAnimationFrame ||
                             window.mozCancelAnimationFrame ||
                             window.msCancelAnimationFrame;
Observable.requestAnimationFrame = function() {
  return Observable.withCallback(function(subscriber) {
    var id = requestAnimationFrame_(subscriber.completed.bind(subscriber));
    return cancelAnimationFrame_.bind(window, id);
  });
};


function Subject() {
  Observable.prototype.constructor.call(this);
}
extend(Subject, Observable);

function Subject() {
  this.observers_ = [];
}

function removeFromList(list, el) {
  var index = list.indexOf(el);
  if (index >= 0)
    list.splice(index, 1);
}

Subject.prototype.didSubscribe_ = function(observer) {
  var observers = this.observers_;
  observers.push(observer);
  return function() {
    removeFromList(observers);
  };
};

Subject.prototype.next = function(value) {
  this.observers_.forEach(function(observer) {
    observer.next(value);
  });
};

Subject.prototype.completed = function() {
  this.observers_.forEach(function(observer) {
    observer.completed();
  });
};

Subject.prototype.error = function() {
  this.observers_.forEach(function(observer) {
    if (typeof observer != 'function')
      observer.error(value);
  });
};


function ReplaySubject() {
  Subject.prototype.constructor.call(this);
  this.values_ = [];
}
extend(ReplaySubject, Subject);

ReplaySubject.prototype.didSubscribe_ = function(observer) {
  this.values_.forEach(function(value) {
    observer.next(value);
  });
  if (this.isCompleted_)
    observer.completed();
  return Subject.prototype.didSubscribe_.call(this, observer);
}

ReplaySubject.prototype.next = function(value) {
  this.values_.push(value);
  Subject.prototype.next.call(this, value);
}

ReplaySubject.prototype.completed = function() {
  Subject.prototype.completed.call(this);
  this.isCompleted_ = true;
};


function Future() {
  ReplaySubject.prototype.constructor.call(this);
}
extend(Future, ReplaySubject);

Future.prototype.isFulfilled = function() {
  return this.values_.length > 0;
};

Future.prototype.next = function(value) {
  if (this.isFulfilled())
    throw new Error('Future is already fulfilled');

  ReplaySubject.prototype.next.call(this, value);
};

Future.prototype.completed = function() {
  ReplaySubject.prototype.completed.call(this);

  // Clear the list of observers, because we're not going to need them any more.
  this.observers_ = [];
};

function arrayify(args) {
  return Array.prototype.slice.apply(args);
}

Future.prototype.fulfill = function() {
  arrayify(arguments).forEach(this.next.bind(this));
  this.completed();
};

Future.prototype.pipe = function(future) {
  this.then(function() {
    future.fulfill.apply(future, arguments);
  });
};
Future.prototype.defer = function(f) {
  var future = new Future();
  this.then(function() {
    f.apply(null, arguments).then(function() {
      future.fulfill.apply(future, arguments);
    });
  });
  return future;
};
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


function Promise() {
}

Promise.defer = function() {
  // if the promise is unresolved, |pendingSubscribers| is an array that holds
  // the pending subscribers, otherwise it is undefined.
  var pendingSubscribers = [];
  var value;
  function dispatch(v) {
    // Ignore all resolutions after the first one.
    if (!pendingSubscribers)
      return;
    value = v;
    pendingSubscribers.forEach(v.subscribe.bind(v));
    pendingSubscribers = undefined;
  }
  return {
    resolve: function(v) {
      // XXX: Don't box promises?
      dispatch(Observable.return(v));
    },
    reject: function(reason) {
      dispatch(Observable.error(reason));
    },
    promise: Observable.withCallback(function(subscriber) {
      if (pendingSubscribers)
        pendingSubscribers.push(subscriber);
      else
        dispatchResolved()
    });
  };
}
