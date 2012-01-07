var terminal;
function init() {
    terminal = new VT100();
}

function GOTOXY(x, y) {
    terminal.gotoXY(x, y);
}

function WRITE(s) {
    terminal.vt100(s);
}
