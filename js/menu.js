const menuItemsActionEnum = { newgame : 0 , exit : 1 , score : 2 };
class GMenu {
	bgLayer;
	bgColor;
	items   = [];
	current = 0;
	message = "";
	constructor() {
		this.CreateItems();
	}
	SetBGLayer( texture ) {
		this.bgLayer = texture;
	}
	SetBGColor( color ) {
		this.bgColor = color;
	}
	AddItem( iText , font , action ) {
		let item = { text : iText , font : font , action : action };
		this.items.push( item );
	}
	CreateItems() {
		this.AddItem( "Новая игра" , "bold 20px Roboto" , menuItemsActionEnum.newgame );
		this.AddItem( "Выход" , "bold 20px Roboto" , menuItemsActionEnum.exit  );
	}
	GetHeightPadding( itemHeight ) {
		return parseInt( ( height - itemHeight ) * 0.5 );
	}
	GetWidthPadding( itemWidth ) {
		return parseInt( ( width - itemWidth ) * 0.5 );
	}
	Next() {
		this.current = ( this.current + 1 ) * ( this.current + 1 < this.items.length );
	}
	Prev() {
		this.current = ( this.current - 1 ) * ( this.current - 1 > 0 ) + ( this.items.length - 1 ) * ( this.current - 1 < 0 );
	}
	Click() {
		let itemAction = this.items[ this.current ];
		switch ( itemAction.action ) {
			case menuItemsActionEnum.newgame:
				StartLevel();
			break;
			case menuItemsActionEnum.exit:
				if ( confirm( "Выйти из игры?" ) ) {
					window.close();
				}
			break;
		}
	}
	DrawMessage() {
		context.font      = 'bold 30px Roboto';
		context.fillStyle = 'green';
		let tinfo = context.measureText( this.message );
		let xPos  = parseInt( widthH - tinfo.width * 0.5 );
		context.fillText( this.message , xPos , 45 );
	}
	Draw() {
		context.fillStyle = this.bgColor;
		context.fillRect( 0 , 0 , width , height );
		context.drawImage( this.bgLayer.img , this.GetWidthPadding( menuTextures[ 0 ].img.width ) , this.GetHeightPadding( menuTextures[ 0 ].img.height ) );
		if( this.message != "" ) this.DrawMessage();
		let itemsHeight   = this.items.length * 25;
		let itemsPaddingH = this.GetHeightPadding( itemsHeight );
		for( let i = 0; i < this.items.length; i++ ) {
			let item          = this.items[ i ];
			let yPos          = itemsPaddingH + 25 * i;
			context.font      = 'bold 20px Roboto';
			let tinfo = context.measureText( item.text );
			let xPos  = parseInt( widthH - tinfo.width * 0.5 );
			if( i == this.current ) {
				context.fillStyle = "yellow";
				context.fillRect( xPos - 3 , yPos + 6 , tinfo.width + 6 , -26 );
			}
			context.fillStyle = 'green';
			context.fillText( item.text , xPos , yPos );
		}
	}
}