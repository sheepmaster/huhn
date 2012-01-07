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
Terminal.prototype.keysPressed = function(ch) {
  var s;
  switch(ch) {
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
    default:
        s = ch;
  }
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    var callback = this.pendingCallback_;
    if (callback) {
      delete this.pendingCallback_;
      callback(c);
    } else {
      this.keyBuffer_.push(c);
    }
  }
};

Terminal.prototype.keyPressed = function() {
  return terminal.keyBuffer_.length > 0;
};

Terminal.prototype.readKey = function(f) {
  if (this.keyBuffer_.length > 0) {
    f(this.keyBuffer_.shift());
  } else {
    this.pendingCallback_ = f;
  }
}
Terminal.prototype.write = function() {
  this.vt100(Array.prototype.join.call(arguments, ''));
}

var WRITE;
function init() {
  terminal = new Terminal();
  WRITE = terminal.write.bind(terminal);
}

function GOTOXY(x, y) {
  terminal.gotoXY(x, y);
}

function KEYPRESSED() {
  return terminal.keyPressed();
}

function READKEY(f) {
  return terminal.readKey(f);
}
