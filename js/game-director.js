const orderEnum = { move : 0 , attack : 1 , patrol : 2 , hold : 3 };

class Order {
	unit;
	action;
	attack = true;
	constructor( unit ) {
		this.unit = unit;
	}
	Update() {
		
	}
	CheckOnCell( position ) {
		// if( parseInt( this.unit.position.x ) == parseInt( position.x ) && parseInt( this.unit.position.z ) == parseInt( position.z ) ) {
			// return true;
		// }
		if( collision.AABBPoint( { x : this.unit.position.x - this.unit.widthH , y : this.unit.position.z - this.unit.widthH , width : this.unit.width , height : this.unit.width } , { x : position.x , y : position.z } ) ) {
			return true;
		}
		return false;
	}
}
class PatrolOrder extends Order {
	positions  = [];
	mapKeys    = [];
	wayPath    = [];
	wayCurr    = 0;
	movePath   = [];
	position;
	enemyPosition;
	currentPos = 0;
	constructor( unit , position1 , position2 ) {
		super( unit );
		this.positions.push( position1 );
		this.positions.push( position2 );
		this.position = this.positions[ this.currentPos ];
	}
	AddPosition( position ) {
		this.positions.push( position );
	}
	GetCurrentTargetPosition() {
		if( this.CheckOnCell( this.position ) ) this.currentPos++;
		if( this.currentPos == this.positions.length ) this.currentPos = 0;
		this.position = this.positions[ this.currentPos ].Plus( new Vector3F( 0.5 , 0 , 0.5 ) ); //Центрируем
		return this.position.Copy();
	}
	WayMove( movePosition , view = false ) {
		if( this.wayCurr >= this.wayPath.length ) {
			this.FindWay( movePosition );
			return;
		} 
		//let movePath;
		let cellCenter = new Vector3F( 0.5 , 0 , 0.5 ); //Для перехода на центр клетки
		// if( this.unit.directCollision && 1 == 2 ) { //Обработка столкновений
			// let dir   = this.wayPath[ this.wayCurr ].Subtract( this.unit.position );
			// let xplus = 2 * ( this.unit.overlap.z ) * -Math.sign( dir.x ); //Если столкновение по x
			// let zplus = 2 * ( this.unit.overlap.x ) * -Math.sign( dir.z ); //Если столкновение по z
			// console.log( xplus , zplus );
			// cellCenter.x = xplus;
			// cellCenter.z = zplus;
			// movePath = this.unit.position.Copy();
			// this.unit.directCollision = false;
		// } else {
			// movePath = this.wayPath[ this.wayCurr ];
		// }
		this.movePath = this.wayPath[ this.wayCurr ].Plus( cellCenter );
		this.unit.Move( this.movePath );
		//if( !level.InVision( this.unit.position , movePath ) ) this.wayCurr = this.wayPath.length;
		if( this.CheckOnCell( this.movePath ) ) this.wayCurr++;
	}
	FindWay( movePosition ) {
		this.wayPath = level.FindWay( this.unit.position , movePosition );
		this.wayCurr = 0;
	}
	Update() {
		if( this.unit.CheckOnVision( camera.GetPosition() ) ) {
			if( !this.unit.alert ) {
				this.wayCurr = this.wayPath.length;
				this.unit.Alert();
			}
			this.enemyPosition = camera.GetPosition().Copy();
			if( this.unit.CheckOnAttack( camera.GetPosition() ) ) {
				this.unit.Attack( camera );
				this.wayCurr = this.wayPath.length;
			} else {
				if( this.unit.StopAttack() ) this.unit.Move( this.enemyPosition );
			}
		} else if( this.unit.alert ) { //Поиск игрока
			if( !this.CheckOnCell( this.enemyPosition ) ) {
				if( this.unit.StopAttack() ) {
					this.WayMove( this.enemyPosition );
				}
			} else {
				if( this.unit.StopAttack() ) {
					this.unit.orders.actual = new SearchOrder( this.unit , camera.GetPosition() );
					this.wayCurr = this.wayPath.length;
				} 
			}
		} else {
			if( this.unit.StopAttack() || !this.unit.attack ) {
				this.WayMove( this.GetCurrentTargetPosition() );
			}
		}
	}
}
class SearchOrder extends Order {
	angle = 0;
	searchStep = 0.05;
	position;
	constructor( unit , enemyPosition ) {
		super( unit );
		this.position = enemyPosition;
	}
	Update() {
		if( this.angle > 6.28 || this.unit.CheckOnVision( this.position ) ) {
			this.unit.DisAlert();
			return 0;
		}
		this.angle      += this.searchStep; 
		this.unit.angle += this.searchStep;
		return 1;
	}
}
class AttackOrder extends Order {
	enemy;
	constructor( unit , enemy ) {
		super( unit );
		this.enemy = enemy;
	}
	Update() {
		if( !this.unit.CheckOnAttack( this.enemy.position ) ) {
			this.unit.Attack( this.enemy );
		}
		return 0;
	}
}
class MoveOrder extends Order {
	position;
	constructor( unit , position ) {
		super( unit );
		this.position = position;
	}
	Update() {
		if( !this.CheckOnCell( this.position ) ) {
			this.unit.Move( this.position );
			return 1;
		}
		return 0;
	}
}
class GameDirector {
	orders = [];
	Decision() {
		let enemyPosition = camera.GetPosition();
		for( let u = 0; u < level.units.length; u++ ) {
			let unit = level.units[ u ];
			
		}
	}
	Update() {
		for( let u = 0; u < level.units.length; u++ ) {
			let unit = level.units[ u ];
			if( unit.unavailable ) continue;
				if( unit.orders.actual ) {
					if( !unit.orders.actual.Update() ) unit.orders.actual = 0;
				} else if( unit.orders.idle ) {
					unit.orders.idle.Update();
				} 
		}
	}
	Order( unit , order ) {
		this.orders.push( order );
		unit.SetOrders( order );
		//order
	} 
}