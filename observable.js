function extend(subClass, baseClass) {
  subClass.prototype = Object.create(baseClass.prototype);
};

function Observable() {
}

// TODO: Pre-bind subscribe()?
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
  var values = [];
  var result = Promise.defer();  // TODO: Use underlying implementation instead?
  this.subscribe({
    next: function(v) {
      values.push(v);
    },
    completed: function() {
      try {
        result.resolve(resolveCallback.apply(null, values));
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

Observable.prototype.distinctUntilChanged = function(eq) {
  if (!eq) {
    eq = function(a, b) {
      return (a === b);
    };
  }
  var self = this;
  var oldValue;
  return Observable.withCallback(function(subscriber) {
    return self.subscribe({
      'next': function(value) {
        if (!eq(value, oldValue)) {
          subscriber.next(value);
        }
        oldValue = value;
      },
      'completed': function() {
        subscriber.completed();
      },
      'error': function(reason) {
        subscriber.error(reason);
      }
    });
  });
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

Observable.return = function() {
  var args = arrayify(arguments);
  return Observable.withCallback(function(subscriber) {
    args.forEach(function(arg) {
      subscriber.next(arg);
    });
    subscriber.completed();
  });
};

Observable.error = function(reason) {
  return Observable.withCallback(function(subscriber) {
    subscriber.error(reason);
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
  if (this.isCompleted_) {
    observer.completed();
    return;
  }

  if (this.error_) {
    observer.error(reason);
    return;
  }

  var observers = this.observers_;
  observers.push(observer);
  return removeFromList.bind(null, observers);
};

Subject.prototype.next = function(value) {
  this.observers_.forEach(function(observer) {
    observer.next(value);
  });
};

Subject.prototype.completed = function() {
  this.isCompleted_ = true;
  this.observers_.forEach(function(observer) {
    observer.completed();
    // XXX: dispatch via didSubscribe_?
  });
  delete this.observers_;
};

Subject.prototype.error = function(reason) {
  this.error_ = reason;
  this.observers_.forEach(function(observer) {
    observer.error(reason);
  });
  delete this.observers_;
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
  return Subject.prototype.didSubscribe_.call(this, observer);
};

ReplaySubject.prototype.next = function(value) {
  this.values_.push(value);
  Subject.prototype.next.call(this, value);
};


function BehaviorSubject() {
  Subject.prototype.constructor.call(this);
}
extend(BehaviorSubject, Subject);

BehaviorSubject.prototype.didSubscribe_ = function(observer) {
  if (typeof this.value != 'undefined') {
    observer.next(this.value);
  }
};

BehaviorSubject.prototype.next = function(value) {
  this.value = value;
  Subject.prototype.next.call(this, value);
};


var nextTick;
if (typeof MessageChannel !== "undefined") {
  // modern browsers
  // http://www.nonblocking.io/2011/06/windownexttick.html
  var channel = new MessageChannel();
  // linked list of tasks (single, with head node)
  var head = {}, tail = head;
  channel.port1.onmessage = function () {
    head = head.next;
    var task = head.task;
    delete head.task;
    task();
  };
  nextTick = function (task) {
    tail = tail.next = {task: task};
    channel.port2.postMessage(0);
  };
} else {
  // old browsers
  nextTick = function (task) {
    setTimeout(task, 0);
  };
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
    var pending = pendingSubscribers;
    pendingSubscribers = undefined;
    nextTick(function() {
      pending.forEach(v.subscribe.bind(v));
    })
  }
  return {
    resolve: function(v) {
      dispatch(Promise.resolve(v));
    },
    reject: function(reason) {
      dispatch(Observable.error(reason));
    },
    // TODO: Pre-bind then()?
    promise: Observable.withCallback(function(subscriber) {
      if (pendingSubscribers) {
        pendingSubscribers.push(subscriber);
      } else {
        nextTick(function() {
          value.subscribe(subscriber);
        });
      }
      // XXX: disposalCallback?
    })
  };
};

Promise.resolve = function(v) {
  if (v && typeof v.then === 'function')
    return v;

  return Observable.return(v);
};

// function repeat_until(body, condition) {
//   var f = Promise.defer();
//   loop();
//   function loop() {
//     body().then(function() {
//       if (condition()) {
//         f.resolve();
//       } else {
//         loop();
//       }
//     });
//   }
//   return f.promise;
// }

function repeat_until(body, condition) {
  function loop() {
    return body().then(function() {
      if (!condition())
        return loop();
    });
  }
  return loop();
}
