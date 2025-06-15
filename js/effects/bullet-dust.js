const bulletDustTexture = [];
function CreateBulletDustEffect( position , offsetY = 0 , size = 1 ) {
	if( bulletDustTexture.length == 0 ) {
		bulletDustTexture.push( new DImage( "img/effects/bullet-dust.png" , 0 , 0  ) );
	}
	let bulletDust = new Sprite( bulletDustTexture[ 0 ] , new Vector3F() , 0.2 * size , 0.2 * size , -0.5 );
		bulletDust.AddAnimation( 0 , new SpriteAnim( 0 , 10 , 500 , 128 , 128 ) );
		bulletDust.CurrentAnimation( 0 );
		bulletDust.offsetY = offsetY;
	return new Effect( bulletDust , position );
}