importScripts( '../vector.js' );
importScripts( '../color.js' );
importScripts( '../draw.js' );
importScripts( '../map.js' );
importScripts( '../raycast.js' );
importScripts( '../dimage.js' );
importScripts( '../angles.js' );
importScripts( '../water.js' );
importScripts( '../render.js' );
importScripts( '../texture.js' );
let   width  = 1280;
let   height = 720;
//let caster      = event.data.caster;
const render   = new Render();
	  render.CreateScreenStripes( width );
let   stripes  = render.GetStripes();
const angles   = new Angles();
const caster   = new Raycaster();
let   draw;
let   viewDist = 0;
let   textSize    = 0;
let   camDepth    = 0;
let   cameraAngle = 0;
let   fovStep     = 0;
let   fovHalf     = 0;
let   maxHeight   = 0;
let   heightH     = 0;
let   heightStep  = 0;
let   floorAspect = 0;
let   level;
let   cameraPosition = new Vector3F();
let   canvas;
let   context;
let   screenBuffer = [];
let   zBuffer      = [];
let   start        = 0;
let   end          = 0;

//Текстуры с сайта https://iddqd.ru/textures?find=Doom+Hi-Res+Texture+Pack&showfull=1
const textures = [];

function SetTexture( data ) {
	textures[ data.id ] = new Texture( data.texture );
}
function SetPosition( data ) {
	cameraPosition.x = data.cameraPosition.x;
	cameraPosition.z = data.cameraPosition.z;
	cameraAngle      = data.cameraAngle;
}
function Init( data ) {
		fovStep     = data.fovStep;
		fovHalf    	= data.fovHalf; //Стартовый угол
	    viewDist    = data.viewDist;
		textSize    = data.textSize;
		camDepth    = data.camDepth;
		maxHeight   = data.maxHeight;
		heightH     = data.heightH;
		heightStep  = data.heightStep;
		floorAspect = data.floorAspect;
		start       = data.start;
		end         = data.end;
		level       = new Map( data.level.size.x , data.level.size.y , data.level.cells );
		canvas      = data.canvas;

		context       = canvas.getContext( '2d' , { willReadFrequently: true } );
		draw          = new Draw();
	SetPosition( data );
}
function RenderStripes() {
	context.clearRect( 0 , 0 , canvas.width , canvas.height );
	let	angle  = -fovHalf + fovStep * start;
	draw.InitBuffer();
	for( let w = start; w <= end; w++ ) {
		let stripe = stripes[ w ];
		stripe.Empty();
		stripe.rayAngle = cameraAngle + angle;
		stripe.cast     = caster.Cast( cameraPosition.Copy() , stripe.rayAngle );
		render.RenderWallThread( stripe , angle ); 
		angle          += fovStep;
	}
	
	for( let w = start; w < end; w++ ) {
		let stripe = stripes[ w ];
		if( stripe.cast[ 0 ].wall.end < height ) render.RenderFloorThread( stripe );
		//render.AmbientOclusion( stripe );
	}
	draw.Draw();
	canvas.convertToBlob().then((blob) => {
        createImageBitmap(blob).then((imageBitmap) => {
            self.postMessage(imageBitmap);
        });
    });
	self.requestAnimationFrame( RenderStripes );
}

self.onmessage = function (event) {
	if( event.data.action == 0 ) Init( event.data ); //Базовые настройки
	if( event.data.action == 1 ) SetPosition( event.data ); //Позиция камеры
	if( event.data.action == 2 ) SetTexture( event.data ); //Задаём текстуру
	if( event.data.action == 3 ) RenderStripes( event.data ); //Задаём текстуру
	
};