setup = () => {
	createCanvas(600,600);
	snakey = new Snake();
}

draw = () => {
	background(51);
	snakey.update();
	snakey.show();
}

Snake = () => {
	this.x = 0;
	this.y = 0;
	this.xspeed = 1;
	this.yspeed = 0;

	this.update = () => {
		this.y = this.x + this.yspeed;
		this.y = this.y + this.yspeed;
	}
	
	this.show = () => {
		fill(255);
		rect(this.x, this.y, 10, 10)
	}		

}
