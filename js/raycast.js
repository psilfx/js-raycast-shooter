function GetTexturePosition( position ) {
	return parseInt( Math.abs( position - Math.floor( position ) ) * textSize );
}
/**
 ** @desc Сам рейкастер
 **/
class Cast {
	distance = 0;
	texture  = 0;
	textureX = 0;
	normal   = 0;
	cell     = 0;
	wall     = { start : 0 , end : 0 , height: 0 , heightH : 0 , camera : 0 };
	floor    = { start : 0 , end : 0 };
	outmap   = false;
	units    = [];
	constructor( distance , texture , textureX , normal , cell ) {
		this.distance = distance;
		this.texture  = texture;
		this.textureX = textureX;
		this.normal   = normal;
		this.cell     = cell;
		this.SetWall( 0 , 0 , 0 , 0 );
		this.SetFloor( 0 , 0 );
	}
	SetWall( start , end , height , heightH , whCamera ) {
		this.wall.start   = start;
		this.wall.end     = end;
		this.wall.height  = height;
		this.wall.heightH = heightH;
		this.wall.camera  = parseInt( whCamera );
	}
	SetFloor( start , end ) {
		this.floor.start = start;
		this.floor.end   = end;
	}
}
class Raycaster {
	/**
	 ** @desc Основной метод, пускает луч по заданному углу и возвращает расстояние, если луч достиг цели или вылетел за пределы карты
	 ** @vars (float) rayAngle - угол луча в радианах
	 **/
	Cast( rayStart , rayAngle , castReflect = true ) {
		//Входные данные
		let textureId = 0;
		let angleConv = angles.ConvertRadianAngle( rayAngle );
		let { direction , delta , start , distance , step , side } = this.DDARay( angleConv , rayStart );
		let casts  = [];
		let ignore = rayStart.Copy(); //Если луч запущен из клетки
		for( let d = 0; d <= viewDist; d++ ) {
			//Двигаемся к следующей клетке
			if ( distance.x < distance.z ) {
				distance.x += delta.x;
				start.x    += step.x;
				side        = 0;
			} else {
				distance.z += delta.z;
				start.z    += step.z;
				side        = 1;
			}
			//Проверяем, попали ли в стену
			textureId  = level.CheckCell( start ); //Либо 0 либо id текстуры
			let outmap = ( start.x < 0 || start.z < 0 || start.x >= level.size.x || start.z >= level.size.y ||  viewDist == d ); //За пределы карты
			if ( ( outmap || textureId ) && ( Math.floor( ignore.x ) != start.x || Math.floor( ignore.z ) != start.z ) ) {
				//let cameraPosition = camera.GetPosition();
				let cell           = start.Plus( new Vector3F( ( 1 - step.x ) >> 1 , level.GetHeight( start ) , ( 1 - step.z ) >> 1 ) );
				let outdistance    = ( side ) ? ( cell.z - rayStart.z ) / direction.z : ( cell.x - rayStart.x ) / direction.x;
				let textureOffset  = 0;
				if( outmap ) {
					textureId = 0;
					cell.y    = 0; //Костыль, чтобы при выходе с карты рисовалась стенка
				}
				let door = level.CheckDoor( start );
				if( door ) {
					let { intersect , offset , doorSide } = this.CheckDoor( door , outdistance , angleConv , rayStart , direction , side );
					textureOffset  = offset;
					side           = doorSide;
					if( !intersect ) continue;
					outdistance    = rayStart.Distance( intersect );
				}
				let normal = step.Negate();
				( side ) ? normal.x = 0 : normal.z = 0;
				if( !outmap ) {
					textureId = level.GetCellTextures( start.x , start.z );
				}
				let cast        = new Cast( outdistance , textureId , GetTexturePosition( this.GetTexturePosBySide( side , outdistance , angleConv , textureOffset ) ) , normal , cell );
					cast.outmap = outmap;
				casts.push( cast );
				ignore = cell.Copy();
				if( outmap ) break;
				return casts;
				//if( !level.CheckHeightAround( start , 6 , step ) || outmap ) return casts;
				//return [ outdistance , textures[ textureId ] , GetTexturePosition( this.GetTexturePosBySide( side , outdistance , angleConv ) ) ,  reflect , normal , cell , cast ];
			}
		}
		return casts;
	}
	CheckDoor( door , outdistance , angleConv , rayStart , direction , doorSide ) {
		let distVector = new Vector3F( ( outdistance + 1 ) * angles.Cos( angleConv ) , 0 , ( outdistance + 1 ) * angles.Sin( angleConv ) );
		let dir        = ( door.vertical ) ? direction.x : direction.z;
		let doorDir    = door.direction.Multiply( ( dir < 0 ) ); //Меняем направление в зависимости от позиции
		let intersect  = this.Intersect( rayStart , rayStart.Plus( distVector ) , door.lines[ 0 ].Plus( doorDir ) , door.lines[ 1 ].Plus( doorDir ) );
		let offset     = door.offset;
		if( !intersect ) { //Проверка бокового пересечения
			offset    = 0;
			doorSide  = door.side;
			intersect = this.Intersect( rayStart , rayStart.Plus( distVector ) , door.lines[ 2 ] , door.lines[ 3 ] );
		};
		return { intersect , offset , doorSide };
	}
	CastUnit( rayStart , rayAngle ) {
		let rayStep   = this.CreateVectorFromAngle( 1 , rayAngle ).Devide( 10 );
		let ray       = rayStart.Copy();
		let castUnit  = 0;
		let castUnits = [];
		let units     = 0;
		let cellKey   = -1;
		for( let d = 0; d < viewDist; d += 0.1 ) {
			cellKey = level.GetMapKey( ray.x , ray.z );
			if( units = level.unitsPositions[ cellKey ] ) {
				units.forEach( ( unit , index ) => {
					castUnit = unit;
					if( collision.AABB( { x : ray.x , y : ray.z , width : 0 , height : 0 } , { x : castUnit.position.x - castUnit.widthH , y : castUnit.position.z - castUnit.widthH , width : castUnit.width , height : castUnit.width } ) ) castUnits[ unit.id ] = unit; //Если есть коллизия дропаем цикл
				});
				if( castUnits.length > 0 ) break;
			} 
			if( level.cells[ cellKey ] ) {
				let doorOpen = false;
				if( level.doors[ cellKey ] ) {
					let { intersect , offset , doorSide } = this.CheckDoor( level.doors[ cellKey ] , d , angles.ConvertRadianAngle( rayAngle ) , rayStart , rayStep , 0 );
					if( intersect )  ray      = intersect;
					if( !intersect ) doorOpen = true;
				}
				if( !doorOpen ) {
					ray.x -= rayStep.x;
					ray.z -= rayStep.z;
					break;
				}
			} 
			ray.x += rayStep.x;
			ray.z += rayStep.z;
		}
		return { castUnits , ray , rayStep };
	}
	CastObject( rayStart , rayAngle ) {
		let rayStep = this.CreateVectorFromAngle( 1 , rayAngle ).Devide( 100 );
		let ray     = rayStart.Copy();
		// for( let d  = 0; d < 100; d += 0.01 ) {
			// let mapKey = level.GetMapKey( ray.x , ray.z );
			// if( collision.AABB( { x : ray.x , y : ray.z , width : 0.01 , height : 0.01 } , { x : Math.floor( rayStart.x ) + 0.4 , y : Math.floor( rayStart.z ) , width : 0.2 , height : 1 } ) ) return d; //Если есть коллизия дропаем цикл
			// ray.x += rayStep.x;
			// ray.z += rayStep.z;
		// }
		return 0.5;
	}
	CastCell( rayStart , rayEnd ) {
		//Входные данные
		let textureId = 0;
		let angleConv = angles.ConvertRadianAngle( Math.atan2( rayEnd.z - rayStart.z , rayEnd.x - rayStart.x ) );
		let { direction , delta , start , distance , step , side } = this.DDARay( angleConv , rayStart );
		let casts  = [];
		for( let d = 0; d <= viewDist; d++ ) {
			//Двигаемся к следующей клетке
			if ( distance.x < distance.z ) {
				distance.x += delta.x;
				start.x    += step.x;
				side        = 0;
			} else {
				distance.z += delta.z;
				start.z    += step.z;
				side        = 1;
			}
			if( level.CheckCell( start ) && !level.CheckDoor( start ) ) break; //Попали в стену, обрываем
			if ( parseInt( rayEnd.x ) == start.x && parseInt( rayEnd.z ) == start.z ) {
				let cell = start.Plus( new Vector3F( ( 1 - step.x ) >> 1 , level.GetHeight( start ) , ( 1 - step.z ) >> 1 ) );
				return ( side ) ? ( cell.z - rayStart.z ) / direction.z : ( cell.x - rayStart.x ) / direction.x;
			}
		}
		return false;
	}
	GetReflectVector( vector3f , normal ) {
		normal = normal.Normalize();
		let dot = vector3f.Dot( normal );
		return new Vector3F( vector3f.x - 2 * dot * normal.x , 0 , vector3f.z - 2 * dot * normal.z );
	}
	GetTexturePosBySide( side , distance , rayConv , offset = 0 ) {
		let cameraPosition = camera.GetPosition();
		return ( !side ) ? cameraPosition.z + distance * angles.Sin( rayConv ) + offset : cameraPosition.x + distance * angles.Cos( rayConv ) + offset;
	}
	/**
	 * Проверяет пересечение отрезков AB и CD
	 * @param {Object} A, B, C, D - Точки {x, y}
	 * @returns {Object|null} Точка пересечения или null
	 */
	Intersect( A , B , C , D ) {
		// Векторные компоненты
		let ABx = B.x - A.x;
		let ABy = B.z - A.z;
		let CDx = D.x - C.x;
		let CDy = D.z - C.z;
		
		//console.log( A , B , C , D );

		// Определитель
		let determinator = ABx * CDy - ABy * CDx;

		// Отрезки параллельны
		if ( determinator == 0 ) return false;

		let ACx = C.x - A.x;
		let ACy = C.z - A.z;

		// Параметры пересечения
		let t = ( ACx * CDy - ACy * CDx ) / determinator;
		let u = ( ACx * ABy - ACy * ABx ) / determinator;

		// Проверка условий пересечения
		if ( t >= 0 && t <= 1 && u >= 0 && u <= 1 ) return new Vector3F( A.x + ABx * t , 0 , A.z + ABy * t );
		return false; // Нет пересечения
	}
	/**
	 ** @desc Разбивает на основные составляющие DDA алгоритма и возвращает их
	 ** @vars (float) rayAngle - угол луча в радианах, (Vecto3F) rayCast - старт каста луча
	 **/
	DDARay( angleConv , rayCast ) {
		//Направление луча
		let direction = new Vector3F( angles.Cos( angleConv ) , 0 , angles.Sin( angleConv ) );
		//Шаг DDA, расстояние по x и z(y)
		let delta     = new Vector3F( Math.abs( 1 / direction.x ) , 0 , Math.abs( 1 / direction.z ) );
		//Старт луча
		let start     = new Vector3F( Math.floor( rayCast.x ) , 0 , Math.floor( rayCast.z ) );
		//Стартовое  расстояние
		let distance  = new Vector3F();
		//Шаг по клетке
		let step      = new Vector3F();
		//Определяем начальные шаги и расстояния
		if ( direction.x < 0) { //Луч идёт влево
			step.x = -1;
			distance.x = ( rayCast.x - start.x ) * delta.x;
		} else {
			step.x = 1;
			distance.x = ( ( start.x + 1 ) - rayCast.x ) * delta.x;
		}
		if ( direction.z < 0) { //Луч идёт вверх
			step.z = -1;
			distance.z = ( rayCast.z - start.z ) * delta.z;
		} else {
			step.z = 1;
			distance.z = ( ( start.z + 1 ) - rayCast.z ) * delta.z;
		}
		//Сторона, горизонталь / вертикаль
		let side = 0;
		return { direction , delta , start , distance , step , side };
	}
	/**
	 ** @desc Возвращает вектор по переданным длине и углу
	 ** @vars (float) dist - длина луча, (float) angle - угол луча
	 **/
	CreateVectorFromAngle( dist , angle ) {
		let angleConv = angles.ConvertRadianAngle( angle );
		return new Vector3F( dist * angles.Cos( angleConv ) , 0 , dist * angles.Sin( angleConv ) );
	}
	CalcWallheight( distance ) {
		return Math.min( parseInt( camDepth / distance ) , maxHeight );
	}
}