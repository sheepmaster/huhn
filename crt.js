var terminal;

function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

function Terminal() {
  this.keyBuffer_ = [];
  this.superClass.constructor.call(this);
}
extend(Terminal, VT100);
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
  }
  console.log('\'' + s + '\'');
  var that = this;
  s.split('').forEach(function(key) {
    var callback = that.pendingCallback_;
    if (callback) {
      if (that.keyBuffer_.length > 0) {
        throw new Error('key buffer should be empty if we have a pending callback');
      }
      delete that.pendingCallback_;
      window.setTimeout(function() {
          callback(key);
      }, 0);
    } else {
      that.keyBuffer_.push(key);
    }
  });
  return false;
};

Terminal.prototype.crtKeyPressed = function() {
  return terminal.keyBuffer_.length > 0;
};

Terminal.prototype.crtReadKey = function(callback) {
  if (this.keyBuffer_.length > 0) {
    var key = this.keyBuffer_.shift();
    window.setTimeout(function() {
        callback(key);
    }, 0);
  } else {
    this.pendingCallback_ = callback;
  }
};
Terminal.prototype.crtWrite = function() {
  this.vt100(Array.prototype.join.call(arguments, ''));
};
Terminal.prototype.crtClrEol = function() {
  this.clearRegion(this.cursorX, this.cursorY,
                   this.terminalWidth - this.cursorX, 1, this.style);
};
Terminal.prototype.crtClrScr = function() {
  this.clearRegion(0, 0, this.terminalWidth, this.terminalHeight,this.style);
};

function crtInit() {
  terminal = new Terminal();
  terminal.enableAlternateScreen();
}

function GOTOXY(x, y) {
  terminal.gotoXY(x, y);
}

function WRITE() {
  terminal.crtWrite.apply(terminal, arguments);
}

function KEYPRESSED() {
  return terminal.crtKeyPressed();
}

function READKEY(f) {
  return terminal.crtReadKey(f);
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
