function CreateShotgun() {
	let weaponSprite = new Sprite( weaponTextures[ 1 ] , new Vector3F( width - 302 , height - 130 ) , 302 , 150 );
		weaponSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 302 , 150 ) );
		weaponSprite.AddAnimation( 1 , new SpriteAnim( 0 , 11 , 600 , 302 , 150 ) );
		weaponSprite.AddAnimation( 2 , new SpriteAnim( 12 , 16 , 700 , 302 , 150 ) );
		weaponSprite.CurrentAnimation( 0 , 0 );
	let weapon = new Weapon( weaponSprite );
		weapon.spread = 0.15;
		weapon.reloadSoundId = 6;
		weapon.bullets = 0;
		weapon.Fire = function() {
			sound.PlayPlayerSound( 1 );
			for( let s = 0; s < 10; s++ ) {
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
					level.AddDecal( ray , rayStep , decals[ 10 ] , offsetY + 0.15 );
				}
			}
			this.bullets -= 1;
		}
	return weapon;
}