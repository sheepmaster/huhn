/* PROGRAM NAME: TOETE_DAS_HUHN_UND_SPEISE_ES_MIT_EINER_SAFTIGEN_SOSSE */
var MAX_ENTRIES = 9;
var ONE = 1;
var ENTRY_TYPE = Object;
var HIGHSCORE_TYPE = Array;
var OPTION_TYPE = Object;
var OPTIONS_TYPE = Object;
var I, POS, LEVL = new INTEGER();
var OLD_MODE = new BYTE();
var C = new CHAR();
var OUT, CHANGED, COLOR = new BOOLEAN();
var HIGHSCORES = new HIGHSCORE_TYPE();
var OPTIONS = new OPTION_TYPE();

function INVERSE_ON() {
    TEXTCOLOR(BLACK);
    if (COLOR) {
        TEXTBACKGROUND(7)
    } else {
        TEXTBACKGROUND(WHITE)
    };
}

function INVERSE_OFF() {
    if (COLOR) {
        TEXTCOLOR(OPTIONS.TEXT);
        TEXTBACKGROUND(OPTIONS.BACK);
    } else {
        HIGHVIDEO();
        TEXTBACKGROUND(BLACK);
    };
}

function CENTERED(L) {
    GOTOXY(1, L);
    CLREOL();
    GOTOXY((80 - LENGTH(S)) / 2, L);
    WRITE(S);
}

function READ_IN(READ_IN) {
    var C = new CHAR();
    var S = new STRING();
    CURSOR_ON();
    S = ST;
    WRITE(S);
    do {
        C = READKEY;
        if ((C in [' '..'}', 'Ž', '™', 'š', '„', '”', '?']) && (LENGTH(S) < 20)) {
            S = CONCAT(S, C);
            WRITE(C);
        };
        if ((C = CHR(8)) && (LENGTH(S) > 0)) {
            DELETE(S, LENGTH(S), 1);
            WRITE(CHR(8), ' ', CHR(8));
        };
        if (C = CHR(0)) {
            C = READKEY
        };
    } while (!((C = CHR(13)) || (C = CHR(27))));;
    if (C = CHR(13)) {
        ST = S
    } else {
        ST = ''
    };
    CURSOR_OFF();
}

function WRITE_HIGHSCORES(HIGHSCORES) {
    GOTOXY(33, 4);
    WRITE('ÉÍÍÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(20, 5);
    WRITE('ÉÍÍÍÍÍÍÍÍÍÍÍÍ¹ Highscores ÌÍÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(20, 6);
    WRITE('º            ÈÍÍÍÍÍÍÍÍÍÍÍÍ¼           º');
    GOTOXY(20, 7);
    WRITE('º Platz Name             Level Punkte º');
    GOTOXY(20, 8);
    WRITE('º                                     º');
    GOTOXY(20, 9);
    WRITE('º                                     º');
    GOTOXY(20, 10);
    WRITE('º                                     º');
    GOTOXY(20, 11);
    WRITE('º                                     º');
    GOTOXY(20, 12);
    WRITE('º                                     º');
    GOTOXY(20, 13);
    WRITE('º                                     º');
    GOTOXY(20, 14);
    WRITE('º                                     º');
    GOTOXY(20, 15);
    WRITE('º                                     º');
    GOTOXY(20, 16);
    WRITE('º                                     º');
    GOTOXY(20, 17);
    WRITE('º                                     º');
    GOTOXY(20, 18);
    WRITE('º                                     º');
    GOTOXY(20, 19);
    WRITE('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
    for (I = 0; I <= MAX_ENTRIES; I++) {
        GOTOXY(22, 9 + I);
        WRITE(I + 1, '.');
        GOTOXY(26, 9 + I);
        WRITE(HIGHSCORES[I].NAME);
        GOTOXY(47, 9 + I);
        WRITE(HIGHSCORES[I].LVL);
        GOTOXY(50, 9 + I);
        WRITE(HIGHSCORES[I].SCOR);
    };
}

function SHOW_HIGHSCORES() {
    var I = new INTEGER();
    WRITE_HIGHSCORES(HIGHSCORES);
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste dr?cken ***');
    INVERSE_OFF();
    I = 1;
    if (LEVL >= 35) {
        do {
            COLO_SCREEN[I].ATTR = COLO_SCREEN[I].ATTR / 16 * 16 + RANDOM(16);
            I = I % 2000 + 1;
        } while (!(KEYPRESSED));
    };
    C = READKEY;
    if (C = CHR(0)) {
        C = READKEY
    };
    LEVL = 0;
}

function PUT_IN_HIGHSCORE(SCOR) {
    var I, J = new INTEGER();
    var NAME = new STRING();
    var NEWHIGHSCORES = new HIGHSCORE_TYPE();
    NEWHIGHSCORES = HIGHSCORES;
    I = 0;
    while ((NEWHIGHSCORES[I].SCOR > SCOR) && (I < MAX_ENTRIES)) {
        I = I + 1
    };
    if (NEWHIGHSCORES[I].SCOR <= SCOR) {
        for (J = MAX_ENTRIES; J >= I + 1; J--) {
            NEWHIGHSCORES[J] = NEWHIGHSCORES[J - 1]
        };
        NEWHIGHSCORES[I].LVL = LVL;
        NEWHIGHSCORES[I].SCOR = SCOR;
        NAME = 'Anonymous';
        INVERSE_OFF();
        WRITE_HIGHSCORES(NEWHIGHSCORES);
        INVERSE_ON();
        CENTERED(25, 'Bitte geben Sie nun Ihren Namen ein oder dr?cken sie [Esc], um abzubrechen');
        INVERSE_OFF();
        GOTOXY(26, 9 + I);
        WRITE('                    ');
        GOTOXY(26, 9 + I);
        READ_IN(NAME);
        NEWHIGHSCORES[I].NAME = NAME;
        if (NAME != '') {
            HIGHSCORES = NEWHIGHSCORES;
            CHANGED = TRUE;
        };
        SHOW_HIGHSCORES();
    };
}

function LOAD_HIGHSCORES_AND_OPTIONS() {
    var HI_FILE_TYPE = ;
    var F = new HI_FILE_TYPE();
    var RED = new OPTIONS_TYPE();
    ASSIGN(F, 'HUHN.HI');
    RESET(F);
    READ(F, RED);
    CLOSE(F);
    if (IORESULT != 0) {
        for (I = 1; I <= MAX_ENTRIES; I++) {
            HIGHSCORES[I].NAME = 'Anonymous';
            HIGHSCORES[I].LVL = 1;
            HIGHSCORES[I].SCOR = 10000;
        };
        HIGHSCORES[0].NAME = 'Sheepmaster';
        HIGHSCORES[0].LVL = 55;
        HIGHSCORES[0].SCOR = 632650;
        OPTIONS.COLOR = TRUE;
        OPTIONS.BEEP = TRUE;
        OPTIONS.TEXT = LIGHTGREEN;
        OPTIONS.BACK = BLACK;
    } else {
        HIGHSCORES = RED.HIGHSCORES;
        OPTIONS = RED.OPTIONS;
    };
}

function SAVE_HIGHSCORES_AND_OPTIONS() {
    var HI_FILE_TYPE = ;
    var R = new WORD();
    var F = new HI_FILE_TYPE();
    var WRITTEN = new OPTIONS_TYPE();
    WRITTEN.HIGHSCORES = HIGHSCORES;
    WRITTEN.OPTIONS = OPTIONS;
    ASSIGN(F, 'HUHN.HI');
    REWRITE(F);
    WRITE(F, WRITTEN);
    CLOSE(F);
    R = IORESULT;
    if (R != 0) {
        WRITELN('Fehler beim Schreiben der Datei ''HUHN.HI''!');
        WRITELN('Fehlernr.: ', R);
    };
}

function NEW_GAME() {
    var MAX_AUTOS = 30;
    var START_DELAY = 110;
    var SPEED_FACTOR = .977;
    var TOP = 10;
    var BOTTOM = 16;
    var LEFT = 24;
    var RIGHT = 56;
    var START_BONUS = 10000;
    var REDUCTION = 50;
    var PROBS = new Array(.01, .0, 7.5, 2.5, 1.0, 9.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.5, 1.0, 1.0, 2.5, 2.5, 7.5, .0, .0, .0, .0, .001);
    var PROBSUM = 42.011;
    var COORD = Object;
    var AUTO_TYP = Array;
    var START_AGAIN, GAME_OVER, RAINBOW, SPLAT, KEY = new BOOLEAN();
    var I, HUEHNER, PRESENT_DELAY, BONUS, BONUS2, WAIT_DELAY, FAC = new INTEGER();
    var SCORE = new LONGINT();
    var CH = new CHAR();
    var HUHN = new COORD();
    var AUTOS = new AUTO_TYP();
    var TURBO_POWER = new Array();

    function MAX(A, B) {
        if (A > B) {
            MAX = A
        } else {
            MAX = B
        };
    }

    function WAIT(MIL) {
        var I, J = new INTEGER();
        var ST, MI, SE, HU = new WORD();
        var TIME2 = new LONGINT();
        for (I = 0; I <= FAC * MIL; I++) {
            GETTIME(ST, MI, SE, HU);
            TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
            INC(J);
        };
    }

    function CALIBRATE() {
        var ST, MI, SE, HU = new WORD();
        var TIME, TIME2, INT = new LONGINT();
        INT = 0;
        GETTIME(ST, MI, SE, HU);
        TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
        do {
            GETTIME(ST, MI, SE, HU);
            TIME = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
        } while (!(TIME2 != TIME));;
        do {
            GETTIME(ST, MI, SE, HU);
            TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
            INC(INT);
        } while (!((TIME2 >= TIME + PRESENT_DELAY) || (TIME2 < TIME)));;
        FAC = INT / (PRESENT_DELAY * 10);
    }

    function BEEP() {
        SOUND(880);
        WAIT(200);
        NOSOUND();
    }

    function RAND() {
        var I = new INTEGER();
        var R, N = new REAL();
        R = RANDOM * PROBSUM;
        I = -1;
        N = 0;
        do {
            N = N + PROBS[I];
            INC(I);
        } while (!((I = 21) || (N >= R)));;
        if (I - 1 = OPTIONS.BACK) {
            RAND = 0
        } else {
            RAND = I - 1
        };
    }

    function INIT() {
        var I, J = new INTEGER();
        for (I = LEFT; I <= RIGHT; I++) {
            for (J = TOP; J <= BOTTOM; J++) {
                TURBO_POWER[J][I] = FALSE
            }
        };
        CENTERED(1, 'Warum ging das Huhn ?ber die Autobahn?');
        CENTERED(2, '¸ 1999 by Bl”k!Interactive Megatrend Gamesystems');
        GOTOXY(LEFT, TOP - 2);
        WRITE('================================');
        GOTOXY(LEFT, BOTTOM + 1);
        WRITE('================================');
        GOTOXY(LEFT, BOTTOM + 2);
        WRITE('Score');
        GOTOXY((RIGHT + LEFT) / 2 - 4, BOTTOM + 2);
        WRITE('Bonus');
        GOTOXY(RIGHT - 8, BOTTOM + 2);
        WRITE('Bonus II');
        INVERSE_ON();
        CENTERED(25, 'Warum ging das Huhn ?ber die Autobahn?');
        INVERSE_OFF();
        RANDOMIZE();
        for (I = 0; I <= MAX_AUTOS; I++) {
            AUTOS[I].X = LEFT + RANDOM(RIGHT - LEFT);
            AUTOS[I].Y = TOP + RANDOM(BOTTOM - TOP);
            AUTOS[I].COLOR = RAND;
            if (AUTOS[I].COLOR = OPTIONS.BACK) {
                AUTOS[I].COLOR = BLACK
            };
            GOTOXY(AUTOS[I].X, AUTOS[I].Y);
            if (OPTIONS.COLOR && COLOR) {
                TEXTCOLOR(AUTOS[I].COLOR)
            };
            WRITE('*');
        };
        LEVL = 1;
        HUEHNER = 3;
        PRESENT_DELAY = START_DELAY;
        GAME_OVER = FALSE;
        RAINBOW = FALSE;
        SCORE = 0;
        BONUS2 = START_BONUS;
    }

    function INIT2() {
        INVERSE_OFF();
        START_AGAIN = FALSE;
        HUHN.X = (RIGHT + LEFT) / 2;
        HUHN.Y = BOTTOM;
        BONUS = 200 * LEVL;
        GOTOXY(LEFT, TOP - 3);
        WRITE('Level: ', LEVL);
        GOTOXY(RIGHT - 4, TOP - 3);
        if (HUEHNER < 10) {
            WRITE(' ')
        };
        WRITE('#x', HUEHNER, '    ');
        GOTOXY(LEFT, BOTTOM + 3);
        WRITE(SCORE);
        GOTOXY(RIGHT - 4, BOTTOM + 3);
        WRITE(BONUS2);
        GOTOXY((RIGHT + LEFT) / 2 - 3, BOTTOM + 3);
        WRITE(BONUS);
    }

    function GESCHAFFT() {
        var I = new INTEGER();
        PRESENT_DELAY = ROUND(PRESENT_DELAY * SPEED_FACTOR);
        INC(LEVL);
        INC(HUEHNER);
        START_AGAIN = TRUE;
        SCORE = SCORE + BONUS + BONUS2;
        BONUS2 = START_BONUS;
        INVERSE_ON();
        if (LEVL != 35) {
            CENTERED(25, 'YOAHEEH!')
        } else {
            CENTERED(25, 'UI, BUNT!');
            RAINBOW = TRUE;
        };
        GOTOXY(HUHN.X, HUHN.Y);
        INVERSE_OFF();
        WRITE('#');
        CALIBRATE();
        WRITE(CHR(8), ' ');
        HUHN.X = (RIGHT + LEFT) / 2;
        HUHN.Y = BOTTOM;
    }

    function TOT() {
        if (OPTIONS.BEEP) {
            BEEP()
        };
        INVERSE_ON();
        CENTERED(25, 'HAA HAA!');
        INVERSE_OFF();
        HUEHNER = HUEHNER - 1;
        START_AGAIN = TRUE;
        if (HUEHNER < 0) {
            GAME_OVER = TRUE
        } else {
            CALIBRATE()
        };
        while (KEYPRESSED) {
            CH = READKEY
        };
    }

    function VORWAERTS_MARSCH() {
        var I, P = new INTEGER();
        var POWER_RANGERS_MEGA_ZORD_POWER = new Array();
        SPLAT = FALSE;
        for (I = 0; I <= 5; I++) {
            POWER_RANGERS_MEGA_ZORD_POWER[I] = FALSE
        };
        for (I = 0; I <= MAX_AUTOS; I++) {
            GOTOXY(AUTOS[I].X, AUTOS[I].Y);
            WRITE(' ');
            TURBO_POWER[AUTOS[I].Y][AUTOS[I].X] = FALSE;
            AUTOS[I].X = AUTOS[I].X - 1;
            if (AUTOS[I].X < LEFT) {
                do {
                    P = RANDOM(6);
                } while (!(!POWER_RANGERS_MEGA_ZORD_POWER[P]));;
                POWER_RANGERS_MEGA_ZORD_POWER[P] = TRUE;
                AUTOS[I].X = RIGHT - 1;
                AUTOS[I].Y = BOTTOM - 1 - P;
                AUTOS[I].COLOR = RAND;
                if (AUTOS[I].COLOR = OPTIONS.BACK) {
                    AUTOS[I].COLOR = BLACK
                };
                if (RAINBOW) {
                    AUTOS[I].COLOR = -1
                };
            };
            GOTOXY(AUTOS[I].X, AUTOS[I].Y);
            if (OPTIONS.COLOR && COLOR) {
                if (AUTOS[I].COLOR != -1) {
                    TEXTCOLOR(AUTOS[I].COLOR)
                } else {
                    TEXTCOLOR(RANDOM(16))
                }
            };
            TURBO_POWER[AUTOS[I].Y][AUTOS[I].X] = TRUE;
            WRITE('*');
            if ((HUHN.X = AUTOS[I].X) && (HUHN.Y = AUTOS[I].Y)) {
                SPLAT = TRUE
            };
            if (KEY) {
                while (KEYPRESSED) {
                    CH = READKEY
                }
            };
            KEY = FALSE;
        };
        if (SPLAT) {
            TOT()
        };
    }

    function HAEMISCH_LACHEN() {
        var I = new INTEGER();
        if (OPTIONS.COLOR && COLOR) {
            TEXTCOLOR(4)
        };
        for (I = 500; I >= 0; I--) {
            GOTOXY(RANDOM(71) + 1, RANDOM(24) + 1);
            WAIT(I / 50 + 3);
            WRITE('GAME OVER!');
        };
        WAIT(500);
        INVERSE_OFF();
    }
    INVERSE_ON();
    CENTERED(25, '                               Bitte warten...                                 ');
    PRESENT_DELAY = START_DELAY;
    FAC = 500;
    CALIBRATE();
    GOTOXY(47, 25);
    WRITE('OK.');
    INVERSE_OFF();
    CLRSCR();
    INIT();
    do {
        INIT2();
        do {
            WAIT(PRESENT_DELAY);
            GOTOXY(HUHN.X, HUHN.Y);
            WRITE(' ');
            if (KEYPRESSED) {
                KEY = TRUE;
                CH = READKEY;
                switch (CH) {
                case '\0':
                    CH = READKEY;
                    switch (CH) {
                    case 'K':
                        DEC(HUHN.X)
                        break;
                    case 'P':
                        INC(HUHN.Y)
                        break;
                    case 'M':
                        INC(HUHN.X)
                        break;
                    case 'H':
                        DEC(HUHN.Y)
                        break;
                    };

                    break;
                case ' ':
                    INVERSE_ON();
                    CENTERED(25, '***PAUSE***');
                    CH = READKEY;
                    GOTOXY(21, 25);
                    WRITE('Warum ging das Huhn ?ber die Autobahn?');
                    INVERSE_OFF();

                    break;
                case '\x19':
                    INVERSE_ON();
                    CENTERED(25, 'Wollen Sie das Spiel wirklich beenden[J/N]?');
                    do {
                        C = READKEY;
                    } while (!(C in ['J', 'j', 'N', 'n', CHR(27), CHR(13)]));;
                    if (C in ['J', 'j', CHR(13)]) {
                        START_AGAIN = TRUE;
                        GAME_OVER = TRUE;
                    };
                    CENTERED(25, 'Warum ging das Huhn ?ber die Autobahn?');
                    INVERSE_OFF();

                    break;
                };
            };
            if (HUHN.X < LEFT) {
                INC(HUHN.X)
            };
            if (HUHN.X >= RIGHT) {
                DEC(HUHN.X)
            };
            if (HUHN.Y > BOTTOM) {
                DEC(HUHN.Y)
            };
            if (HUHN.Y < TOP) {
                GESCHAFFT()
            };
            GOTOXY(HUHN.X, HUHN.Y);
            INVERSE_OFF();
            WRITE('#');
            VORWAERTS_MARSCH();
            INVERSE_OFF();
            BONUS2 = MAX(BONUS2 - REDUCTION, 0);
            GOTOXY(RIGHT - 4, BOTTOM + 3);
            WRITE(BONUS2, '     ');
        } while (!(START_AGAIN));;
    } while (!(GAME_OVER));;
    HAEMISCH_LACHEN();
    CLRSCR();
    PUT_IN_HIGHSCORE(SCORE, LEVL);
}

function INFO() {
    var I = new INTEGER();
    GOTOXY(33, 7);
    WRITE(' ÉÍÍÍÍÍÍÍÍÍ» ');
    GOTOXY(17, 8);
    WRITE('ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹ Info... ÌÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(17, 9);
    WRITE('º                ÈÍÍÍÍÍÍÍÍÍ¼                 º');
    GOTOXY(17, 10);
    WRITE('º   Warum ging das Huhn ?ber die Autobahn?   º');
    GOTOXY(17, 11);
    WRITE('º             Version 2.2 f?r PC             º');
    GOTOXY(17, 12);
    WRITE('º                                            º');
    GOTOXY(17, 13);
    WRITE('º               "Ui, bunt!" -- Simon Bichler º');
    GOTOXY(17, 14);
    WRITE('º                                            º');
    GOTOXY(17, 15);
    WRITE('º        (c) 1999 by Bl”k!Interactive        º');
    GOTOXY(17, 16);
    WRITE('º            Megatrend Gamesystems           º');
    GOTOXY(17, 17);
    WRITE('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste dr?cken ***');
    INVERSE_OFF();
    I = 999;
    do {
        COLO_SCREEN[I].ATTR = COLO_SCREEN[I].ATTR / 16 * 16 + RANDOM(16);
        I = (I - 997) % 4 + 998;
    } while (!(KEYPRESSED));;
    C = READKEY;
    if (C = CHR(0)) {
        C = READKEY
    };
}

function EASTER_EGG() {
    var I = new INTEGER();
    GOTOXY(14, 7);
    WRITE('                    ÉÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(14, 8);
    WRITE('ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹ Das Huhn ÌÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(14, 9);
    WRITE('º                   ÈÍÍÍÍÍÍÍÍÍÍ¼                    º');
    GOTOXY(14, 10);
    WRITE('º   In der Bahnhofshalle, die nicht f?r es gebaut,  º');
    GOTOXY(14, 11);
    WRITE('º                   geht ein Huhn                   º');
    GOTOXY(14, 12);
    WRITE('º                   hin und her...                  º');
    GOTOXY(14, 13);
    WRITE('º       Wo, wo ist der Herr Stationsvorsteh''r?      º');
    GOTOXY(14, 14);
    WRITE('º                   Wird dem Huhn                   º');
    GOTOXY(14, 15);
    WRITE('º                  man nichts tun?                  º');
    GOTOXY(14, 16);
    WRITE('º         Hoffen wir es! Sagen wir es laut:         º');
    GOTOXY(14, 17);
    WRITE('º          daá ihm unsere Sympathie geh”rt,         º');
    GOTOXY(14, 18);
    WRITE('º       selbst an dieser St„tte, wo es ''st”rt''!     º');
    GOTOXY(14, 19);
    WRITE('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste dr?cken ***');
    INVERSE_OFF();
    C = READKEY;
    if (C = CHR(0)) {
        C = READKEY
    };
}

function SETUP_OPTIONS() {
    var I, POS = new INTEGER();
    var OUT = new BOOLEAN();
    var NEW_OPTIONS = new OPTION_TYPE();

    function WRITE_MENU(P) {
        switch (P) {
        case 0:
            GOTOXY(30, 9);
            if (!COLOR) {
                LOWVIDEO()
            };
            WRITE(' [ ] Bunte Autos    ');
            GOTOXY(32, 9);
            if (NEW_OPTIONS.COLOR) {
                WRITE('X')
            };
            CENTERED(25, 'Schaltet die Option ''Bunte Autos'' ein und aus');
            HIGHVIDEO();

            break;
        case 1:
            GOTOXY(30, 10);
            WRITE(' [ ] Ger„usche      ');
            GOTOXY(32, 10);
            if (NEW_OPTIONS.BEEP) {
                WRITE('X')
            };
            CENTERED(25, 'Schaltet die Ger„uschuntermalung ein und aus');

            break;
        case 2:
            GOTOXY(30, 16);
            if (!COLOR) {
                LOWVIDEO()
            };
            WRITE(' Textfarbe..        ');
            CENTERED(25, 'Schaltet die Textfarbe um (Siehe Farb-Beispiel)');
            HIGHVIDEO();

            break;
        case 3:
            GOTOXY(30, 17);
            if (!COLOR) {
                LOWVIDEO()
            };
            WRITE(' Hintergrundfarbe.. ');
            CENTERED(25, 'Schaltet die Hintergrundfarbe um (Siehe Farb-Beispiel)');
            HIGHVIDEO();

            break;
        case 4:
            GOTOXY(31, 19);
            WRITE(' OK ');
            CENTERED(25, 'Verl„át diesen Dialog und ?bernimmt die Optionen');

            break;
        case 5:
            GOTOXY(39, 19);
            WRITE(' Abbrechen ');
            CENTERED(25, 'Verl„át diesen Dialog, ohne die Optionen zu ?bernehmen');

            break;
        };
    }

    function WRITE_TEXT() {
        if (COLOR) {
            TEXTCOLOR(NEW_OPTIONS.TEXT);
            TEXTBACKGROUND(NEW_OPTIONS.BACK);
        } else {
            INVERSE_OFF()
        };
        GOTOXY(31, 13);
        WRITE(' M„„„„„„„„„„„„hh! ');
        GOTOXY(31, 14);
        WRITE(' Bl””””””””””””k! ');
        INVERSE_OFF();
    }

    function SWITCH_COLOR() {
        if (COLOR) {
            NEW_OPTIONS.COLOR = !NEW_OPTIONS.COLOR;
            GOTOXY(32, 9);
            if (!COLOR) {
                LOWVIDEO()
            };
            if (NEW_OPTIONS.COLOR) {
                WRITE('X')
            } else {
                WRITE(' ')
            };
            HIGHVIDEO();
        };
    }

    function SWITCH_BEEP() {
        NEW_OPTIONS.BEEP = !NEW_OPTIONS.BEEP;
        GOTOXY(32, 10);
        if (NEW_OPTIONS.COLOR) {
            WRITE('X')
        } else {
            WRITE(' ')
        };
    }

    function CYCLE_TEXT() {
        if (COLOR) {
            NEW_OPTIONS.TEXT = (NEW_OPTIONS.TEXT + 1) % 16;
            TEXTCOLOR(NEW_OPTIONS.TEXT);
            WRITE_TEXT();
        };
    }

    function CYCLE_BACK() {
        if (COLOR) {
            NEW_OPTIONS.BACK = (NEW_OPTIONS.BACK + 1) % 8;
            TEXTBACKGROUND(NEW_OPTIONS.BACK);
            WRITE_TEXT();
        };
    }
    POS = 0;
    NEW_OPTIONS = OPTIONS;
    do {
        CLRSCR();
        GOTOXY(33, 5);
        WRITE(' ÉÍÍÍÍÍÍÍÍÍÍ» ');
        GOTOXY(28, 6);
        WRITE('ÉÍÍÍÍÍ¹ Optionen ÌÍÍÍÍÍ»');
        GOTOXY(28, 7);
        WRITE('º     ÈÍÍÍÍÍÍÍÍÍÍ¼     º');
        GOTOXY(28, 8);
        WRITE('ÌÍÍÍÍÍÍAllgemeinÍÍÍÍÍÍÍ¹');
        GOTOXY(28, 9);
        WRITE('º  [ ] Bunte Autos     º');
        GOTOXY(28, 10);
        WRITE('º  [ ] Piepton         º');
        GOTOXY(28, 11);
        WRITE('ÌÍÍÍÍÍÍÍÍFarbenÍÍÍÍÍÍÍÍ¹');
        GOTOXY(28, 12);
        WRITE('º                      º');
        GOTOXY(28, 13);
        WRITE('º                      º');
        GOTOXY(28, 14);
        WRITE('º                      º');
        GOTOXY(28, 15);
        WRITE('º                      º');
        GOTOXY(28, 16);
        WRITE('º  Textfarbe..         º');
        GOTOXY(28, 17);
        WRITE('º  Hintergrundfarbe..  º');
        GOTOXY(28, 18);
        WRITE('º                      º');
        GOTOXY(28, 19);
        WRITE('º   OK      Abbrechen  º');
        GOTOXY(28, 20);
        WRITE('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
        for (I = 0; I <= 5; I++) {
            WRITE_MENU(I)
        };
        INVERSE_ON();
        WRITE_MENU(POS);
        INVERSE_OFF();
        WRITE_TEXT();
        do {
            C = READKEY;
            WRITE_MENU(POS);
            if (C = CHR(0)) {
                C = READKEY;
                if (C = 'P') {
                    POS = (POS + 1) % 6
                };
                if (C = 'H') {
                    POS = (POS + 5) % 6
                };
            };
            INVERSE_ON();
            WRITE_MENU(POS);
            INVERSE_OFF();
        } while (!((C = CHR(13)) || (C = CHR(27))));;
        if (C = CHR(27)) {
            POS = 5
        };
        switch (POS) {
        case 0:
            SWITCH_COLOR()
            break;
        case 1:
            SWITCH_BEEP()
            break;
        case 2:
            CYCLE_TEXT()
            break;
        case 3:
            CYCLE_BACK()
            break;
        case 4:
            OUT = TRUE
            break;
        };
    } while (!(OUT));;
    if (POS = 4) {
        OPTIONS = NEW_OPTIONS;
        CHANGED = TRUE;
    };
}

function WRITE_MENU(P) {
    switch (P) {
    case 0:
        GOTOXY(32, 10);
        WRITELN(' Info...       ');
        CENTERED(25, 'Informationen ?ber dieses bescheuerte Spiel');

        break;
    case 1:
        GOTOXY(32, 11);
        WRITELN(' Neues Spiel   ');
        CENTERED(25, 'Beginnt ein neues Spiel');

        break;
    case 2:
        GOTOXY(32, 12);
        WRITELN(' Highscores... ');
        CENTERED(25, 'Zeigt die aktuellen Highscores an');

        break;
    case 3:
        GOTOXY(32, 13);
        WRITELN(' Optionen...   ');
        CENTERED(25, 'Stellt diverse Optionen ein');

        break;
    case 4:
        GOTOXY(32, 14);
        WRITELN(' Ende          ');
        CENTERED(25, 'Beendet das Programm');

        break;
    };
}
OLD_MODE = LASTMODE;
COLOR = COLOR_SCREEN;
CURSOR_OFF();
CHECKBREAK = FALSE;
OUT = FALSE;
CHANGED = FALSE;
POS = 0;
LEVL = 0;
LOAD_HIGHSCORES_AND_OPTIONS();
INVERSE_OFF();
CLRSCR();
INFO();
do {
    INVERSE_OFF();
    CLRSCR();
    GOTOXY(33, 7);
    WRITE('ÉÍÍÍÍÍÍÍÍÍÍÍ»');
    GOTOXY(30, 8);
    WRITE('ÉÍÍ¹ Hauptmen? ÌÍÍ»');
    GOTOXY(30, 9);
    WRITE('º  ÈÍÍÍÍÍÍÍÍÍÍÍ¼  º');
    GOTOXY(30, 10);
    WRITE('º                 º');
    GOTOXY(30, 11);
    WRITE('º                 º');
    GOTOXY(30, 12);
    WRITE('º                 º');
    GOTOXY(30, 13);
    WRITE('º                 º');
    GOTOXY(30, 14);
    WRITE('º                 º');
    GOTOXY(30, 15);
    WRITE('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
    for (I = 0; I <= 4; I++) {
        WRITE_MENU(I)
    };
    INVERSE_ON();
    WRITE_MENU(POS);
    INVERSE_OFF();
    do {
        C = READKEY;
        WRITE_MENU(POS);
        if (C = CHR(0)) {
            WRITE('!');
            C = READKEY;
            if (C = 'P') {
                POS = (POS + 1) % 5
            };
            if (C = 'H') {
                POS = (POS + 4) % 5
            };
        };
        INVERSE_ON();
        WRITE_MENU(POS);
        INVERSE_OFF();
    } while (!((C = CHR(13)) || (C = CHR(27)) || (C = CHR(10))));;
    if (C = CHR(27)) {
        OUT = TRUE
    } else {
        switch (POS) {
        case 0:
            if (C != CHR(10)) {
                INFO()
            } else {
                EASTER_EGG()
            }
            break;
        case 1:
            NEW_GAME()
            break;
        case 2:
            SHOW_HIGHSCORES()
            break;
        case 3:
            SETUP_OPTIONS()
            break;
        case 4:
            OUT = TRUE
            break;
        }
    };
} while (!(OUT));;
TEXTCOLOR(LIGHTGRAY);
TEXTBACKGROUND(BLACK);
CLRSCR();
if (CHANGED) {
    SAVE_HIGHSCORES_AND_OPTIONS()
};
WRITE('Danke, daá Sie ''Warum ging das Huhn ?ber die Autobahn'' so lange ertragen haben!');
CURSOR_ON();
CHECKBREAK = TRUE;
TEXTMODE(OLD_MODE);
WRITE('Danke, daá Sie ''Warum ging das Huhn ?ber die Autobahn'' so lange ertragen haben!');