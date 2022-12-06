
	function hide_welcome() {
		document.querySelector('#float_welcome').style.display = "none";
	}
	
	function hide_screen() {
		
		if (document.getElementById('float_welcome').style.display != "none") {
			hide_welcome();
		} else if (document.getElementById('float_message').style.display != "none"){
			hide_message();
		}
		document.querySelector('#screen').style.display = "none";
	}
	
	function show_screen() {
		document.querySelector('#screen').style.display = "block";
	}
	
	function hide_message() {
		document.getElementById("float_message").style.display = "none";
		level += 1;
		wish_color = new_color(level);
		update_color();
	}
	
	function show_message(text) {
		document.querySelector('#float_message').innerHTML = text;
		document.querySelector('#float_message').style.display = "block";
		show_screen();
	}
		
	
    var stage = document.querySelector('#stage');
    var ctx = stage.getContext('2d');
    var wish_color = null;
    var steps = 0;
    var cols = 0;
    var level = 1;
    var mode = "free";
    
    function setmode(me) {
		if (m == "free") {
			mode = m;
			$('#but_free').addClass('active');
			$('#but_play').removeClass('active');
			
		} else if (m == "play") {
			mode = m;
			$('#but_free').removeClass('active');
			$('#but_play').addClass('active');
		} 
	}
    
    function update_level_beschreibung() {
		document.querySelector('#level').innerHTML = level;
		beschreibung = "Du musst " + cols + (cols == 1 ? " Farbe" : " Farben") + " mischen.";
		document.querySelector('#beschreibung').innerHTML = beschreibung;
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

		ctx.fillStyle = rgb_from_discrete(wish_color);
		ctx.beginPath();
		ctx.arc(200,207, 30, 0*Math.PI/3, 6*Math.PI/3); 
		
		ctx.stroke();
		ctx.fill();
	}
	
	function new_color(level) {
		steps = 3; // default for most cases
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
			if (level > 10) {
				steps = Math.floor((level + 1) / 3 ); // alle drei Level um eins ansteigen, ab Level 11
			}
		}
		
		document.querySelector('#control_red').setAttribute("max", steps);
		document.querySelector('#control_green').setAttribute("max", steps);
		document.querySelector('#control_blue').setAttribute("max", steps);
		
		document.querySelector('#control_red').value = 0;
		document.querySelector('#control_green').value = 0;
		document.querySelector('#control_blue').value = 0;
		update_level_beschreibung();
		return {r,g,b};	
	}
	
	function rgb_from_discrete(color) {
		return  "rgb(" + color.r*255/steps + ", " + color.g*255/steps + ", " + color.b*255/steps + ")"
	}
	
	function diff_color() {
		var dr = Math.abs(wish_color.r - document.querySelector('#control_red').value);
		var dg = Math.abs(wish_color.g - document.querySelector('#control_green').value);
		var db = Math.abs(wish_color.b - document.querySelector('#control_blue').value);
		//console.log({dr, dg, db});
		if (dr + dg + db == 0) {
			show_message("Super! Du hast es geschafft!<br>Tippen für den nächsten Level!");
		}
	}
	
	wish_color = new_color(level);
	document.getElementById("float_message").style.display = "none";
	update_color();
