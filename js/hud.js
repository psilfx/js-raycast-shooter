class HUD {
	DrawText( text , positionX ) {
		context.font       = 'bold 20px Roboto';
		context.fillStyle  = 'green';
		let tinfo          = context.measureText( text );
		let tPos           = parseInt( positionX - tinfo.width * 0.5 );
		context.fillText( text , positionX , height - 5 );
	}
	DrawKeys() {
		if( player.inventory.keys[ keyCardsNamesEnums.red ] )    context.drawImage( objectTextures[ 8 ].img , 5 , 5 , 6 , 10 );
		if( player.inventory.keys[ keyCardsNamesEnums.blue ] )   context.drawImage( objectTextures[ 7 ].img , 16 , 5 , 6 , 10 );
		if( player.inventory.keys[ keyCardsNamesEnums.yellow ] ) context.drawImage( objectTextures[ 9 ].img , 27 , 5 , 6 , 10 );
	}
	Draw() {
		this.DrawKeys();
		this.DrawText( player.weapon.bullets , 10 );
		this.DrawText( player.stats.health , width - 50 );
	}
}