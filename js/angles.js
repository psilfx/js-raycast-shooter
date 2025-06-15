const cosCache           = [];
const sinCache           = [];
const anglesConvertValue = 1000;
class Angles {
	constructor() {
		let radiansCacheStart = parseInt( -Math.PI * 4 * anglesConvertValue );
		for( let r = radiansCacheStart; r <= Math.abs( radiansCacheStart ); r++ ) {
			cosCache[ r ] = Math.cos( r / anglesConvertValue );
			sinCache[ r ] = Math.sin( r / anglesConvertValue );
		}
	}
	ConvertRadianAngle( angle ) {
		return parseInt( angle * anglesConvertValue );
	}
	Sin( convertedAngle ) {
		return sinCache[ convertedAngle ];
	}
	Cos( convertedAngle ) {
		return cosCache[ convertedAngle ];
	}
	Normalize( angle ) {
		// Приводим угол к диапазону [-π, π]
		let doublePi = 2 * Math.PI;
		angle = angle % ( doublePi ); //Остаток
		if ( angle < -Math.PI ) { //Если отрицательное
			angle += doublePi ; 
		} else if ( angle > Math.PI ) {
			angle -= doublePi; //Если положительное
		}
		return angle;
	}
}