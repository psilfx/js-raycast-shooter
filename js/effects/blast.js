const blastTexture = [];
function CreateBlastEffect( position , offsetY = 0 , size = 1 ) {
	if( blastTexture.length == 0 ) {
		blastTexture.push( new DImage( "img/effects/blast-1.png" , 0 , 0  ) );
	}
	let blast = new Sprite( blastTexture[ 0 ] , new Vector3F() , size , size , offsetY );
		blast.AddAnimation( 0 , new SpriteAnim( 0 , 8 , 700 , 205 , 205 ) );
		blast.CurrentAnimation( 0 );
		blast.offsetY = offsetY;
	return new Effect( blast , position );
}