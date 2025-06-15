const bloodTexture = [];
function CreateBloodEffect( position , offsetY = 0 , size = 1 ) {
	if( bloodTexture.length == 0 ) {
		bloodTexture.push( new DImage( "img/effects/blood.png" , 0 , 0  ) );
	}
	let blood = new Sprite( bloodTexture[ 0 ] , new Vector3F() , 0.2 * size , 0.2 * size , -0.5 );
		blood.AddAnimation( 0 , new SpriteAnim( 0 , 6 , 500 , 136 , 136 ) );
		blood.CurrentAnimation( 0 );
		blood.offsetY = offsetY;
	return new Effect( blood , position );
}