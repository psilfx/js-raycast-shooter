function CreateBlueKeycard( position , offsetY = 0 ) {
	let keyCardBlue = new Sprite( objectTextures[ 7 ] , new Vector3F() , 0.2 * 0.631 , 0.2 , 0 ); 
		keyCardBlue.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 40 , 64 ) );
		keyCardBlue.CurrentAnimation( 0 );
	let keyCardBlueObject = new GObject( position , keyCardBlue );
		keyCardBlueObject.collectable = true;
		keyCardBlueObject.action      = objectActionsEnum.keyCard;
		keyCardBlueObject.actionValue = keyCardsNamesEnums.blue;
	return keyCardBlueObject;
}