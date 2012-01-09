var terminal;

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

unfulfilledFutures = [];

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
Future.prototype.pipe = function(f) {
  this.then(function() {
    f.fulfill.apply(f, arrayify(arguments));
  });
};
Future.prototype.reversePipe = function(f) {
  var that = this;
  var args = arrayify(arguments);
  f.then(function() {
    that.fulfill.apply(that, args);
  });
}

Future.prototype.isFulfilled = function() {
  return (typeof this.result_ != 'undefined');
};

function ImmediateFuture() {
  this.superClass.constructor.call(this);
  this.fulfill(arguments);
}
extend(ImmediateFuture, Future);

function TimedFuture(timeout) {
  this.superClass.constructor.call(this);
  window.setTimeout(this.fulfill.bind(this), timeout);
}
extend(TimedFuture, Future);

function Terminal() {
  this.superClass.constructor.call(this);
  this.utfEnabled = false;
  this.fulfilledFutures_ = [];
  this.unfulfilledFutures_ = [];
}
extend(Terminal, VT100);
Terminal.prototype.keyDown = function(e) {
  if (e.metaKey)
    return true;
  return this.superClass.keyDown.call(this, e);
}
Terminal.prototype.keyUp = function(e) {
  if (e.metaKey)
    return true;
  return this.superClass.keyUp.call(this, e);
};
Terminal.prototype.keyPressed = function(e) {
  if (e.metaKey)
    return true;
  return this.superClass.keyPressed.call(this, e);
};
Terminal.prototype.keysPressed = function(s) {
  switch(s) {
    case '\u001B[D':
        s = '\0K';  // left
        break;
    case '\u001B[A':
        s = '\0H';  // up
        break;
    case '\u001B[C':
        s = '\0M';  // right
        break;
    case '\u001B[B':
        s = '\0P';  // down
        break;
    case '\x7F':
        s = '\x08';  // backspace
        break;
    }
  // console.log('\'' + s + '\'');
  var that = this;
  function pushFulfilledFuture(f) {
    that.fulfilledFutures_.push(f);
    return f;
  }
  s.split('').forEach(function(key) {
    var f = that.unfulfilledFutures_.shift() || pushFulfilledFuture(new Future());
    f.fulfill(key);
  });
  return false;
};
Terminal.prototype.crtKeyPressed = function() {
  return this.fulfilledFutures_.length > 0;
};
Terminal.prototype.crtReadKey = function() {
  var that = this;
  function pushUnfulfilledFuture(f) {
    that.unfulfilledFutures_.push(f);
    return f;
  }
  return this.fulfilledFutures_.shift() || pushUnfulfilledFuture(new Future());
};
Terminal.prototype.crtWrite = function() {
  this.vt100(Array.prototype.join.call(arguments, ''));
};
Terminal.prototype.crtWriteLn = function() {
  this.vt100(Array.prototype.join.call(arguments, '') + '\n');
};
Terminal.prototype.crtClrEol = function() {
  this.clearRegion(this.cursorX, this.cursorY,
                   this.terminalWidth - this.cursorX, 1, this.style);
};
Terminal.prototype.crtClrScr = function() {
  this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight,this.style);
  this.gotoXY(0, 0);
};

Terminal.prototype.crtTextColor = function(c) {
  this.attr = (this.attr & ~0x0F) | c;
  this.updateStyle();
};
Terminal.prototype.crtBackgroundColor = function(c) {
  this.attr = (this.attr & ~0xF0) | (c << 4);
  this.updateStyle();
};
Terminal.prototype.crtHighVideo = function() {
  this.attr = (this.attr & ~0x0400) | 0x0800;
  this.updateStyle();
};
Terminal.prototype.crtLowVideo = function() {
  this.attr = (this.attr & ~0x0800) | 0x0400;
  this.updateStyle();
};

function crtInit() {
  suppressAllAudio = true;
  terminal = new Terminal();
  terminal.enableAlternateScreen();
}

function GOTOXY(x, y) {
  terminal.gotoXY(x - 1, y - 1);
}

function WRITE() {
  terminal.crtWrite.apply(terminal, arguments);
}

function WRITELN() {
  terminal.crtWriteLn.apply(terminal, arguments);
}

function KEYPRESSED() {
  return terminal.crtKeyPressed();
}

function READKEY() {
  return terminal.crtReadKey();
}

function CURSOR_ON() {
  terminal.showCursor();
}

function CURSOR_OFF() {
  terminal.hideCursor();
}

function CLREOL() {
  terminal.crtClrEol();
}
function CLRSCR() {
  terminal.crtClrScr();
}

function TEXTCOLOR(c) {
  terminal.crtTextColor(c);
}

function TEXTBACKGROUND(c) {
  terminal.crtBackgroundColor(c);
}

function LOWVIDEO() {
  terminal.crtLowVideo();
}

function HIGHVIDEO() {
  terminal.crtHighVideo();
}

