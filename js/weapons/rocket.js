function CreateRocket() {
	let weaponSprite = new Sprite( weaponTextures[ 3 ] , new Vector3F( width - 204 , 30 ) , 204 , 225 );
		weaponSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 204 , 225 ) );
		weaponSprite.AddAnimation( 1 , new SpriteAnim( 1 , 5 , 1000 , 204 , 225 ) );
		weaponSprite.AddAnimation( 2 , new SpriteAnim( 6 , 10 , 500 , 204 , 225 ) );
		weaponSprite.CurrentAnimation( 0 , 0 );
	let weapon = new Weapon( weaponSprite );
		weapon.spread  = 0.01;
		weapon.bullets = 0;
		weapon.damage  = 100;
		weapon.reloadSoundId = 9;
		weapon.Fire = function() {
			sound.PlayPlayerSound( 3 );
			let projSprite  = new Sprite( fatterTextures[ unitAnimationsNums.projectile ] , new Vector3F() , 0.1 , 0.18 , -0.5 );
				projSprite.AddAnimation( 0 , new SpriteAnim( 0 , 4 , 300 , 90 , 139 ) );
				projSprite.CurrentAnimation( 0 );
			let projectile        = new Projectile( projSprite , camera.position.Copy() , decals[ 11 ] );
				projectile.speed  = 0.2;
				projectile.damage = this.damage;
				projectile.SetVector( camera.angle );
				projectile.effect = CreateBlastEffect( new Vector3F() , 0 , 1 );
				projectile.sound  = 13;
			level.AddProjectile( projectile );
			this.bullets -= 1;
		}
	return weapon;
}