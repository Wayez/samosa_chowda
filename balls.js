var ball = function() {
    var x=250;
    var y=250;
    var vel=1;
    var theta=0
    var radius=10;
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx",x);
    c.setAttribute("cy",y);
    c.setAttribute("r",radius);
    c.setAttribute("fill","red");
    c.setAttribute("stroke","black");
    document.getElementById("vimage").appendChild(c);
    var getX = function(){
	return x;
    };
    var getY = function(){
	return y;
    };
    var set = function(x,y){
	c.setAttribute("cx",250);
	c.setAttribute("cy",250);
    };
    var getTheta = function(){
	return theta;
    };
    var getVel = function(){
	return vel;
    };
    var getRadius = function(){
	return Radius;
    };
    var setVel = function(vel,theta){
	this.vel=vel;
	this.theta=theta;
    };
    var move = function(){
	c.setAttribute("cx",c.getAttribute("cx")+vel*cos(theta));
	c.setAttribute("cy",c.getAttribute("cy")+vel*sin(theta));
    }
    return {
	getX: getX,
	getY: getY,
	set: set,
	getVel: getVel,
	setVel: setVel,
	getRadius: getRadius,
	move: move
    }
}

var balls = []
ball1=ball
balls.push(ball1)
