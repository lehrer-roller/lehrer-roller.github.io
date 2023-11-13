var stage = document.querySelector('#stage');
var ctx = stage.getContext('2d');

const colors = {
	ir : [150, 150, 150],
	red: [255, 0, 0],
	yel: [255, 255, 0],
	gre: [0, 255, 0],
	blu: [0, 0, 255],
	vio: [150, 120, 255],
	uv : [150, 150, 150]
}

function set_color() {
	for (col in colors) {
		document.querySelector('#color_'+col).style.background = get_rgb(col);
	}
}

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

}

function show_message(text) {
	
	document.querySelector('#float_message').innerHTML = text;
	document.querySelector('#float_message').style.display = "block";
	show_screen();
}
	

function draw_anode(part) {
	ctx.lineWidth=0.1*x10
	ctx.strokeStyle = " solid black";
	ctx.beginPath();
	if (part == 1) { // vorderer Teil
		ctx.ellipse(4*w10, 5*h10, 2.5*w10, 0.5*h10, 0, Math.PI, 0, true);
	} else {		 // hinterer Teil
		ctx.ellipse(4*w10, 5*h10, 2.5*w10, 0.5*h10, 0, 0, Math.PI,true);
	}
	ctx.stroke();
}

function draw_experiment() {
	w10 = 0.1*stage.width;
	h10 = 0.1*stage.height;
	x10 = Math.min(w10, h10);
	
	ctx.strokeStyle = " solid 	black";
	ctx.lineWidth = 0.05*x10;
	ctx.fillStyle = "rgb(200, 200, 200)";
	ctx.clearRect(0, 0, stage.width, stage.height);
	
	// Kathode
	ctx.beginPath();
	ctx.rect(w10, 9*h10, 6*w10, 0.6*h10);
	ctx.fill();
	ctx.stroke();
	
	// Voltmeter
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
	
	// Kabel
	ctx.beginPath();
	ctx.strokeStyle = "red";
	ctx.moveTo(7*w10+0.2*x10, 9.3*h10-0.2*x10);
	ctx.lineTo(7*w10, 9.3*h10);
	ctx.lineTo(7*w10+0.2*x10, 9.3*h10+0.2*x10);
	ctx.moveTo(7*w10, 9.3*h10);
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
	
	// Lampe
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
	
	// Anode + Licht
	draw_anode(1);
	draw_light();
	draw_anode(2);
	
	draw_voltage(1.3);
}

function draw_voltage(val) {
	ctx.clearRect(volt_x, volt_y, volt_w, volt_h);
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = "" + Math.floor(0.8*volt_h) +"px sans";
	ctx.fillText("" + val + "V",volt_x+0.5*volt_w, volt_y+0.5*volt_h, 0.9*volt_w );
	
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
hide_message();
draw_experiment();
