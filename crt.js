var terminal;

function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

function Terminal() {
  this.keyBuffer = '';
  this.superClass.constructor.call(this);
}
extend(Terminal, VT100);
Terminal.prototype.keysPressed = function(ch) {
  var s;
  if (ch == '\u001B[D') {
    s = '\0K';  // left
  } else if (ch == '\u001B[A') {
    s = '\0H';  // up
  } else if (ch == '\u001B[C') {
    s = '\0M';  // right
  } else if (ch == '\u001B[B') {
    s = '\0P';  // down
  } else {
    s = ch;
  }
  for (var i = 0; i < s.length; i++) {
    if (this.pendingCallback) {
      this.pendingCallback.call(s.charAt(i));
      delete this.pendingCallback;
    } else {
      this.keyBuffer = this.keyBuffer + s;
    }
  }
}

function init() {
    terminal = new Terminal();
}

function GOTOXY(x, y) {
    terminal.gotoXY(x, y);
}

function WRITE() {
    terminal.vt100(Array.prototype.join.call(arguments, ''));
}

function KEYPRESSED() {
  return terminal.keyBuffer.length > 0;
}
