class Water {
	speed     = 0.01;
	direction = new Vector3F();
	texture;
	currentPosition = new Vector3F();
	time      = 1000 / 60;
	start     = 0;
	noize = 0;
	constructor( speed , texture ) {
		this.texture = texture;
		this.SetSpeed( speed );
	}
	Update() {
		let time = new Date().getTime();
		if( time < this.start + this.time ) return;
		this.start = time;
		this.currentPosition = this.currentPosition.Plus( this.direction.Multiply( this.speed ) );
	}
	GetNoize() {
		return this.noize;
	}
	GetPosition() {
		return this.currentPosition;
	}
	SetDirection( vector3f ) {
		this.direction = vector3f.Copy();
	}
	SetSpeed( speed ) {
		this.speed = speed;
		this.start = new Date().getTime();
		this.SetNoize( speed * 1000 );
	}
	SetNoize( random ) {
		this.noize = random;
	}
}