var stage = document.querySelector('#stage');
var ctx = stage.getContext('2d');
var steps = 10;
var cols = 0;
var level = 1;
var mode = "free";
var wish_color = null;


function hide_welcome() {
	document.querySelector('#float_welcome').style.display = "none";
}

function hide_screen() {
	if (document.getElementById('float_message').style.display != "none"){
		hide_message();
	}
	document.querySelector('#screen').style.display = "none";
}

function show_screen() {
	document.querySelector('#screen').style.display = "block";
}

function hide_message() {
	document.getElementById("float_message").style.display = "none";
	if (mode == "play") {

		update_color();
	} else if (mode == "free") {
		update_color();
	}
	
	update_level_beschreibung();
	
}

function show_message(text) {
	
	document.querySelector('#float_message').innerHTML = text;
	document.querySelector('#float_message').style.display = "block";
	show_screen();
}
	

function set_mode(m) {
	text_free = "Willkommen beim freien Farbmischen, hier kannst du an den drei Reglern unten aus den Grundfarben eine neue Farbe mischen.<br>\
	Um eine Challenge zu starten, klicke auf 'Spiel!'<br>\
	Tippen um loszulegen!"
	text_play = "Tanja, die Bühnentechnikerin, ist leider krank im Bett, du musst ihren Job übernehmen! An drei Reglern kannst du die roten, grünen und blauen Scheinwerfer einzeln ansteuern. \
	In der Mitte siehst du die gemischte Farbe, der kleine Kreis ganz in der Mitte zeigt die gewünschte Mischfarbe an. Es fängt ganz leicht an... <br>\
	Tippen um loszulegen!"
	
	if (m == "free") {
		mode = m;
		$('#but_free').addClass('active');
		$('#but_play').removeClass('active');
		set_control_steps(10);
		show_message(text_free);
	} else if (m == "play") {
		mode = m;
		$('#but_free').removeClass('active');
		$('#but_play').addClass('active');
		set_control_steps(steps_for_level(level));
		show_message(text_play);
	} 
}

function update_level_beschreibung() {
	if (mode == "free") {
		document.querySelector('#level').innerHTML = "freies Spiel";
		beschreibung = "";
		document.querySelector('#beschreibung').innerHTML = beschreibung;
	} else if (mode == "play") {
		document.querySelector('#level').innerHTML = level;
		beschreibung = "Du musst " + cols + (cols == 1 ? " Farbe" : " Farben") + " mischen.";
		document.querySelector('#beschreibung').innerHTML = beschreibung;
	}
}

function update_color() {
	// Farbwerte sind gestuft 0..steps
	val_red =   document.querySelector('#control_red').value;
	val_green = document.querySelector('#control_green').value;
	val_blue =  document.querySelector('#control_blue').value;
	
	ctx.strokeStyle = " solid 10px  black";
	ctx.clearRect(0, 0, stage.width, stage.height);
	ctx.fillStyle = rgb_from_discrete({r: val_red, g: 0, b: 0});
	ctx.beginPath();
	ctx.moveTo(240, 0);
	ctx.lineTo(280, 160);
	ctx.lineTo(120, 160);
	ctx.lineTo(160, 0);
	ctx.stroke();
	ctx.fill();
	
	ctx.fillStyle = rgb_from_discrete({r: 0, g: val_green, b: 0});
	ctx.beginPath();
	ctx.moveTo(400, 300);
	ctx.lineTo(280, 160);
	ctx.lineTo(200, 300);
	ctx.lineTo(400, 380);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = rgb_from_discrete({r: 0, g: 0, b: val_blue});
	ctx.beginPath();
	ctx.moveTo(0, 300);
	ctx.lineTo(120, 160);
	ctx.lineTo(200, 300);
	ctx.lineTo(0, 380);
	ctx.stroke();
	ctx.fill();

	ctx.fillStyle = rgb_from_discrete({r: val_red, g: val_green, b: val_blue});
	ctx.beginPath();
	ctx.arc(120,160, 160, 0*Math.PI/3, 1*Math.PI/3);
	ctx.arc(280,160, 160, 2*Math.PI/3, 3*Math.PI/3);
	ctx.arc(200,300, 160, 4*Math.PI/3, 5*Math.PI/3); 
	ctx.stroke();
	ctx.fill();

	if (mode == "play") {
		ctx.fillStyle = rgb_from_discrete(wish_color);
		ctx.beginPath();
		ctx.arc(200,207, 30, 0*Math.PI/3, 6*Math.PI/3); 
		ctx.stroke();
		ctx.fill();
	}
}

function new_color(level) {
	console.log("new_color called");
	steps = steps_for_level(level);
	if (level == 1) {
		cols = 1;
		var r = Math.ceil(Math.random() * steps);
		var g = b = 0;
	} else if (level == 2) {
		cols = 1;
		var b = Math.ceil(Math.random() * steps);
		var r = g = 0;
	} else if (level == 3) {
		cols = 1;
		var g = Math.ceil(Math.random() * steps);
		var r = b = 0;
	} else if (level == 4) {
		cols = 2;
		var g = Math.ceil(Math.random() * steps);
		var r = Math.ceil(Math.random() * steps);
		var b = 0;
	} else if (level == 5) {
		cols = 2;
		var g = Math.ceil(Math.random() * steps);
		var b = Math.ceil(Math.random() * steps);
		var r = 0;
	} else if (level == 6) {
		cols = 2;
		var b = Math.ceil(Math.random() * steps);
		var r = Math.ceil(Math.random() * steps);
		var g = 0;
	} else {
		cols = 3;
		var g = Math.ceil(Math.random() * steps);
		var b = Math.ceil(Math.random() * steps);
		var r = Math.ceil(Math.random() * steps);
		
	}
	
	return {r,g,b};	
}

function steps_for_level(level) {
	if (level > 10) {
		return Math.floor((level + 1) / 3 ); // alle drei Level um eins ansteigen, ab Level 11
	} else return 3;
}
	

function set_control_steps(steps) {
	document.querySelector('#control_red').setAttribute("max", steps);
	document.querySelector('#control_green').setAttribute("max", steps);
	document.querySelector('#control_blue').setAttribute("max", steps);
	
	start_val = (mode == "free" ? 1 : 0);
	document.querySelector('#control_red').value = start_val;
	document.querySelector('#control_green').value = start_val;
	document.querySelector('#control_blue').value = start_val;
}

function rgb_from_discrete(color) {
	return  "rgb(" + color.r*255/steps + ", " + color.g*255/steps + ", " + color.b*255/steps + ")"
}

function diff_color() {
	if (mode == "play") {
		var dr = Math.abs(wish_color.r - document.querySelector('#control_red').value);
		var dg = Math.abs(wish_color.g - document.querySelector('#control_green').value);
		var db = Math.abs(wish_color.b - document.querySelector('#control_blue').value);
		//console.log({dr, dg, db});
		if (dr + dg + db == 0) {
			show_message("Super! Du hast es geschafft!<br>Tippen für den nächsten Level!");
			level += 1;
			wish_color = new_color(level);
			set_control_steps(steps_for_level(level));
		}
	}
}

wish_color = new_color(level);
set_mode(mode);

