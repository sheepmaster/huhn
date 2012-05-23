function Observable() {
  this.observers_ = [];
}

Observable.prototype.subscribe = function(observer) {
  this.observers_.push(observer);
};

function dispatchNextTo(value, observer) {
  if (typeof observer == 'function')
    observer(value);
  else
    observer.next(value);
}

Observable.prototype.dispatchNext = function(value) {
  this.observers_.forEach(function(observer) {
    dispatchNextTo(value, observer);
  });
};

Observable.prototype.dispatchCompleted = function() {
  this.observers_.forEach(function(observer) {
    if (typeof observer != 'function')
      observer.completed(value);
  });
};

Observable.prototype.dispatchError = function() {
  this.observers_.forEach(function(observer) {
    if (typeof observer != 'function')
      observer.error(value);
  });
};


function MemorizingObservable() {
  this.superClass.constructor.call(this);
  this.values_ = [];
}
extend(MemorizingObservable, Observable);

MemorizingObservable.prototype.subscribe = function(observer) {
  this.values_.forEach(function(value) {
    dispatchNextTo(value, observer);
  });
  this.superClass.subscribe(observer);
}

MemorizingObservable.prototype.dispatchNext = function(value) {
  this.values_.push(value);
  this.superClass.dispatchNext(value);
}


function Future() {
}
extend(Future, MemorizingObservable);

Future.prototype.isFulfilled = function() {
  return this.values_.length > 0;
};

Future.prototype.subscribe = function(observer) {
  this.superClass.subscribe(observer);
  if (this.isFulfilled())
    this.dispatchCompleted();
};

Future.prototype.dispatchNext = function(value) {
  if (this.isFulfilled())
    throw new Error('Future is already fulfilled');

  this.superClass.dispatchNext(value);
};

Future.prototype.dispatchCompleted = function(value) {
  if (!this.isFulfilled())
    throw new Error('Future is not fulfilled yet');

  this.superClass.dispatchCompleted(value);

  // Clear the list of observers, because we're not going to need them any more.
  this.observers_ = [];
};

Future.prototype.fulfill = Future.prototype.dispatchNext;
Future.prototype.then = Future.prototype.subscribe;
