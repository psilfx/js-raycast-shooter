//Массива для кэша, значения которые надо расчитать, но они всегда одинаковые
const pixelPointerXCache  = [];
const pixelPointerYCache  = [];
const floorViewDistCache  = [];
const heightDistanceCache = [];
/**
 ** @desc Отрисовка значений рейкастера
 **/
class Draw {
	frameImage;
	framePixels;
	zBuffer = [];
	shadowColor = new Color( 0 , 0 , 0 );
	wallColor  = new Color(); //Цвет стены
	floorColor = new Color(); //Цвет пола
	skyColor   = new Color( 168 , 217 , 255 ); //Цвет неба
	lightColor = new Color();
	constructor() {
		this.stride      = canvas.width * 4;
		for( let y = 0; y < canvas.height; y++ ) {
			pixelPointerYCache[ y ] = y * this.stride;
		}
		for( let x = 0; x < canvas.width; x++ ) {
			pixelPointerXCache[ x ] = x * 4;
		}
		for( let w = 0; w <= width; w++ ) {
			let rayAngle = -fovHalf + fovStep * w;
			floorViewDistCache[ w ] = [];
			for( let y = 0; y <= heightH + 50; y++ ) {
				floorViewDistCache[ w ][ y ] = viewDist / ( ( viewDist - ( y * heightStep ) ) * Math.cos( rayAngle ) ) / floorAspect;
			}
			for( let y = -heightH - 50; y < 0; y++ ) { //Для потолка за экраном
				floorViewDistCache[ w ][ y ] = viewDist / ( ( viewDist - ( y * heightStep ) ) * Math.cos( rayAngle ) ) / floorAspect;
			}
		}
		for( let y = 0; y < heightH; y++ ) {
			heightDistanceCache[ y ] = y / heightH;
		}
	}
	InitBuffer() {
		this.frameImage  = context.getImageData( 0 , 0 , canvas.width , canvas.height );
		this.framePixels = this.frameImage.data;
	}
	/**
	 ** @desc Проверяет по збуфферу и пишет пиксель в массив на вывод
	 ** @vars (int) x - координата x отсносительно экрана, (int) y - координата y отсносительно экрана, (Color) color - цвет на заполнение, (int) z - координата z для проверки по буфферу
	 **/
	SetFramePixel( x , y , color , z = 0 ) {
		let pixelPointer = pixelPointerYCache[ y ] + pixelPointerXCache[ x ];
		//if( this.zBuffer[ pixelPointer ] > z ) return;
		this.zBuffer[ pixelPointer ]         = z;
		this.framePixels[ pixelPointer ]     = color.r;
		this.framePixels[ pixelPointer + 1 ] = color.g;
		this.framePixels[ pixelPointer + 2 ] = color.b;
		//this.framePixels[ pixelPointer + 3 ] = color.a;
	}
	GetFramePixel( x , y ) {
		let pixelPointer = pixelPointerYCache[ y ] + pixelPointerXCache[ x ];
		return { r : this.framePixels[ pixelPointer ] , g : this.framePixels[ pixelPointer + 1 ] , b : this.framePixels[ pixelPointer + 2 ] /*, a : this.framePixels[ pixelPointer + 3 ] */  };
	}
	/**
	 ** @desc Рисует небо
	 **/
	DrawSky() {
		context.fillStyle = this.skyColor.ToString();
		context.fillRect( 0 , 0 , width , heightH );
	}
	/**
	 ** @desc Рисует пол
	 **/
	DrawFloor() {
		for( let y = 0; y < heightH; y++ ) {
			let dist    = y / heightH;
			let	color   = this.floorColor.Multiply( dist );
				color.a = 1;
			this.DrawLine( { x : 0 , z : heightH + y } , { x : width , z : heightH + y } , color.ToString() );
		}
	}
	/**
	 ** @desc Рисует линию
	 ** @vars (Vecto3F) start - начало линии, (Vecto3F) end - конец линии, (Color) color - цвет линии
	 **/
	DrawLine( start , end , color ) {
		context.strokeStyle = color;
		context.strokeWidth = 1;
		context.beginPath();
		context.moveTo( start.x + 0.5 , start.z ); //0.5 для сдвига, чтобы избежать смешивания
		context.lineTo( end.x + 0.5 , end.z );
		context.stroke();
		context.closePath();
	}
	/**
	 ** @desc Рисует стену
	 ** @vars (int) w - номер пикселя по ширине экрана, (float) distance - дистанция до стены, полученная от каста луча
	 **/
	DrawWall( w , distance ) {
		let wallHeight = Math.min( parseInt( camDepth / ( distance ) ) , height ) * 0.5;	
		let distBlack  = 1 - distance / viewDist;
		let	color      = this.wallColor.Multiply( distBlack );
			color.a    = 1;
		this.DrawLine( { x : w , z : heightH - wallHeight } , { x : w , z : heightH + wallHeight } , color.ToString() );
	}
	DrawTexturedWall( w , distance , texture , textureX ) {
		let wallHeight = caster.CalcWallheight( distance );
		let wallHeightH = parseInt( wallHeight >> 1 ); //Деление на 2
		let distBlack  = 1 - distance / ( viewDist ) - 0.2;
		let	color      = this.shadowColor.Copy();
			color.a    = distBlack;
		let startY     = heightH - wallHeightH;
		let endY       = heightH + wallHeightH;
			if( startY < 0 ) {
				startY = Math.abs( startY );
			} else {
				startY = 0;
			}
			if( endY > height ) {
				endY = Math.abs( height - endY );
			} else {
				endY = 0;
			}
			for( let y = startY; y < wallHeight - endY; y++ ) {
				let textureY = parseInt( textSize * ( y / wallHeight ) );
				let pixel    = texture.GetRGBAPixel( parseInt( textureX ) , textureY );
				let	mix      = pixel.Mix( this.skyColor.Multiply( pixel.specular ) );
					mix      = mix.Multiply( distBlack );
				this.SetFramePixel( w , heightH - wallHeightH + y , mix );
			}
			// if( texture.reflects ) {
				// //let reflectDistance = 1 - texture.reflects[ 0 ] / viewDist;
				// let reflectTexture  = texture.reflects[ 1 ];
				// let reflectTextureX = texture.reflects[ 2 ];
				// let specHeight      = wallHeight;
				// for( let y = startY; y < specHeight - endY; y++ ) {
					// let textureY = parseInt( textSize * ( y / specHeight ) );
					// let reflect  = reflectTexture.GetRGBAPixel( parseInt( reflectTextureX ) , textureY );
					// let drawY    = heightH - wallHeightH + y;
					// let pixel    = this.GetFramePixel( w , drawY );
					// this.SetFramePixel( w , drawY , reflect );
				// }
				// //let reflectPixel    = reflectTexture.GetRGBAPixel( parseInt( reflectTextureX ) , textureY );
				// //if( typeof( reflectPixel ) == "undefined" ) console.log( reflectTextureX );
				// //mix = mix.Mix( reflectPixel );
			// }
		// context.globalCompositeOperation = "source-over";
		// //context.drawImage( texture.img , textureX , 0 , 1 , textSize , w , heightH - wallHeightH , 1 , wallHeight );
		// if( texture.specularImg ) {
			// this.DrawLine( { x : w , z : heightH - wallHeightH } , { x : w , z : heightH + wallHeightH } , this.lightColor.ToString() );
			// context.globalCompositeOperation = "hard-light";
			// context.drawImage( texture.specularImg , textureX , 0 , 1 , textSize , w , heightH - wallHeightH , 1 , wallHeight );
			// context.globalCompositeOperation = "hard-light";
			// context.drawImage( texture.img , textureX , 0 , 1 , textSize , w , heightH - wallHeightH , 1 , wallHeight );
		// }
		
		//context.globalCompositeOperation = "source-over";
		//context.globalCompositeOperation = "source-in";
		//this.DrawLine( { x : w , z : heightH - wallHeightH } , { x : w , z : heightH + wallHeightH } , color.ToString() );
		
		
		return wallHeightH;
	}
	Draw() {
		context.putImageData( this.frameImage , 0 , 0 );
	}
	DrawTexturedFloor( x , floorStart , positionRandom = new Vector3F() , noize = 0 ) {
		//Текстура пола
		let texture     = textures[ 4 ];
		//Стартовые вычисления
		let angle       = cameraAngle + ( -fovHalf + fovStep * x );
		let angleConv   = angles.ConvertRadianAngle( angle );
		let rowDistance = 0;
		let floorEnd    = heightH - floorStart;
		let pixelStride = [];
		for ( let y = 0; y <= floorEnd; y++ ) {
			// Вычисляем расстояние до пола
			rowDistance = floorViewDistCache[ x ][ y ];
			let hDistX  = rowDistance * angles.Cos( angleConv ) + cameraPosition.x + positionRandom.x;
			let hDistY  = rowDistance * angles.Sin( angleConv ) + cameraPosition.z + positionRandom.z;
			// Текущие координаты текстуры
			let textureX = GetTexturePosition( hDistX ) ;
			let textureY = GetTexturePosition( hDistY ) ;
			// Получаем цвет из текстуры пола
			let pixel    = texture.GetRGBAPixel( textureX , textureY );
			let dist     = 1 - heightDistanceCache[ y ];
			let mix      = pixel.Multiply( dist )
			if( pixel.specular ) mix = mix.Mix( this.skyColor.Multiply( pixel.specular ) );
			if( pixel.reflect )  mix = mix.Mix( this.GetFramePixel( Math.min( x + parseInt( noize * Math.random() ) , width - 1 ) , Math.min( height - ( floorEnd << 1 ) + y + parseInt( noize * Math.random() ) , height - 1 ) ).Multiply( pixel.reflect ) );
			this.SetFramePixel( x , height - y , mix );
		}
	}
}