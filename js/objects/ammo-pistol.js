function CreatePistolAmmo( position , offsetY = 0 ) {
	let pistolAmmo = new Sprite( objectTextures[ 3 ] , new Vector3F() , 0.1 , 0.05 , 0 ); 
		pistolAmmo.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 99 , 64 ) );
		pistolAmmo.CurrentAnimation( 0 );
	let pistolAmmoObject = new GObject( position , pistolAmmo );
		pistolAmmoObject.collectable = true;
		pistolAmmoObject.action      = objectActionsEnum.pistolAmmo;
		pistolAmmoObject.actionValue = 8;
	return pistolAmmoObject;
}