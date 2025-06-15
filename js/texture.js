class Texture {
	data       = [];
	rgbaData   = [];
	rgbaXOff   = [];
	rgbaStride = [];
	pixels     = [];
	constructor( dImage ) {
		this.rgbaData   = dImage.rgbaData;
		this.rgbaXOff   = dImage.rgbaXOff;
		this.rgbaStride = dImage.rgbaStride;
		this.pixels     = dImage.pixels;
	}
	/**
	 ** @desc Создаёт массив с объектами пикселей, чтобы не создавать их каждый раз
	 **/
	CreateRGBA() {
		for( let y = 0; y <= this.img.height; y++ ) {
			this.rgbaStride[ y ] = parseInt( y * this.img.stride );
			for( let x = 0; x <= this.img.width; x++ ) {
				this.rgbaXOff[ x ] = x * 4;
				this.rgbaData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ] = this.GetPixelFromData( x , y );
			}
		}
	}
	/**
	 ** @desc Получает и возвращает пиксель из массива
	 ** @vars (int) x - координата x отсносительно текстуры, (int) y - координата y отсносительно текстуры
	 **/
	GetPixel( x , y ) {
		return this.GetPixelFromData( x , y );
	}
	/**
	 ** @desc Возвращает объект пикселя
	 ** @vars (int) x - координата x отсносительно текстуры, (int) y - координата y отсносительно текстуры
	 **/
	GetRGBAPixel( x , y ) {
		return this.rgbaData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ];
	}
	/**
	 ** @desc Получает и возвращает пиксель по uv координатам
	 ** @vars (int) x - координата x отсносительно текстуры, (int) y - координата y отсносительно текстуры
	 **/
	GetPixelByUV( x , y ) {
		x = Math.abs( x );
		y = Math.abs( y );
		x = parseInt( ( x - Math.floor( x ) ) * this.img.width );
		y = parseInt( ( y - Math.floor( y ) ) * this.img.height );
		return this.GetRGBAPixel( x , y );
	}
	/**
	 ** @desc Получает и возвращает пиксель напрямую из массива
	 ** @vars (int) x - координата x отсносительно текстуры, (int) y - координата y отсносительно текстуры
	 **/
	GetPixelFromData( x , y ) {
		let pixelPointer = this.rgbaStride[ y ] + this.rgbaXOff[ x ];
		let pixel = new Color( this.pixels[ pixelPointer ] , this.pixels[ pixelPointer + 1 ] , this.pixels[ pixelPointer + 2 ] , this.pixels[ pixelPointer + 3 ] );
		// pixel.r = this.pixels[ pixelPointer ];
		// pixel.g = this.pixels[ pixelPointer + 1 ];
		// pixel.b = this.pixels[ pixelPointer + 2 ];
		// pixel.a = this.pixels[ pixelPointer + 3 ];
		return pixel;
	}
}