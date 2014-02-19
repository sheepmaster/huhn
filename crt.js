var terminal;

function extend(subClass, baseClass) {
  subClass.prototype = Object.create(baseClass.prototype);
};

function Terminal() {
  VT100.call(this);
  this.utfEnabled = false;
  this.promises_ = [];
  this.resolvers_ = [];
}
extend(Terminal, VT100);
Terminal.prototype.keyDown = function(e) {
  if (e.location == 3 && e.keyCode == 13)
    e.keyCode = 10;
  if (e.metaKey)
    return true;
  return VT100.prototype.keyDown.call(this, e);
}
Terminal.prototype.keyUp = function(e) {
  if (e.metaKey)
    return true;
  return VT100.prototype.keyUp.call(this, e);
};
Terminal.prototype.keyPressed = function(e) {
  if (e.metaKey)
    return true;
  return VT100.prototype.keyPressed.call(this, e);
};
Terminal.prototype.keysPressed = function(s) {
  switch(s) {
    case '\u001B\r':
        s = "\n";
        break;
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
    case '\u001B':  // escape
        break;
    default:
        // Ignore other escape sequences.
        if (s.charCodeAt(0) == 27)
          return;
  }
  var that = this;
  s.split('').forEach(function(key) {
    var f = that.resolvers_.shift();
    if (f) {
      f(key);
      return;
    }

    that.promises_.push(Promise.resolve(key));
  });
  return false;
};
Terminal.prototype.crtKeyPressed = function() {
  return this.promises_.length > 0;
};
Terminal.prototype.crtReadKey = function() {
  var that = this;
  return this.promises_.shift() || new Promise(function(resolve) {
    that.resolvers_.push(resolve);
  });
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
  if (this.textColor_ != c) {
    this.attr = (this.attr & ~0x0F) | c;
    this.updateStyle();
    updateStyleRule(document.styleSheets[document.styleSheets.length - 1], '#vt100 #cursor.bright', 'background-color: '+this.ansi[c]);
    updateStyleRule(document.styleSheets[document.styleSheets.length - 1], '#vt100 #cursor.inactive', 'border-color: '+this.ansi[c]);
    this.textColor_ = c;
  }
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
Terminal.prototype.getCharAt = function(x, y) {
  var line = this.console[this.currentScreen].childNodes[y];
  if (!line)
    return ' ';
  var span = line.firstChild;
  var xPos = 0;
  while (span && xPos <= x) {
    var s = this.getTextContent(span);
    var len = s.length;
    if (xPos + len > x) {
      return s.charAt(x - xPos);
    }
    xPos += len;
    span = span.nextSibling;
  }
  return ' ';
}

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

function updateStyleRule(stylesheet, selector, style) {
  for (var i = 0; i < stylesheet.cssRules.length; i++) {
    var rule = stylesheet.cssRules[i];
    if (rule.selectorText == selector) {
      rule.style.cssText = style;
      return;
    }
  }
  stylesheet.insertRule(selector + ' { ' + style + ' } ', 0);
}

function setColoScreenAttr(index, attr) {
  var row = Math.floor((index - 1) / 80);
  var col = (index - 1) % 80;
  var color = 'color:' + terminal.ansi[attr] + ';'
  color += 'background-color:rgb(0, 0, 0);';
  terminal.putString(col, row, terminal.getCharAt(col, row), color);
}
