const textureSizesCache = [];
var   imagesToLoad      = 0;
var   imagesLoaded      = 0;
/**
 ** @desc Объект для загрузки и обработки изображения
 **/
class DImage {
	src = ""; //Путь к изображению
	img;      //Загруженное изображение
	specularImg = 0;
	reflectImg  = 0;
	reflects   = [];
	pixels     = []; //Массив пикселей
	rgbaData   = []; //Массив с объектами пикселей
	rgbaStride = []; //Длина значений пикселей по оси y
	rgbaXOff   = []; //Сдвиг пикселей по оси x
	heightPixelsCache = []; //Полоски пикселей по высоте
	constructor( path , specular = 0 , reflect = 0 ) {
		imagesToLoad   += 1;
		this.img        = new Image();
		this.img.src    = path;
		this.img.loaded = false;
		this.img.wrap   = this;
		//По завершению загрузки
		this.img.onload = function() {
			this.stride = this.width * 4;
			this.loaded = true;
			//Канвас для загрузки текстуры
			let tcontext = tcanvas.getContext( '2d' , { willReadFrequently: true }  );
			tcontext.clearRect( 0 , 0 , tcanvas.width, tcanvas.height );
			tcanvas.width  = this.width;
			tcanvas.height = this.height;
			//Считает
			this.heightHalf = parseInt( this.height * 0.5 );
			this.widthHalf  = parseInt( this.width * 0.5 );
			this.maxheight  = Math.max( this.width , this.height );
			//Считает центр изображения
			this.origin           = {}
			this.origin.translate = parseInt( this.maxheight * 0.5 );
			this.origin.offsetX   = parseInt( this.origin.translate - this.widthHalf );
			this.origin.offsetY   = parseInt( this.origin.translate - this.heightHalf );
			tcontext.drawImage( this , 0 , 0 );
			//Сохраняет пиксели изображения
			let imageData = tcontext.getImageData( 0 , 0 , this.width , this.height );
			let pixelData = imageData.data;
			for( let p = 0; p <= pixelData.length; p++ ) {
				this.wrap.pixels[ p ] = pixelData[ p ];
			}
			this.wrap.CreateRGBA();
			//this.wrap.CreatePixelsCache();
			if( specular ) this.wrap.SetSpecular( specular );
			if( reflect ) this.wrap.SetReflect( reflect );
			imagesLoaded++;
		}
	}
	CreatePixelsCache() {
		for( let s = 0; s <= maxHeight + heightH; s++ ) {
			if( typeof( this.heightPixelsCache[ s ] ) == "undefined" ) this.heightPixelsCache[ s ] = [];
			for( let y = 0; y <= s; y++ ) {
				this.heightPixelsCache[ s ][ y ] = parseInt( ( y / s )  * this.img.height );
			}
		}
	}
	SetSpecular( path ) {
		this.specularImg = new Image();
		this.specularImg.src = path;
		this.specularImg.onload = () => {
			let tcontext = tcanvas.getContext( '2d'  );
			tcontext.clearRect( 0 , 0 , tcanvas.width, tcanvas.height );
			tcanvas.width  = this.specularImg.width;
			tcanvas.height = this.specularImg.height;
			tcontext.drawImage( this.specularImg , 0 , 0 );
			let imageData = tcontext.getImageData( 0 , 0 , this.specularImg.width , this.specularImg.height );
			let pixelData = imageData.data;
			for( let y = 0; y <= this.img.height; y++ ) {
				for( let x = 0; x <= this.img.width; x++ ) {
					let pixelSpecular = pixelData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ];
					this.rgbaData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ].specular = colorPercentCache[ pixelSpecular ];
				}
			}
		}
	}
	SetReflect( path ) {
		this.reflectImg = new Image();
		this.reflectImg.src = path;
		this.reflectImg.onload = () => {
			let tcontext = tcanvas.getContext( '2d'  );
			tcontext.clearRect( 0 , 0 , tcanvas.width, tcanvas.height );
			tcanvas.width  = this.reflectImg.width;
			tcanvas.height = this.reflectImg.height;
			tcontext.drawImage( this.reflectImg , 0 , 0 );
			let imageData = tcontext.getImageData( 0 , 0 , this.reflectImg.width , this.reflectImg.height );
			let pixelData = imageData.data;
			for( let y = 0; y <= this.img.height; y++ ) {
				for( let x = 0; x <= this.img.width; x++ ) {
					let pixelReflect = pixelData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ];
					this.rgbaData[ this.rgbaStride[ y ] + this.rgbaXOff[ x ] ].reflect = colorPercentCache[ pixelReflect ];
				}
			}
		}
	}
	AddReflect( reflect ) {
		this.reflects = reflect;
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
	SetRGBAPixels( xStart , yStart , dimage ) {
		for( let y = yStart; y < yStart + dimage.img.height; y++ ) {
			if( y >= this.img.height ) break;
			let yImg    = y - yStart;
			let yStride = this.rgbaStride[ y ];
			for( let x = xStart; x < xStart + dimage.img.width; x++ ) {
				if( x >= this.img.width ) break;
				let xImg = x - xStart;
				let xOff = this.rgbaXOff[ x ];
				let key  = yStride + xOff;
				let pixel = dimage.GetRGBAPixel( xImg , yImg );
				this.rgbaData[ key ].r += pixel.r;
				this.rgbaData[ key ].g += pixel.g;
				this.rgbaData[ key ].b += pixel.b;
			}
		}
	}
	GetPixelsStride( x , height ) {
		let pixels = {};
		for( let h = 0; h < height; h++ ) {
			if( typeof( this.heightPixelsCache[ height ] ) == "undefined" ) console.log( height );
			let y = this.heightPixelsCache[ height ][ h ];
			pixels[ h ] = this.GetRGBAPixel( x , y );
		}
		return pixels;
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
		let pixel = { r : this.pixels[ pixelPointer ] , g : this.pixels[ pixelPointer + 1 ] , b : this.pixels[ pixelPointer + 2 ] , a : this.pixels[ pixelPointer + 3 ] };
		// pixel.r = this.pixels[ pixelPointer ];
		// pixel.g = this.pixels[ pixelPointer + 1 ];
		// pixel.b = this.pixels[ pixelPointer + 2 ];
		// pixel.a = this.pixels[ pixelPointer + 3 ];
		return pixel;
	}
}