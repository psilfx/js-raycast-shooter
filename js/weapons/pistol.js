function CreatePistol() {
	let weaponSprite = new Sprite( weaponTextures[ 0 ] , new Vector3F( widthH - 201 * 0.5 + 52 , height - 90 ) , 201 , 110 );
		weaponSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 201 , 110 ) );
		weaponSprite.AddAnimation( 1 , new SpriteAnim( 1 , 7 , 300 , 201 , 110 ) );
		weaponSprite.AddAnimation( 2 , new SpriteAnim( 8 , 12 , 500 , 201 , 110 ) );
		weaponSprite.CurrentAnimation( 0 , 0 );
	let weapon = new Weapon( weaponSprite );
		weapon.spread = 0.01;
		weapon.reloadSoundId = 7;
		weapon.bullets = 10;
		weapon.Fire = function() {
			sound.PlayPlayerSound( 0 );
			let spreadT    = Math.random();
			let spreadSide = Math.random() * 2 - 1;
			let offsetY    = -0.5 + this.spread * spreadSide * spreadT;
			let { castUnits , ray , rayStep } = caster.CastUnit( camera.position , camera.angle + ( this.spread * spreadSide * spreadT ) );
			if( castUnits.length > 0 ) {
				castUnits.forEach( ( castUnit , index ) => {
					castUnit.GetDamage( 5 , camera.GetPosition() );
				});
				level.AddEffect( CreateBloodEffect( ray , offsetY  ) );
				
				let decal = decals[ 2 + parseInt( 2 * spreadT ) ];
				
				let projSprite  = new Sprite( decal , new Vector3F() , 0.1 , 0.1 , offsetY - 0.1 );
					projSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 0 , decal.img.width , decal.img.height ) );
					projSprite.CurrentAnimation( 0 );
				let projectile = new Projectile( projSprite , ray , decals[ 5 + parseInt( 3 * spreadT ) ] );
					projectile.SetSpeed( Math.max( 0.005 * Math.random() , 0.001 ) );
					projectile.SetImpulse( 0.15 * Math.random() );
					projectile.SetVector( camera.angle + 6.28 * spreadT );
					projectile.SetGravity( Math.max( 0.05 * Math.random() , 0.03 ) );
					level.AddProjectile( projectile );
				
			} else {
				let soundDist = ray.Subtract( camera.position );
				sound.PlayAmbientSound( 10 , soundDist );
				level.AddEffect( CreateBulletDustEffect( ray , offsetY ) );
				level.AddDecal( ray , rayStep , decals[ 0 ] , offsetY + 0.15 );
			}
			this.bullets -= 1;
		}
	return weapon;
}