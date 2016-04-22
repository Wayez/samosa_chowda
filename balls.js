height=500
width=500

box=document.getElementById("vimage")

var ball = function() {
    var x=250;
    var y=250;
    var theta=360*Math.random();
    var radius=Math.floor((Math.random() * 30) + 11);;
    var vel=((40 - radius) / 6.0 - 0.5) + Math.random() + 1;
    var c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    //Useful for collision detection
    var checked=2;
    c.setAttribute("cx",x);
    c.setAttribute("cy",y);
    c.setAttribute("r",radius);
    c.setAttribute("fill","red");
    c.setAttribute("stroke","black");
    box.appendChild(c);
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
    var setVel = function(n){
	vel+=n;
    };
    var move = function(){
	console.log("theta "+theta);
	theta=theta%360;
	if (checked!=0)
	    checked-=1;
	new_x=x+vel*Math.cos((theta/180.0)*Math.PI);
	new_y=y+vel*Math.sin((theta/180.0)*Math.PI);
	if (checked==0){
        if (theta >= 0 && theta < 90){ //quadrant 1
            if (new_x + radius > width){
                theta = 180 - theta;
            }
            else if (new_y + radius > height){
                theta = 360 - theta;
            }
            checked = 2
        }
        else if (theta >= 90 && theta < 180){ //quadrant 2
            if (new_x - radius < 0){
                theta = 180 - theta;
            }
            else if (new_y + radius > height){
                theta = 360 - theta;
            }
            checked = 2
        }
        else if (theta >= 180 && theta < 270){ //quadrant 3
            if (new_x - radius < 0){
                theta = (540 - theta) % 360;
            }
            else if (new_y - radius < 0){
                theta = 360 - theta;
            }
            checked = 2
        }
        else if (theta >= 270 && theta < 360){ //quadrant 4
            if (new_x + radius > width){
                theta = (540 - theta) % 360;
            }
            else if (new_y - radius < 0){
                theta = 360 - theta;
            }
            checked = 2
        }
	}
	x+=vel*Math.cos((theta/180.)*Math.PI);
	y+=vel*Math.sin((theta/180.)*Math.PI);
	c.setAttribute("cx",x);
	c.setAttribute("cy",y);
    }
    var remove = function(){
	box.removeChild(c);
    }
    return {
	getX: getX,
	getY: getY,
	set: set,
	getVel: getVel,
	setVel: setVel,
	getRadius: getRadius,
	move: move,
	remove: remove
    }
}

var balls = []

Id=window.setInterval(function(){for (var i=0;i<balls.length;i++) balls[i].move();},16)

document.getElementById("inc").addEventListener("click", function(){for (var i = 0; i < balls.length; i++) balls[i].setVel(1);});
document.getElementById("dec").addEventListener("click", function(){for (var i = 0; i < balls.length; i++) balls[i].setVel(-1);});
document.getElementById("add").addEventListener("click", function(){ balls.push(ball());  });
document.getElementById("rem").addEventListener("click", function(){balls[balls.length-1].remove();balls.pop() });


/*
if (new_x+radius>width){
		if (theta<180)
		    theta-=90;
		else
		    theta+=90;
		checked=2;
	    }
	    else if (new_x-radius<0){
		if (theta<180)
		    theta+=90;
		else
		    theta-=90;
		checked=2;
	    }
	    else if (new_y+radius>height){
		if (theta<180)
		    theta-=90;
		else
		    theta+=90;
		checked=2;
	    }
	    else if (new_y-radius<0){
		if (theta<180)
		    theta+=90;
		else
		    theta-=90;
		checked=2;
	    }
*/
