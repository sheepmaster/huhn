var main = (function() {
  'use strict';

  /* PROGRAM NAME: TOETE_DAS_HUHN_UND_SPEISE_ES_MIT_EINER_SAFTIGEN_SOSSE */
  var BLACK = 0;
  var LIGHTGRAY = 7;
  var LIGHTGREEN = 10;
  var WHITE = 15;

  function LASTMODE() {}
  var COLOR_SCREEN = true;

  function CHR(c) {
    return String.fromCharCode(c);
  }
  function ROUND(x) {
    return Math.round(x);
  }

  function RANDOMIZE() {}

  function LENGTH(s) {
    return s.length;
  }
  function CONCAT(a, b) {
    return a + b;
  }
  function DELETE(str, pos, length) {
    return str.substr(0, pos - 1) + str.substr(pos - 1 + length);
  }

  function RANDOM(a) {
    if (typeof a == 'undefined') {
      return Math.random();
    } else {
      return Math.floor(Math.random() * a);
    }
  }

  function update(o, properties) {
    for (var key in properties) {
      if (properties.hasOwnProperty(key)) {
        if (typeof properties[key] == 'object') {
          update(o[key], properties[key]);
        } else {
          o[key] = properties[key];
        }
      }
    }
  }

  var MAX_ENTRIES = 9;
  var ONE = 1;
  function ENTRY_TYPE() {
  }
  ENTRY_TYPE.prototype = {
    NAME: null,
    LVL: null,
    SCOR: null
  };
  function HIGHSCORE_TYPE() {
    for (var i = 0; i <= MAX_ENTRIES; i++) {
      this.push(new ENTRY_TYPE());
    }
  }
  HIGHSCORE_TYPE.prototype = new Array();
  function OPTION_TYPE() {
  }
  OPTION_TYPE.prototype = {
    TEXT: null,
    BACK: null,
    BEEP: null,
    COLOR: null
  };
  function OPTIONS_TYPE() {
    this.OPTIONS = new OPTION_TYPE();
    this.HIGHSCORES = new HIGHSCORE_TYPE();
  }
  var I, POS, LEVL;
  var OLD_MODE;
  var C;
  var OUT, CHANGED;
  var COLOR;
  var HIGHSCORES = new HIGHSCORE_TYPE();
  var OPTIONS = new OPTION_TYPE();

  function INVERSE_ON() {
    TEXTCOLOR(BLACK);
    if (COLOR) {
      TEXTBACKGROUND(7);
    } else {
      TEXTBACKGROUND(WHITE);
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

  function CENTERED(L, S) {
    GOTOXY(1, L);
    CLREOL();
    GOTOXY((80 - LENGTH(S)) / 2, L);
    WRITE(S);
  }

  async function READ_IN(ST) {
    var C;
    var S;
    CURSOR_ON();
    S = ST;
    WRITE(S);
    do {
      C = await READKEY();
      var accepted_keys = {};
      var start = (' ').charCodeAt(0);
      var end = ('{').charCodeAt(0);
      for (var i = start; i <= end; i++) {
        accepted_keys[String.fromCharCode(i)] = true;
      }
      ['Ä', 'Ö', 'Ü', 'ä', 'ö', 'ü'].forEach(function(c) {
        accepted_keys[c] = true;
      });
      if (accepted_keys[C] && (LENGTH(S) < 20)) {
        S = CONCAT(S, C);
        WRITE(C);
      }
      if ((C == CHR(8)) && (LENGTH(S) > 0)) {
        S = DELETE(S, LENGTH(S), 1);
        WRITE(CHR(8), ' ', CHR(8));
      }
      if (C == CHR(0)) {
        C = await READKEY();
      }
    } while (!(C == CHR(13) || C == CHR(27)));
    if (C == CHR(13)) {
      ST = S;
    } else {
      ST = '';
    };
    CURSOR_OFF();
    return ST;
  }

  function WRITE_HIGHSCORES(HIGHSCORES) {
    GOTOXY(33, 4);
    WRITE('╔════════════╗');
    GOTOXY(20, 5);
    WRITE('╔════════════╣ Highscores ╠═══════════╗');
    GOTOXY(20, 6);
    WRITE('║            ╚════════════╝           ║');
    GOTOXY(20, 7);
    WRITE('║ Platz Name             Level Punkte ║');
    GOTOXY(20, 8);
    WRITE('║                                     ║');
    GOTOXY(20, 9);
    WRITE('║                                     ║');
    GOTOXY(20, 10);
    WRITE('║                                     ║');
    GOTOXY(20, 11);
    WRITE('║                                     ║');
    GOTOXY(20, 12);
    WRITE('║                                     ║');
    GOTOXY(20, 13);
    WRITE('║                                     ║');
    GOTOXY(20, 14);
    WRITE('║                                     ║');
    GOTOXY(20, 15);
    WRITE('║                                     ║');
    GOTOXY(20, 16);
    WRITE('║                                     ║');
    GOTOXY(20, 17);
    WRITE('║                                     ║');
    GOTOXY(20, 18);
    WRITE('║                                     ║');
    GOTOXY(20, 19);
    WRITE('╚═════════════════════════════════════╝');
    for (I = 0; I <= MAX_ENTRIES; I++) {
      GOTOXY(22, 9 + I);
      WRITE((I + 1), '.');
      GOTOXY(26, 9 + I);
      WRITE(HIGHSCORES[I].NAME);
      GOTOXY(47, 9 + I);
      WRITE(HIGHSCORES[I].LVL);
      GOTOXY(50, 9 + I);
      WRITE(HIGHSCORES[I].SCOR);
    };
  }

  async function SHOW_HIGHSCORES() {
    var I;
    WRITE_HIGHSCORES(HIGHSCORES);
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste drücken ***');
    SAVE_HIGHSCORES_AND_OPTIONS();
    INVERSE_OFF();
    I = 1;
    // if (LEVL >= 35) {
    //   do {
    //     COLO_SCREEN[I].ATTR = COLO_SCREEN[I].ATTR / 16 * 16 + RANDOM(16);
    //     I = I % 2000 + 1;
    //   } while (!KEYPRESSED());
    // }
    C = await READKEY();
    if (C == CHR(0))
      C = await READKEY();

    LEVL = 0;
  }

  async function PUT_IN_HIGHSCORE(SCOR, LVL) {
    var I, J;
    var NAME;
    var NEWHIGHSCORES = new HIGHSCORE_TYPE();
    update(NEWHIGHSCORES, HIGHSCORES);
    I = 0;
    while ((NEWHIGHSCORES[I].SCOR > SCOR) && (I < MAX_ENTRIES)) {
      I = I + 1;
    }
    if (NEWHIGHSCORES[I].SCOR <= SCOR) {
      for (J = MAX_ENTRIES; J >= I + 1; J--) {
        update(NEWHIGHSCORES[J], NEWHIGHSCORES[J - 1]);
      }
      NEWHIGHSCORES[I].LVL = LVL;
      NEWHIGHSCORES[I].SCOR = SCOR;
      NAME = 'Anonymous';
      INVERSE_OFF();
      WRITE_HIGHSCORES(NEWHIGHSCORES);
      INVERSE_ON();
      CENTERED(25, 'Bitte geben Sie nun Ihren Namen ein oder drücken sie [Esc], um abzubrechen');
      INVERSE_OFF();
      GOTOXY(26, 9 + I);
      WRITE('                    ');
      GOTOXY(26, 9 + I);
      NAME = await READ_IN(NAME);
      NEWHIGHSCORES[I].NAME = NAME;
      if (NAME != '') {
        update(HIGHSCORES, NEWHIGHSCORES);
        CHANGED = true;
      }
      await SHOW_HIGHSCORES();
    }
  }

  function LOAD_HIGHSCORES_AND_OPTIONS() {
    // var HI_FILE_TYPE = function() {};
    // var F = new HI_FILE_TYPE();
    var RED = new OPTIONS_TYPE();
    // ASSIGN(F, 'HUHN.HI');
    // RESET(F);
    // READ(F, RED);
    // CLOSE(F);
    var IORESULT = -1;
    if (window.localStorage.getItem('HUHN.HI')) {
      update(RED, JSON.parse(window.localStorage.getItem('HUHN.HI')));
      IORESULT = 0;
    }
    if (IORESULT != 0) {
      for (I = 1; I <= MAX_ENTRIES; I++) {
        HIGHSCORES[I].NAME = 'Anonymous';
        HIGHSCORES[I].LVL = 1;
        HIGHSCORES[I].SCOR = 10000;
      };
      HIGHSCORES[0].NAME = 'Sheepmaster';
      HIGHSCORES[0].LVL = 55;
      HIGHSCORES[0].SCOR = 632650;
      OPTIONS.COLOR = true;
      OPTIONS.BEEP = true;
      OPTIONS.TEXT = LIGHTGREEN;
      OPTIONS.BACK = BLACK;
    } else {
      update(HIGHSCORES, RED.HIGHSCORES);
      update(OPTIONS, RED.OPTIONS);
    };
  }

  function SAVE_HIGHSCORES_AND_OPTIONS() {
    var R;
    var WRITTEN = new OPTIONS_TYPE();
    WRITTEN.HIGHSCORES = HIGHSCORES;
    WRITTEN.OPTIONS = OPTIONS;
    window.localStorage.setItem('HUHN.HI', JSON.stringify(WRITTEN));
    R = 0;
    if (R != 0) {
      WRITELN('Fehler beim Schreiben der Datei \'HUHN.HI\'!');
      WRITELN('Fehlernr.: ', R);
    }
  }

  async function NEW_GAME() {
    var MAX_AUTOS = 30;
    var START_DELAY = 110;
    var SPEED_FACTOR = .977;
    var TOP = 10;
    var BOTTOM = 16;
    var LEFT = 24;
    var RIGHT = 56;
    var START_BONUS = 10000;
    var REDUCTION = 50;
    var PROBS = [.01, .0, 7.5, 2.5, 1.0, 9.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.5, 1.0, 1.0, 2.5, 2.5, 7.5, .0, .0, .0, .0, .001];
    var PROBSUM = 42.011;
    function COORD() {
    }
    COORD.prototype = {
      X: null,
      Y: null,
      COLOR: null
    };
    function AUTO_TYP() {
      for (var i = 0; i <= MAX_AUTOS; i++) {
        this.push(new COORD());
      }
    }
    AUTO_TYP.prototype = new Array();
    var START_AGAIN, GAME_OVER, RAINBOW, SPLAT, KEY;
    var I, HUEHNER, PRESENT_DELAY, BONUS, BONUS2, WAIT_DELAY, FAC;
    var SCORE;
    var CH;
    var HUHN = new COORD();
    var AUTOS = new AUTO_TYP();
    var TURBO_POWER = [];
    for (var i = TOP; i <= BOTTOM; i++) {
      TURBO_POWER.push(new Array(RIGHT - LEFT + 1));
    }

    function MAX(A, B) {
      if (A > B) {
        return A;
      } else {
        return B;
      }
    }

    function WAIT(MIL) {
      return Promises.timer(MIL);
      // var I, J = new Number();
      // var ST, MI, SE, HU = new WORD();
      // var TIME2 = new LONGINT();
      // for (I = 0; I <= FAC * MIL; I++) {
      //     GETTIME(ST, MI, SE, HU);
      //     TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
      //     J++;
      // }
    }

    function CALIBRATE() {
      return Promises.timer(PRESENT_DELAY * 10);
      // var ST, MI, SE, HU = new WORD();
      // var TIME, TIME2, INT = new LONGINT();
      // INT = 0;
      // GETTIME(ST, MI, SE, HU);
      // TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
      // do {
      //     GETTIME(ST, MI, SE, HU);
      //     TIME = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
      // } while (!TIME2 != TIME);
      // do {
      //     GETTIME(ST, MI, SE, HU);
      //     TIME2 = ((ONE * ST * 60 + MI) * 60 + SE) * 100 + HU;
      //     INT++;
      // } while (!(TIME2 >= TIME + PRESENT_DELAY) || (TIME2 < TIME));
      // FAC = INT / (PRESENT_DELAY * 10);
    }

    function BEEP() {
      // SOUND(880);
      // WAIT(200);
      // NOSOUND();
    }

    function RAND() {
      var I;
      var R, N;
      R = RANDOM() * PROBSUM;
      I = -1;
      N = 0;
      do {
        N = N + PROBS[I + 1];
        I++;
      } while ((I != 21) && (N < R));
      if (I - 1 == OPTIONS.BACK) {
        return 0;
      } else {
        return I - 1;
      }
    }

    function INIT() {
      var I, J;
      for (J = TOP; J <= BOTTOM; J++) {
        for (I = LEFT; I <= RIGHT; I++) {
          TURBO_POWER[J - TOP][I - LEFT] = false;
        }
      }
      CENTERED(1, 'Warum ging das Huhn über die Autobahn?');
      CENTERED(2, '© 1999 by Blök!Interactive Megatrend Gamesystems');
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
      CENTERED(25, 'Warum ging das Huhn über die Autobahn?');
      INVERSE_OFF();
      RANDOMIZE();
      for (I = 0; I <= MAX_AUTOS; I++) {
        update(AUTOS[I], {
          X: LEFT + RANDOM(RIGHT - LEFT),
          Y: TOP + RANDOM(BOTTOM - TOP),
          COLOR: RAND()
        });
        if (AUTOS[I].COLOR == OPTIONS.BACK) {
          AUTOS[I].COLOR = BLACK;
        }
        GOTOXY(AUTOS[I].X, AUTOS[I].Y);
        if (OPTIONS.COLOR && COLOR) {
          TEXTCOLOR(AUTOS[I].COLOR);
        };
        WRITE('*');
      }
      LEVL = 1;
      HUEHNER = 3;
      PRESENT_DELAY = START_DELAY;
      GAME_OVER = false;
      RAINBOW = false;
      SCORE = 0;
      BONUS2 = START_BONUS;
    }

    function INIT2() {
      INVERSE_OFF();
      START_AGAIN = false;
      HUHN.X = (RIGHT + LEFT) / 2;
      HUHN.Y = BOTTOM;
      BONUS = 200 * LEVL;
      GOTOXY(LEFT, TOP - 3);
      WRITE('Level: ', LEVL);
      GOTOXY(RIGHT - 4, TOP - 3);
      if (HUEHNER < 10) {
        WRITE(' ');
      }
      WRITE('#x', HUEHNER, '    ');
      GOTOXY(LEFT, BOTTOM + 3);
      WRITE(SCORE);
      GOTOXY(RIGHT - 4, BOTTOM + 3);
      WRITE(BONUS2);
      GOTOXY((RIGHT + LEFT) / 2 - 3, BOTTOM + 3);
      WRITE(BONUS);
    }

    async function GESCHAFFT() {
      var I;
      PRESENT_DELAY = ROUND(PRESENT_DELAY * SPEED_FACTOR);
      LEVL++;
      HUEHNER++;
      START_AGAIN = true;
      SCORE = SCORE + BONUS + BONUS2;
      BONUS2 = START_BONUS;
      INVERSE_ON();
      if (LEVL != 35) {
        CENTERED(25, 'YOAHEEH!')
      } else {
        CENTERED(25, 'UI, BUNT!');
        RAINBOW = true;
      }
      GOTOXY(HUHN.X, HUHN.Y);
      INVERSE_OFF();
      WRITE('#');
      await CALIBRATE();
      WRITE(CHR(8), ' ');
      HUHN.X = (RIGHT + LEFT) / 2;
      HUHN.Y = BOTTOM;
    }

    async function TOT() {
      if (OPTIONS.BEEP) {
        BEEP();
      }
      INVERSE_ON();
      CENTERED(25, 'HAA HAA!');
      INVERSE_OFF();
      HUEHNER = HUEHNER - 1;
      START_AGAIN = true;
      if (HUEHNER < 0) {
        GAME_OVER = true;
      } else {
        await CALIBRATE();
      }
      while (KEYPRESSED())
        READKEY();
    }

    async function VORWAERTS_MARSCH() {
      var I, P;
      var POWER_RANGERS_MEGA_ZORD_POWER = new Array();
      SPLAT = false;
      for (I = 0; I <= 5; I++) {
        POWER_RANGERS_MEGA_ZORD_POWER[I] = false;
      }
      for (I = 0; I <= MAX_AUTOS; I++) {
        GOTOXY(AUTOS[I].X, AUTOS[I].Y);
        WRITE(' ');
        TURBO_POWER[AUTOS[I].Y - TOP][AUTOS[I].X - LEFT] = false;
        AUTOS[I].X = AUTOS[I].X - 1;
        if (AUTOS[I].X < LEFT) {
          do {
            P = RANDOM(6);
          } while (POWER_RANGERS_MEGA_ZORD_POWER[P]);
          POWER_RANGERS_MEGA_ZORD_POWER[P] = true;
          AUTOS[I].X = RIGHT - 1;
          AUTOS[I].Y = BOTTOM - 1 - P;
          AUTOS[I].COLOR = RAND();
          if (AUTOS[I].COLOR == OPTIONS.BACK) {
            AUTOS[I].COLOR = BLACK;
          }
          if (RAINBOW) {
            AUTOS[I].COLOR = -1;
          }
        }
        GOTOXY(AUTOS[I].X, AUTOS[I].Y);
        if (OPTIONS.COLOR && COLOR) {
          if (AUTOS[I].COLOR != -1) {
            TEXTCOLOR(AUTOS[I].COLOR);
          } else {
            TEXTCOLOR(RANDOM(16));
          }
        }
        TURBO_POWER[AUTOS[I].Y - TOP][AUTOS[I].X - LEFT] = true;
        WRITE('*');
        if ((HUHN.X == AUTOS[I].X) && (HUHN.Y == AUTOS[I].Y)) {
          SPLAT = true;
        }
        if (KEY) {
          while (KEYPRESSED()) {
            READKEY();
          }
        }
        KEY = false;
      }
      if (SPLAT)
        await TOT();
    }

    async function HAEMISCH_LACHEN() {
      var I;
      if (OPTIONS.COLOR && COLOR) {
        TEXTCOLOR(4);
      }
      I = 500;
      do {
        GOTOXY(RANDOM(71) + 1, RANDOM(24) + 1);
        await WAIT(I / 50 + 3);
        WRITE('GAME OVER!');
        I--;
      } while (I >= 0);
      await WAIT(500);
      INVERSE_OFF();
    }

    INVERSE_ON();
    CENTERED(25, '                               Bitte warten...                                 ');
    PRESENT_DELAY = START_DELAY;
    FAC = 500;
    await CALIBRATE();
    GOTOXY(47, 25);
    WRITE('OK.');
    INVERSE_OFF();
    CLRSCR();
    INIT();
    do {
      INIT2();
      do {
        await WAIT(PRESENT_DELAY);
        GOTOXY(HUHN.X, HUHN.Y);
        WRITE(' ');
        if (KEYPRESSED()) {
          KEY = true;
          CH = await READKEY();
          switch (CH) {
            case '\0':
              CH = await READKEY();
              switch (CH) {
                case 'K':
                  HUHN.X--;
                  break;
                case 'P':
                  HUHN.Y++;
                  break;
                case 'M':
                  HUHN.X++;
                  break;
                case 'H':
                  HUHN.Y--;
                  break;
              }
              break;
            case ' ':
              INVERSE_ON();
              CENTERED(25, '***PAUSE***');
              CH = await READKEY();
              GOTOXY(21, 25);
              WRITE('Warum ging das Huhn über die Autobahn?');
              INVERSE_OFF();
              break;
            case '\x1B':  // #27
              INVERSE_ON();
              CENTERED(25, 'Wollen Sie das Spiel wirklich beenden[J/N]?');
              do {
                C = await READKEY();
                var keys = {
                  'J': true,
                  'j': true,
                  'N': false,
                  'n': false,
                  '\x1B': false,  // CHR(27)
                  '\x0D': true  // CHR(13)
                };
              } while (typeof keys[C] == 'undefined');
              if (keys[C]) {
                START_AGAIN = true;
                GAME_OVER = true;
              }
              CENTERED(25, 'Warum ging das Huhn \u00FCber die Autobahn?');
              INVERSE_OFF();
              break;
          }
        }
        if (HUHN.X < LEFT) {
          HUHN.X++;
        }
        if (HUHN.X >= RIGHT) {
          HUHN.X--;
        }
        if (HUHN.Y > BOTTOM) {
          HUHN.Y--;
        }
        if (HUHN.Y < TOP) {
          await GESCHAFFT();
        }
        GOTOXY(HUHN.X, HUHN.Y);
        INVERSE_OFF();
        WRITE('#');
        await VORWAERTS_MARSCH();
        INVERSE_OFF();
        BONUS2 = MAX(BONUS2 - REDUCTION, 0);
        GOTOXY(RIGHT - 4, BOTTOM + 3);
        WRITE(BONUS2, '     ');
      } while (!START_AGAIN);
    } while (!GAME_OVER);
    await HAEMISCH_LACHEN();
    CLRSCR();
    await PUT_IN_HIGHSCORE(SCORE, LEVL);
  }

  async function INFO() {
    var I;
    GOTOXY(33, 7);
    WRITE(' ╔═════════╗ ');
    GOTOXY(17, 8);
    WRITE('╔════════════════╣ Info... ╠═════════════════╗');
    GOTOXY(17, 9);
    WRITE('║                ╚═════════╝                 ║');
    GOTOXY(17, 10);
    WRITE('║   Warum ging das Huhn über die Autobahn?   ║');
    GOTOXY(17, 11);
    WRITE('║             Version 2.2 für PC             ║');
    GOTOXY(17, 12);
    WRITE('║                                            ║');
    GOTOXY(17, 13);
    WRITE('║               "Ui, bunt!" -- Simon Bichler ║');
    GOTOXY(17, 14);
    WRITE('║                                            ║');
    GOTOXY(17, 15);
    WRITE('║        (c) 1999 by Blök!Interactive        ║');
    GOTOXY(17, 16);
    WRITE('║            Megatrend Gamesystems           ║');
    GOTOXY(17, 17);
    WRITE('╚════════════════════════════════════════════╝');
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste drücken ***');
    INVERSE_OFF();
    I = 999;
    do {
      setColoScreenAttr(I, RANDOM(16));
      I = (I - 997) % 4 + 998;
      await Promises.animationFrame();
    } while (!KEYPRESSED());
    C = await READKEY();
    if (C == CHR(0)) C = await READKEY();
  }

  async function EASTER_EGG() {
    var I;
    GOTOXY(14, 7);  WRITE('                    ╔══════════╗');
    GOTOXY(14, 8);  WRITE('╔═══════════════════╣ Das Huhn ╠════════════════════╗');
    GOTOXY(14, 9);  WRITE('║                   ╚══════════╝                    ║');
    GOTOXY(14, 10); WRITE('║   In der Bahnhofshalle, die nicht für es gebaut,  ║');
    GOTOXY(14, 11); WRITE('║                   geht ein Huhn                   ║');
    GOTOXY(14, 12); WRITE('║                   hin und her...                  ║');
    GOTOXY(14, 13); WRITE('║       Wo, wo ist der Herr Stationsvorsteh\'r?      ║');
    GOTOXY(14, 14); WRITE('║                   Wird dem Huhn                   ║');
    GOTOXY(14, 15); WRITE('║                  man nichts tun?                  ║');
    GOTOXY(14, 16); WRITE('║         Hoffen wir es! Sagen wir es laut:         ║');
    GOTOXY(14, 17); WRITE('║          daß ihm unsere Sympathie gehört,         ║');
    GOTOXY(14, 18); WRITE('║       selbst an dieser Stätte, wo es \'stört\'!     ║');
    GOTOXY(14, 19); WRITE('╚═══════════════════════════════════════════════════╝');
    INVERSE_ON();
    CENTERED(25, '*** Bitte Taste drücken ***');
    INVERSE_OFF();
    C = await READKEY();
    if (C == CHR(0)) C = await READKEY();
  }

  async function SETUP_OPTIONS() {
    var I, POS;
    var OUT;
    var NEW_OPTIONS = new OPTION_TYPE();

    function WRITE_MENU(P) {
      switch (P) {
      case 0:
        GOTOXY(30, 9);
        if (!COLOR) LOWVIDEO(); WRITE(' [ ] Bunte Autos    ');
        GOTOXY(32, 9);
        if (NEW_OPTIONS.COLOR) WRITE('X');
        CENTERED(25, 'Schaltet die Option \'Bunte Autos\' ein und aus');
        HIGHVIDEO();

        break;
      case 1:
        GOTOXY(30, 10);
        WRITE(' [ ] Geräusche      ');
        GOTOXY(32, 10);
        if (NEW_OPTIONS.BEEP) {
          WRITE('X')
        };
        CENTERED(25, 'Schaltet die Geräuschuntermalung ein und aus');

        break;
      case 2:
        GOTOXY(30, 16);
        if (!COLOR) {
          LOWVIDEO();
        };
        WRITE(' Textfarbe..        ');
        CENTERED(25, 'Schaltet die Textfarbe um (Siehe Farb-Beispiel)');
        HIGHVIDEO();

        break;
      case 3:
        GOTOXY(30, 17);
        if (!COLOR) {
          LOWVIDEO();
        };
        WRITE(' Hintergrundfarbe.. ');
        CENTERED(25, 'Schaltet die Hintergrundfarbe um (Siehe Farb-Beispiel)');
        HIGHVIDEO();

        break;
      case 4:
        GOTOXY(31, 19);
        WRITE(' OK ');
        CENTERED(25, 'Verläßt diesen Dialog und übernimmt die Optionen');

        break;
      case 5:
        GOTOXY(39, 19);
        WRITE(' Abbrechen ');
        CENTERED(25, 'Verläßt diesen Dialog, ohne die Optionen zu übernehmen');

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
      WRITE(' Määäääääääääähh! ');
      GOTOXY(31, 14);
      WRITE(' Blöööööööööööök! ');
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
    update(NEW_OPTIONS, OPTIONS);
    do {
      CLRSCR();
      GOTOXY(33, 5);
      WRITE(' ╔══════════╗ ');
      GOTOXY(28, 6);
      WRITE('╔═════╣ Optionen ╠═════╗');
      GOTOXY(28, 7);
      WRITE('║     ╚══════════╝     ║');
      GOTOXY(28, 8);
      WRITE('╠══════Allgemein═══════╣');
      GOTOXY(28, 9);
      WRITE('║  [ ] Bunte Autos     ║');
      GOTOXY(28, 10);
      WRITE('║  [ ] Piepton         ║');
      GOTOXY(28, 11);
      WRITE('╠════════Farben════════╣');
      GOTOXY(28, 12);
      WRITE('║                      ║');
      GOTOXY(28, 13);
      WRITE('║                      ║');
      GOTOXY(28, 14);
      WRITE('║                      ║');
      GOTOXY(28, 15);
      WRITE('║                      ║');
      GOTOXY(28, 16);
      WRITE('║  Textfarbe..         ║');
      GOTOXY(28, 17);
      WRITE('║  Hintergrundfarbe..  ║');
      GOTOXY(28, 18);
      WRITE('║                      ║');
      GOTOXY(28, 19);
      WRITE('║   OK      Abbrechen  ║');
      GOTOXY(28, 20);
      WRITE('╚══════════════════════╝');
      for (I = 0; I <= 5; I++) {
        WRITE_MENU(I);
      };
      INVERSE_ON();
      WRITE_MENU(POS);
      INVERSE_OFF();
      WRITE_TEXT();
      do {
        C = await READKEY();
        WRITE_MENU(POS);
        if (C == CHR(0)) {
          C = await READKEY();
          if (C == 'P') {
            POS = (POS + 1) % 6;
          };
          if (C == 'H') {
            POS = (POS + 5) % 6;
          };
        };
        INVERSE_ON();
        WRITE_MENU(POS);
        INVERSE_OFF();
      } while (C != CHR(13) && C != CHR(27));
      if (C == CHR(27)) {
        POS = 5;
      };
      switch (POS) {
      case 0:
        SWITCH_COLOR();
        break;
      case 1:
        SWITCH_BEEP();
        break;
      case 2:
        CYCLE_TEXT();
        break;
      case 3:
        CYCLE_BACK();
        break;
      case 4:
      case 5:
        OUT = true;
        break;
      };
    } while (!OUT);
    if (POS == 4) {
      update(OPTIONS, NEW_OPTIONS);
      CHANGED = true;
    };
  }

  function WRITE_MENU(P) {
    switch (P) {
    case 0:
      GOTOXY(32, 10);
      WRITELN(' Info...       ');
      CENTERED(25, 'Informationen über dieses bescheuerte Spiel');

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

  async function main() {
    OLD_MODE = LASTMODE();
    COLOR = COLOR_SCREEN;
    CURSOR_OFF();
    // CHECKBREAK = false;
    OUT = false;
    CHANGED = false;
    POS = 0;
    LEVL = 0;
    LOAD_HIGHSCORES_AND_OPTIONS();
    INVERSE_OFF();
    CLRSCR();
    await INFO();
    do {
      INVERSE_OFF();
      CLRSCR();
      GOTOXY(33, 7);
      WRITE('╔═══════════╗');
      GOTOXY(30, 8);
      WRITE('╔══╣ Hauptmenü ╠══╗');
      GOTOXY(30, 9);
      WRITE('║  ╚═══════════╝  ║');
      GOTOXY(30, 10);
      WRITE('║                 ║');
      GOTOXY(30, 11);
      WRITE('║                 ║');
      GOTOXY(30, 12);
      WRITE('║                 ║');
      GOTOXY(30, 13);
      WRITE('║                 ║');
      GOTOXY(30, 14);
      WRITE('║                 ║');
      GOTOXY(30, 15);
      WRITE('╚═════════════════╝');
      for (I = 0; I <= 4; I++) {
        WRITE_MENU(I);
      }
      INVERSE_ON();
      WRITE_MENU(POS);
      INVERSE_OFF();
      do {
        C = await READKEY();
        WRITE_MENU(POS);
        if (C == CHR(0)) {
          WRITE('!');
          C = await READKEY();
          if (C == 'P') {
            POS = (POS + 1) % 5;
          }
          if (C == 'H') {
            POS = (POS + 4) % 5;
          }
        }
        INVERSE_ON();
        WRITE_MENU(POS);
        INVERSE_OFF();
      } while (!((C == CHR(13)) || (C == CHR(27)) || (C == CHR(10))));
      if (C == CHR(27)) {
        OUT = true;
      } else {
        switch (POS) {
          case 0:
            if (C != CHR(10)) {
              await INFO();
            } else {
              await EASTER_EGG();
            }
            break;
          case 1:
            await NEW_GAME();
            break;
          case 2:
            await SHOW_HIGHSCORES();
            break;
          case 3:
            await SETUP_OPTIONS();
            break;
          case 4:
            OUT = true;
            break;
          }
      }
    } while (!OUT);
    TEXTCOLOR(LIGHTGRAY);
    TEXTBACKGROUND(BLACK);
    CLRSCR();
    if (CHANGED) {
      SAVE_HIGHSCORES_AND_OPTIONS();
    }
    WRITE('Danke, daß Sie \'Warum ging das Huhn über die Autobahn\' so lange ertragen haben!');
    CURSOR_ON();
    // CHECKBREAK = true;
    // TEXTMODE(OLD_MODE);
    // WRITE('Danke, daß Sie 'Warum ging das Huhn über die Autobahn' so lange ertragen haben!');
  }
  return main;
})();
