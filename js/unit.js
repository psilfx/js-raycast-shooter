const unitAnimationsNums = { stand : 0 , death : 1 , gethit : 2 , move : 3 , attack : 4 , projectile : 5 , blasted : 6 };
const unitNameNums       = { fatter : 1 , zombie : 2 };
function UnitAnimationHandler( unit ) {
	if( unit.death ) {
		if( unit.spriteId == unitAnimationsNums.death ) return;
		unit.SetSprite( unitAnimationsNums.death );
		unit.sprite.CurrentAnimation( 0 , false );
	} else if( unit.gethit ) {
		unit.SetSprite( unitAnimationsNums.gethit );
		unit.sprite.CurrentAnimation( 0 , false );
	} else if( unit.attack ) {
		unit.SetSprite( unitAnimationsNums.attack );
		//unit.sprite.CurrentAnimation( 0 , false );
	} else if( unit.move ) {
		unit.SetSprite( unitAnimationsNums.move );
		//unit.sprite.CurrentAnimation( 0 , false );
	} else {
		unit.SetSprite( unitAnimationsNums.stand );
		//unit.sprite.CurrentAnimation( 0 , true );
	}
}
class Unit {
	id      = -1;
	sprites = []; //Массив с многосторонними спрайтами
	sprite  = 0;  //Активный спрайт
	spriteId = -1;
	position;
	positionMove;
	angle = 0;
	cells = [];
	distance; //Расстояние до игрока
	side  = 0; //Сторона повёрнутая к камере
	
	enemy;
	//Переключатели
	death       = false;
	gethit      = false;
	unavailable = false;
	move        = false;
	attack      = false;
	attackDone  = false;
	alert       = false;
	collision   = false;
	directCollision = false; //Для обработки столкновения в директоре
	hideDraw        = false; //Скрыть отрисовку
	//
	width   = 0;
	widthH  = 0;
	height  = 0;
	offsetY = 0;
	overlap = new Vector3F();
	orders  = { idle : 0 , actual : 0 };
	stats   = { health : 100 , speed : 0.009 , range : 2 , vision : 4 , fov : 1.57 , fovHalf : 0.785398 , damage : 10 , attackFrame : 3 , score : 0 };
	sounds  = { alert : 14 , attack : 15 , projectile : 16 , gethit : 19 , death : 20 };
	projectileData = { texture : 0 , width : 0 , height : 0 , offsetY : 0 , animTime : 0 , frames : 0 , frameWidth : 0 , frameHeight : 0 , decal : 0 , speed : 0 , effectSize : 0 , effect : 0 };
	
	constructor( position , sprite ) {
		this.position     = position;
		this.AddSprite( unitAnimationsNums.stand , sprite );
		this.SetSprite( unitAnimationsNums.stand );
	}
	AddSprite( id , sprite ) {
		this.sprites[ id ] = sprite;
		if( id == unitAnimationsNums.stand || id == unitAnimationsNums.blasted || id == unitAnimationsNums.projectile ) return;
		//Масштабирует спрайт
		let mainSprite       = this.sprites[ unitAnimationsNums.stand ];
		let frameHeightScale = sprite.frameWidth[ 0 ] / mainSprite.frameWidth[ 0 ];
		sprite.width         = mainSprite.width * frameHeightScale;
		sprite.height        = mainSprite.height * frameHeightScale;
		sprite.offsetY       = mainSprite.offsetY * frameHeightScale;
	}
	SetOrders( idle = 0 , actual = 0 ) {
		this.orders.idle   = idle;
		this.orders.actual = actual;
	}
	GetSprite() {
		return this.sprite;
	}
	SetSprite( spriteId ) {
		if( this.spriteId == spriteId ) return;
		this.sprite   = this.sprites[ spriteId ];
		this.spriteId = spriteId;
		
		this.sprite.AnimationStart();
	}
	SetScreenPosition( x , y ) {
		this.sprite.screenPosition.x = x;
		this.sprite.screenPosition.y = y;
	}
	SetScreenHeights( x , y ) {
		this.sprite.screenHeights.width  = x;
		this.sprite.screenHeights.height = y;
	}
	SetDistance( distance ) {
		this.distance             = distance;
		this.GetSprite().distance = distance;
	}
	CalcSide() {
		let cameraPostion = camera.GetPosition();
		let unitAngle     = angles.Normalize( Math.atan2( this.position.z - cameraPostion.z , this.position.x - cameraPostion.x ) + this.angle );
		this.side         = ( Math.round( unitAngle / 0.785398 ) + 4 ) % 8;
	}
	GetDamage( damage , hitPosition ) {
		if( this.death ) return;
		this.stats.health -= damage;
		this.gethit        = true;
		this.attack        = false;
		this.orders.actual = new SearchOrder( this , hitPosition );
		this.sprites[ unitAnimationsNums.gethit ].GetAnimation().Start();
		if( damage > 50 ) {
	
			let meatObject = new GObject( this.position.Copy() , this.sprites[ unitAnimationsNums.blasted ] );
			level.objects.push( meatObject );
			this.hideDraw = true;
			level.AddDecal( new Vector3F( this.position.x + this.widthH , 0 , this.position.z ) , new Vector3F() , decals[ 9 ] , 0 );
			level.AddDecal( new Vector3F( this.position.x - this.widthH , 0 , this.position.z ) , new Vector3F() , decals[ 9 ] , 0 );
			level.AddDecal( new Vector3F( this.position.x , 0 , this.position.z + this.widthH ) , new Vector3F() , decals[ 9 ] , 0 );
			level.AddDecal( new Vector3F( this.position.x , 0 , this.position.z - this.widthH ) , new Vector3F() , decals[ 9 ] , 0 );
		}
		sound.PlayAmbientSound( this.sounds.gethit , this.position.Subtract( camera.position ) );
		if( this.stats.health <= 0 ) {
			this.death = true;
			level.score += this.stats.score;
			sound.PlayAmbientSound( this.sounds.death , this.position.Subtract( camera.position ) );
		} 
	}
	Attack( enemy ) {
		this.enemy  = enemy;
		this.angle  = -this.GetTargetAngle( enemy.position );
		this.attack = true;
	}
	Alert() {
		this.alert = true;
		if( this.sounds.alert ) sound.PlayAmbientSound( this.sounds.alert , this.position.Subtract( camera.position ) );
		this.sounds.alert = 0;
	}
	DisAlert() {
		this.alert = false;
	}
	StopAttack() {
		if( this.sprites[ unitAnimationsNums.attack ].Animated() ) {
			this.attackDone = false;
			this.attack     = false;
		} 
		return ( !this.attack );
	}
	DoAttack() {
		if( this.sprites[ unitAnimationsNums.attack ].GetFrame() != this.stats.attackFrame || this.attackDone ) return;
		this.attackDone = true;
		if( this.sounds.attack ) sound.PlayAmbientSound( this.sounds.attack , this.position.Subtract( camera.position ) );
		let projData    = this.projectileData;
		let projSprite  = new Sprite( projData.texture , new Vector3F() , projData.width , projData.height , projData.offsetY );
			projSprite.AddAnimation( 0 , new SpriteAnim( 0 , projData.frames , projData.animTime , projData.frameWidth , projData.frameHeight ) );
			projSprite.CurrentAnimation( 0 );
		let projectile = new Projectile( projSprite , this.position.Copy() , projData.decal );
			projectile.owner  = this.id;
			projectile.speed  = projData.speed;
			switch( projData.effect ) {
				case 1 :
					projectile.effect = CreateBloodEffect( new Vector3F() , projData.offsetY , projData.effectSize );
				break;
				case 2 :
					projectile.effect = CreateBulletDustEffect( new Vector3F() , projData.offsetY , projData.effectSize );
				break;
				case 3 :
					projectile.effect = CreateBlastEffect( new Vector3F() , projData.offsetY , projData.effectSize );
				break;
			}
			projectile.SetVector( -this.angle );
			projectile.damage = this.stats.damage;
			projectile.sound  = this.sounds.projectile;
		
		level.AddProjectile( projectile );
	}
	CheckOnVision( enemyPosition ) {
		let posDist = this.position.Subtract( enemyPosition );
		if( Math.abs( posDist.x ) < this.stats.vision && Math.abs( posDist.z ) < this.stats.vision && level.InVision( this.position , enemyPosition ) ) {
			let angle = angles.Normalize( Math.atan2( posDist.z , posDist.x ) + ( this.angle - 3.14 ) );
			return ( Math.abs( angle ) <= this.stats.fovHalf );
		}
		return false;
	}
	CheckOnAttack( enemyPosition ) {
		let posDist = this.position.Subtract( enemyPosition );
		return ( Math.abs( posDist.x ) < this.stats.range && Math.abs( posDist.z ) < this.stats.range );
	}
	GetTargetAngle( target ) {
		let angleVec = target.Subtract( this.position );
		return Math.atan2( angleVec.z , angleVec.x );
	}
	Move( target ) {
		if( this.gethit || this.death || this.attack ) return;
		this.move         = true;
		this.angle        = -this.GetTargetAngle( target );
		this.positionMove = this.position.Plus( caster.CreateVectorFromAngle( this.stats.speed , -this.angle ) );
	}
	DoMove() {
		if( this.collision ) this.DoCollision();
		this.position = this.positionMove;
		this.move     = false;
	}
	Collision( x , z ) {
		this.collision = true;
		this.overlap.x = x;
		this.overlap.z = z;
	}
	DoCollision() {
		this.collision    = false;
		this.positionMove = this.positionMove.Plus( this.overlap );
	}
	Update( time ) {
		this.CalcSide();
		if( this.unavailable ) level.AddDecal( this.position , new Vector3F() , decals[ 7 ] , 0 );
		if( this.sprites[ unitAnimationsNums.gethit ].Animated() && this.gethit ) this.gethit      = false;
		if( this.sprites[ unitAnimationsNums.attack ].Animated() && this.attack ) this.attackDone  = false;
		this.sprite.Update( time );
		if( this.move ) this.DoMove();
		if( this.attack ) this.DoAttack();
		if( this.sprites[ unitAnimationsNums.death ].Animated() && this.death ) this.unavailable = true; //Выключаем контроль юнита, если он умер и анимация проигралась
	}
	Draw() {
		if( this.hideDraw ) return;
		this.sprite.DrawByDistance( this.side );
	}
}