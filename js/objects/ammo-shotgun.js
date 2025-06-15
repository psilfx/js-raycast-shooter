function CreateShotgunAmmo( position , offsetY = 0 ) {
	let shotgunAmmo = new Sprite( objectTextures[ 4 ] , new Vector3F() , 0.15 , 0.1 , 0 ); 
		shotgunAmmo.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 99 , 64 ) );
		shotgunAmmo.CurrentAnimation( 0 );
	let shotgunAmmoObject = new GObject( position , shotgunAmmo );
		shotgunAmmoObject.collectable = true;
		shotgunAmmoObject.action      = objectActionsEnum.shotgunAmmo;
		shotgunAmmoObject.actionValue = 4;
	return shotgunAmmoObject;
}