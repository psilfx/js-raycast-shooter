/**
 ** @desc Объект для работы с цветом, используется для смешивания и вывода цвета на рендер
 **/
 const colorPercentCache = [];
 const colorHalfDevideCache = [];
for( let c = 0; c <= 255; c++ ) {
	 colorPercentCache[ c ] = c / 255;
}
for( let c = 0; c <= 1000; c++ ) {
	 colorHalfDevideCache[ c ] = parseInt( c / 2 );
}
function MixColor( color1 , color2 ) {
	let r = color1.r + color2.r;
	let g = color1.g + color2.g;
	let b = color1.b + color2.b;
	let a = color1.a + color2.a;
	return { r : r , g : g , b : b , a : a };
}
function MixColorDevide( color1 , color2 ) {
	let r = color1.r + color2.r;
	let g = color1.g + color2.g;
	let b = color1.b + color2.b;
	//let a = color1.a + color2.a;
	return { r : colorHalfDevideCache[ r  ], g : colorHalfDevideCache[ g ] , b : colorHalfDevideCache[ b ] , a : 255 };
}
function MultiplyColor( color1 , num ) {
	let r = color1.r * num;
	let g = color1.g * num;
	let b = color1.b * num;
	let a = color1.a;
	return { r : parseInt( r ) , g : parseInt( g ) , b: parseInt( b ) , a : a };
}
class Color{
	r = 0;
	g = 0;
	b = 0;
	a = 1;
	specular = 0;
	reflect  = 0;
	constructor( r = 255 , g = 255 , b = 255 , a = 1 ){
		this.r = r;
		this.g = g;
		this.b = b;
		this.a = a;
	}
	/**
	 ** @desc Избавляемся от значения альфа канала
	 **/
	SetAlpha(){
		let a   = colorPercentCache[ parseInt( this.a ) ];
		this.r *= this.a;
		this.g *= this.a;
		this.b *= this.a;
		this.a = 1;
	}
	/**
	 ** @desc Смешивает два цвета
	 ** @vars (Color) color - цвет для смешивания
	 **/
	Mix( color ) {
		//color.SetAlpha();
		let r = this.r + color.r;
		let g = this.g + color.g;
		let b = this.b + color.b;
		let a = this.a;
		return new Color( colorHalfDevideCache[ r ] , colorHalfDevideCache[ g ] , colorHalfDevideCache[ b ] , a );
	}
	Sub( color ) {
		let r = this.r - color.r;
		let g = this.g - color.g;
		let b = this.b - color.b;
		let a = this.a;
		return new Color( r , g , b , a );
	}
	/**
	 ** @desc Умножает значения всех каналов, возвращает новый цвет
	 ** @vars (number) num - число на которое нужно умножить
	 **/
	Multiply( num ) {
		let r = this.r * num;
		let g = this.g * num;
		let b = this.b * num;
		let a = this.a;
		return new Color( parseInt( r ) , parseInt( g ) , parseInt( b ) , a );
	}
	/**
	 ** @desc Создаёт копию объекта цвета
	 **/
	Copy() {
		return new Color( this.r , this.g , this.b , this. a );
	}
	/**
	 ** @desc Преобразуем значения в строку, применяется при выводе в рендер
	 **/
	ToString() {
		return "rgba( " + this.r * this.a + "," + this.g * this.a + "," + this.b * this.a + " , " + this.a + " )";
	}
}