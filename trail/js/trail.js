var canvas;
var ctx;
var e = null;

// Tail variables
var tails = 25;
var maxLineWidth = 50;
var minLineWidth = 0.1;

// Not implemented
// var life = 1000 // miliseconds

var interval = 10;
var intervalID;

var paths = [];
var startPos = [];

// Set mouse event
(function(){
	window.onmousemove = mouseMove;	
	function mouseMove(event) {
		e = event || window.event;
	}
})();


// Main draw method
function draw(){

	// Get path data
	getPathData();

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	// Loop through all lines and draw
	for (i = 0;i < paths.length;i++){
	
		// Fade opacity		
		// op = paths[i].getOpacity();
		// paths[i].setOpacity(op-(1/tails));

		// Thin lines
		w = paths[i].getLineWidth();
		paths[i].setLineWidth(w-(maxLineWidth/tails))

		// Draw!
		paths[i].draw()
	}
}


// Add new line to paths array
function getPathData(){

	// Add line
	paths.push(addLine());

	// Trim extras
	if (paths.length > tails) {
		paths.shift();
	}

}

// Add line method
function addLine(){
	
	// Set the end point of line to be start of next
	if (paths.length > 0){
		startPos = [paths[paths.length-1].endX, paths[paths.length-1].endY];
	}

	// Create new line
	endPos = getMousePos();
	l = new Line()
	l.startX = startPos[0]
	l.startY = startPos[1]
	l.endX = endPos[0]
	l.endY = endPos[1]	
	return l;
}

// Line class
function Line(){

	// Variables
	this.startX;
	this.startY;
	this.endX;
	this.endY;
	this.opacity = 1;
	this.lineWidth = maxLineWidth;
	
	this.draw = function(){ 

		// Fade and width
		ctx.lineWidth = this.lineWidth
		this.color = "rgba(240, 124, 124, " + this.opacity + ")";
		ctx.strokeStyle = this.color;
		
		// Draw
		ctx.beginPath();
		ctx.moveTo(this.startX, this.startY);
		ctx.lineTo(this.endX, this.endY);
		ctx.lineJoin = 'round';
		ctx.closePath();
		ctx.stroke();
	}
	// ------------------------------------- //
	// Getters and setters
	this.getOpacity = function(){
		return this.opacity;
	}

	this.setOpacity = function(value){
		if (value > 1){
			value = 1;
		}
		else if (value < 0){
			value = 0;
		}
		this.opacity = value;
	}

	this.getLineWidth = function(){
		return this.lineWidth;
	}

	this.setLineWidth = function(value){
		if (value > maxLineWidth){
			value = maxLineWidth;
		}
		else if (value <= minLineWidth){
			value = minLineWidth;
		}
		this.lineWidth = value;
	}
}

// Get current mouse position
function getMousePos(event){
	if(e){
		return [e.clientX, e.clientY];
	}
	else{
		return null;
	}
}


// Mouse stuff
var mouseX = 0;
var mouseY = 0;
var mouseIsIn = true;

function wireEvent() {
window.addEventListener("mouseout",
    function(e){
        mouseX = e.pageX;
        mouseY = e.pageY;
    	if ((mouseY >= 0 && mouseY <= window.innerHeight)
    	&& (mouseX >= 0 && mouseX <= window.innerWidth))
    		{return;}

    	mouseIsIn = false;
    	clearInterval(intervalID);
    },
    false);

window.addEventListener("mouseover",
    function(e){
    	intervalID = setInterval(draw, interval)
    	if (mouseIsIn){
    		return;
    	}
    	mouseIsIn = true;
    },
    false);
}

function init(){
	console.log('init');
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	// Resize the canvas to fill the browser window dynamically
	window.addEventListener('resize', resizeCanvas, false);
	function resizeCanvas() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
	wireEvent();

}