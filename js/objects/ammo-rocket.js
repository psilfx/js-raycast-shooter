function CreateRocketAmmo( position , offsetY = 0 ) {
	let rocketAmmo = new Sprite( objectTextures[ 6 ] , new Vector3F() , 0.15 , 0.4 , 0 ); 
		rocketAmmo.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 14 , 64 ) );
		rocketAmmo.CurrentAnimation( 0 );
	let rocketAmmoObject = new GObject( position , rocketAmmo );
		rocketAmmoObject.collectable = true;
		rocketAmmoObject.action      = objectActionsEnum.rocketAmmo;
		rocketAmmoObject.actionValue = 1;
	return rocketAmmoObject;
}