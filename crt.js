var terminal;

function Future() {
  this.continuations_ = [];
  this.results_ = [];
}
Future.prototype.fulfill = function() {
  var continuation = this.continuations_.shift();
  if (continuation) {
    continuation.apply(null, arguments);
  } else {
    this.results_.push(Array.prototype.slice.apply(arguments));
  }
};
Future.prototype.then = function(f) {
  var args = this.results_.shift();
  if (args) {
    f.apply(null, args);
  } else {
    this.continuations_.push(f);
  }
};
Future.prototype.isQueued = function() {
  return (this.results_.length > 0);
};
Future.prototype.isBlocked = function() {
  return (this.continuations_.length > 0);
}

function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

function Terminal() {
  this.superClass.constructor.call(this);
  this.utfEnabled = false;
  this.keyBuffer_ = new Future();
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
  s.split('').forEach(this.keyBuffer_.fulfill.bind(this.keyBuffer_));
  return false;
};
Terminal.prototype.crtKeyPressed = function() {
  return this.keyBuffer_.isQueued();
};
Terminal.prototype.crtReadKey = function(callback) {
  this.keyBuffer_.then(callback);
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

