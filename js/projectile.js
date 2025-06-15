class Projectile {
	owner      = -1;
	position;
	sprite;
	moveVector = new Vector3F();
	moveVectorU = new Vector3F(); //Расчетный вектор
	speed      = 0.05;
	gravity    = 0;
	offsetY    = 0.01;
	impulse    = 0;
	damage     = 0;
	distance   = 0;
	decal      = false;
	effect     = false;
	objectable = false; //При столкновении со стенкой не исчезает
	sound      = false;
	constructor( sprite , position , decal = false ) {
		this.sprite   = sprite;
		this.position = position;
		this.decal    = decal;
	}
	SetVector( angle ) {
		this.moveVector = caster.CreateVectorFromAngle( this.speed , angle );
	}
	SetGravity( gravity ) {
		this.gravity = gravity;
	}
	SetSpeed( speed ) {
		this.speed = speed;
	}
	SetImpulse( impulse ) {
		this.impulse = impulse;
	}
	Stop() {
		this.position = this.position.Subtract( this.moveVectorU );
	}
	Update( time ) {
		this.moveVectorU    = this.moveVector.Copy();
		this.moveVectorU.x += this.impulse * Math.sign( this.moveVector.x );
		this.moveVectorU.z += this.impulse * Math.sign( this.moveVector.z );
		this.position       = this.position.Plus( this.moveVectorU );
		this.sprite.Update( time );
		this.sprite.offsetY += ( this.gravity + this.impulse );
		this.impulse         = ( this.impulse - this.gravity ) * ( this.impulse > 0 );
	}
	Draw() {
		this.sprite.DrawByDistance();
	}
}