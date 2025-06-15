function CreateRifleAmmo( position , offsetY = 0 ) {
	let rifleAmmo = new Sprite( objectTextures[ 5 ] , new Vector3F() , 0.08 , 0.2 , 0 ); 
		rifleAmmo.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 23 , 64 ) );
		rifleAmmo.CurrentAnimation( 0 );
	let rifleAmmoObject = new GObject( position , rifleAmmo );
		rifleAmmoObject.collectable = true;
		rifleAmmoObject.action      = objectActionsEnum.rifleAmmo;
		rifleAmmoObject.actionValue = 30;
	return rifleAmmoObject;
}