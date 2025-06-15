const textureSidesNum   = { left : 0 , front : 1 , right : 2 , back : 3 , top : 4 , bottom : 5 };
const textureSidesNames = { 0 : "Лево" , 1 : "Перед" , 2 : "Право" , 3 : "Зад" , 4 : "Верх" , 5 : "Низ" };
class Map{
	size     = { x : 0 , y : 0 };
	cells    = [];
	heights  = [];
	textures = [];
	decals   = [];
	decalsO  = []; //Объекты для добавления на текстуры декалей
	units    = [];
	unitsInput = []; //Для добавления юнитов из редактора на карту
	objects      = [];
	objectsCells = [];
	doors    = []; //Объекты дверей
	doorOpen = []; //Клетки открывающие дверь
	players  = [];
	blockmap = [];
	mapKeysY = [];
	effects  = [];
	anims    = []; //Анимации для дверей
	projectiles = [];
	unitsPositions = [];
	pathFinder = [];
	ways       = []; //Пути редактора
	winTrigger = false;
	score      = 0;
	constructor( sizeX , sizeY , array ) {
		this.cells  = array;
		for( let y = 0; y <= sizeY; y++ ) {
			this.mapKeysY[ y ] = y * sizeX;
			for( let x = 0; x <= sizeX; x++ ) {
				let key = this.mapKeysY[ y ] + x;
				this.cells[ key ] = 0 + 1 * ( y == 0 || x == 0 || y == sizeY - 1 || x == sizeX - 1 );
			}
		}
		this.size.x = sizeX;
		this.size.y = sizeY;
		for( let c = 0; c < this.cells.length; c++ ) {
			( this.cells[ c ] ) ? this.heights[ c ] = 1 : this.heights[ c ] = 0;
		}
		for( let y = 0; y <= this.size.y; y++ ) {
			this.mapKeysY[ y ] = y * this.size.x;
		}
		this.CreateTexturesFromCells();
		// let key = this.GetMapKey( 7 , 4 );
		// this.AddDoor( 7 , 4 , 0.2 , true );
		// this.AddDoor( 2 , 7 , 0.2 , false );
		//this.doors[ key ] = { open : true , offset : 0 , step : 0.025 };
	}
	CreatePathFinder() {
		this.pathFinder = new PathFinder( this );
	}
	CreateTexturesFromCells() {
		for( let c = 0; c < this.cells.length; c++ ) {
			this.CreateCellTextures( c );
		}
	}
	AddPlayer( unit ) {
		this.players.push( unit );
	}
	AddUnit( unit ) {
		let key     = this.units.length;
			unit.id = key;
		this.units.push( unit );
		return key;
	}
	AddEffect( effect ) {
		this.effects.push( effect );
		return this.effects.length - 1;
	}
	AddDecal( position , rayStep , decal , offsetY = 0 ) {
		//Клетка отсчёта наложения
		let decX  = parseInt( position.x );
		let decY  = parseInt( position.z );
		//Клетка наложения
		let cellPos = position.Plus( rayStep );
		let cellX = parseInt( cellPos.x );
		let cellY = parseInt( cellPos.z );
		let textureSide = 0;
		//Обрабатываем пол
		if( offsetY >= 0 ) {
			let key     = this.GetMapKey( cellX , cellY );
			textureSide = textureSidesNum.bottom;
			if( !this.textures[ key ] ) return;
			let texture = textures[ this.textures[ key ][ 0 ][ textureSide ] ];
			let decalX  = parseInt( ( cellPos.x - cellX ) * textSize ) - decal.img.widthHalf;
			let decalY  = parseInt( ( cellPos.z - cellY ) * textSize ) - decal.img.heightHalf;
			if( !this.decals[ key ][ 0 ][ textureSide ] ) this.AddDecalTexture( texture , key , textureSide ); //Если текстура для декалей ещё не создана, создаём
			this.AddDecalObject( key , textureSide , decal.img , decalX , decalY );
			return;
		}
		//Берём минимальное
		let xDist = Math.abs( cellPos.x - ( cellX + 1 * ( rayStep.x < 0 ) ) );
		let yDist = Math.abs( cellPos.z - ( cellY + 1 * ( rayStep.z < 0 ) ) );
		//Правим под двери ( значение клетки двери и наклейки будут одинаковые, что повлечёт за собой выбор правой сторны , увеличиваем в разные стороны на 1 )
		decX += ( -1 + 2 * ( rayStep.x < 0 ) ) * ( decX == cellX );
		decY += ( -1 + 2 * ( rayStep.z < 0 ) ) * ( decY == cellY );
		//Стены
		if( xDist < yDist ) {
			if( decX > cellX ) {
				textureSide = textureSidesNum.left;
			} else {
				textureSide = textureSidesNum.right;
			} 
			let key = this.GetMapKey( cellX , cellY );
			let texture = textures[ this.textures[ key ][ 0 ][ textureSide ] ];
			let decalX = parseInt( ( cellPos.z - cellY ) * textSize ) - decal.img.widthHalf;
			let decalY = parseInt( textSize + offsetY * textSize ) - decal.img.heightHalf;
			if( !this.decals[ key ][ 0 ][ textureSide ] ) this.AddDecalTexture( texture , key , textureSide ); //Если текстура для декалей ещё не создана, создаём
			this.AddDecalObject( key , textureSide , decal.img , decalX , decalY );
		} else {
			if( decY < cellY ) {
				textureSide = textureSidesNum.front;
			} else {
				textureSide = textureSidesNum.back;
			} 
			let key = this.GetMapKey( cellX , cellY );
			let texture = textures[ this.textures[ key ][ 0 ][ textureSide ] ];
			let decalX = parseInt( ( cellPos.x - cellX ) * textSize ) - decal.img.widthHalf;
			let decalY = parseInt( textSize + offsetY * textSize ) - decal.img.heightHalf;
			if( !this.decals[ key ][ 0 ][ textureSide ] ) this.AddDecalTexture( texture , key , textureSide ); //Если текстура для декалей ещё не создана, создаём
			this.AddDecalObject( key , textureSide , decal.img , decalX , decalY );
		}
	}
	AddDecalObject( key , textureSide , img , x , y , heightH ) {
		if( !this.decalsO[ key ] ) this.decalsO[ key ] = [];
		if( !this.decalsO[ key ][ textureSide ] ) this.decalsO[ key ][ textureSide ] = [];
		this.decalsO[ key ][ textureSide ].push( { img : img , x : x , y : y } );
	}
	AddDecalTexture( texture , key , textureSide ) {
		this.decals[ key ][ 0 ][ textureSide ]   = 1;
		let tkey                                 = textures.length;
		tcanvas.width                            = textSize;
		tcanvas.height                           = textSize;
		tcontext.drawImage( texture.img , 0 , 0 );
		textures[ tkey ]                         = new DImage( texture.img.src , 0 , 0  );
		textures[ tkey ].img.src                 = tcanvas.toDataURL();
		this.textures[ key ][ 0 ][ textureSide ] = tkey;
	}
	UpdateDecals( time ) {
		for( let key in this.decalsO ) {
			let decals = this.decalsO[ key ];
			for( let textureSide in decals ) {
				let side       = decals[ textureSide ];
				let texture    = textures[ this.textures[ key ][ 0 ][ textureSide ] ];
				tcanvas.width  = textSize;
				tcanvas.height = textSize;
				tcontext.drawImage( texture.img , 0 , 0 );
				for( let d in side ) {
					let decal = side[ d ];
					tcontext.drawImage( decal.img , decal.x , decal.y );
				}
				texture.img.src = tcanvas.toDataURL();
				delete this.decalsO[ key ][ textureSide ];
			}
			delete this.decalsO[ key ];
		}
	}
	AddProjectile( projectile ) {
		this.projectiles.push( projectile );
		return this.projectiles.length - 1;
	}
	AddDoor( x , y , width , vertical = false , keyCard = 0 ) {
		let key = this.GetMapKey( x , y );
		let vector , direction , collision = {} , step , side;
		let lines = {};
			lines[ 0 ] = new Vector3F(); 
			lines[ 1 ] = new Vector3F(); 
			lines[ 2 ] = new Vector3F(); 
			lines[ 3 ] = new Vector3F(); 
		if( vertical ) {
			lines[ 0 ].x = x + 0.5 - ( width * 0.5 );
			lines[ 0 ].z = y;
			lines[ 1 ].x = lines[ 0 ].x;
			lines[ 1 ].z = lines[ 0 ].z + 1;
			lines[ 2 ].x = lines[ 0 ].x;
			lines[ 2 ].z = lines[ 1 ].z;
			lines[ 3 ].x = lines[ 0 ].x + width;
			lines[ 3 ].z = lines[ 1 ].z;
			vector      = new Vector3F();
			vector.z    = 1;
			direction   = new Vector3F();
			direction.x = width;
			collision.position = new Vector3F( lines[ 0 ].x , 0 , lines[ 0 ].z );
			collision.width    = width;
			collision.height   = 1;
			step               = 0.025;
			side               = 1;
		let openKey  = this.GetMapKey( x + 1 , y );
		let openKey1 = this.GetMapKey( x - 1 , y );
			this.doorOpen[ openKey  ] = key;
			this.doorOpen[ openKey1 ] = key;
			this.doorOpen[ key      ] = key;
		} else {
			lines[ 0 ].x = x;
			lines[ 0 ].z = y + 0.5 - ( width * 0.5 );
			lines[ 1 ].x = lines[ 0 ].x + 1;
			lines[ 1 ].z = lines[ 0 ].z;
			lines[ 2 ].x = lines[ 1 ].x;
			lines[ 2 ].z = lines[ 1 ].z;
			lines[ 3 ].x = lines[ 1 ].x;
			lines[ 3 ].z = lines[ 1 ].z + width;
			vector      = new Vector3F();
			vector.x    = 1;
			direction   = new Vector3F();
			direction.z = width;
			collision.position = new Vector3F( lines[ 0 ].x , 0 , lines[ 0 ].z );
			collision.width    = 1;
			collision.height   = width;
			step               = 0.025;
			side               = 0;
			let openKey  = this.GetMapKey( x , y + 1 );
			let openKey1 = this.GetMapKey( x , y - 1 );
			this.doorOpen[ openKey  ] = key;
			this.doorOpen[ openKey1 ] = key;
			this.doorOpen[ key      ] = key;
		}
		let door = { position : new Vector3F( lines[ 0 ].x , 0 , lines[ 0 ].z ) , key : key , open : false , vertical : vertical , lines : lines , offset : 0 , vector : vector , direction : direction , step : step , side : side , collision : collision , keyCard : keyCard };
			door.GetCollisionBox = function( direction ) {
				let dir        = ( this.vertical ) ? direction.x : direction.z;
				let doorDir    = this.direction.Multiply( ( dir < 0 ) ); //Меняем направление в зависимости от позиции
				let start      = this.lines[ 0 ].Plus( doorDir );
				this.collision.position = start;
				if( this.vertical ) {
					this.collision.height = this.offset;
				} else {
					this.collision.width = this.offset;
				}
				return this.collision;
			}
		this.doors[ key ] = door;
	}
	SetUnitCellPosition( unit ) {
		this.AddUnitToCell( unit.position.x - unit.widthH , unit.position.z + unit.widthH , unit );
		this.AddUnitToCell( unit.position.x - unit.widthH , unit.position.z - unit.widthH , unit );
		this.AddUnitToCell( unit.position.x + unit.widthH , unit.position.z + unit.widthH , unit );
		this.AddUnitToCell( unit.position.x + unit.widthH , unit.position.z - unit.widthH , unit );
	}
	AddUnitToCell( x , y , unit ) {
		let key = this.GetMapKey( x , y );
		if( this.cells[ key ] && !this.doors[ key ] ) { //Если это стенка
			let overlapX = Math.floor( x ) - x + ( 1 * ( unit.position.x > Math.floor( x ) ) );
			let overlapY = Math.floor( y ) - y + ( 1 * ( unit.position.z > Math.floor( y ) ) );
			( overlapX > overlapY ) ? overlapX = 0 : overlapY = 0;
			unit.Collision( overlapX , overlapY );
			unit.directCollision = true;
			return;
		}
		if( !this.unitsPositions[ key ] ) this.unitsPositions[ key ] = [];
		this.unitsPositions[ key ][ unit.id ] = unit;
	}
	UpdateDoors( time ) {
		for( let d in this.doors ) {
			let door = this.doors[ d ];
			let cameraKey = this.GetMapKey( camera.position.x , camera.position.z );
			if( this.doorOpen[ cameraKey ] == d && ( player.inventory.keys[ door.keyCard ] || !door.keyCard ) ) {
				door.open = true;
			} else {
				door.open = false;
				for( let ukey in this.unitsPositions ) { //Открываем юнитами
					if( door.keyCard ) break;
					if( ukey == d ) {
						door.open = true;
						break;
					}
				}
			}
			if( door.open ) {
				if( door.offset <= 0 ) sound.PlayAmbientSound( 17 , door.lines[0].Subtract( camera.position ) );
				if( door.offset < 1 ) {
					door.offset    += door.step;
					let doorVec     = door.vector.Multiply( door.step );
					door.lines[ 1 ] = door.lines[ 1 ].Subtract( doorVec );
					door.lines[ 2 ] = door.lines[ 2 ].Subtract( doorVec );
					door.lines[ 3 ] = door.lines[ 3 ].Subtract( doorVec );
				} 
			} else {
				//if( door.offset <= 0 && ( !player.inventory.keys[ door.keyCard ] && door.keyCard ) && this.doorOpen[ cameraKey ] ) sound.PlayAmbientSound( 25 , door.lines[0].Subtract( camera.position ) );
				if( door.offset >= 1 ) sound.PlayAmbientSound( 17 , door.lines[0].Subtract( camera.position ) );
				if( door.offset > 0 ) {
					door.offset    -= door.step;
					let doorVec     = door.vector.Multiply( -door.step );
					door.lines[ 1 ] = door.lines[ 1 ].Subtract( doorVec );
					door.lines[ 2 ] = door.lines[ 2 ].Subtract( doorVec );
					door.lines[ 3 ] = door.lines[ 3 ].Subtract( doorVec );
				} 
			}
		}
	}
	UpdateUnits( time ) {
		this.unitsPositions = [];
		for( let u = 0; u < this.units.length; u++ ) {
			let unit = this.units[ u ];
			if( unit.unavailable ){
				unit.CalcSide();
				continue;
			} 
			this.SetUnitCellPosition( unit );
			UnitAnimationHandler( unit );
			unit.Update( time );
		}
	}
	UpdateEffects( time ) {
		let temp = [];
		for( let e = 0; e < this.effects.length; e++ ) {
			let effect = this.effects[ e ];
				effect.Update( time );
			if( !effect.sprite.Animated() ) temp.push( effect );
		}
		this.effects = temp;
	}
	UpdateObjects( time ) {
		this.objectsCells = [];
		for( let o = 0; o < this.objects.length; o++ ) {
			let object    = this.objects[ o ];
				object.id = o;
				object.Update( time );
			let mapKey = this.GetMapKey( object.position.x , object.position.z );
				if( typeof( this.objectsCells[ mapKey ] ) == "undefined" ) this.objectsCells[ mapKey ] = [];
				this.objectsCells[ mapKey ].push( object );
		}
	}
	UpdateExit( time ) {
		if( parseInt( camera.position.x ) == 28 && parseInt( camera.position.z ) == 1 ) this.winTrigger = true;
	}
	DeleteObject( id ) {
		this.objects.splice( id , 1 );
	}
	UpdateProjectiles( time ) {
		let temp = [];
		for( let p = 0; p < this.projectiles.length; p++ ) {
			let projectile = this.projectiles[ p ];
			let mapKey     = this.GetMapKey( projectile.position.x , projectile.position.z );
			let units;
				projectile.Update( time );
			//Пол
			if( projectile.sprite.offsetY >= 0 ) {
				if( projectile.decal ) this.AddDecal( projectile.position , projectile.moveVectorU , projectile.decal , 0 );
				if( projectile.objectable ) {
					projectile.sprite.offsetY = 0;
					let projObject = new GObject( projectile.position.Copy() , projectile.sprite );
						projObject.offsetY = 0;
					level.objects.push( projObject );
				}
				if( projectile.sound ) sound.PlayAmbientSound( projectile.sound , projectile.position.Subtract( camera.position ) );
				continue;
			} 
			//Игрок
			if( collision.AABB( { x : camera.position.x - camera.widthH , y : camera.position.z - camera.widthH , width : camera.width , height : camera.width } , { x : projectile.position.x - projectile.sprite.widthH , y : projectile.position.z - projectile.sprite.widthH , width : projectile.sprite.width , height : projectile.sprite.width } ) && projectile.owner != -1 && projectile.damage > 0  ) {
				projectile.collision = true;
				if( projectile.effect ) {
					projectile.effect.position = projectile.position;
					this.AddEffect( projectile.effect );
				}
				if( projectile.decal ) this.AddDecal( projectile.position.Subtract( projectile.moveVector ) , projectile.moveVector , projectile.decal , projectile.sprite.offsetY + projectile.sprite.heightH );
				player.GetDamage( projectile.damage );
				if( projectile.sound ) sound.PlayAmbientSound( projectile.sound , projectile.position.Subtract( camera.position ) );
				continue;
			//Враги
			} else if( units = this.unitsPositions[ mapKey ] ) {
				for( let u in units ) {
					if( projectile.damage <= 0 ) break;
					let unit = units[ u ];
					if( collision.AABB( 
						{ x : projectile.position.x - projectile.sprite.widthH , y : projectile.position.z - projectile.sprite.widthH , width : projectile.sprite.width , height : projectile.sprite.width } , 
						{ x : unit.position.x - unit.widthH , y : unit.position.z - unit.widthH , width : unit.width , height : unit.width } ) && unit.id != projectile.owner ) {
							this.AddEffect( CreateBloodEffect( camera.GetPosition() , 0  ) );
							projectile.collision = true;
							unit.GetDamage( projectile.damage , projectile.position );
							//Кровь
							for( let b = 0; b < projectile.damage / 5; b++ ) {
								let spreadT = Math.random();
								let decal = decals[ 2 + parseInt( 2 * spreadT ) ];
								let projSprite  = new Sprite( decal , new Vector3F() , 0.1 , 0.1 , -0.5 );
									projSprite.AddAnimation( 0 , new SpriteAnim( 0 , 0 , 0 , decal.img.width , decal.img.height ) );
									projSprite.CurrentAnimation( 0 );
								let bloodprojectile = new Projectile( projSprite , projectile.position , decals[ 5 + parseInt( 3 * spreadT ) ] );
									bloodprojectile.SetSpeed( Math.max( 0.005 * projectile.damage * Math.random() , 0.001 ) );
									bloodprojectile.SetImpulse( 0.15 * Math.random() );
									bloodprojectile.SetVector( unit.angle + 6.28 * spreadT );
									bloodprojectile.SetGravity( Math.max( 0.05 * Math.random() , 0.03 ) );
									bloodprojectile.sound = 18;
									//bloodprojectile.objectable = true;
									level.AddProjectile( bloodprojectile );
							}
						} 
				};
				if( projectile.collision ) {
					if( projectile.effect ) {
						projectile.effect.position = projectile.position;
						this.AddEffect( projectile.effect );
					}
					if( projectile.sound ) sound.PlayAmbientSound( projectile.sound , projectile.position.Subtract( camera.position ) );
					continue;
				}
			}
			//Стены
			if( this.CheckByKey( mapKey ) ) {
				let doorOpen = false;
				if( this.doors[ mapKey ] ) {
					let door = this.doors[ mapKey ];
					if( door.open && door.offset >= 1 ) doorOpen = true;
				}
				if( !doorOpen ) {
					projectile.collision = true;
					if( projectile.effect ) {
						projectile.effect.position = projectile.position.Subtract( projectile.moveVectorU ).Subtract( projectile.moveVectorU ); //Выталкиваем из стены
						this.AddEffect( projectile.effect );
					} 
					if( projectile.decal ) this.AddDecal( projectile.position.Subtract( projectile.moveVectorU ) , projectile.moveVectorU , projectile.decal , projectile.sprite.offsetY + projectile.sprite.heightH );
					projectile.Stop();
					if( projectile.sound ) sound.PlayAmbientSound( projectile.sound , projectile.position.Subtract( camera.position ) );
					if( !projectile.objectable ) continue; //Исчезает если не
				}
			}
			temp.push( projectile );
		}
		this.projectiles = temp;
	}
	LoadFromData( data ) {
		//data          = JSON.parse( data );
		this.size     = data.size;
		this.cells    = data.cells;
		this.heights  = data.heights;
		this.textures = data.textures;
		for( let c in this.cells ) {
			this.CreateCellDecals( c );
		}
		if( data.doors ) {
			for( let d in data.doors ) {
				if( data.doors[ d ] ) {
					this.doors[ d ]           = data.doors[ d ];
					this.doors[ d ].direction = new Vector3F( data.doors[ d ].direction.x , data.doors[ d ].direction.y , data.doors[ d ].direction.z );
					this.doors[ d ].vector    = new Vector3F( data.doors[ d ].vector.x , data.doors[ d ].vector.y , data.doors[ d ].vector.z );
					for( let l = 0; l < 4; l++ ) {
						this.doors[ d ].lines[ l ] = new Vector3F( this.doors[ d ].lines[ l ].x , this.doors[ d ].lines[ l ].y , this.doors[ d ].lines[ l ].z );
					}
					this.doors[ d ].GetCollisionBox = function( direction ) {
						// let dir        = ( this.vertical ) ? direction.x : direction.z;
						// let doorDir    = this.direction.Multiply( ( dir < 0 ) ); //Меняем направление в зависимости от позиции
						// let start      = this.lines[ 0 ].Plus( doorDir );
						// //this.collision.position = start;
						// this.collision.x = this.collision.position.x;
						// this.collision.y = this.collision.position.z;
						// if( this.vertical ) {
							// this.collision.width = this.offset;
							
							
						// } else {
							// this.collision.height = this.offset;
							// this.collision.y      += 0.5;
							// this.collision.x      -= 0.1;
						// }
						return this.collision;
					}
				}
			}
		} else {
			this.doors = [];
		}
		if( data.doorOpen ) {
			for( let d in data.doorOpen ) {
				if( data.doorOpen[ d ] ) {
					this.doorOpen[ d ] = data.doorOpen[ d ];
				}
			}
		} else {
			this.doorOpen = [];
		}
		if( data.unitsInput ) {
			for( let d in data.unitsInput ) {
				if( data.unitsInput[ d ] ) {
					let unit = data.unitsInput[ d ];
					let position = new Vector3F( unit.x + 0.5 , 0 , unit.y + 0.5 );
					let addUnit  = false;
					switch ( unit.type ) {
						case unitNameNums.fatter :
							addUnit = CreateFatterUnit( position );
							
						break;
						case unitNameNums.zombie :
							addUnit = CreateZombieUnit( position );
						break;
					}
					if( addUnit ) {
						this.AddUnit( addUnit );
						if( unit.way ) {
							let positions = data.ways[ unit.way ].positions;
							let order = new PatrolOrder( addUnit , new Vector3F( parseInt( positions[ 0 ].x ) , 0 , parseInt( positions[ 0 ].y ) ) , new Vector3F( parseInt( positions[ 1 ].x ) , 0 , parseInt( positions[ 1 ].y ) ) );
							for( let p = 2; p < positions.length; p++ ) {
								order.AddPosition( new Vector3F( parseInt( positions[ p ].x ) , 0 , parseInt( positions[ p ].y ) ) );
							}
							gameDirector.Order( addUnit , order );
						}
					}
					
				}
			}
			this.unitsInput = data.unitsInput;
		} else {
			this.unitsInput = [];
		}
		if( data.items ) {
			for( let i = 0; i < data.items.length; i++ ) {
				let itemData = data.items[ i ];
				switch ( itemData.item ) {
					case 1 :
						level.objects.push( CreatePistolAmmo( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 2 :
						level.objects.push( CreateShotgunAmmo( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 3 :
						level.objects.push( CreateRifleAmmo( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 4 :
						level.objects.push( CreateRocketAmmo( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 5 :
						level.objects.push( CreateRedKeycard( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 6 :
						level.objects.push( CreateBlueKeycard( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 7 :
						level.objects.push( CreateYellowKeycard( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
					case 8 :
						level.objects.push( CreateAidObject( new Vector3F( itemData.x , 0 , itemData.y ) ) );
					break;
				}
			}
		}
		this.ways  = data.ways;
		this.items = data.items;
	}
	CreateCellTextures( key ) {
		let texture        = this.cells[ key ];
		let heights        = this.heights[ key ];
		if( typeof( this.textures[ key ] ) == "undefined" ) this.textures[ key ] = [];
		for( let h = 0; h <= heights; h++ ) {
			if( typeof( this.textures[ key ][ h ] ) != "undefined" ) continue;
			this.textures[ key ][ h ] = [];
			for( let t = 0; t < 6; t++ ) {
				this.textures[ key ][ h ][ t ] = texture; //Лево //Перед //Право //Зад //Верх //Низ
			}
		}
	}
	CreateCellDecals( key ) {
		let heights = this.heights[ key ];
		if( typeof( this.decals[ key ] ) == "undefined" ) this.decals[ key ] = [];
		for( let h = 0; h <= heights; h++ ) {
			if( typeof( this.decals[ key ][ h ] ) != "undefined" ) continue;
			this.decals[ key ][ h ] = [];
		}
		// for( let d = 0; d < 6; d++ ) {
			// let texture = textures[ this.textures[ key ][ 0 ][ d ] ];
			// this.AddDecalTexture( texture , key , d );
		// }
	}
	SetTexturesToCells( x , y , z , textureIds = { left : 0 , front : 0 , right : 0 , back : 0 , top : 0 , bottom : 0 } ) {
		let key = this.GetMapKey( x , z );
		if( textureIds.left )  this.textures[ key ][ y ][ textureSidesNum.left ]   = textureIds.left;
		if( textureIds.front ) this.textures[ key ][ y ][ textureSidesNum.front ]  = textureIds.front;
		if( textureIds.right ) this.textures[ key ][ y ][ textureSidesNum.right ]  = textureIds.right;
		if( textureIds.back )  this.textures[ key ][ y ][ textureSidesNum.back ]   = textureIds.back;
		if( textureIds.top )   this.textures[ key ][ y ][ textureSidesNum.top ]    = textureIds.top;
		if( textureIds.bottom )this.textures[ key ][ y ][ textureSidesNum.bottom ] = textureIds.bottom;
	}
	GetTexture( x , y , z , sideNum ) {
		let key = this.GetMapKey( x , z );
		return this.textures[ key ][ y ][ sideNum ];
	}
	GetCellTextures( x , y ) {
		let key = this.GetMapKey( x , y );
		return this.textures[ key ];
	}
	GetHeight( vector3f ) {
		return this.GetHeightByXY( vector3f.x , vector3f.z );
	}
	GetHeightByXY( x , y ) {
		let key = this.GetMapKey( x , y );
		if( typeof( this.heights[ key ] ) == "undefined" ) return 0;
		return this.heights[ key ];
	}
	GetMapKey( x , y ) {
		return this.mapKeysY[ Math.floor( y ) ] + Math.floor( x );
	}
	SetHeightByXY( x , y , height ) {
		let key = this.GetMapKey( x , y );
		this.heights[ key ] = height;
	}
	CheckCell( vector3f ) {
		return this.CheckCellByXY( vector3f.x , vector3f.z );
	}
	CheckDoor( vector3f ) {
		let key = this.GetMapKey( vector3f.x , vector3f.z );
		return this.doors[ key ];
	}
	CheckCellByXY( x , y ) {
		let key = this.GetMapKey( x , y );
		return this.CheckByKey( key );
	}
	CheckByKey( key ) {
		if( typeof( this.cells[ key ] ) == "undefined" ) return 0;
		return this.cells[ key ];
	}
	FindWay( startVec3F , endVec3F ) {
		let startKey = this.GetMapKey( startVec3F.x , startVec3F.z );
		let endKey   = this.GetMapKey( endVec3F.x , endVec3F.z );
		if( this.CheckByKey( startKey ) || this.CheckByKey( endKey ) ) {
			return [ startVec3F , endVec3F ];
		} 
		let path = this.pathFinder.Find( startKey , endKey );
		//console.log( path );
		return path;
	}
	InVision( startVec3F , endVec3F ) {
		let startKey = this.GetMapKey( startVec3F.x , startVec3F.z );
		let endKey   = this.GetMapKey( endVec3F.x , endVec3F.z );
		if( this.cells[ startKey ] ) return false; //Костыль на стенку
		return this.pathFinder.InVision( startKey , endKey );
	}
	CheckHeightAround( vector3f , dist , normal ) {
		let x = vector3f.x;
		let y = vector3f.z;
		for( let d = 1; d <= dist; d++ ) {
			if( this.GetHeightByXY( x + d * normal.x , y ) > 1 || this.GetHeightByXY( x , y + d * normal.z ) > 1 ) return true;
			if( this.GetHeightByXY( x + d * normal.x , y + d * normal.z ) > 1 ) return true;

		}
		return false;
	}
}