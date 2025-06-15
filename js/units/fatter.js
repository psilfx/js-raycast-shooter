const fatterTextures = [];
function CreateFatterUnit( position ) {
	if( fatterTextures.length == 0 ) {
		fatterTextures[ unitAnimationsNums.stand ] = [];
		fatterTextures[ unitAnimationsNums.stand ][ 0 ] = new DImage( "img/enemies/fatter/stand/0.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 1 ] = new DImage( "img/enemies/fatter/stand/1.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 2 ] = new DImage( "img/enemies/fatter/stand/2.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 3 ] = new DImage( "img/enemies/fatter/stand/3.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 4 ] = new DImage( "img/enemies/fatter/stand/4.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 5 ] = new DImage( "img/enemies/fatter/stand/5.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 6 ] = new DImage( "img/enemies/fatter/stand/6.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.stand ][ 7 ] = new DImage( "img/enemies/fatter/stand/7.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.death ] = [];
		fatterTextures[ unitAnimationsNums.death ][ 0 ] = new DImage( "img/enemies/fatter/death/0.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 1 ] = new DImage( "img/enemies/fatter/death/1.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 2 ] = new DImage( "img/enemies/fatter/death/2.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 3 ] = new DImage( "img/enemies/fatter/death/3.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 4 ] = new DImage( "img/enemies/fatter/death/4.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 5 ] = new DImage( "img/enemies/fatter/death/5.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 6 ] = new DImage( "img/enemies/fatter/death/6.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.death ][ 7 ] = new DImage( "img/enemies/fatter/death/7.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.gethit ] = [];
		fatterTextures[ unitAnimationsNums.gethit ][ 0 ] = new DImage( "img/enemies/fatter/gethit/0.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 1 ] = new DImage( "img/enemies/fatter/gethit/1.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 2 ] = new DImage( "img/enemies/fatter/gethit/2.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 3 ] = new DImage( "img/enemies/fatter/gethit/3.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 4 ] = new DImage( "img/enemies/fatter/gethit/4.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 5 ] = new DImage( "img/enemies/fatter/gethit/5.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 6 ] = new DImage( "img/enemies/fatter/gethit/6.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.gethit ][ 7 ] = new DImage( "img/enemies/fatter/gethit/7.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.move ] = [];
		fatterTextures[ unitAnimationsNums.move ][ 0 ] = new DImage( "img/enemies/fatter/move/0.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 1 ] = new DImage( "img/enemies/fatter/move/1.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 2 ] = new DImage( "img/enemies/fatter/move/2.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 3 ] = new DImage( "img/enemies/fatter/move/3.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 4 ] = new DImage( "img/enemies/fatter/move/4.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 5 ] = new DImage( "img/enemies/fatter/move/5.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 6 ] = new DImage( "img/enemies/fatter/move/6.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.move ][ 7 ] = new DImage( "img/enemies/fatter/move/7.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.attack ] = [];
		fatterTextures[ unitAnimationsNums.attack ][ 0 ] = new DImage( "img/enemies/fatter/attack/0.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 1 ] = new DImage( "img/enemies/fatter/attack/1.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 2 ] = new DImage( "img/enemies/fatter/attack/2.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 3 ] = new DImage( "img/enemies/fatter/attack/3.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 4 ] = new DImage( "img/enemies/fatter/attack/4.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 5 ] = new DImage( "img/enemies/fatter/attack/5.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 6 ] = new DImage( "img/enemies/fatter/attack/6.png" , 0 , 0  );
		fatterTextures[ unitAnimationsNums.attack ][ 7 ] = new DImage( "img/enemies/fatter/attack/7.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.projectile ] =  new DImage( "img/enemies/fatter/projectile.png" , 0 , 0  );
		
		fatterTextures[ unitAnimationsNums.blasted ] = new DImage( "img/objects/fatter-ass.png" , 0 , 0  );
	}
	let spriteWidth  = 0.4;
	let spriteHeight = 0.5;
	let spriteOffset = 0.1;
	let spriteStand = new SpriteSides( fatterTextures[ unitAnimationsNums.stand ][ 0 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 1 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 2 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 3 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 4 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 5 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 6 ] , 
										fatterTextures[ unitAnimationsNums.stand ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteStand.AddAnimation( 0 , new SpriteAnim( 0 , 11 , 1100 , 185 , 165 ) );
	spriteStand.CurrentAnimation( 0 );
	spriteStand.CreateFrames();
	let spriteDeath = new SpriteSides( 	fatterTextures[ unitAnimationsNums.death ][ 0 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 1 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 2 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 3 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 4 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 5 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 6 ] , 
										fatterTextures[ unitAnimationsNums.death ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteDeath.AddAnimation( 0 , new SpriteAnim( 0 , 10 , 800 , 230 , 205 ) );
	spriteDeath.CurrentAnimation( 0 );
	spriteDeath.CreateFrames();
	
	let spriteGethit = new SpriteSides( fatterTextures[ unitAnimationsNums.gethit ][ 0 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 1 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 2 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 3 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 4 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 5 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 6 ] , 
										fatterTextures[ unitAnimationsNums.gethit ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteGethit.AddAnimation( 0 , new SpriteAnim( 0 , 5 , 300 , 230 , 205 ) );
	spriteGethit.CurrentAnimation( 0 );
	spriteGethit.CreateFrames();
	
	let spriteMove = new SpriteSides( 	fatterTextures[ unitAnimationsNums.move ][ 0 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 1 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 2 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 3 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 4 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 5 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 6 ] , 
										fatterTextures[ unitAnimationsNums.move ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteMove.AddAnimation( 0 , new SpriteAnim( 0 , 4 , 800 , 230 , 205 ) );
	spriteMove.CurrentAnimation( 0 );
	spriteMove.CreateFrames();
	
	let spriteAttack = new SpriteSides( fatterTextures[ unitAnimationsNums.attack ][ 0 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 1 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 2 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 3 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 4 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 5 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 6 ] , 
										fatterTextures[ unitAnimationsNums.attack ][ 7 ] , 
										new Vector3F( widthH , heightH ) , spriteWidth , spriteHeight , spriteOffset  );
	spriteAttack.AddAnimation( 0 , new SpriteAnim( 0 , 6 , 600 , 230 , 205 ) );
	spriteAttack.CurrentAnimation( 0 );
	spriteAttack.CreateFrames();
	
	let meat = new Sprite( fatterTextures[ unitAnimationsNums.blasted ] , new Vector3F() , 0.5 , 0.3 , -0.2 ); 
		meat.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 100 , 176 , 101 ) );
		meat.CurrentAnimation( 0 );
	
	let unit         = new Unit( position , spriteStand );
		unit.width   = 0.5;
		unit.widthH  = 0.25;
		unit.height  = spriteHeight;
		unit.offsetY = spriteOffset;
		unit.AddSprite( unitAnimationsNums.death , spriteDeath );
		unit.AddSprite( unitAnimationsNums.gethit , spriteGethit );
		unit.AddSprite( unitAnimationsNums.move , spriteMove );
		unit.AddSprite( unitAnimationsNums.attack , spriteAttack );
		unit.AddSprite( unitAnimationsNums.blasted , meat );
		unit.sprites[ unitAnimationsNums.stand ].Scale( 0.95 );
		unit.sprites[ unitAnimationsNums.move ].Scale( 1.2 ); 
		unit.sprites[ unitAnimationsNums.death ].Scale( 0.75 );
		unit.stats.damage      = 25;
		unit.stats.health      = 100;
		unit.stats.range       = 8;
		unit.stats.vision      = 8;
		//unit.stats.fov         = 1.57;
		unit.stats.fov         = 2.57;
		//unit.stats.fovHalf     = 0.785398;
		unit.stats.fovHalf     = unit.stats.fov * 0.5;
		unit.stats.speed       = 0.009;
		unit.stats.attackFrame = 3;
		unit.stats.score       = 50;
		unit.projectileData.texture  = fatterTextures[ unitAnimationsNums.projectile ];
		unit.projectileData.width    = 0.1;
		unit.projectileData.height   = 0.18;
		unit.projectileData.offsetY  = -0.5;
		unit.projectileData.animTime = 300;
		unit.projectileData.frames   = 4;
		unit.projectileData.speed    = 0.1;
		unit.projectileData.frameWidth  = 90;
		unit.projectileData.frameHeight = 139;
		unit.projectileData.decal       = decals[ 1 ];
		unit.projectileData.effect      = 3;
		unit.projectileData.effectSize  = 0.4;
	return unit;
}