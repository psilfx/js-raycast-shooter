class GamePad{
	init = false;
	prevButtons = [];
	gamepad;
	axis
	constructor() {
		
		//console.log( navigator.getGamepads() );
		
	}
	Connected( index ) {
		this.gamepad = navigator.getGamepads()[ index ];
		if( this.gamepad ) this.init = true;
	}
	Update() {
		if( !this.init ) return;
		this.AxesLeft();
		this.AxesRight();
		//controls.input.attack = false;
		controls.MouseButton( 0 , this.gamepad.buttons[ 7 ].pressed );
		//if( this.gamepad.buttons[ 7 ].pressed && player.pause ) gMenu.Click(); //Attack
		controls.input.nextWeapon = this.gamepad.buttons[ 5 ].pressed;
		controls.input.prevWeapon = this.gamepad.buttons[ 4 ].pressed;
		//this.CheckButtonChanges();
	}
	AxesLeft() {
		let x = Math.round( this.gamepad.axes[ 0 ] );
		let y = Math.round( this.gamepad.axes[ 1 ] );
		controls.input.Key( 87 , ( y < 0 ) ); //up
		controls.input.Key( 83 , ( y > 0 ) ); //down
		controls.input.Key( 65 , ( x < 0 ) ); //left
		controls.input.Key( 68 , ( x > 0 ) ); //right
	}
	AxesRight() {
		let x = Math.round( this.gamepad.axes[ 2 ] );
		let y = this.gamepad.axes[ 3 ];
		controls.input.Mouse( x * camera.rotAngle , 0 );
	}
	CheckButtonChanges() {
		
		this.gamepad.buttons.forEach( ( button , index ) => {
			
			//console.log( this.gamepad.axes );
			if ( button.pressed && !this.prevButtons[ index ]) {
				console.log(`Кнопка ${index} нажата`);
			}
			if (!button.pressed && this.prevButtons[ index ]) {
				console.log(`Кнопка ${index} отпущена`);
			}
		});
		
		this.prevButtons = this.gamepad.buttons.map( b => b.pressed );
	}
}