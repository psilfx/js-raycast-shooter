class Effect {
	position;
	sprite;
	distance = 0;
	constructor( sprite , position ) {
		this.sprite   = sprite;
		this.position = position;
	}
	SetDistance( distance ) {
		this.distance        = distance;
		this.sprite.distance = distance;
	}
	SetScreenPosition( x , y ) {
		this.sprite.screenPosition.x = x;
		this.sprite.screenPosition.y = y;
	}
	SetScreenHeights( x , y ) {
		this.sprite.screenHeights.width  = x;
		this.sprite.screenHeights.height = y;
	}
	Update( time ) {
		if( this.sprite.Animated() ) return;
		this.sprite.Update( time );
	}
	Draw() {
		this.sprite.DrawByDistance();
	}
}