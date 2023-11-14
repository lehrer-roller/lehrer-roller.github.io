var stage = document.querySelector('#stage');
var ctx = stage.getContext('2d');
const max_steps = 12;
var last_step = max_steps;	// will be recalculated basing on the intensity
var step = 0;
var step_timer = null;


const colors = {
	ir : [200, 150, 150],
	red: [255, 0, 0],
	yel: [255, 255, 0],
	gre: [0, 255, 0],
	blu: [0, 0, 255],
	vio: [150, 120, 255],
	uv : [150, 150, 200]
}
const wavelengths = {
	ir : 900e-9,
	red: 620e-9,
	yel: 570e-9,
	gre: 540e-9,
	blu: 460e-9,
	vio: 400e-9,
	uv : 270e-9
}

const h = 4.136e-15 // Planck's constant in eVs
const c = 3e8	// speed of light in m/s

function set_color() {
	for (col in colors) {
		document.querySelector('#color_'+col).style.background = get_rgb(col);
	}
}

function hide_welcome() {
	document.querySelector('#float_welcome').style.display = "none";
}

function hide_screen() {
	/*if (document.getElementById('float_message').style.display != "none"){
		hide_message();
	}*/
	document.querySelector('#screen').style.display = "none";
}

function show_screen() {
	document.querySelector('#screen').style.display = "block";
}

function hide_message() {
	document.getElementById("float_message").style.display = "none";
	start_experiment();
	hide_screen();
}

function show_message(text) {
	show_screen();
	document.querySelector('#float_message').innerHTML = text;
	document.querySelector('#float_message').style.display = "block";

}
	

function draw_anode(part) {
	ctx.lineWidth=0.1*x10
	ctx.strokeStyle = " solid black";
	ctx.beginPath();
	if (part == 1) { // rear
		ctx.ellipse(4*w10, 5*h10, 2.5*w10, 0.5*h10, 0, Math.PI, 0, true);
	} else {		 // front
		ctx.ellipse(4*w10, 5*h10, 2.5*w10, 0.5*h10, 0, 0, Math.PI,true);
	}
	ctx.stroke();
}

function draw_ground(pos_x, pos_y) {
	ctx.beginPath();
	ctx.strokeStyle = " solid black";
	ctx.lineWidth = 0.05*x10;
	ctx.moveTo(pos_x, pos_y);
	ctx.lineTo(pos_x/2, pos_y);
	ctx.lineTo(pos_x/2, pos_y+0.7*h10);
	ctx.moveTo(pos_x/2-0.3*w10, pos_y+0.4*h10);
	ctx.lineTo(pos_x/2+0.3*w10, pos_y+0.4*h10);
	ctx.moveTo(pos_x/2-0.2*w10, pos_y+0.5*h10);
	ctx.lineTo(pos_x/2+0.2*w10, pos_y+0.5*h10);
	ctx.moveTo(pos_x/2-0.1*w10, pos_y+0.6*h10);
	ctx.lineTo(pos_x/2+0.1*w10, pos_y+0.6*h10);
	ctx.stroke();
}

function start_experiment() {
	step = 0;	// restart counting
	if (step_timer) {
		window.clearInterval(step_timer);
	}
	if (get_intensity() == 0) {
		last_step = 0;
	} else {
		last_step = 3/get_intensity();		//step out of max_steps, when max_voltage is reached
	}
	draw_experiment(true);
	update_voltage();	// draw voltage step 0
	window.setTimeout(draw_experiment, 600);
	step_timer = window.setInterval(update_voltage, 800);
}

function draw_experiment(grounded) {	// anode and cathode will be grounded if grounded = true 
	w10 = 0.1*stage.width;
	h10 = 0.1*stage.height;
	x10 = Math.min(w10, h10);
	
	ctx.strokeStyle = " solid black";
	ctx.lineWidth = 0.05*x10;
	ctx.fillStyle = "rgb(200, 200, 200)";
	ctx.clearRect(0, 0, stage.width, stage.height);
	
	// cathode
	ctx.beginPath();
	ctx.rect(1.5*w10, 9*h10, 5*w10, 0.6*h10);
	ctx.fill();
	ctx.stroke();
	
	// voltmeter
	volt_x = 9*w10-0.5*x10;
	volt_y = 7*h10-0.3*x10;
	volt_w = x10; 
	volt_h = 0.6*x10;
	
	ctx.lineWidth= 0.05*x10;
	ctx.beginPath();
	ctx.ellipse(9*w10, 7*h10, 0.7*x10, 0.7*x10, 0, 0, 2*Math.PI);
	ctx.stroke();
	ctx.fill();
	ctx.rect(volt_x, volt_y, volt_w, volt_h);
	ctx.stroke();
	
	// cables
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(6.5*w10+0.2*x10, 9.3*h10-0.2*x10);
	ctx.lineTo(6.5*w10, 9.3*h10);
	ctx.lineTo(6.5*w10+0.2*x10, 9.3*h10+0.2*x10);
	ctx.moveTo(6.5*w10, 9.3*h10);
	ctx.lineTo(9*w10, 9.3*h10);
	ctx.lineTo(9*w10, 7*h10+0.7*x10);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.strokeStyle = "blue";
	ctx.moveTo(9*w10, 7*h10-0.7*x10);
	ctx.lineTo(9*w10, 5*h10);
	ctx.lineTo(6.5*w10, 5*h10);
	ctx.lineTo(6.5*w10+0.2*x10, 5*h10+0.2*x10);
	ctx.moveTo(6.5*w10, 5*h10);
	ctx.lineTo(6.5*w10+0.2*x10, 5*h10-0.2*x10);
	ctx.stroke();
	
	// lamp
	ctx.fillStyle = "rgb(100, 100, 100)";
	ctx.strokeStyle = "black";
	ctx.lineWidth = 0.05*x10;
	ctx.beginPath();
	
	ctx.moveTo(3*w10, 1*h10);
	ctx.lineTo(3*w10, 2*h10);
	ctx.ellipse(4*w10, 2*h10, w10, 0.2*x10, 0, Math.PI, 0, false);
	ctx.lineTo(5*w10, 1*h10);
	ctx.ellipse(4*w10, 1*h10, w10, 0.2*x10, 0, 0, Math.PI, true);
	ctx.lineTo(3*w10, 1*h10);
	ctx.fill();
	ctx.stroke();
	ctx.lineTo(3*w10, 2*h10);
	ctx.ellipse(4*w10, 2*h10, w10, 0.2*x10, 0, Math.PI, 0, true);
	ctx.stroke();
	
	
	// anode + light or ground
	draw_anode(1);
	if (grounded) {
		draw_ground(1.5*w10,9.3*h10);
		draw_ground(1.5*w10, 5*h10);
	} else {
		draw_light();
	}
	draw_anode(2);
	
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.textAlign = "left";
	ctx.textBaseline = "bottom";
	ctx.font = "" + Math.floor(0.5*x10) +"px sans";
	ctx.fillText("Anode",0, 5*h10, 1.4*w10 );
	ctx.fillText("Kathode",0, 9.3*h10, 1.4*w10 );
	
}

function get_max_voltage() {
	col = get_color();
	wavelength = wavelengths[col];
	Ea = document.getElementById("select_cathode").value;
	return Math.max(h*c/wavelength - Ea, 0);
}

function get_rising_voltage() {
	if (last_step == 0) {
		return 0;
	} else {
		return get_max_voltage()*Math.min(step, last_step)/last_step;
	}
}

function update_voltage() {
	draw_voltage(get_rising_voltage());
	step += 1;
	if (step > last_step) {
		window.clearInterval(step_timer);
	}
		
}

function draw_voltage(val) {
	ctx.clearRect(volt_x, volt_y, volt_w, volt_h);
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "" + Math.floor(0.8*volt_h) +"px sans";
	ctx.fillText("" + val.toFixed(2) + "V",volt_x+0.5*volt_w, volt_y+0.5*volt_h, 0.9*volt_w );
}

function draw_light() {
	ctx.beginPath();
	ctx.fillStyle = get_rgba(get_color(), get_intensity());
	ctx.moveTo(3*w10, 2*h10);
	ctx.ellipse(4*w10, 2*h10, w10, 0.2*x10, 0, Math.PI, 0, false);
	ctx.lineTo(6*w10, 9*h10);
	ctx.lineTo(2*w10, 9*h10); 
	ctx.lineTo(3*w10, 2*h10);
	ctx.fill();
}

function get_intensity() {
	return document.querySelector('#intensity').value/100;
}

function get_color() {
	color = document.querySelector('input[name="radio_color"]:checked').value;
	return color;
}

function get_rgb(col) {
	return "rgb(" + colors[col].join(",") + ")";
}

function get_rgba(col, int) {
	return "rgba(" + colors[col].join(",") + "," + int + ")";
}

set_color();
show_screen();
show_message("Willkommen bei der Simulation des Photoelektrischen Effekts. "+
	"Wählen Sie unterschiedliche Beleuchtungsintensitäten, Farben und Kathodenmaterialien. "+
	"Dabei stellt sich jeweils eine andere Spannung ein.<br>"+
	"Vor jedem Experiment werden Anode und Kathode entladen.<br>"+
	"Klicken Sie auf diese Nachricht zum Starten.");
draw_experiment(true);
