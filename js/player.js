const weaponsNamesEnums  = { pistol : 0 , shotgun : 1 , rifle : 2 , rocket : 3 };
const keyCardsNamesEnums = { none : 0 , red : 1 , blue : 2 , yellow : 3 };
class Player {
	position;
	camera;
	weapon;
	stats     = { health : 100 , healthMax : 100 };
	inventory = { weapons : [] , weaponId : 0 , items: [] , keys : { 0 : true } };
	death     = false;
	pause     = true;
	pickUpStart    = 0;
	getDamageStart = 0;
	constructor( camera , weaponId ) {
		this.Reset();
		this.SetWeapon( weaponId );
		this.camera   = camera;
		this.position = camera.position;
	}
	AddHealth( value ) {
		if( this.stats.health == this.stats.healthMax ) return false; //Возвращаем false, чтобы предмет не поднимался
		this.stats.health = Math.min( this.stats.health + value , this.stats.healthMax );
		this.SetPickUpStart();
		sound.PlayPlayerSound( 21 );
		return true;
	}
	AddAmmo( weaponId , value ) {
		this.inventory.weapons[ weaponId ].bullets += value;
		this.SetPickUpStart();
		sound.PlayPlayerSound( 11 );
		return true;
	}
	NextWeapon() {
		this.SetWeapon( this.GetWeaponId( 1 ) );
	}
	PrevWeapon() {
		this.SetWeapon( this.GetWeaponId( -1 ) );
	}
	GetWeaponId( direction ) {
		let maxId = 3;
		let id = this.inventory.weaponId + direction;
			id = id * ( id >= 0 ) + ( id < 0 ) * maxId; //Если id меньше 1
			id = id * ( id <= maxId ); //Если id больше maxId
		if( this.inventory.weapons[ id ] ) {
			return id;
		} else {
			return this.GetWeaponId( direction );
		}
	}
	AddKeyCard( keyCardId ) {
		this.inventory.keys[ keyCardId ] = true;
		this.SetPickUpStart();
		sound.PlayPlayerSound( 11 );
		return true;
	}
	CreateWeapons() {
		this.inventory.weapons[ weaponsNamesEnums.pistol ]  = CreatePistol();
		this.inventory.weapons[ weaponsNamesEnums.shotgun ] = CreateShotgun();
		this.inventory.weapons[ weaponsNamesEnums.rifle ]   = CreateRifle();
		this.inventory.weapons[ weaponsNamesEnums.rocket ]  = CreateRocket();
	}
	GetDamage( damage ) {
		this.stats.health = ( this.stats.health - damage ) * ( !this.death );
		this.getDamageStart = new Date().getTime();
		sound.PlayPlayerSound( 22 );
		if( this.stats.health < 1 ) sound.PlayPlayerSound( 23 );
	}
	SetWeapon( weaponId ) {
		if( this.weapon.Animated() && this.inventory.weaponId != weaponId ) {
			this.inventory.weaponId = weaponId;
			this.weapon             = this.inventory.weapons[ weaponId ];
			this.weapon.CurrentAnimation( 2 , false );
			this.weapon.SetNextAnimation( 0 );
			sound.PlayPlayerSound( this.weapon.reloadSoundId );
		} 
	}
	SetPickUpStart() {
		this.pickUpStart = new Date().getTime();
	}
	Update( time ) {
		this.death  = ( this.stats.health < 1 );
		this.pause  = this.death; 
		this.weapon.Update( time );
		this.camera.Update( time );
	}
	Draw() {
		this.weapon.Draw();
		if( this.pickUpStart ) {
			let time = new Date().getTime();
			let perc = 1 - ( time - this.pickUpStart ) / 200;
			context.fillStyle = "rgba( 255 , 255 , 0 , " + 0.3 * perc + ") ";
			context.fillRect( 0 , 0 , width , height );
			this.pickUpStart = this.pickUpStart * ( perc < 1 );
		}
		if( this.getDamageStart ) {
			let time = new Date().getTime();
			let perc = 1 - ( time - this.getDamageStart ) / 500;
			context.fillStyle = "rgba( 255 , 0 , 0 , " + 0.5 * perc + ") ";
			context.fillRect( 0 , 0 , width , height );
			this.getDamageStart = this.getDamageStart * ( perc < 1 );
		}
	}
	Reset() {
		this.stats.health = 100;
		this.inventory = { weapons : [] , weaponId : 0 , items: [] , keys : { 0 : true } };
		this.death        = false;
		this.CreateWeapons();
		this.weapon       = this.inventory.weapons[ weaponsNamesEnums.pistol ];
		this.SetWeapon( weaponsNamesEnums.pistol );
	}
}