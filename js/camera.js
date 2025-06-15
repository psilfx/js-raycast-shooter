class CameraMoveAnimation {
	//Y
	tdeltaY    = 0;
	tdeltaYD   = 0;
	currentY   = 0;
	targetY    = 10;
	//X
	tdeltaX    = 0;
	tdeltaXD   = 0;
	currentX   = 0;
	targetX    = 20;
	constructor() {
		
	}
	Update( time ) {
		this.UpdateY( time );
		this.UpdateX( time );
	}
	UpdateY( time ) {
		( this.currentY == 0 ) ? this.tdeltaY += 1 : this.tdeltaY -= 1;
		if( this.tdeltaY >= this.targetY ) this.currentY = 1;
		this.tdeltaYD = this.tdeltaY << 1;
		if( this.tdeltaY <= 0 ) this.currentY = 0;
	}
	UpdateX( time ) {
		( this.currentX == 0 ) ? this.tdeltaX += 1 : this.tdeltaX -= 1;
		if( this.tdeltaX >= this.targetX ){
			this.currentX = 1;
			sound.PlayPlayerSound( 4 );
		} 
		this.tdeltaXD = this.tdeltaX << 1;
		if( this.tdeltaX <= 0 ) {
			this.currentX = 0;
			sound.PlayPlayerSound( 5 );
		} 
	}
	GetOffsetY() {
		return this.tdeltaY;
	}
	GetOffsetX() {
		return this.tdeltaX;
	}
}
class Camera {
	position = new Vector3F( 1.5 , 0 , 1.5 );
	overlap  = new Vector3F();
	angle    = 0 ; //Угол поворота вокруг y оси
	up       = 0; //Подъем камеры для эмуляции ходьбы
	rotAngle = 0.025; //Скорость поворота
	speed    = 0.05; //Скорость перемещения
	width    = 0.4;
	widthH   = 0.2;
	check    = new Vector3F();
	
	move     = new Vector3F();
	rotate   = 0; //Угол поворота
	
	collision = false;
	
	GetPosition() {
		return this.position;
	}
	GetAngle() {
		return this.angle;
	}
	Rotate( direction ) {
		this.rotate = this.rotAngle * fps.delta * direction;
	}
	SetPosition( position ) {
		this.position = position;
	}
	RotateMouse() {
		this.rotate = controls.input.mouseMove.x * fps.delta;
	}
	CheckCellPosition() {
		this.collision = false;
		this.overlap.x = 0;
		this.overlap.z = 0;
		this.CheckCellCollision( this.position.x - this.widthH , this.position.z + this.widthH );
		this.CheckCellCollision( this.position.x - this.widthH , this.position.z - this.widthH );
		this.CheckCellCollision( this.position.x + this.widthH , this.position.z + this.widthH );
		this.CheckCellCollision( this.position.x + this.widthH , this.position.z - this.widthH );
	}
	CheckCellCollision( x , y ) {
		let key = level.GetMapKey( x , y );
		if( !level.cells[ key ] ) return false;
		let door = level.doors[ key ];
		if( door ) {
			if( door.open && door.offset >= 1 ) return false; //Если дверь открыта, пропускаем
		}
		let overlapX = Math.floor( x ) - x + ( 1 * ( this.position.x > Math.floor( x ) ) );
		let overlapY = Math.floor( y ) - y + ( 1 * ( this.position.z > Math.floor( y ) ) );
		( overlapX > overlapY ) ? overlapX = 0 : overlapY = 0;
		this.position.x += overlapX;
		this.position.z += overlapY;
		this.collision = true;
		return true;
	}
	Update() {
		if( this.rotate ) {
			this.angle += this.rotate;
			this.rotate = 0;
			this.angle = angles.Normalize( this.angle );
		}
		
		if( this.move.z != 0 || this.move.x != 0 ) {
			let strafeAngle = ( this.move.z != 0 && this.move.x != 0 ) ? 0.785398 * this.move.x : 1.57 * this.move.x; //45 градусов если задействованы оба направления, 90, если как обычно
			let moveAngle   = ( this.move.z < 0  ) ? this.angle - strafeAngle : this.angle + strafeAngle;
			let speed       = ( this.move.z != 0 ) ? this.speed * this.move.z : this.speed;
			if( this.move.z == 1 && this.move.x == 0 ) speed += this.speed * 0.5;
			this.check = this.position.Subtract( new Vector3F( -this.widthH , 0 , -this.widthH ) ).Plus( caster.CreateVectorFromAngle( this.width * this.move.z * fps.delta , moveAngle ) ); //Отктываемся на центр и прибавляем шаг проверки
			let mapKey = level.GetMapKey( this.check.x , this.check.z );
			if( !level.cells[ mapKey ] && 1 == 2 ) {
				let units;
				let collisionSW = false;
				if( units = level.unitsPositions[ mapKey ] ) {
					units.forEach( ( unit , index ) => {
						if( !unit.unavailable ) {
							if( collisionSW = collision.AABB( { x : this.check.x - this.widthH , y : this.check.z - this.widthH , width : this.width , height : this.width } , { x : unit.position.x - unit.widthH , y : unit.position.z - unit.widthH , width : unit.width , height : unit.width } ) ) return;
						}
					})
				}
				if( !collisionSW ) {
					this.position = this.position.Plus( caster.CreateVectorFromAngle( speed * fps.delta , moveAngle ) );
				}
			}
			//Проверка на объекты
			if( level.objectsCells[ mapKey ] ) {
				let objects = level.objectsCells[ mapKey ];
				for( let o in objects ) {
					let object = objects[ o ];
						object.Collect();
				}
			}
			this.position = this.position.Plus( caster.CreateVectorFromAngle( speed * fps.delta , moveAngle ) );
		}
		this.CheckCellPosition();
	}
}