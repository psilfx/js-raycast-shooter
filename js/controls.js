class FPS {
	time  = 0;
	delta = 1;
	fps   = 0;
	prevTime  = 0;
	frameTime = 0;
	fpsTarget = 60;
	fpsTargetDelta = 1000 / this.fpsTarget;
	Update() {
		let time = new Date().getTime();
		this.deltaTime  = ( time - this.time ); //16.6 - 60 кадров
		this.frameTime += time - this.prevTime;
		this.fps++;
		if( this.deltaTime >= 1000 ){
			//this.delta = this.fpsTarget / this.fps;
			this.delta = 1;
			this.time  = time;
			this.fps   = 0;
		}
		this.prevTime = time;
	}
}
class Input {
	
	mouseMove = { x : 0 , y : 0 };
	
	left   = false;
	right  = false;
	up     = false;
	down   = false;
	attack = false;
	jump   = false;
	mouse  = false;
	mouseButton   = false;
	mouseButtonId = 0;
	nextWeapon    = false;
	prevWeapon    = false;

	Key( key , val ) {
		
		switch ( key ) {
			case 49: //Цифра 1
				player.SetWeapon( weaponsNamesEnums.pistol );
			break;
			case 50: //Цифра 2
				player.SetWeapon( weaponsNamesEnums.shotgun );
			break;
			case 51: //Цифра 3
				player.SetWeapon( weaponsNamesEnums.rifle );
			break;
			case 52: //Цифра 4
				player.SetWeapon( weaponsNamesEnums.rocket );
			break;
			case 87:
				this.up = val;
				if( val && player.pause ) gMenu.Next(); //Для меню, если кнопка была отпущена 
			break;
			case 83:
				this.down = val;
				if( val && player.pause ) gMenu.Prev(); //Для меню, если кнопка была отпущена 
			break;
			case 68:
				this.right = val;
			break;
			case 65:
				this.left = val;
			break;
			case 32:
				this.jump = val;
				if( !val ) StartLevel( false ); //Для спавна мобов
			break;
			case 13:
				this.attack = val;
				if( !val && player.pause ) gMenu.Click(); //Для меню, если кнопка была отпущена 
			break;
		}
	}
	Mouse( x , y ) {
		this.mouse = true;
		this.mouseMove.x = x;
		this.mouseMove.y = y;
	}
	MouseButton( buttonId , val ) {
		this.mouseButton   = val;
		this.mouseButtonId = buttonId;
	}
}
class Controls {
	sensivity = 0.003;
	input;
	constructor() {
		this.input = new Input();
	}
	Mouse( x , y ) {
		let xoffset = x;
		let yoffset = y;
		xoffset    *= this.sensivity;
		yoffset    *= this.sensivity;
		this.input.Mouse( xoffset , yoffset );
	}
	Input( key , val ) {
		this.input.Key( key , val );
	}
	MouseButton( buttonId , val ) {
		this.input.MouseButton( buttonId , val );
	}
	Move() {
		if( this.input.left == true || this.input.right == true ) return true;
		return false;
	}
	Attack() {
		return this.input.attack;
	}
	Jump() {
		return this.input.jump;
	}
	NextWeapon() {
		this.input.nextWeapon = true;
	}
	PrevWeapon() {
		this.input.prevWeapon = true;
	}
	Update( time ) {
		let cameraPosition = camera.GetPosition();
		let cameraAngle    = camera.GetAngle();
		let cameraMoveSW   = false;
		camera.move.z = 0;
		camera.move.x = 0;
		if( this.input.up ) {
			camera.move.z = 1;
			cameraMoveSW  = true;
		} else if( this.input.down ) {
			camera.move.z = -1;
			cameraMoveSW  = true;
		}
		if( this.input.left ) {
			camera.move.x = -1;
			cameraMoveSW  = true;
		} else if( this.input.right ) {
			camera.move.x = 1;
			cameraMoveSW  = true;
		}
		if( cameraMoveSW ) cameraMove.Update( time );
		if( this.input.mouse ) {
			camera.RotateMouse();
			this.input.mouse = false;
		}
		if( this.input.nextWeapon ) {
			player.NextWeapon();
			this.input.nextWeapon = false;
		}
		if( this.input.prevWeapon ) {
			player.PrevWeapon();
			this.input.prevWeapon = false;
		}
		if( this.input.mouseButton ) {
			if( this.input.mouseButtonId == 0 ) {
				if( player.weapon.Animated() && player.weapon.AnimationId() == 0 && player.weapon.bullets > 0 ) {
					player.weapon.Fire();
					player.weapon.CurrentAnimation( 1 );
					player.weapon.SetNextAnimation( 0 );
				}
				//this.input.mouseButton = false;
			} 
		}
	}
}