const zombieTextures = [];
function CreateZombieUnit( position ) {
	if( zombieTextures.length == 0 ) {
		zombieTextures[ unitAnimationsNums.stand ] = [];
		zombieTextures[ unitAnimationsNums.stand ][ 0 ] = new DImage( "img/enemies/zombie/stand/0.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 1 ] = new DImage( "img/enemies/zombie/stand/1.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 2 ] = new DImage( "img/enemies/zombie/stand/2.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 3 ] = new DImage( "img/enemies/zombie/stand/3.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 4 ] = new DImage( "img/enemies/zombie/stand/4.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 5 ] = new DImage( "img/enemies/zombie/stand/5.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 6 ] = new DImage( "img/enemies/zombie/stand/6.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.stand ][ 7 ] = new DImage( "img/enemies/zombie/stand/7.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.death ] = [];
		zombieTextures[ unitAnimationsNums.death ][ 0 ] = new DImage( "img/enemies/zombie/death/0.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 1 ] = new DImage( "img/enemies/zombie/death/1.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 2 ] = new DImage( "img/enemies/zombie/death/2.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 3 ] = new DImage( "img/enemies/zombie/death/3.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 4 ] = new DImage( "img/enemies/zombie/death/4.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 5 ] = new DImage( "img/enemies/zombie/death/5.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 6 ] = new DImage( "img/enemies/zombie/death/6.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.death ][ 7 ] = new DImage( "img/enemies/zombie/death/7.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.gethit ] = [];
		zombieTextures[ unitAnimationsNums.gethit ][ 0 ] = new DImage( "img/enemies/zombie/gethit/0.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 1 ] = new DImage( "img/enemies/zombie/gethit/1.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 2 ] = new DImage( "img/enemies/zombie/gethit/2.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 3 ] = new DImage( "img/enemies/zombie/gethit/3.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 4 ] = new DImage( "img/enemies/zombie/gethit/4.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 5 ] = new DImage( "img/enemies/zombie/gethit/5.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 6 ] = new DImage( "img/enemies/zombie/gethit/6.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.gethit ][ 7 ] = new DImage( "img/enemies/zombie/gethit/7.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.move ] = [];
		zombieTextures[ unitAnimationsNums.move ][ 0 ] = new DImage( "img/enemies/zombie/move/0.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 1 ] = new DImage( "img/enemies/zombie/move/1.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 2 ] = new DImage( "img/enemies/zombie/move/2.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 3 ] = new DImage( "img/enemies/zombie/move/3.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 4 ] = new DImage( "img/enemies/zombie/move/4.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 5 ] = new DImage( "img/enemies/zombie/move/5.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 6 ] = new DImage( "img/enemies/zombie/move/6.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.move ][ 7 ] = new DImage( "img/enemies/zombie/move/7.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.attack ] = [];
		zombieTextures[ unitAnimationsNums.attack ][ 0 ] = new DImage( "img/enemies/zombie/attack/0.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 1 ] = new DImage( "img/enemies/zombie/attack/1.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 2 ] = new DImage( "img/enemies/zombie/attack/2.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 3 ] = new DImage( "img/enemies/zombie/attack/3.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 4 ] = new DImage( "img/enemies/zombie/attack/4.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 5 ] = new DImage( "img/enemies/zombie/attack/5.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 6 ] = new DImage( "img/enemies/zombie/attack/6.png" , 0 , 0  );
		zombieTextures[ unitAnimationsNums.attack ][ 7 ] = new DImage( "img/enemies/zombie/attack/7.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.projectile ] =  new DImage( "img/enemies/zombie/projectile.png" , 0 , 0  );
		
		zombieTextures[ unitAnimationsNums.blasted ] = new DImage( "img/objects/zombie-ass.png" , 0 , 0  );
	}
	let spriteWidth  = 0.3;
	let spriteHeight = 0.6;
	let spriteOffset = 0.2;
	let spriteStand = new SpriteSides( zombieTextures[ unitAnimationsNums.stand ][ 0 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 1 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 2 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 3 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 4 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 5 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 6 ] , 
										zombieTextures[ unitAnimationsNums.stand ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteStand.AddAnimation( 0 , new SpriteAnim( 0 , 11 , 1100 , 105 , 222 ) );
	spriteStand.CurrentAnimation( 0 );
	spriteStand.CreateFrames();
	let spriteDeath = new SpriteSides( 	zombieTextures[ unitAnimationsNums.death ][ 0 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 1 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 2 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 3 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 4 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 5 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 6 ] , 
										zombieTextures[ unitAnimationsNums.death ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteDeath.AddAnimation( 0 , new SpriteAnim( 0 , 8 , 800 , 508 , 256 ) );
	spriteDeath.CurrentAnimation( 0 );
	spriteDeath.CreateFrames();
	
	let spriteGethit = new SpriteSides( zombieTextures[ unitAnimationsNums.gethit ][ 0 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 1 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 2 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 3 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 4 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 5 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 6 ] , 
										zombieTextures[ unitAnimationsNums.gethit ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteGethit.AddAnimation( 0 , new SpriteAnim( 0 , 6 , 800 , 288 , 222 ) );
	spriteGethit.CurrentAnimation( 0 );
	spriteGethit.CreateFrames();
	
	let spriteMove = new SpriteSides( 	zombieTextures[ unitAnimationsNums.move ][ 0 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 1 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 2 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 3 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 4 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 5 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 6 ] , 
										zombieTextures[ unitAnimationsNums.move ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteMove.AddAnimation( 0 , new SpriteAnim( 0 , 11 , 1600 , 283 , 206 ) );
	spriteMove.CurrentAnimation( 0 );
	spriteMove.CreateFrames();
	
	let spriteAttack = new SpriteSides( zombieTextures[ unitAnimationsNums.attack ][ 0 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 1 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 2 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 3 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 4 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 5 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 6 ] , 
										zombieTextures[ unitAnimationsNums.attack ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteAttack.AddAnimation( 0 , new SpriteAnim( 0 , 10 , 1500 , 230 , 205 ) );
	spriteAttack.CurrentAnimation( 0 );
	spriteAttack.CreateFrames();
	
	let spriteMeat = new Sprite( zombieTextures[ unitAnimationsNums.blasted ] , new Vector3F() , 0.4 , 0.15 , -0.2 ); 
		spriteMeat.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 159 , 64 ) );
		spriteMeat.CurrentAnimation( 0 );
	
	let projSprite  = new Sprite( zombieTextures[ unitAnimationsNums.projectile ] , new Vector3F() , 0.1 , 0.18 , -0.5 );
		projSprite.AddAnimation( 0 , new SpriteAnim( 0 , 4 , 300 , 90 , 139 ) );
		projSprite.CurrentAnimation( 0 );
	
	let unit         = new Unit( position , spriteStand );
		unit.width   = 0.5;
		unit.widthH  = 0.25;
		unit.height  = spriteHeight;
		unit.offsetY = spriteOffset;
		unit.AddSprite( unitAnimationsNums.death , spriteDeath );
		unit.AddSprite( unitAnimationsNums.gethit , spriteGethit );
		unit.AddSprite( unitAnimationsNums.move , spriteMove );
		unit.AddSprite( unitAnimationsNums.attack , spriteAttack );
		unit.AddSprite( unitAnimationsNums.blasted , spriteMeat );
		//unit.AddSprite( unitAnimationsNums.projectile , projSprite );
		//unit.sprites[ unitAnimationsNums.stand ].Scale( 0.6 );
		unit.sprites[ unitAnimationsNums.move ].Scale( 0.4 );
		unit.sprites[ unitAnimationsNums.move ].ScaleX( 2.4 );
		unit.sprites[ unitAnimationsNums.gethit ].Scale( 0.4 ); 
		unit.sprites[ unitAnimationsNums.gethit ].ScaleX( 2.4 );
		unit.sprites[ unitAnimationsNums.death ].Scale( 0.28 );
		unit.sprites[ unitAnimationsNums.death ].ScaleX( 3.2 );
		unit.sprites[ unitAnimationsNums.attack ].Scale( 0.49 );
		unit.sprites[ unitAnimationsNums.attack ].ScaleX( 2 );
		unit.stats.damage      = 15;
		unit.stats.health      = 20;
		unit.stats.range       = 1;
		unit.stats.vision      = 8;
		//unit.stats.fov         = 1.57;
		unit.stats.fov         = 2.57;
		//unit.stats.fovHalf     = 0.785398;
		unit.stats.fovHalf     = unit.stats.fov * 0.5;
		unit.stats.speed       = 0.004;
		unit.stats.attackFrame = 3;
		unit.stats.score       = 15;
		unit.sounds.alert      = 26;
		unit.sounds.death      = 27;
		unit.sounds.attack     = 28;
		unit.sounds.gethit     = 29;
		unit.sounds.projectile = 30;
		unit.projectileData.texture  = zombieTextures[ unitAnimationsNums.projectile ];
		unit.projectileData.width    = 0.1;
		unit.projectileData.height   = 0.18;
		unit.projectileData.offsetY  = -0.5;
		unit.projectileData.animTime = 300;
		unit.projectileData.frames   = 4;
		unit.projectileData.speed    = 0.2;
		unit.projectileData.frameWidth  = 0;
		unit.projectileData.frameHeight = 0;
		unit.projectileData.effect      = 0;
		unit.projectileData.effectSize  = 0;
		//unit.projectileData.decal       = decals[ 1 ];
	return unit;
}