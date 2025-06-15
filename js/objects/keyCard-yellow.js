function CreateYellowKeycard( position , offsetY = 0 ) {
	let keyCardYellow = new Sprite( objectTextures[ 9 ] , new Vector3F() , 0.2 * 0.631 , 0.2 , 0 ); 
		keyCardYellow.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 40 , 64 ) );
		keyCardYellow.CurrentAnimation( 0 );
	let keyCardYellowObject = new GObject( position , keyCardYellow );
		keyCardYellowObject.collectable = true;
		keyCardYellowObject.action      = objectActionsEnum.keyCard;
		keyCardYellowObject.actionValue = keyCardsNamesEnums.yellow;
	return keyCardYellowObject;
}