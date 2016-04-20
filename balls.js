var ball = function() {
    var x=0;
    var y=0;
    var getX = function(){
	return x;
    };
    var getY = function(){
	return x;
    };
    var set = function(x,y){
	this.x=x;
	this.y=y;
    }
    return {
	getX: getX,
	getY: getY,
	set: set
    }
}
