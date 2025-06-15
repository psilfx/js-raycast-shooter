function GetTexturePosition( position ) {
	return parseInt( Math.abs( position - Math.floor( position ) ) * textSize );
}
const canvas   = document.querySelector( "#raycast-canvas" );
const tcanvas  = document.querySelector( "#texture-render" ); //Канвас для рендера текстуры
const context  = canvas.getContext( "2d" );
context.font   = "20px roboto";
const width    = canvas.width;
const height   = canvas.height;
const widthH   = parseInt( canvas.width / 2 );
const heightH  = parseInt( canvas.height / 2 );
const fov      = Math.PI / 3; //Угол обзора
const fovHalf  = fov * 0.5;
const fovStep  = fov / canvas.width; //Шаг угла при проходе по экрану
const viewDist = 15; //Дистанция отрисовки
const heightStep = viewDist / heightH;
const floorAspect = Math.tan( fovHalf * 1.1 );
const camDepth = widthH / Math.tan( fovHalf ); //Глубина проекции
const textures = [];
//Текстуры с сайта https://iddqd.ru/textures?find=Doom+Hi-Res+Texture+Pack&showfull=1
textures[ 0 ]  = new DImage( "img/wall-0.jpg" , "img/wall-0-specular.jpg" );
textures[ 1 ]  = new DImage( "img/wall-1.jpg" , "img/wall-1-specular.jpg" , "img/wall-1-reflect.jpg" );
textures[ 2 ]  = new DImage( "img/wall-2.jpg" , "img/wall-2-specular.jpg" );
textures[ 3 ]  = new DImage( "img/door-0.jpg" , "img/door-0-specular.jpg" , "img/door-0-reflect.jpg" );
textures[ 4 ]  = new DImage( "img/water-0.jpg" , 0 , "img/water-0-reflect.jpg" );
const maxHeight = height * 2;
const textSize  = 256;
//Уровень
const map      = [ 
					0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 1 ,
					3 , 0 , 0 , 2 , 2 , 0 , 1 , 1 , 1 , 0 ,
					1 , 0 , 2 , 2 , 0 , 0 , 0 , 0 , 1 , 0 ,
					0 , 0 , 0 , 1 , 0 , 1 , 0 , 0 , 0 , 0 ,
					0 , 0 , 1 , 1 , 0 , 1 , 0 , 0 , 1 , 0 ,
					0 , 0 , 0 , 1 , 1 , 1 , 1 , 0 , 1 , 0 ,
					1 , 0 , 0 , 0 , 0 , 1 , 0 , 0 , 1 , 0 ,
					0 , 0 , 1 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
					0 , 1 , 1 , 1 , 0 , 0 , 1 , 1 , 1 , 3 ,
					0 , 0 , 0 , 1 , 0 , 0 , 0 , 0 , 0 , 3
				 ];
const level     = new Map( 10 , 10 , map );
const cellWidth = height / level.size.x;
//Позиция камеры
let   cameraPosition = new Vector3F( 0.5 , 0 , 0.5 );
let   cameraAngle    = 0 ;
const cameraRotAngle = 0.1;
const cameraSpeed    = 0.1;
const draw           = new Draw();
const caster         = new Raycaster();
const angles         = new Angles();
const water          = new Water( 0.005 , textures[ 4 ] );
	  water.SetDirection( new Vector3F( 1 , 0 , 0 ) );