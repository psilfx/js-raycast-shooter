class RPixel {
	x;
	y;
	z;
	color;
	next = 0;
	constructor( x = 0 , y = 0 , z = 0 , color = new Color() ) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.color = color;
	}
}

class RStripe {
	x           = 0;
	start       = 0; //Стартовая полоска
	next        = 0;
	prev        = 0;
	distance    = 0;
	
	cast        = []; //Результат каст луча
	pixels      = [];
	rayAngle    = 0;
	Empty() {
		this.cast     = [];
		this.pixels   = [];
		this.distance = 0;
		this.rayAngle = 0;
	}
}
const screenStripes = [];
const screenZBuffer = [];
const screenShadows = [];
class Render {
	renderObjects = [];
	CreateScreenStripes( width ) {
		for( let w = 0; w <= width; w++ ) {
			screenStripes[ w ] = new RStripe();
			screenShadows[ w ] = [];
		}
		for( let w = 0; w <= width; w++ ) {
			let stripe      = screenStripes[ w ];
				stripe.x    = w;
				stripe.next = ( w == width ) ? 0 : screenStripes[ w + 1 ];
				stripe.prev = ( w == 0 )     ? 0 : screenStripes[ w - 1 ];
		}
	}
	RenderWall( stripe , screenAngle ) {
		//screenShadows[ stripe.x ] = [];
		let length = stripe.cast.length;
		let floor  = 1;
		for( let c = 0; c < length; c++ ) {
			let cast = stripe.cast[ length - 1 - c ];
			this.RenderCast( stripe.x , cast , screenAngle , floor );
			floor = cast.cell.y; //Задаём этаж отрисовки
		}
	}
	RenderCast( x , cast , screenAngle , floor = 1 ) {
		let distance    = cast.distance * angles.Cos( angles.ConvertRadianAngle( screenAngle ) );
		let texturesIds = cast.texture;
		let textureX    = cast.textureX;
		let cell        = cast.cell;
		let normal      = cast.normal;
		let wallHeight  = caster.CalcWallheight( distance ) + 2;
		let wallHeightH = parseInt( wallHeight >> 1 ); //Деление на 2
		//Обрезка по экрану
		let wallY       = heightH - wallHeightH;
		let startY      = wallY;
		let endY        = heightH + wallHeightH;
			startY      = ( startY < 0 )    ? Math.abs( startY )        : startY = 0;
			endY        = ( endY > height ) ? Math.abs( height - endY ) : endY   = 0;
		let textureSide = 0;
		let units       = cast.units;
		//let playerDeath = ( player.death == true ) * ( player.death == true ) * heightH;
		switch( normal.x ) { //Нормаль инвертирована, направления противоположные
			case -1:
				textureSide = textureSidesNum.right;
			break;
			case 1:
				textureSide = textureSidesNum.left;
			break;
		}
		switch( normal.z ) { //Нормаль инвертирована, направления противоположные
			case -1:
				textureSide = textureSidesNum.front;
			break;
			case 1:
				textureSide = textureSidesNum.back;
			break;
		}
		//context.globalCompositeOperation = "source-out";
		//let whCamera = ( heightS * cameraUp ) / ( 2 * distance ); //Смещение при подъеме камеры
		let cameraMoveOffset = cameraMove.GetOffsetY();
		let whCamera = cameraMoveOffset; //Смещение при подъеме камеры
		let start    = wallY + whCamera; //Избавляемся от операции умножения wallY - wallHeight * h +  whCamera;
		for( let h = 0; h < cell.y; h++ ) {
			let texture = textures[ texturesIds[ h ][ textureSide ] ];
			// //console.log( texture );
			// let stride = texture.GetPixelsStride( textureX , wallHeight );
			// for( let y = 0; y < wallHeight; y++ ) {
				// draw.SetFramePixel( x , start + y , stride[ y ] , distance );
			// }
			context.drawImage( texture.img , textureX , 0 , 1 , textSize , x , start  , 1 , wallHeight );
			//context.fillStyle = `rgba( 0 , 0 , 0 , ${ viewDistCache[ parseInt( distance ) ] } )`;
			//context.fillRect( x , start , 1 , wallHeight );
			// if( normal.x == -1 ) {
				// context.fillStyle = "rgba( 0 , 0 , 0 , 0.5 )";
				// context.fillRect( x , start , 1 , wallHeight );
			// } else if( normal.x == 1 ) {
				// //context.globalCompositeOperation = "soft-light";
				// context.fillStyle = "rgba( 255 , 255 , 255 , 0.15 )";
				// context.fillRect( x , start , 1 , wallHeight );
			// }
			start -= wallHeight;
		}
		cast.SetWall( wallY + startY , wallY + wallHeight - endY , wallHeight , wallHeightH , whCamera );
		screenStripes[ x ].distance = cast.distance;
		
		//context.globalCompositeOperation = "source-over";
	}
	RenderObjects( objects ) {
		let cameraPostion    = camera.GetPosition();
		let cameraMoveOffset = cameraMove.GetOffsetY();
		for( let o = 0; o < objects.length; o++ ) {
			let object = objects[ o ];
			let render = this.RenderSprite( object.sprite , object.position , camera.angle , cameraPostion , cameraMoveOffset );
			object.distance = object.sprite.distance;
			if( render ) this.AddObjectToRender( object );
		}
	}
	AddObjectToRender( object ) {
		this.renderObjects.push( object );
		this.renderObjects.sort( ( a , b ) => b.distance - a.distance );
	}
	Update() {
		this.renderObjects = [];
	}
	Draw() {
		this.renderObjects.forEach( ( item , index ) => {
			item.Draw();
		});
	}
	RenderSprite( sprite , position , angle , cameraPostion , cameraMoveOffset ) {
		let xDiff       = position.x - cameraPostion.x;
		let zDiff       = position.z - cameraPostion.z;
		let spriteAngle = angles.Normalize( Math.atan2( zDiff , xDiff ) - angle );
		if ( spriteAngle <= fovHalf + sprite.width && spriteAngle >= -fovHalf - sprite.width ) {
			let distance    = Math.sqrt( Math.pow( zDiff , 2 ) + Math.pow( xDiff , 2 ) ) ;
			let distCos     = distance * Math.cos( -spriteAngle );
			let wallHeight  = caster.CalcWallheight( distCos );
			let wallHeightH = wallHeight >> 1;
			let screenH     = wallHeight * sprite.height;
			let screenW     = ( width * sprite.width ) / distCos;
			let screenX     = parseInt( spriteAngle / fovHalf * widthH + widthH ) - ( screenW >> 1 );
			let screenOffY  = sprite.offsetY * wallHeightH;
			sprite.SetDistance( distance );
			sprite.SetScreenPosition( screenX , heightH + ( wallHeightH - screenH + screenOffY + cameraMoveOffset ) );
			sprite.SetScreenHeights ( screenW , screenH );
			return true;
		}
		return false;
	} 
	RenderWallThread( stripe , screenAngle ) {
		//screenShadows[ stripe.x ] = [];
		let length = stripe.cast.length;
		let buffer = [];
		let floor  = 1;
		for( let c = 0; c < length; c++ ) {
			let cast = stripe.cast[ length - 1 - c ];
			this.RenderCastThread( stripe , cast , screenAngle , buffer );
			floor = cast.cell.y; //Задаём этаж отрисовки
		}
	}
	RenderCastThread( stripe , cast , screenAngle , buffer ) {
		let distance    = cast.distance * angles.Cos( angles.ConvertRadianAngle( screenAngle ) ) ;
		let texture     = cast.texture;
		let textureX    = cast.textureX;
		let cell        = cast.cell;
		let normal      = cast.normal;
		let wallHeight  = caster.CalcWallheight( distance );
		let wallHeightH = parseInt( wallHeight >> 1 ); //Деление на 2
		let x           = stripe.x - start;
		//Обрезка по экрану
		let wallY       = heightH - wallHeightH;
		let startY      = wallY;
		let endY        = heightH + wallHeightH;
			startY      = ( startY < 0 )    ? Math.abs( startY )        : startY = 0;
			endY        = ( endY > height ) ? Math.abs( height - endY ) : endY   = 0;
			cast.SetWall( wallY + startY , wallY + wallHeight - endY , wallHeight , wallHeightH );
			// for( let y = startY; y < wallHeight - endY; y++ ) {
				// let textureY    = parseInt( textSize * Math.abs( y / wallHeight ) );
				// let pixel       = texture.GetRGBAPixel(  textureX , textureY );
				// let bufferPixel = buffer[ y ];
				// draw.SetFramePixel( x , wallY + y , pixel , distance );
				// // if( buffer[ y ] > distance || !buffer[ y ] ) {
					
					// // //console.log( stripe.pixels[ y ] );
					// // //buffer[ y ]        = distance;
				// // } 
			// }
		//context.drawImage( texture.img , textureX , 0 , 1 , textSize , x , wallY - wallHeight * h, 1 , wallHeight );
	}
	RenderFloor( stripe , texture , positionRandom = new Vector3F() , noize = 0 ) {
		//Стартовые вычисления
		let angle       = stripe.rayAngle;
		let angleConv   = angles.ConvertRadianAngle( angle );
		let rowDistance = 0;
		//let distance    = stripe.cast[ 0 ].distance;
		let castWall    = stripe.cast[ 0 ].wall;
		//let ystep       = castWall.camera; //Для поворота камеры верх низ
		let floorEnd    = heightH - castWall.heightH - castWall.camera  + 1 ;
		let x           = stripe.x;
		let floorEndW   = floorEnd << 1;
		//let ystep       = distance / heightH; //Для поворота камеры верх низ
		//let floorDistance = stripe.cast[ 0 ].distance;
		//let floorDistanceStep = floorDistance / floorEnd;
		let cameraMoveOffset = cameraMove.GetOffsetY();
		let cameraPosition   = camera.GetPosition();
		//if( x < 2 )console.log( castWall.camera );
		//let yb = parseInt( ( cameraUp ) * heightH );
		let ceiling     = true;
		let cellCamera  = cameraMove.tdeltaYD;
		//let playerDeath = ( player.death == true ) * ( player.death == true ) * heightH;
		for ( let y = 0; y < floorEnd; y++ ) {
			//if( heightH + y < castWall.end + castWall.camera ) continue;
			//if( y < height - floorEnd ) continue;
			//rowDistance = heightStep * y * heightDistanceCache[ floorEnd - y ] * Math.cos( cameraAngle - angle ); //Бульк на воде
			//rowDistance = ( distance ) / ( ( distance - ( ( y + cameraUp )  * ystep ) ) * Math.cos( cameraAngle - angle ) ) * 1.0;
			rowDistance = floorViewDistCache[ x ][ y + cameraMoveOffset ];
			// Вычисляем расстояние до пола
			//let yd = parseInt( ystep * y ); //Для поворота камеры верх низ
			//let yd = ystep + y; //Для поворота камеры верх низ
			
			//console.log( ystep * camDepth / heightStep )
			//if( yd < 0 || yd >= heightH ) continue;
			//rowDistance = floorViewDistCache[ x ][ y ] * ystep;
			//console.log( y - heightH + cameraUp );
			let hDistX  = cameraPosition.x + rowDistance * angles.Cos( angleConv );
			let hDistY  = cameraPosition.z + rowDistance * angles.Sin( angleConv );
			// Текущие координаты текстуры
			let textureX = GetTexturePosition( hDistX + positionRandom.x );
			let textureY = GetTexturePosition( hDistY + positionRandom.x );
			let cellTextures = level.GetCellTextures( hDistX , hDistY );
			let pixel;
			//Потолок
			if( ceiling ) {
				texture = textures[ cellTextures[ 0 ][ 4 ] ];
				pixel   = texture.GetRGBAPixel( textureX , textureY );
				let framePixel = draw.GetFramePixel( x , cellCamera + y );
				if( parseInt( framePixel.r ) <= 0 ) draw.SetFramePixel( x , cellCamera + y , MultiplyColor( pixel , 1 - viewDistCache[ parseInt( rowDistance ) ] ) );
			}
				texture      = textures[ cellTextures[ 0 ][ 5 ] ];
			// Получаем цвет из текстуры пола
				pixel      = texture.GetRGBAPixel( textureX , textureY );
			let framePixel = draw.GetFramePixel( x , height - y );
			if( !pixel || framePixel.r > 0 ) continue;
			//if( y == 0 ) pixel.r = 255;
			let mix      = MultiplyColor( pixel , 1 - viewDistCache[ parseInt( rowDistance ) ] );

			let sky      = draw.skyColor.Copy();
			let mkey = level.GetMapKey( hDistX , hDistY );
			// if( level.pathFinder.paths[ mkey ].node ) {
				// mix = MultiplyColor( mix , 2 );
			// }
			// if( order.wayPath[ order.wayCurr ] ) {
				// if( parseInt( order.movePath.x ) == parseInt( hDistX ) && parseInt( order.movePath.z ) == parseInt( hDistY ) ) {
					// //console.log( order.wayPath[ order.wayCurr ] );
					// mix = MultiplyColor( mix , 1 );
					// mix.r += 100;
				// }
			// }
			// if( collision.AABB( { x : unit.position.x - unit.widthH , y : unit.position.z - unit.widthH , width : unit.width , height : unit.width } , { x : hDistX , y : hDistY , width : 0.01 , height : 0.01 } ) ) {
				// mix = MultiplyColor( mix , 1 );
				// mix.g += 100;
			// }
			//if( pixel.specular ) mix = MixColorDevide( mix , MultiplyColor( sky , pixel.specular ) );
			//console.log( pixel );
			let oa = 0;
			// if( level.CheckCellByXY( hDistX + 0.5 , hDistY ) ) { //Тень
				// mix = MultiplyColor( mix , 1.4 - ( hDistX - Math.floor( hDistX ) ) );
			// } else if( oa = level.CheckCellByXY( hDistX - 0.5 , hDistY ) ) { //Подсветка
				// let oaPixel = textures[ oa ].GetRGBAPixel( textureX , textureY );
				// let shadDist = 1.5 - ( hDistX - Math.floor( hDistX ) );
				// mix = MultiplyColor( mix , shadDist );
			// }
			// if( pixel.reflect ) {
				// mix = MixColorDevide( mix , MultiplyColor( draw.GetFramePixel( Math.min( x + parseInt( noize * Math.random() ) , width - 1 ) , Math.min( height - ( floorEndW ) + y + parseInt( noize * Math.random() ) , height - 1 ) ) , pixel.reflect ) );
			// }
			draw.SetFramePixel( x ,  height - y , mix );
		}
		if( ceiling ) { //Костыль для потолка
			for ( let y = 0; y <= cellCamera; y++ ) {
				let cellY   = cellCamera - y;
				if( heightH - castWall.heightH + cameraMoveOffset + 1 < cellY ) continue;
				rowDistance = floorViewDistCache[ x ][ cellCamera - cameraMoveOffset - y ];
				let hDistX  = cameraPosition.x + rowDistance * angles.Cos( angleConv );
				let hDistY  = cameraPosition.z + rowDistance * angles.Sin( angleConv );
				// Текущие координаты текстуры
				let textureX = GetTexturePosition( hDistX + positionRandom.x );
				let textureY = GetTexturePosition( hDistY + positionRandom.x );
				let cellTextures = level.GetCellTextures( hDistX , hDistY );
				if( !cellTextures ) break;
				texture = textures[ cellTextures[ 0 ][ 4 ] ];
				let pixel   = texture.GetRGBAPixel( textureX , textureY );
				
				draw.SetFramePixel( x , cellY , pixel );
			}
		}
	}
	RenderFloorThread( stripe , positionRandom = new Vector3F() , noize = 0 ) {
		//Текстура пола
		let texture     = textures[ 5 ];
		//Стартовые вычисления
		let angle       = stripe.rayAngle;
		let angleConv   = angles.ConvertRadianAngle( angle );
		let rowDistance = 0;
		let floorEnd    = heightH - stripe.cast[ 0 ].wall.heightH + 1;
		let x           = stripe.x - start;
		let floorEndW   = floorEnd << 1;
		for ( let y = 0; y < floorEnd; y++ ) {
			// Вычисляем расстояние до пола
			rowDistance = floorViewDistCache[ x ][ y ];
			let hDistX  = rowDistance * angles.Cos( angleConv ) + cameraPosition.x;
			let hDistY  = rowDistance * angles.Sin( angleConv ) + cameraPosition.z;
			// Текущие координаты текстуры
			let textureX = GetTexturePosition( hDistX + positionRandom.x ) ;
			let textureY = GetTexturePosition( hDistY + positionRandom.z ) ;
			// Получаем цвет из текстуры пола
			let pixel    = texture.GetRGBAPixel( textureX , textureY );
			let sky      = draw.skyColor.Copy();
			let mix      = MixColor( pixel , sky );
			//if( pixel.specular ) mix = MixColor( mix , sky.Multiply( pixel.specular ) );
			let oa = 0;
			// if( level.CheckCellByXY( hDistX + 0.5 , hDistY ) ) { //Тень
				// mix = mix.Multiply( 1.4 - ( hDistX - Math.floor( hDistX ) ) );
			// } else if( oa = level.CheckCellByXY( hDistX - 0.5 , hDistY ) ) { //Подсветка
				// let oaPixel = textures[ oa ].GetRGBAPixel( textureX , textureY );
				// let shadDist = 1.5 - ( hDistX - Math.floor( hDistX ) );
				// mix = mix.Multiply( shadDist );
			// }
			// if( pixel.reflect ) {
				// mix = mix.Mix( draw.GetFramePixel( Math.min( x + parseInt( noize * Math.random() ) , width - 1 ) , Math.min( height - ( floorEndW ) + y + parseInt( noize * Math.random() ) , height - 1 ) ).Multiply( pixel.reflect ) );
			// }
			//console.log( mix );
			draw.SetFramePixel( x , height - y , pixel , rowDistance );
		}
	}
	AmbientOclusion( stripe ) {
		let aoLength = parseInt( stripe.distance );
		let aoStart  = stripe.wall.end - aoLength;
		let x        = stripe.x;
		for( let y = 0; y < aoLength; y++ ) {
			draw.SetFramePixel( x , aoStart + y , new Color( 0 , 0 , 0 , 255 ) );
		}
	}
	GetStripes() {
		return screenStripes;
	}
	GetStripe( w ) {
		return screenStripes[ w ];
	}
}