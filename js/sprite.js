class SpriteAnim {
	startFrame  = 0;
	endFrame    = 0;
	frame       = 0;
	startTime   = 0;
	duration    = 0;
	frames      = 0;
	frameWidth  = 0;
	frameHeight = 0;
	tdelta      = 0;
	complete    = false;
	cycle       = true;
	constructor( startFrame , endFrame , duration , frameWidth , frameHeight ) {
		this.frames      = parseInt( endFrame - startFrame );
		this.duration    = duration;
		this.startTime   = new Date().getTime();
		this.frameWidth  = frameWidth;
		this.frameHeight = frameHeight;
		this.startFrame  = startFrame;
		this.endFrame    = endFrame;
	}
	Update( time ){
		this.tdelta = Math.min( ( time - this.startTime ) / this.duration , 1 );
		this.frame  = this.startFrame + parseInt( this.tdelta * this.frames );
		if( this.tdelta >= 1 ) {
			this.complete = true;
			this.frame    = this.MaxFrame() ;
		} 
	}
	MaxFrame() {
		return this.startFrame + this.frames - 1 * Math.sign( this.frames );
	}
	Start() {
		this.startTime = new Date().getTime();
		this.complete  = false;
		this.frame     = this.startFrame;
	}
}
let spritesCountNum = 0;
class Sprite {
	id             = 0;
	texture;
	animations     = [];
	animationId    = 0;
	animationNext  = -1;
	width          = 0;
	widthH         = 0;
	height         = 0;
	heightH        = 0;
	offsetY        = 0;
	screenOffset   = new Vector3F();
	screenPosition = new Vector3F();
	screenHeights  = { width : 0 , height : 0 };
	distance       = 0;
	frameWidth     = 0;
	frameHeight    = 0;
	constructor( texture , screenPosition , width = 0 , height = 0 , offsetY = 0 ) {
		this.id             = spritesCountNum;
		this.texture        = texture;
		this.screenPosition = screenPosition;
		this.width          = width;
		this.widthH         = width * 0.5;
		this.height         = height;
		this.heightH        = height * 0.5;
		this.offsetY        = offsetY;
		this.screenHeights.width  = width;
		this.screenHeights.height = height;
		spritesCountNum++;
	}
	Update( time ) {
		let animation = this.animations[ this.animationId ];
		animation.Update( time );
		if( animation.complete && animation.cycle ) {
			if( this.animationNext >= 0 ) {
				this.animationId   = this.animationNext;
				this.animationNext = -1;
				animation          = this.animations[ this.animationId ];
			}
			animation.Start();
		}
		this.screenHeights.width  = animation.frameWidth;
		this.screenHeights.height = animation.frameHeight;
		
	}
	AddAnimation( id , spriteAnim ) {
		this.animations[ id ] = spriteAnim;
	}
	CurrentAnimation( id , cycle = true ) {
		if( id == this.animationId ) return; //Если это не текущая анимация и следующая анимация должна быть другой пропускаем
		this.animationId = id;
		this.animations[ this.animationId ].cycle = cycle;
		this.animations[ this.animationId ].Start();
	}
	SetNextAnimation( id ) {
		this.animationNext = id;
	}
	AnimationStart() {
		this.animations[ this.animationId ].Start();
	}
	GetAnimation() {
		return this.animations[ this.animationId ];
	}
	Scale( diemension ) {
		this.ScaleX( diemension );
		this.ScaleY( diemension );
	}
	ScaleX( diemension ) {
		this.width   *= diemension;
		this.widthH   = this.width * 0.5;
	}
	ScaleY( diemension ) {
		this.height  *= diemension;
		this.offsetY *= diemension;
	}
	SetScreenPosition( x , y ) {
		this.screenPosition.x = x;
		this.screenPosition.y = y;
	}
	SetScreenHeights( x , y ) {
		this.screenHeights.width  = x;
		this.screenHeights.height = y;
	}
	SetDistance( distance ) {
		this.distance             = distance;
	}
	Animated() {
		let animation = this.animations[ this.animationId ];
		return ( animation.startFrame + animation.frame == animation.MaxFrame() ) ;
	}
	SetFrame( frame ) {
		this.animations[ this.animationId ].frame = frame;
	}
	GetFrames() {
		return this.animations[ this.animationId ].frames;
	}
	GetFrame() {
		return this.animations[ this.animationId ].frame;
	}
	Draw() {
		let animation = this.animations[ this.animationId ];
		context.drawImage( this.texture.img , animation.frameWidth * animation.frame , 0 , animation.frameWidth , animation.frameHeight , this.screenPosition.x + this.screenOffset.x , this.screenPosition.y + this.screenOffset.y , this.screenHeights.width , this.screenHeights.height );
	}
	DrawByDistance() {
		let animation = this.animations[ this.animationId ];
		let startX    = this.screenPosition.x + this.screenOffset.x;
		let endX      = startX + this.screenHeights.width;
		let diffX     = endX - startX;
		for( let x = 0; x < diffX; x++ ) {
			if( startX + x >= width || endX <= 0 ) break;
			if( startX + x < 0 ) continue;
			let frameX = parseInt( x / diffX * animation.frameWidth );
			if( screenStripes[ startX + x ].distance > this.distance ) { 
				context.drawImage( this.texture.img , animation.frameWidth * animation.frame + frameX , 0 , 1 , animation.frameHeight , startX + x, this.screenPosition.y + this.screenOffset.y , 1 , this.screenHeights.height );
				//context.fillStyle = `rgba( 0 , 0 , 0 , ${ viewDistCache[ parseInt( this.distance ) ] } )`;
				//context.fillRect( startX + x , this.screenPosition.y + this.screenOffset.y , 1 , this.screenHeights.height );
			}
		}
	}
}
class SpriteSides extends Sprite {
	textures    = [];
	frameWidth  = [];
	frameHeight = [];
	framesSteps = [];
	constructor( front , frontRight , right , backRight , back , backLeft , left , frontLeft , screenPosition , width = 0 , height = 0 , offsetY = 0 ) {
		super( front , screenPosition , width , height , offsetY );
		this.textures[ 0 ] = front;
		this.textures[ 1 ] = frontRight;
		this.textures[ 2 ] = right;
		this.textures[ 3 ] = backRight;
		this.textures[ 4 ] = back;
		this.textures[ 5 ] = backLeft;
		this.textures[ 6 ] = left;
		this.textures[ 7 ] = frontLeft;
	}
	CreateFrames() {
		for( let s = 0; s < 8; s++ ) {
			this.frameWidth[ s ]  = parseInt( this.textures[ s ].img.width / this.animations[ this.animationId ].frames );
			this.frameHeight[ s ] = this.textures[ s ].img.height;
			this.framesSteps[ s ] = [];
			for( let f = 0; f < this.animations[ this.animationId ].frames; f++ ) {
				this.framesSteps[ s ][ f ] = this.frameWidth[ s ] * f;
			}
		}
	}
	DrawByDistance( side ) {
		//console.log( side );
		let animation = this.animations[ this.animationId ];
		let startX    = this.screenPosition.x + this.screenOffset.x;
		let endX      = startX + this.screenHeights.width;
		let diffX     = endX - startX;
		let frameHeight = this.frameHeight[ side ];
		let frameWidth  = this.frameWidth[ side ];
		let frameStep   = this.framesSteps[ side ][ animation.frame ];
		let texture     = this.textures[ side ].img;
		for( let x = 0; x < diffX; x++ ) {
			if( startX + x >= width || endX <= 0 ) break;
			if( startX + x < 0 ) continue;
			let frameX = parseInt( x / diffX * frameWidth );
			if( screenStripes[ startX + x ].distance > this.distance ) { 
				context.drawImage( texture , frameStep + frameX , 0 , 1 , frameHeight , startX + x, this.screenPosition.y + this.screenOffset.y , 1 , this.screenHeights.height ); //distance
				//context.fillStyle = `rgba( 0 , 0 , 0 , ${ viewDistCache[ parseInt( this.distance ) ] } )`;
				//context.fillRect( startX + x , this.screenPosition.y + this.screenOffset.y , 1 , this.screenHeights.height );
			}
		}
	}
}