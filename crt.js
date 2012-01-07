var terminal;
function init() {
    terminal = new VT100();
}

function GOTOXY(x, y) {
    terminal.gotoXY(x, y);
}

function WRITE() {
    terminal.vt100(Array.prototype.join.call(arguments, ''));
}
