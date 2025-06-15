class Weapon {
	sprite;
	spread     = 0; //Разброс
	bullets    = 10;
	damage     = 5;
	reloadSoundId = 6;
	constructor( sprite ) {
		this.sprite = sprite;
	}
	Update( time ) {
		let heightHalf = this.sprite.texture.img.heightHalf;
		let pickoffset = ( this.sprite.animationId == 2 ) * parseInt( heightHalf - this.sprite.GetAnimation().tdelta * heightHalf );
		this.sprite.screenOffset.y = cameraMove.GetOffsetY() + pickoffset;
		this.sprite.screenOffset.x = parseInt( cameraMove.GetOffsetX() );
		this.sprite.Update( time );
	}
	Animated() {
		return this.sprite.Animated();
	}
	AnimationId() {
		return this.sprite.animationId;
	} 
	Draw() {
		this.sprite.Draw();
	}
	CurrentAnimation( animId ) {
		this.sprite.CurrentAnimation( animId )
	}
	SetNextAnimation( animId ) {
		this.sprite.SetNextAnimation( animId );
	}
	
}