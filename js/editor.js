class Editor {
	editorClass = "editor";
	elem;
	map;
	textures;
	player;
	saveButton;
	maxHeight = 5;
	inputHeight;
	inputDoor;
	inputDoorKey;
	inputUnits;
	inputTextures;
	inputItems;
	addWayButton;
	addItemButton;
	items = [];
	ways  = [];
	selected; //Выбранная клетка
	selectedTexture;
	selectedWay;
	cellwidth = 30;
	cellWH    = 15;
	size      = { x : 10 , y : 10 };
	constructor( domElement ) {
		this.elem = domElement;
		this.elem.style.display  = `flex`;
		this.elem.style.flexWrap = `wrap`;
		this.ways  = level.ways;
		this.items = level.items;
		this.map   = this.CreateBlock( "div" , "map" );
		this.elem.appendChild( this.map );
		this.ViewLevel();
		this.CreateEditorPanel();
		this.CreateTexturesBlock();
		this.CreateSaveButton();
		this.RenderWays();
	}
	CreateSaveButton() {
		let saveButton = this.CreateBlock( "button" , "save-button" , { value : "Сохранить" } );
			saveButton.innerHTML = "Сохранить";
			saveButton.onclick = () => {
				let temp     = { cells : level.cells , heights : level.heights , textures : level.textures , size : level.size , doors : level.doors , doorOpen : level.doorOpen , unitsInput : level.unitsInput , ways : this.ways , items : this.items , playerStart : { "x" : 1.5 , "y" : 1.5 } };
				let saveInfo = JSON.stringify( temp );
				console.log( saveInfo );
			}
		this.elem.appendChild( saveButton );
	}
	CreateTexturesBlock() {
		let tblock = this.CreateBlock( "div" , "textures-block" );
		this.CreateText( tblock , "Загруженные текстуры" );
			for( let t = 0; t < textures.length; t++ ) {
				let textureImg = this.CreateTextureImage( t );
					textureImg.style.width  = `100px`;
					textureImg.style.height = `100px`;
					textureImg.setAttribute( "id" , t );
					textureImg.onclick = () => {
						if( typeof( this.selectedTexture ) != "undefined" ) {
							let cellKey    = this.selectedTexture.getAttribute( "key" );
							let cellHeight = this.selectedTexture.getAttribute( "height" );
							let cellSide   = this.selectedTexture.getAttribute( "side" );
							level.textures[ cellKey ][ cellHeight ][ cellSide ] = textureImg.getAttribute( "id" );
							this.selectedTexture.src = textureImg.src;
							//alert( this.selectedTexture.getAttribute( "key" ) );
						}
					}
				tblock.appendChild( textureImg );
			}
		this.elem.appendChild( tblock );
	}
	DrawPlayer() {
		this.player = this.CreateBlock( "div" , "map-player" ); 
		this.player.style.width           = `${ this.cellwidth * camera.width }px`;
		this.player.style.height          = `${ this.cellwidth * camera.width }px`;
		this.player.style.borderRadius    = `${ this.cellwidth }px`;
		this.player.style.position        = `absolute`;
		this.player.style.backgroundColor = `red`;
		this.map.appendChild( this.player );
		this.UpdatePlayerPos();
	}
	Update() {
		this.UpdatePlayerPos();
		//this.DrawUnit( unit );
	}
	DrawUnits() {
		for( let u in level.units ) {
			let unit = level.units[ u ];
			this.DrawUnit( unit );
		}
	}
	DrawRect( x , y , width ) {
		let rect = this.CreateBlock( "div" , "map-rect" ); 
			rect.style.width           = `${ this.cellwidth * width }px`;
			rect.style.height          = `${ this.cellwidth * width }px`;
			rect.style.position        = `absolute`;
			rect.style.left = `${ ( x - camera.widthH ) * ( this.cellwidth + 1 ) }px`; //1 - отступ border
			rect.style.top  = `${ ( y - camera.widthH ) * ( this.cellwidth + 1 ) }px`;
			rect.style.backgroundColor = `orange`;
			this.map.appendChild( rect );
	}
	DrawUnit( unit ) {
		let mapunit = this.CreateBlock( "div" , "map-unit" ); 
			mapunit.style.width           = `${ this.cellwidth * unit.sprite.width }px`;
			mapunit.style.height          = `${ this.cellwidth * unit.sprite.width }px`;
			mapunit.style.borderRadius    = `${ this.cellwidth }px`;
			mapunit.style.position        = `absolute`;
			mapunit.style.left = `${ ( unit.position.x - camera.widthH ) * ( this.cellwidth + 1 ) }px`; //1 - отступ border
			mapunit.style.top  = `${ ( unit.position.z - camera.widthH ) * ( this.cellwidth + 1 ) }px`;
			mapunit.style.backgroundColor = `red`;
			this.map.appendChild( mapunit );
	}
	UpdatePlayerPos() {
		let cameraPosition     = camera.GetPosition();
		this.player.style.left = `${ ( cameraPosition.x - camera.widthH ) * ( this.cellwidth + 1 ) }px`; //1 - отступ border
		this.player.style.top  = `${ ( cameraPosition.z - camera.widthH ) * ( this.cellwidth + 1 ) }px`;
	}
	CreateEditorPanel() {
		this.editorPanel = this.CreateBlock( "div" , "panel" );
		//Высота
		this.CreateText( this.editorPanel , "Высота клетки" );
		this.inputHeight = this.CreateBlock( "input" , "panel-input-height" , { type : "number" } );
		this.inputHeight.onchange = () => {
			if( typeof( this.selected ) == "undefined" ) return;
			let key              = this.selected.getAttribute( "data-id" );
			let heightValue      = Math.min( Math.max( 0 , this.inputHeight.value ) , this.maxHeight );
			level.heights[ key ] = heightValue;
			( heightValue > 0 ) ? level.cells[ key ] = 1 : level.cells[ key ] = 0;
			level.CreateCellTextures( key );
			this.ViewLevel();
		}
		this.inputTextures = this.CreateBlock( "div" , "panel-input-textures" );
		this.editorPanel.appendChild( this.inputHeight );
		//Дверь
		this.CreateText( this.editorPanel , "Дверь" );
		this.inputDoor = this.CreateSelect( { 0 : { name : "Нет" , value : 0 } , 1 : { name : "Вертикальная" , value : 1 } , 2 : { name : "Горизонтальная" , value : 2 } } );
		this.inputDoorKey = this.CreateSelect( { 0 : { name : "Нет" , value : keyCardsNamesEnums.none } , 1 : { name : "Красный" , value : keyCardsNamesEnums.red } , 2 : { name : "Синий" , value : keyCardsNamesEnums.blue } , 3 : { name : "Жёлтый" , value : keyCardsNamesEnums.yellow } } );
		this.inputDoor.onchange = () => {
			if( typeof( this.selected ) == "undefined" ) return;
			let doorType = parseInt( this.inputDoor.options[ this.inputDoor.selectedIndex ].value );
			let key      = this.selected.getAttribute( "data-id" );
			let keyCard  = parseInt( this.inputDoorKey.options[ this.inputDoorKey.selectedIndex ].value );
			let x        = parseInt( this.selected.getAttribute( "data-x" ) );
			let y        = parseInt( this.selected.getAttribute( "data-y" ) );
			if( !doorType ) { //Удаляем
				delete level.doors[ key ];
				for( let d in level.doorOpen ) {
					if( level.doorOpen[ d ] == key ) delete level.doorOpen[ d ];
				}
			}
			if( doorType == 1 ) level.AddDoor( x , y , 0.2 , true  , keyCard ); 
			if( doorType == 2 ) level.AddDoor( x , y , 0.2 , false , keyCard ); 
		}
		this.editorPanel.appendChild( this.inputDoor );
		this.editorPanel.appendChild( this.inputDoorKey );
		//Юниты
		this.CreateText( this.editorPanel , "Юнит" );
		this.inputUnits = this.CreateSelect( 	{ 	
												0 : { name : "Нет" , value : 0 } , 
												1 : { name : "Жирдяй" , value : unitNameNums.fatter } , 
												2 : { name : "Зомби" , value : unitNameNums.zombie } 
												} );
		this.inputUnits.onchange = () => {
			if( typeof( this.selected ) == "undefined" ) return;
			let type     = parseInt( this.inputUnits.options[ this.inputUnits.selectedIndex ].value );
			//if( !type ) return;
			let key      = this.selected.getAttribute( "data-id" );
			let x        = parseInt( this.selected.getAttribute( "data-x" ) );
			let y        = parseInt( this.selected.getAttribute( "data-y" ) );
			level.unitsInput[ key ] = { x : x , y : y , type : type };
		}
		this.editorPanel.appendChild( this.inputUnits );
		//Пути
		this.CreateText( this.editorPanel , "Пути" );
		this.wayBlock               = this.CreateBlock( "div" , "panel-ways-block" );
		this.addWayButton           = document.createElement( "button" );
		this.addWayButton.innerHTML = "Добавить путь";
		this.addWayButton.onclick   = () => {
			this.AddWay();
			this.RenderWays();
		}
		this.editorPanel.appendChild( this.addWayButton );
		this.editorPanel.appendChild( this.wayBlock );
		//Предметы
		this.CreateText( this.editorPanel , "Предметы" );
		let itemsBase      = {};
			itemsBase[ 0 ] = { name : "Нет" , value : 0 };
			itemsBase[ 1 ] = { name : "Патроны пистолета" , value : 1 };
			itemsBase[ 2 ] = { name : "Патроны дробовика" , value : 2 };
			itemsBase[ 3 ] = { name : "Патроны пулемёта"  , value : 3 };
			itemsBase[ 4 ] = { name : "Патроны ракетницы" , value : 4 };
			itemsBase[ 5 ] = { name : "Красный ключ" , value : 5 };
			itemsBase[ 6 ] = { name : "Синий ключ"   , value : 6 };
			itemsBase[ 7 ] = { name : "Жёлтый ключ"  , value : 7 };
			itemsBase[ 8 ] = { name : "Аптечка"      , value : 8 };
		this.addItemButton = document.createElement( "button" );
		this.addItemButton.innerHTML = "Добавить предмет";
		this.addItemButton.onclick   = () => {
			this.AddItem();
		}
		this.inputItems = this.CreateSelect( itemsBase );
		this.editorPanel.appendChild( this.inputItems );
		this.editorPanel.appendChild( this.addItemButton );
		//Текстуры
		this.CreateText( this.inputTextures , "Текстуры" );
		this.editorPanel.appendChild( this.inputTextures );
		this.elem.appendChild( this.editorPanel );
	}
	AddItem() {
		let itemId = parseInt( this.inputItems.options[ this.inputItems.selectedIndex ].value );
		if( this.selected ) {
			let x   = parseInt( this.selected.getAttribute( "data-x" ) );
			let y   = parseInt( this.selected.getAttribute( "data-y" ) );
			let key = this.selected.getAttribute( "data-key" );
			let item = { x : x + 0.5 , y : y + 0.5 , key : key , item : itemId , id : this.items.length , index : this.inputItems.selectedIndex };
			this.items[ this.items.length ] = item;
		}
		
	}
	AddWay() {
		let way = { id : this.ways.length , name : "Новый путь" , positions : [] };
		this.ways.push( way );
	}
	RenderWays() {
		this.wayBlock.innerHTML = "";
		for( let w = 0; w < this.ways.length; w++ ) {
			let way = this.ways[ w ];
			let selectStyle = '';
			if( this.selectedWay ) {
				if( this.selectedWay.getAttribute( "data-id" ) == way.id ) { 
					selectStyle = 'style="background-color:green"';
					for( let p in way.positions ) {
						let position = way.positions[ p ];
						document.querySelector( `div[data-key="${position.key}"]` ).style.backgroundColor = "rgba( 0 , 50 , 50 , 0.5 )";
					}
				}
			}
			let html  = `<div class="way-block" data-id="${ way.id }" ${ selectStyle } >`;
				html += `<input type="text" value="${ way.name }" />`;
				html += ` Кол-во путей: ${ way.positions.length }`;
			if( this.selected ) {
				//console.log( this.selected );
				let cellKey = this.selected.getAttribute( "data-key" );
				if( level.unitsInput[ cellKey ] ) {
					html += ` <button class="link-button" >Привязать</button>`;
				}
			}
				html += `</div>`;
			this.wayBlock.innerHTML += html;
		}
		let blocks = this.wayBlock.querySelectorAll( ".way-block" );
		for( let b = 0; b < blocks.length; b++ ) {
			blocks[ b ].onclick = () => {
				//let id = blocks[ b ].getAttribute( "data-id" );
				if( this.selectedWay ) {
					let way = this.ways[ this.selectedWay.getAttribute( "data-id" ) ];
					for( let p in way.positions ) {
						let position = way.positions[ p ];
						document.querySelector( `div[data-key="${position.key}"]` ).style.backgroundColor = "gray";
					}
					if( this.selectedWay.getAttribute( "data-id" ) == blocks[ b ].getAttribute( "data-id" ) ) {
						this.selectedWay = 0;
					} else {
						this.selectedWay = blocks[ b ];
					}
					
				} else {
					this.selectedWay = blocks[ b ];
				}
				this.RenderWays();
			}
			if( this.selected ) {
				if( blocks[ b ].querySelector( ".link-button" ) ) {
					blocks[ b ].querySelector( ".link-button" ).onclick = () => {
						let cellKey = this.selected.getAttribute( "data-key" );
						level.unitsInput[ cellKey ].way = b;
					}
				}
			}
			let input = blocks[ b ].querySelector( "input" );
			input.onkeydown = () => {
				this.ways[ b ].name = input.value;
			}
		}
	}
	CreateSelect( values ) {
		let element = document.createElement( "select" );
		for( let val in values ) {
			let value  = values[ val ];
			let option = document.createElement( "option" );
				option.innerHTML = value.name;
				option.value     = value.value; 
			element.appendChild( option );
		}
		return element;
	}
	CreateText( elem , text ) {
		let textblock           = document.createElement( "h3" );
			textblock.innerHTML = text;
			elem.appendChild( textblock );
	}
	CreateBlock( elem , className , attrs = {} ) {
		let element = document.createElement( elem );
			element.classList.add( `${ this.editorClass }-${ className }` );
			for( let a in attrs ) {
				element.setAttribute( a , attrs[ a ] );
			}
			return element;
	}
	ViewTextures( ) {
		
	}
	ViewLevel() {
		this.map.innerHTML = "";
		this.cellwidth = 30;
		this.map.style.width    = `${ ( this.cellwidth + 2 ) * level.size.x }px`;
		this.map.style.height   = `${ ( this.cellwidth + 2 ) * level.size.y }px`;
		this.map.style.display  = `flex`;
		this.map.style.flexWrap = `wrap`;
		this.map.style.position = `relative`;
		for( let y = 0; y < level.size.y; y++ ) {
			for( let x = 0; x < level.size.x; x++ ) {
				let key      = level.GetMapKey( x , y );
				let height   = level.heights[ key ];
				let textures = level.textures[ key ];
				let cell     = this.CreateLevelCell( height , textures );
					cell.setAttribute( `data-id` , key );
					cell.setAttribute( `data-x` , x );
					cell.setAttribute( `data-y` , y );
					cell.setAttribute( `data-key` , key );
					//if( level.units[ key ] ) cell.style.backgroundColor = "yellow";
					if( level.doors[ key ] ) {
						cell.querySelector('div').style.backgroundColor = "blue";
						cell.querySelector('div').style.marginTop = `${ this.cellwidth * ( 1 - level.doors[ key ].collision.height ) * 0.5 }px`;
						cell.querySelector('div').style.marginLeft = `${ this.cellwidth * ( 1 - level.doors[ key ].collision.width ) * 0.5 }px`;
						cell.querySelector('div').style.width  = `${ this.cellwidth * level.doors[ key ].collision.width }px`;
						cell.querySelector('div').style.height = `${ this.cellwidth * level.doors[ key ].collision.height }px`;
					}
				this.map.appendChild( cell );
			}
		}
		this.DrawPlayer();
		this.DrawUnits();
	}
	CreateLevelCell( height , textures ) {
		let cell = this.CreateBlock( "div" , "map-cell" );
			cell.style.width           = `${ this.cellwidth }px`;
			cell.style.height          = `${ this.cellwidth }px`;
			cell.style.backgroundColor = `gray`;
			cell.style.border          = `1px solid white`;
			cell.setAttribute( "data-height"   , height );
			cell.setAttribute( "data-textures" , JSON.stringify( textures ) );
			cell.onclick = () => {
				this.SelectCell( cell );
			}
		let heightColor = document.createElement( `div` );
			heightColor.style.width           = `100%`;
			heightColor.style.height          = `100%`;
			heightColor.style.backgroundColor = `rgba( 0 , 0 , 255 , ${ ( height / this.maxHeight ) } )`;
			cell.appendChild( heightColor );
		return cell;
	}
	SelectCell( cell ) {
		if( typeof( this.selected ) != `undefined` ) this.Unselect( this.selected );
		this.selected = cell;
		console.log( this.selected );
		this.SetInputValuesFromCell( cell );
		cell.classList.add( "selected" );
		if( this.selectedWay && this.selected ) {
			let keyCell = this.selected.getAttribute( "data-key" );
			let keyWay  = this.selectedWay.getAttribute( "data-id" );
			for( let p in this.ways[ keyWay ].positions ) {
				if( this.ways[ keyWay ].positions[ p ].key == keyCell ) return; 
			}
			this.ways[ keyWay ].positions.push( { key : keyCell , x : this.selected.getAttribute( "data-x" ) , y : this.selected.getAttribute( "data-y" ) } );
			this.RenderWays();
		}
	}
	CreateTextureImage( textureId , key = 0 , h = 0 , t = 0 ) {
		let texture = textures[ textureId ];
		let timage  = this.CreateBlock( "img" , "texture-image" , { src : texture.img.src , height : h , side : t , key : key } );
			timage.onclick = () => {
				if( this.selectedTexture ) this.selectedTexture.classList.remove( "selected" );
				this.selectedTexture = timage;
				this.selectedTexture.classList.add( "selected" );
			}
			timage.style.width  = `50px`;
			timage.style.height = `50px`;
		return timage;
	}
	SetInputValuesFromCell( cell ) {
		let key        = cell.getAttribute( "data-id" );
		let cellHeight = level.heights[ key ];
		let ltextures  = level.textures[ key ];
		if( !ltextures ) ltextures = [ 0 , 0 , 0 , 0 ,];
		//Поле высота
		this.inputHeight.value = cellHeight;
		this.inputHeight.setAttribute( "value" , cellHeight );
		//Дверь
		if( level.doors[ key ] ) {
			if( level.doors[ key ].vertical ) {
				this.inputDoor.selectedIndex = 1;
			} else {
				this.inputDoor.selectedIndex = 2;
			}
		} else {
			this.inputDoor.selectedIndex = 0;
		}
		//Юнит
		//this.inputUnits.selectedIndex = level.doors[ key ]
		if( level.unitsInput[ key ] ) {
			this.inputUnits.selectedIndex = level.unitsInput[ key ].type;
		} else {
			this.inputUnits.selectedIndex = 0;
		}
		//Предмет
		this.inputItems.selectedIndex = 0;
		for( let item of this.items ) {
			if( item.key == key ) {
				this.inputItems.selectedIndex = item.item;
				break;
			}
		}
		//Текстуры
		this.inputTextures.innerHTML = "";
		for( let h = 0; h < ltextures.length; h++ ) {
			let heightTexture = ltextures[ h ];
			this.CreateText( this.inputTextures , `Этаж ${h}` );
			let imgElem = this.CreateBlock( "div" , "texture-image-block" );
				imgElem.style.display = `flex`;
			for( let t = 0; t < heightTexture.length; t++ ) {
				this.CreateText( imgElem , textureSidesNames[ t ] );
				let img = this.CreateTextureImage( heightTexture[ t ] , key , h , t );
				imgElem.appendChild( img );
			}
			this.inputTextures.appendChild( imgElem );
		}
		
	}
	Unselect( cell ) {
		this.selected.classList.remove( "selected" );
	}
}