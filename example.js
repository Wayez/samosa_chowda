
// ===================================== Globals ===========================
var xMin, yMin, xMax, yMax, theCanvas, theContext, borderWidth;
var temp = 0;


function canvasSupport() {
	return Modernizr.canvas;
}

function canvasApp() {
	if (!canvasSupport()) {
		alert("No canvas support!");
		return;
	}
	theCanvas = document.getElementById("canvasOne");
	theContext = theCanvas.getContext("2d");

	//  Draw background
	borderWidth=5;
	xMin=borderWidth;
	yMin=borderWidth;
	xMax=theCanvas.width-1-borderWidth;
	yMax=theCanvas.height-1-borderWidth;
	minAverageSpeed = minAverageVel * theCanvas.width;
	maxAverageSpeed = maxAverageVel * theCanvas.width;
	DrawBackground();

	NumBalls(1);

	//self.setInterval(Animate,millisecondsPerFrame);
}

function DrawBackground() {
	var offset=Math.floor(borderWidth/2);
	theContext.strokeStyle="red";
	theContext.lineWidth=borderWidth;
	theContext.strokeRect(offset,offset,theCanvas.width-2-offset,theCanvas.height-2-offset);		// this should be theCanvas.width-1-offset, not -2 (??)
	//theContext.fillStyle="#99ffcc";
	theContext.fillStyle="#000000";
	theContext.fillRect(borderWidth,borderWidth,theCanvas.width-2*borderWidth,theCanvas.height-2*borderWidth);
}

function myrgb(r,g,b) {
	return 'rgb('+r+','+g+','+b+')';
}

function randrange(low,high) {
	return Math.floor(low + Math.random() * (high - low + 1));
}

// ================================ Ball class ====================================
function Ball() {
	this.radius=0;
	this.pos={x:0,y:0};	// pixels/sec
	this.vel={x:0,y:0};
	this.mass=0;		// r^2
	this.fillColor=0;
	this.borderColor=0;
}

Ball.prototype.minVel=0.1;		// initial fraction of width or height
Ball.prototype.maxVel=0.3;		// initial fraction of width or height
Ball.prototype.minRadius=20;
Ball.prototype.maxRadius=35;

Ball.prototype.init = function () {
	this.radius = randrange(this.minRadius,this.maxRadius);
	this.mass = this.radius * this.radius;
	this.pos.x = xMin + this.radius + Math.random() * (xMax - xMin - 2 * this.radius);
	this.pos.y = yMin + this.radius + Math.random() * (yMax - yMin - 2 * this.radius);
	this.vel.x = theCanvas.width * (this.minVel + Math.random() * (this.maxVel - this.minVel));
	if (Math.random() < 0.5) this.vel.x = -this.vel.x;
	this.vel.y = theCanvas.height * (this.minVel + Math.random() * (this.maxVel - this.minVel));
	if (Math.random() < 0.5) this.vel.y = -this.vel.y;
	var r=randrange(0,255);
	var g=randrange(0,255);
	var b=randrange(0,255);
	this.fillColor=myrgb(r,g,b);
	//this.borderColor="#000000";
	this.borderColor="#ffffff";
}

Ball.prototype.display = function () {
	theContext.fillStyle=this.fillColor;
	theContext.beginPath();
	theContext.arc(this.pos.x,this.pos.y,this.radius,0,Math.PI*2,true);
	theContext.closePath();
	theContext.fill();
// No border, now.
/*
	theContext.strokeStyle=this.borderColor;
	theContext.lineWidth=1;
	theContext.beginPath();
	theContext.arc(this.xpos,this.ypos,this.radius,0,Math.PI*2,true);
	theContext.closePath();
	theContext.stroke();
*/
}

// ======================================== Change ball values ===========================

var theBalls = new Array();
var minBalls = 1;
var maxBalls = 20;
var minAverageVel = 0.1;
var maxAverageVel = 1.0;
var minAverageSpeed=0;		// this will be set by canvasApp()
var maxAverageSpeed=0;		// this will be set by canvasApp()

var isComputing = false;
var isMoving=false;
var ChangeNumBalls = 0;
var ChangeSpeed = 0;

var millisecondsPerFrame = 10;
var handleInterval=null;

var Collisions=false;

var mousePos;

function NumBalls(nchange) {
	if (isComputing) {
		ChangeNumBalls = nchange;
		return;
	}
	ChangeNumBalls = 0;
	if (nchange < 0 && theBalls.length <= minBalls) return;
	if (nchange > 0 && theBalls.length >= maxBalls) return;

	if (nchange > 0) {
		var b = new Ball();
		b.init();
		b.display();
		theBalls.push(b);
	} else {
		theBalls.pop(theBalls.length-1);
	}

	var s = theBalls.length+" balls";
	if (theBalls.length == 1)
		s = "1 ball";
	var nballsDisplay = document.getElementById("nballs");
	nballsDisplay.innerHTML=s;
}

function AddSubSpeed(deltaSpeed) {
	if (isComputing) {
		ChangeSpeed = deltaSpeed;
		return;
	}
	if (!isMoving) return;

	// calculate average speed
	var i,xspeed=0,yspeed=0,b;
	for (i = 0; i < theBalls.length;++i) {
		b = theBalls[i];
		xspeed += b.vel.x;
		yspeed += b.vel.y;
	}
	var avspeed = Math.sqrt(xspeed*xspeed + yspeed*yspeed);
	if (deltaSpeed < 0 && avspeed >= minAverageSpeed/0.9) {
		for (i = 0; i < theBalls.length; ++i) {
			b=theBalls[i];
			b.vel.x *= 0.9;
			b.vel.y *= 0.9;
		}
	} else if (deltaSpeed > 0 && avspeed < maxAverageSpeed/1.1) {
		for (i = 0; i < theBalls.length; ++i) {
			b=theBalls[i];
			b.vel.x *= 1.1;
			b.vel.y *= 1.1;
		}
	}
}

// ============================= Animation ==========================

function Animate() {
	if (ChangeNumBalls != 0)
		NumBalls(ChangeNumBalls);
	if (ChangeSpeed != 0)
		AddSubSpeed(ChangeSpeed);

	isComputing=true;
	WallCollisions();
	MoveBalls();
	isComputing=false;

	DisplayAll();
}

function DoCollisions() {
	Collisions = document.getElementById("changeCollisions").checked;
}

function WallCollisions() {
	var b;
	for (var i = 0; i < theBalls.length; ++i) {
		b = theBalls[i];
		if (b != ballSelected) {
			if (b.pos.x - b.radius < xMin && b.vel.x < 0) b.vel.x = -b.vel.x;
			if (b.pos.x + b.radius > xMax && b.vel.x > 0) b.vel.x = -b.vel.x;
			if (b.pos.y - b.radius < yMin && b.vel.y < 0) b.vel.y = -b.vel.y;
			if (b.pos.y + b.radius > yMax && b.vel.y > 0) b.vel.y = -b.vel.y;
		}
	}
}

function MoveBalls() {
	var b;
	var fraction = millisecondsPerFrame / 1000;

	for (var i = 0; i < theBalls.length; ++i ) {
		b = theBalls[i];
		if (b != ballSelected) {
			b.pos.x += b.vel.x * fraction;
			b.pos.y += b.vel.y * fraction;
		}
	}
	MoveSelectedBall();

	// Collisions

	if (Collisions) {
		var iA, iB, ballA, ballB;
		var CMvel,bAvel,bBvel,vectAB,vectBA,deltaA,deltaB,norm;

		for (iA = 0; iA < theBalls.length-1; ++iA) {
			ballA = theBalls[iA];
			for (iB = iA+1; iB < theBalls.length; ++iB) {
				ballB = theBalls[iB];
				if (isColliding(ballA,ballB)) {
					// if one of the balls is selected, make its mass 100 times larger
					//console.log(++temp+": "+iA+" with "+iB);
					// printEnergyMomentum();
					if (ballA == ballSelected) ballA.mass *= 100;
					else if (ballB == ballSelected) ballB.mass *= 100;

					norm = 1.0/(ballA.mass+ballB.mass);
					CMvel = {x:(ballA.mass*ballA.vel.x+ballB.mass*ballB.vel.x)*norm, y:(ballA.mass*ballA.vel.y+ballB.mass*ballB.vel.y)*norm};
					bAvel = VectSub(ballA.vel,CMvel);
					bBvel = VectSub(ballB.vel,CMvel);
					vectAB = VectUnit(VectSub(ballB.pos,ballA.pos));
					deltaA = VectMult(VectDot(vectAB,bAvel),vectAB);
					ballA.vel = VectAdd(VectSub(bAvel,VectMult(2,deltaA)),CMvel);
					vectBA = VectMult(-1,vectAB);
					deltaB = VectMult(VectDot(vectBA,bBvel),vectBA);
					ballB.vel = VectAdd(VectSub(bBvel,VectMult(2,deltaB)),CMvel);

					// reduce the mass of the selected ball
					if (ballA == ballSelected) ballA.mass /= 100;
					else if (ballB == ballSelected) ballB.mass /= 100;
				}
			}
		}
	}
}

function isColliding(a,b) {
	if (a.pos.x+a.radius < b.pos.x-b.radius) return false;
	if (a.pos.x-a.radius > b.pos.x+b.radius) return false;
	if (a.pos.y+a.radius < b.pos.y-b.radius) return false;
	if (a.pos.y-a.radius > b.pos.y+b.radius) return false;
	var dx = a.pos.x - b.pos.x;
	var dy = a.pos.y - b.pos.y;
	if (Math.sqrt(dx*dx+dy*dy) > (a.radius+b.radius)) return false;
	var bvel = VectSub(b.vel,a.vel);
	var vectBA = VectSub(a.pos,b.pos);
	if (VectDot(bvel,vectBA) > 0)
		return true;
	return false;
}

function DisplayAll() {
	DrawBackground();
	for (var i = 0; i < theBalls.length; ++i) {
		theBalls[i].display();
	}
}

function StartStop() {
	var el = document.getElementById("StartControl");
	if (el.value == "Start") {
		handleInterval=self.setInterval(Animate,millisecondsPerFrame);
		el.value = "Stop";
		isMoving=true;
	} else {
		self.clearInterval(handleInterval);
		el.value = "Start";
		isMoving=false;
	}
}

// ============================== Ball Selected ========================
var ballSelected=null;
var ballSelectedPositions=new Array();
var lastInterval = 0.25;	// the last interval of positions that will determine the current velocity

function SelectBall(event) {
	ballSelected=null;
	mousePos=relMouseCoords(event);
	var closest = theCanvas.width;
	var closestBall = null;
	var dx,dy,b,dist;
	for (var i = 0 ; i < theBalls.length; ++i) {
		b = theBalls[i];
		dx = b.pos.x-mousePos.x;
		dy = b.pos.y-mousePos.y;
		dist = Math.sqrt(dx*dx+dy*dy);
		if (dist < b.radius && dist < closest) {
			closest = dist;
			closestBall = b;
		}
	}

	ballSelected = closestBall;
	if (ballSelected != null) {
		ballSelectedPositions = new Array();
		var d = new Date();
		ballSelectedPositions.push({x:mousePos.x,y:mousePos.y,t:d.getTime()});
	}
}

function relMouseCoords(event){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = theCanvas;

    do{
        totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
        totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    }
    while(currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;
    return {x:canvasX, y:canvasY}
}

function MoveSelectedBall() {
	if (ballSelected == null) return;

	if (mousePos.x < xMin + ballSelected.radius) ballSelected.pos.x = xMin + ballSelected.radius;
	else if (mousePos.x > xMax - ballSelected.radius) ballSelected.pos.x = xMax - ballSelected.radius;
	else ballSelected.pos.x = mousePos.x;

	if (mousePos.y < yMin + ballSelected.radius) ballSelected.pos.y = yMin + ballSelected.radius;
	else if (mousePos.y > yMax- ballSelected.radius) ballSelected.pos.y = yMax - ballSelected.radius;
	else ballSelected.pos.y = mousePos.y;

	// previous positions and determining current speed
	var d = new Date();
	var now = d.getTime();
	ballSelectedPositions.push({x:ballSelected.pos.x,y:ballSelected.pos.y,t:now});
	var first=ballSelectedPositions[0].t;
	if (now-first > lastInterval * 1000) {
		ballSelected.vel.x = (ballSelected.pos.x - ballSelectedPositions[0].x) * 1000 / (now-first);
		ballSelected.vel.y = (ballSelected.pos.y - ballSelectedPositions[0].y) * 1000 / (now-first);
		ballSelectedPositions.splice(0,1);
	}

}

// ======================================= Events ===================================
function SelectBallMove(event) {
	mousePos=relMouseCoords(event);
}

function SelectBallOut(event) {
	mousePos=relMouseCoords(event);
	ballSelected = null;
}

function SelectBallDrop(event) {
	mousePos=relMouseCoords(event);
	ballSelected = null;
}

// ===================================== Vector Operations ===========================
function VectAdd(v1,v2) {
	return {x:(v1.x+v2.x),y:(v1.y+v2.y)};
}

function VectSub(v1,v2) {
	return {x:(v1.x-v2.x),y:(v1.y-v2.y)};
}

function VectMult(scalar,v) {
	return {x:scalar*v.x,y:scalar*v.y};
}

function VectDot(v1,v2) {
	return v1.x*v2.x+v1.y*v2.y;
}

function VectUnit(v) {
	var ln=Math.sqrt(VectDot(v,v));
	return {x:v.x/ln,y:v.y/ln};
}

// =============== debugging =================
function printEnergyMomentum() {
	var i, b;
	var energy = 0;
	var mx = 0;
	var my = 0;

	for (i = 0; i < theBalls.length; ++i ) {
		b = theBalls[i];
		mx += b.mass*b.vel.x;
		my += b.mass*b.vel.y;
		energy += .5 * b.mass * (b.vel.x*b.vel.x + b.vel.y*b.vel.y);
	}
	console.log("mx: "+mx+" my: "+my+" energy: "+energy);
}
