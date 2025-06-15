const objectActionsEnum = { none : 0 , health : 1 , pistolAmmo : 2 , shotgunAmmo : 3 , rifleAmmo : 4 , rocketAmmo : 5 , keyCard : 6 };
class GObject {
	id = -1;
	position;
	sprite;
	acceleration = 0.001;
	speed        = 0;
	speedMax     = 0.1;
	rebound = { x : 0 , y : 0 };
	impact  = { x : 0 , y : 0 };
	calm    = false;
	collectable = false;
	action      = 0;
	actionValue = 0;
	score       = 5;
	constructor( position , sprite ) {
		this.position = position;
		this.sprite   = sprite;
	}
	Collect() {
		if( !this.action ) return;
		switch ( this.action ) {
			case objectActionsEnum.health: //Здоровье
				if( player.AddHealth( this.actionValue ) ) level.DeleteObject( this.id );
			break;
			case objectActionsEnum.pistolAmmo: //Патроны пистолета
				if( player.AddAmmo( weaponsNamesEnums.pistol , this.actionValue ) ) level.DeleteObject( this.id );
			break;
			case objectActionsEnum.shotgunAmmo: //Патроны дробовика
				if( player.AddAmmo( weaponsNamesEnums.shotgun , this.actionValue ) ) level.DeleteObject( this.id );
			break;
			case objectActionsEnum.rifleAmmo: //Патроны пистолет пулемёта
				if( player.AddAmmo( weaponsNamesEnums.rifle , this.actionValue ) ) level.DeleteObject( this.id );
			break;
			case objectActionsEnum.rocketAmmo: //Патроны пистолет пулемёта
				if( player.AddAmmo( weaponsNamesEnums.rocket , this.actionValue ) ) level.DeleteObject( this.id );
			break;
			case objectActionsEnum.keyCard: //Добавляем ключ
				if( player.AddKeyCard( this.actionValue ) ) level.DeleteObject( this.id );
			break;
		}
		level.score += this.score;
		//alert( "collected" );
	}
	Update( time ) {
		//this.sprite.Update( time );
		if( this.calm ) return;
		let acceleration     = Math.min( this.speed , this.speedMax );
		this.speed          += this.acceleration;
		this.sprite.offsetY += acceleration - acceleration * ( this.rebound.y > 0 ) * 2;
		this.impact.y       += acceleration * ( this.rebound.y < 0 );
		this.rebound.y      -= acceleration;
		if( this.sprite.offsetY >= 0 ) {
			this.rebound.y      = this.impact.y * 0.5;
			this.impact.y       = 0;
			this.speed          = acceleration * 0.5;
			if( this.rebound.y <= acceleration ) this.calm = true;
		}
	}
	Draw() {
		this.sprite.DrawByDistance();
	}
}