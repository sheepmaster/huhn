{OOOOOOK.}
program Toete_das_huhn_und_speise_es_mit_einer_saftigen_sosse;

	uses
		dos, crt, zeug;

	const
		max_entries=9;
		one:longint=1;

	type
		entry_type=record
			name:string;
			lvl:integer;
			scor:longint;
		end;
		highscore_type = array[0..max_entries] of entry_type;
		option_type = record
			text, back: byte;
			beep, color: boolean;
		end;
		options_type = record
			options: option_type;
			highscores: highscore_type;
		end;

	var
		i, pos, levl: integer;
    old_mode:byte;
		c: char;
		out, changed, color: boolean;
		highscores: highscore_type;
    options: option_type;
	
	procedure inverse_on;
	begin
		textcolor(black);
		if color then textbackground(7) {gray}
    else textbackground(white);
	end;

	procedure inverse_off;
	begin
		if color then
			begin
				textcolor(options.text);
				textbackground(options.back);
			end
		else
			begin
				highvideo;
				textbackground(black);
			end;
	end;

	procedure centered(l: integer; s:string);
	begin
		gotoxy(1, l);
		clreol;
		gotoxy((80-length(s))div 2, l);
		write(s);
  end;

	procedure read_in(var st:string);
	var
		c:char;
		s:string;
	begin
		cursor_on;
		s:=st;
    write(s);
		repeat
			c:=readkey;
			if (c in [' '..'}', 'Ž', '™', 'š', '„', '”', '?']) and (length(s) <	20) then {}
				begin
					s:=concat(s, c);
					write(c);
				end;
			if (c=chr(8)) and (length(s)>0) then
				begin
					delete(s, length(s), 1);
					write(chr(8), ' ', chr(8));
				end;
      if c=chr(0) then c := readkey;
		until (c=chr(13)) or (c=chr(27));
		if c=chr(13) then st:=s
    else st:='';
		cursor_off;
	end;

	procedure write_highscores(highscores:highscore_type);
	begin
		gotoxy(33, 4);               write('ÉÍÍÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(20, 5);  write('ÉÍÍÍÍÍÍÍÍÍÍÍÍ¹ Highscores ÌÍÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(20, 6);  write('º            ÈÍÍÍÍÍÍÍÍÍÍÍÍ¼           º');
		gotoxy(20, 7);  write('º Platz Name             Level Punkte º');
		gotoxy(20, 8);  write('º                                     º');
		gotoxy(20, 9);  write('º                                     º');
		gotoxy(20, 10); write('º                                     º');
		gotoxy(20, 11); write('º                                     º');
		gotoxy(20, 12); write('º                                     º');
		gotoxy(20, 13); write('º                                     º');
		gotoxy(20, 14); write('º                                     º');
		gotoxy(20, 15); write('º                                     º');
		gotoxy(20, 16); write('º                                     º');
		gotoxy(20, 17); write('º                                     º');
		gotoxy(20, 18); write('º                                     º');
		gotoxy(20, 19); write('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
		for i:= 0 to max_entries do
			begin
				gotoxy(22, 9+i); write(i+1, '.');
				gotoxy(26, 9+i); write(highscores[i].name);
				gotoxy(47, 9+i); write(highscores[i].lvl);
				gotoxy(50, 9+i); write(highscores[i].scor);
			end;
	end;

	procedure show_highscores;{---20----____30____----40----____50___ } 
	var i:integer;
	begin									{ 901234567890123456789012345678901234567}
  	write_highscores(highscores);
    inverse_on;
    centered(25, '*** Bitte Taste dr?cken ***');         
		inverse_off;
		i:=1;
		if levl >= 35 then repeat
			colo_screen[i].attr := colo_screen[i].attr div 16 * 16 + random(16);
			i:=i mod 2000 + 1;
    until keypressed;
		c:=readkey;
		if c=chr(0) then c:=readkey;
		levl:=0;
	end;

	procedure put_in_highscore(scor:longint; lvl:integer);
	var
		i, j: integer;
		name: string;
		newhighscores:highscore_type;
	begin
		newhighscores:=highscores;
		i := 0;
		while (newhighscores[i].scor > scor) and (i < max_entries) do
			i:= i+1;
		if newhighscores[i].scor <= scor then
    	begin
				for j := max_entries downto i+1 do
					newhighscores[j]:=newhighscores[j-1];
				newhighscores[i].lvl:=lvl;
				newhighscores[i].scor:=scor;
				name:='Anonymous';
        inverse_off;
				write_highscores(newhighscores);
				inverse_on;
        centered(25, 'Bitte geben Sie nun Ihren Namen ein oder dr?cken sie [Esc], um abzubrechen');
				inverse_off;
				gotoxy(26, 9+i);
				write('                    ');
				gotoxy(26, 9+i);
				read_in(name);
				newhighscores[i].name:=name;
				if name <> '' then
					begin
						highscores:=newhighscores;
						changed:=true;
					end;
				show_highscores;
			end;
	end;

	procedure load_highscores_and_options;
	type
  	hi_file_type=file of options_type;
	var
		f:hi_file_type;
		red:options_type;
	begin
		{$I-}
		assign(f, 'HUHN.HI');
    reset(f);
		read(f, red);
		close(f);
		{$I+}
		if ioresult <> 0 then
			begin
				for i:= 1 to max_entries do
					begin
						highscores[i].name := 'Anonymous';
						highscores[i].lvl:= 1;
						highscores[i].scor:=10000;
					end;
				highscores[0].name:='Sheepmaster';
				highscores[0].lvl:=55;
				highscores[0].scor:=632650;
				options.color:=true;
				options.beep:=true;
				options.text:=lightgreen; {yellow}
				options.back:=black;
			end
		else
			begin
				highscores:=red.highscores;
				options:=red.options;
			end;
	end;

	procedure save_highscores_and_options;
	type
		hi_file_type=file of options_type;
	var
  	r:word;
		f:hi_file_type;
		written:options_type;
	begin
		written.highscores:=highscores;
		written.options:=options;
		{$I-}
		assign(f, 'HUHN.HI');
		rewrite(f);
		write(f, written);
		close(f);
		{$I+}
		r:=ioresult;
		if r <> 0 then
			begin
				writeln('Fehler beim Schreiben der Datei ''HUHN.HI''!');
				writeln('Fehlernr.: ', r);
			end;
	end;

	procedure new_game;
		const
			max_autos = 30;
			start_delay = 110;
			speed_factor = 0.977;
			top = 10;
			bottom = 16;
			left = 24;
			right = 56;
			start_bonus = 10000;
			reduction = 50;
			probs:array[-1..20] of real=(0.01, 0.0, 7.5, 2.5, 1.0, 9.0, 1.0, 1.0, 1.0,
				1.0, 1.0, 2.5, 1.0, 1.0, 2.5, 2.5, 7.5, 0.0, 0.0, 0.0, 0.0, 0.001);
      probsum=42.011;

		type
			coord = record
					x, y: integer;
					color:shortint;
				end; {record}
			auto_typ = array[0..max_autos] of coord;

		var
			start_again, game_over, rainbow, splat, key: boolean;
			i, huehner, present_delay, bonus, bonus2, wait_delay, fac: integer;
			score: longint;
			ch: char;
			huhn: coord;
			autos: auto_typ;
			turbo_power:array[top..bottom, left..right] of boolean;  

		function max (a, b: integer): integer;
		begin
			if a > b then
				max := a
			else
				max := b;
		end;

		procedure wait (mil: integer);
		var
			i, j:integer;
			st, mi, se, hu: word;
			time2: longint;
		begin
			for i := 0 to fac*mil do
				begin
					gettime(st, mi, se, hu);
					time2 := ((one * st * 60 + mi) * 60 + se) * 100 + hu;
					inc(j);
				end;
		end;

		procedure calibrate;
			var
				st, mi, se, hu: word;
				time, time2, int: longint;
		begin
    	int:=0;
			gettime(st, mi, se, hu);
			time2 := ((one * st * 60 + mi) * 60 + se) * 100 + hu;
			repeat
				gettime(st, mi, se, hu);
				time := ((one * st * 60 + mi) * 60 + se) * 100 + hu;
			until time2<>time;
			repeat
				gettime(st, mi, se, hu);
				time2 := ((one * st * 60 + mi) * 60 + se) * 100 + hu;
				inc(int);
			until (time2 >= time + present_delay) or (time2<time);
			fac:=int div (present_delay * 10);
		end;

		procedure beep;
		begin
			Sound(880);        { Beep }
			wait(200);         { For 200 ms }
			NoSound;           { Relief! }
{			write(#7);   }
		end;

		function rand:shortint;
		var
			i:integer;
			r, n:real;
		begin
			r:=random*probsum;
			i:=-1;
      n:=0;
			repeat
				n:=n+probs[i];
				inc(i);
			until (i=21) or (n>=r);
			if i-1 = options.back then rand := 0 else
			rand:=i-1;
    end;

		procedure init;
			var
				i, j: integer;
		begin
			for i:=left to right do
				for j:=top to bottom do
        	turbo_power[j, i]:=false;
			centered(1, 'Warum ging das Huhn ?ber die Autobahn?');
			centered(2, '¸ 1999 by Bl”k!Interactive Megatrend Gamesystems');
			gotoxy(left, top - 2);
			write('================================');
			gotoxy(left, bottom + 1);
			write('================================');
			gotoxy(left, bottom + 2);
			write('Score');
			gotoxy((right + left) div 2 - 4, bottom + 2);
			write('Bonus');
			gotoxy(right - 8, bottom + 2);
			write('Bonus II');
			inverse_on;
			centered(25, 'Warum ging das Huhn ?ber die Autobahn?');
			inverse_off;
			randomize;
			for i := 0 to max_autos do
				begin
					autos[i].x := left + random(right - left);
					autos[i].y := top + random(bottom - top);
					autos[i].color:=rand;
					if autos[i].color = options.back then autos[i].color:=black;
					gotoxy(autos[i].x, autos[i].y);
					if options.color and color then textcolor(autos[i].color);
					write('*');
				end;
			levl := 1;
			huehner := 3;
			present_delay := start_delay;
			game_over := false;
      rainbow:=false;
			score := 0;
			bonus2 := start_bonus;
		end;

		procedure init2;
		begin
    	inverse_off;
			start_again := false;
			huhn.x := (right + left) div 2;
			huhn.y := bottom;
			bonus := 200 * levl;
			gotoxy(left, top - 3);
			write('Level: ', levl);
			gotoxy(right - 4, top - 3);
			if huehner < 10 then
				write(' ');
			write('#x', huehner, '    ');
			gotoxy(left, bottom + 3);
			write(score);
			gotoxy(right - 4, bottom + 3);
			write(bonus2);
			gotoxy((right + left) div 2 - 3, bottom + 3);
			write(bonus);
		end;

		procedure geschafft;
		var
			i:integer;
		begin
			present_delay := round(present_delay * speed_factor);
			inc(levl);
			inc(huehner);
			start_again := true;
			score := score + bonus + bonus2;
			bonus2 := start_bonus;
			inverse_on;
			if levl <> 35 then
				centered(25, 'YOAHEEH!')
			else
				begin
					centered(25, 'UI, BUNT!');
					rainbow:=true;
				end;
			gotoxy(huhn.x, huhn.y);
			inverse_off;
			write('#');
			calibrate;{irgend so ein Scheiá}
			write(chr(8), ' ');
			huhn.x := (right + left) div 2;
			huhn.y := bottom;
		end;

		procedure tot;
		begin
			if options.beep then beep;
      inverse_on;
			centered(25, 'HAA HAA!');
			inverse_off;
			huehner := huehner - 1;
			start_again := true; {und wer putzt die Leiche weg?}
			if huehner < 0 then
				game_over := true
			else
				calibrate;
			while keypressed do ch:=readkey;
		end;

		procedure vorwaerts_marsch;
			var
				i, p: integer;
				power_rangers_mega_zord_power:array[0..5] of boolean;
		begin
			splat:=false;
			for i := 0 to 5 do power_rangers_mega_zord_power[i]:=false;
			for i := 0 to max_autos do
				begin
					gotoxy(autos[i].x, autos[i].y);
					write(' ');
          turbo_power[autos[i].y, autos[i].x]:=false;
					autos[i].x := autos[i].x - 1;
					if autos[i].x < left then
						begin
							repeat
								p := random(6);
							until not power_rangers_mega_zord_power[p];
							power_rangers_mega_zord_power[p]:=true;
							autos[i].x:=right-1;
							autos[i].y:=bottom-1-p;
							autos[i].color:=rand;
							if autos[i].color=options.back then autos[i].color:=black;
              if rainbow then autos[i].color:=-1;
						end;
					gotoxy(autos[i].x, autos[i].y);
					if options.color and color then
						if autos[i].color<>-1 then textcolor(autos[i].color)
						else textcolor(random(16));
{					if turbo_power[autos[i].y, autos[i].x] then autos[i].color:=-1;  }
					turbo_power[autos[i].y, autos[i].x]:=true;
					write('*');
					if (huhn.x = autos[i].x) and (huhn.y = autos[i].y) then
						splat:=true;
					if key then while keypressed do   
						ch := readkey;
					key:=false;    
				end; {for}
			if splat then tot;
		end;

		procedure haemisch_lachen;
			var
				i: integer;
		begin
			if options.color and color then textcolor(4);
			for i := 500 downto 0 do
				begin
					gotoxy(random(71)+1, random(24)+1);
					wait(i div 50 + 3);
					write('GAME OVER!');
				end;
			wait(500);
      inverse_off;
    end;

	begin
		inverse_on;
		centered(25, '                               Bitte warten...                                 ');
		present_delay := start_delay;
		fac := 500;
		calibrate;
		gotoxy(47, 25);	write('OK.');
		inverse_off;
		clrscr;
		init;
		repeat
			init2;
			repeat
				wait(present_delay);
				gotoxy(huhn.x, huhn.y);
				write(' ');
				if keypressed then
					begin
          	key:=true;
						ch := ReadKey;
						case ch of
							#0:
								begin
									ch:=readkey;
									case ch of
										'K':dec(huhn.x);
										'P':inc(huhn.y);
										'M':inc(huhn.x);
										'H':dec(huhn.y);
									end;
								end;
							' ':
								begin
									inverse_on;
									centered(25, '***PAUSE***');
									ch := readkey;
									gotoxy(21, 25);
                  write('Warum ging das Huhn ?ber die Autobahn?');
									inverse_off;
								end;
							#27:
								begin
									inverse_on;
									centered(25, 'Wollen Sie das Spiel wirklich beenden[J/N]?');
									repeat
										c:=readkey;
									until c in ['J', 'j', 'N', 'n', chr(27), chr(13)];
									if c in ['J', 'j', chr(13)] then
										begin
											start_again := true;
											game_over := true;
										end;
									centered(25, 'Warum ging das Huhn ?ber die Autobahn?');
									inverse_off;
								end; {case}
						end; {case}
					end; {if}
				if huhn.x < left then
					inc(huhn.x);
				if huhn.x >= right then
					dec(huhn.x);
				if huhn.y > bottom then
					dec(huhn.y);
				if huhn.y < top then
					geschafft;
				gotoxy(huhn.x, huhn.y);
				inverse_off;
				write('#');
				vorwaerts_marsch;
				inverse_off; 
				bonus2 := max(bonus2 - reduction, 0);
				gotoxy(right - 4, bottom + 3);
				write(bonus2, '     ');
			until start_again;
		until game_over;
		haemisch_lachen;
		clrscr;
{		writeln('Ihr Endergebnis:'); }
{		writeln('Level ', levl);     }
{		writeln('Score: ', score);   }
		put_in_highscore(score, levl);
	end;

	procedure info;
	var
		i:integer;
	begin
		gotoxy(33, 7);                  write(' ÉÍÍÍÍÍÍÍÍÍ» ');
		gotoxy(17, 8);  write('ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹ Info... ÌÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(17, 9);  write('º                ÈÍÍÍÍÍÍÍÍÍ¼                 º');
		gotoxy(17, 10); write('º   Warum ging das Huhn ?ber die Autobahn?   º');
		gotoxy(17, 11); write('º             Version 2.2 f?r PC             º');
		gotoxy(17, 12); write('º                                            º');
		gotoxy(17, 13); write('º               "Ui, bunt!" -- Simon Bichler º');
		gotoxy(17, 14); write('º                                            º');
		gotoxy(17, 15); write('º        (c) 1999 by Bl”k!Interactive        º');
		gotoxy(17, 16); write('º            Megatrend Gamesystems           º');
		gotoxy(17, 17); write('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
    inverse_on;
		centered(25, '*** Bitte Taste dr?cken ***');
		inverse_off;
		i:=999;
		repeat
			colo_screen[i].attr:= colo_screen[i].attr div 16 * 16 + random(16);
			i:= (i-997) mod 4 + 998;
		until keypressed;
		c:=readkey;
    if c=chr(0) then c:=readkey;
	end;

	procedure easter_egg;
	var
		i:integer;
	begin
		gotoxy(14, 7);  write('                    ÉÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(14, 8);  write('ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹ Das Huhn ÌÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(14, 9);  write('º                   ÈÍÍÍÍÍÍÍÍÍÍ¼                    º');
		gotoxy(14, 10); write('º   In der Bahnhofshalle, die nicht f?r es gebaut,  º');
		gotoxy(14, 11); write('º                   geht ein Huhn                   º');
		gotoxy(14, 12); write('º                   hin und her...                  º');
		gotoxy(14, 13); write('º       Wo, wo ist der Herr Stationsvorsteh''r?      º');
		gotoxy(14, 14); write('º                   Wird dem Huhn                   º');
		gotoxy(14, 15); write('º                  man nichts tun?                  º');
		gotoxy(14, 16); write('º         Hoffen wir es! Sagen wir es laut:         º');
		gotoxy(14, 17); write('º          daá ihm unsere Sympathie geh”rt,         º');
		gotoxy(14, 18); write('º       selbst an dieser St„tte, wo es ''st”rt''!     º');
		gotoxy(14, 19); write('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
		inverse_on;
		centered(25, '*** Bitte Taste dr?cken ***');
		inverse_off;
		c:=readkey;
    if c=chr(0) then c:=readkey;
	end;

	procedure setup_options;
	var
		i, pos:integer;
		out:boolean;
		new_options:option_type;

	procedure write_menu(p:integer);
	begin
		case p of
			0:
				begin
					gotoxy(30, 9);
					if not color then lowvideo; write(' [ ] Bunte Autos    ');
					gotoxy(32, 9);
					if new_options.color then write('X'); 
					centered(25, 'Schaltet die Option ''Bunte Autos'' ein und aus'); highvideo;
				end;
			1:
				begin
					gotoxy(30, 10);
					write(' [ ] Ger„usche      ');
					gotoxy(32, 10);
					if new_options.beep then write('X');
					centered(25, 'Schaltet die Ger„uschuntermalung ein und aus');
				end;
			2:
				begin
					gotoxy(30, 16);
					if not color then lowvideo; write(' Textfarbe..        ');
					centered(25, 'Schaltet die Textfarbe um (Siehe Farb-Beispiel)'); highvideo;
				end;
			3:
				begin
					gotoxy(30, 17);
					if not color then lowvideo; write(' Hintergrundfarbe.. ');
					centered(25, 'Schaltet die Hintergrundfarbe um (Siehe Farb-Beispiel)'); highvideo;
				end;
			4:
				begin
					gotoxy(31, 19);
					write(' OK ');
					centered(25, 'Verl„át diesen Dialog und ?bernimmt die Optionen');
				end;
			5:
				begin
					gotoxy(39, 19);
					write(' Abbrechen ');
					centered(25, 'Verl„át diesen Dialog, ohne die Optionen zu ?bernehmen');
				end;
		end;
	end;

	procedure write_text;
	begin
		if color then
			begin
				textcolor(new_options.text);
				textbackground(new_options.back);
			end
		else inverse_off;
		gotoxy(31, 13);
		write(' M„„„„„„„„„„„„hh! ');
		gotoxy(31, 14);
		write(' Bl””””””””””””k! ');
		inverse_off;
	end;

	procedure switch_color;
	begin
		if color then
			begin
				new_options.color := not new_options.color;
				gotoxy(32, 9);
				if not color then lowvideo;
				if new_options.color then write('X')
				else write(' '); highvideo;
      end;
	end;

	procedure switch_beep;
	begin
		new_options.beep := not new_options.beep;
		gotoxy(32, 10);
		if new_options.color then write('X')
    else write(' ');
	end;

	procedure cycle_text;
	begin
		if color then
			begin
				new_options.text:=(new_options.text+1) mod 16;
				textcolor(new_options.text);
				write_text;
      end;
	end;

	procedure cycle_back;
	begin
		if color then
			begin
				new_options.back:=(new_options.back+1) mod 8;
				textbackground(new_options.back);
				write_text;
			end;
	end;

	begin
		pos:=0;
    new_options:=options;
		repeat                  {20-----30---____40____50}
			clrscr;               {890123456789012345678901}
			gotoxy(33, 5);       write(' ÉÍÍÍÍÍÍÍÍÍÍ» ');
			gotoxy(28, 6);  write('ÉÍÍÍÍÍ¹ Optionen ÌÍÍÍÍÍ»');
			gotoxy(28, 7);  write('º     ÈÍÍÍÍÍÍÍÍÍÍ¼     º');
			gotoxy(28, 8);  write('ÌÍÍÍÍÍÍAllgemeinÍÍÍÍÍÍÍ¹');
			gotoxy(28, 9);  write('º  [ ] Bunte Autos     º');
			gotoxy(28, 10); write('º  [ ] Piepton         º');
			gotoxy(28, 11); write('ÌÍÍÍÍÍÍÍÍFarbenÍÍÍÍÍÍÍÍ¹');
			gotoxy(28, 12); write('º                      º');
			gotoxy(28, 13); write('º                      º');
			gotoxy(28, 14); write('º                      º');
			gotoxy(28, 15); write('º                      º');
			gotoxy(28, 16); write('º  Textfarbe..         º');
			gotoxy(28, 17); write('º  Hintergrundfarbe..  º');
			gotoxy(28, 18); write('º                      º');
			gotoxy(28, 19); write('º   OK      Abbrechen  º');
			gotoxy(28, 20); write('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
			for i:= 0 to 5 do
				write_menu(i);
			inverse_on;
			write_menu(pos);
			inverse_off;
      write_text;
			repeat
				c := ReadKey;
				write_menu(pos);
				if c=#0 then
					begin
						c:=readkey;
						if c='P' then pos:=(pos+1)mod 6;
						if c='H' then pos:=(pos+5)mod 6;
					end;
				inverse_on;
				write_menu(pos);
				inverse_off;
			until (c=chr(13)) or (c=chr(27));
			if c=chr(27) then pos:=5;
			case pos of
				0: switch_color;
				1: switch_beep;
				2: cycle_text;
				3: cycle_back;
				4, 5: out:=true;
			end;
		until out;
		if pos=4 then
			begin
				options:=new_options;
				changed:=true;
			end;
	end;

	procedure write_menu(p:integer);
	begin
		case p of
		0:
			begin
				gotoxy(32, 10);
				writeln(' Info...       ');
				centered(25, 'Informationen ?ber dieses bescheuerte Spiel');
			end;
		1:
    	begin
				gotoxy(32, 11);
				writeln(' Neues Spiel   ');
				centered(25, 'Beginnt ein neues Spiel');
			end;
		2:
			begin
				gotoxy(32, 12);
				writeln(' Highscores... ');
				centered(25, 'Zeigt die aktuellen Highscores an');
			end;
		3:
			begin
				gotoxy(32, 13);
				writeln(' Optionen...   ');
				centered(25, 'Stellt diverse Optionen ein');
			end;
		4:
			begin
				gotoxy(32, 14);
				writeln(' Ende          ');
				centered(25, 'Beendet das Programm');
			end;
		end;
	end;

begin
	old_mode:=lastmode;
	color:=color_screen;
	cursor_off;
  checkbreak:=false;
	out:=false;
  changed:=false;
	pos:=0;
  levl:=0;
  load_highscores_and_options;
	inverse_off;
	clrscr;
	info;
	repeat
		inverse_off;
		clrscr;
		gotoxy(33, 7);     write('ÉÍÍÍÍÍÍÍÍÍÍÍ»');
		gotoxy(30, 8);  write('ÉÍÍ¹ Hauptmen? ÌÍÍ»');
		gotoxy(30, 9);  write('º  ÈÍÍÍÍÍÍÍÍÍÍÍ¼  º');
		gotoxy(30, 10); write('º                 º');
		gotoxy(30, 11); write('º                 º');
		gotoxy(30, 12); write('º                 º');
		gotoxy(30, 13); write('º                 º');
		gotoxy(30, 14); write('º                 º');
		gotoxy(30, 15); write('ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼');
		for i:= 0 to 4 do
			write_menu(i);
		inverse_on;
		write_menu(pos);
		inverse_off;
		repeat
			c := ReadKey;
			write_menu(pos);
			if c = #0 then
				begin
					write('!');
					c:=readkey;
					if c='P' then pos:=(pos+1)mod 5;
					if c='H' then pos:=(pos+4)mod 5;
				end;
			inverse_on;
			write_menu(pos);
			inverse_off;
		until (c=chr(13)) or (c=chr(27)) or (c=#10);
		if c=chr(27) then out:=true
		else
			case pos of
				0: if c<>#10 then info else easter_egg;
				1: new_game;
				2: show_highscores;
				3: setup_options;
				4: out:=true;
			end;
	until out;
	textcolor(lightgray);    
	textbackground(black);
	clrscr;
	if changed then save_highscores_and_options;
	write('Danke, daá Sie ''Warum ging das Huhn ?ber die Autobahn'' so lange ertragen haben!');
	cursor_on;
	checkbreak:=true;
	textmode(old_mode);
	write('Danke, daá Sie ''Warum ging das Huhn ?ber die Autobahn'' so lange ertragen haben!');
end.
										ÉÍÍÍÍÍÍÍÍÍÍ»
ÉÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¹ Das Huhn ÌÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ»
º                   ÈÍÍÍÍÍÍÍÍÍÍ¼                    º
º   In der Bahnhofshalle, die nicht f?r es gebaut,  º
º                   geht ein Huhn                   º
º                   hin und her...                  º
º       Wo, wo ist der Herr Stationsvorsteh'r?      º
º                   Wird dem Huhn                   º
º                  man nichts tun?                  º
º         Hoffen wir es! Sagen wir es laut:         º
º          daá ihm unsere Sympathie geh”rt,         º
º       selbst an dieser St„tte, wo es 'st”rt'!     º
º                                                   º
ÈÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍÍ¼

Seht ihr den Frosch dort sitzen?
Er muss sich etwas st?tzen
und ist doch stark und sch”n.
So ist es mit manchen Sachen,
die wir getrost belachen,
weil wie sie besser nicht versteh'n.


NOW, YOU MUST
UNDERSTAND.
YOU'RE A HIPPY
PET.
