function CreateRifle() {
	let weaponSprite = new Sprite( weaponTextures[ 2 ] , new Vector3F( widthH - 316 * 0.5 + 52 , height - 90 ) , 316 , 130 );
		weaponSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 316 , 130 ) );
		weaponSprite.AddAnimation( 1 , new SpriteAnim( 1 , 3 , 90 , 316 , 130 ) );
		weaponSprite.AddAnimation( 2 , new SpriteAnim( 4 , 9 , 500 , 316 , 130 ) );
		weaponSprite.CurrentAnimation( 0 , 0 );
	let weapon = new Weapon( weaponSprite );
		weapon.spread  = 0.03;
		weapon.bullets = 0;
		weapon.reloadSoundId = 8;
		weapon.Fire = function() {
			sound.PlayPlayerSound( 2 );
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