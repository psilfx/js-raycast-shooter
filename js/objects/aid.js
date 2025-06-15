function CreateAidObject( position , offsetY = 0 ) {
	let aid = new Sprite( objectTextures[ 2 ] , new Vector3F() , 0.2 , 0.14 , 0 ); 
		aid.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 85 , 64 ) );
		aid.CurrentAnimation( 0 );
	let aidObject = new GObject( position , aid );
		aidObject.collectable = true;
		aidObject.action      = objectActionsEnum.health;
		aidObject.actionValue = 25;
		aidObject.score       = 7;
	return aidObject;
}