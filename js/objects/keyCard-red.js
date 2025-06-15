function CreateRedKeycard( position , offsetY = 0 ) {
	let keyCardRed = new Sprite( objectTextures[ 8 ] , new Vector3F() , 0.2 * 0.631 , 0.2 , 0 ); 
		keyCardRed.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 40 , 64 ) );
		keyCardRed.CurrentAnimation( 0 );
	let keyCardRedObject = new GObject( position , keyCardRed );
		keyCardRedObject.collectable = true;
		keyCardRedObject.action      = objectActionsEnum.keyCard;
		keyCardRedObject.actionValue = keyCardsNamesEnums.red;
		//level.objects.push( keyCardRedObject );
	return keyCardRedObject;
}