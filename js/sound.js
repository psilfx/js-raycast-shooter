var audioContext;
var soundsToLoad = 0;
var soundsLoaded = 0;

class Sound {
	sounds  = [];
	sources = [];
	playerPanner;
	ambientPanner;
	musicPanner;
	musicSources = [];
	musicGain    = [];
	constructor() {
		this.playerPanner  = this.CreatePanner();
		this.ambientPanner = this.CreatePanner();
		this.musicPanner   = this.CreatePanner();
		this.LoadSound( 0 , "sound/weapon/shot-pistol.mp3" );
		this.LoadSound( 1 , "sound/weapon/shot-shotgun.mp3" );
		this.LoadSound( 2 , "sound/weapon/shot-rifle.mp3" );
		this.LoadSound( 3 , "sound/weapon/shot-rocket.mp3" );
		this.LoadSound( 4 , "sound/player/step-1.mp3" );
		this.LoadSound( 5 , "sound/player/step-2.mp3" );
		this.LoadSound( 6 , "sound/weapon/reload-shotgun.mp3" );
		this.LoadSound( 7 , "sound/weapon/reload-pistol.mp3" );
		this.LoadSound( 8 , "sound/weapon/reload-rifle.mp3" );
		this.LoadSound( 9 , "sound/weapon/reload-launcher.mp3" );
		this.LoadSound( 10 , "sound/weapon/bullet-wall-pistol.mp3" );
		this.LoadSound( 11 , "sound/player/pickup-ammo.mp3" );
		this.LoadSound( 12 , "sound/weapon/shot-empty.mp3" );
		this.LoadSound( 13 , "sound/weapon/blast-rocket.mp3" );
		this.LoadSound( 14 , "sound/units/fatter-alert.mp3" );
		this.LoadSound( 15 , "sound/units/fatter-attack.mp3" );
		this.LoadSound( 16 , "sound/units/fatter-projectile.mp3" );
		this.LoadSound( 17 , "sound/objects/door-open.mp3" );
		this.LoadSound( 18 , "sound/objects/blood-splash.mp3" );
		this.LoadSound( 19 , "sound/units/fatter-gethit.mp3" );
		this.LoadSound( 20 , "sound/units/fatter-death.mp3" );
		this.LoadSound( 21 , "sound/player/pickup-health.mp3" );
		this.LoadSound( 22 , "sound/player/gethit.mp3" );
		this.LoadSound( 23 , "sound/player/death.mp3" );
		this.LoadSound( 24 , "sound/music/level-1.mp3" );
		this.LoadSound( 25 , "sound/objects/door-error.mp3" );
		this.LoadSound( 26 , "sound/units/zombie-alert.mp3" );
		this.LoadSound( 27 , "sound/units/zombie-death.mp3" );
		this.LoadSound( 28 , "sound/units/zombie-attack.mp3" );
		this.LoadSound( 29 , "sound/units/zombie-gethit.mp3" );
		this.LoadSound( 30 , "sound/units/zombie-projectile.mp3" );
	}
	CreatePanner() {
		// Создаем PannerNode для 3D-эффекта
		this.AudioContext();
		let panner;
		panner = audioContext.createPanner();
		panner.panningModel  = "HRTF"; // Алгоритм позиционирования (лучшее качество)
		panner.distanceModel = "exponential"; // Модель затухания с расстоянием
		panner.refDistance   = 1; // Расстояние, на котором громкость начинает падать
		panner.maxDistance   = 20; // Максимальное расстояние слышимости
		panner.rolloffFactor = 1; // Интенсивность затухания
		return panner;
	}
	AudioContext() {
		if( !audioContext ) audioContext = new ( window.AudioContext || window.webkitAudioContext )();
		this.musicGain[ 0 ] = audioContext.createGain();
	}
	// Загружаем звук
	async LoadSound( id , url ) {
		soundsToLoad++;
		this.AudioContext();
		this.LoadSoundData( id , url );
	}
	async LoadSoundData( id , url ) {
		//console.log( soundsToLoad );
		let response       = await fetch( url );
		let audioBuffer    = await response.arrayBuffer();
		this.sounds[ id ]  = await audioContext.decodeAudioData( audioBuffer , () => { soundsLoaded++; } );
	}
	LoadingError( id , url ) {
		
	}

	// Воспроизводим звук с позиционированием
	PlayPlayerSound( id , soundPosition = new Vector3F( 0 , 0 , 0 ) ) {
		let audioBuffer = this.sounds[ id ];
		let source         = audioContext.createBufferSource();
			source.buffer  = audioBuffer;
		// Устанавливаем позицию источника звука
		this.playerPanner.setPosition( soundPosition.x , soundPosition.y , soundPosition.z );
		// Подключаем цепочку: источник → panner → выход
		source.connect( this.playerPanner );
		this.playerPanner.connect( audioContext.destination );
		source.start();
	}
	// Воспроизводим звук с позиционированием
	PlayAmbientSound( id , soundPosition = new Vector3F( 0 , 0 , 0 ) ) {
		if( !soundPosition.x || !soundPosition.z ) return;
		let audioBuffer = this.sounds[ id ];
		let source         = audioContext.createBufferSource();
			source.buffer  = audioBuffer;
		// Устанавливаем позицию источника звука
		this.ambientPanner.setPosition( soundPosition.x , soundPosition.y , soundPosition.z );
		// Подключаем цепочку: источник → panner → выход
		source.connect( this.ambientPanner );
		this.ambientPanner.connect( audioContext.destination );
		source.start();
	}
	// Воспроизводим звук с позиционированием
	PlayMusicSound( soundId ) {
		let audioBuffer = this.sounds[ soundId ];
		if( this.musicSources[ 0 ] ) {
			this.musicSources[ 0 ].stop();
			this.musicSources[ 0 ].disconnect();
		}

		this.musicSources[ 0 ]         = audioContext.createBufferSource();
		this.musicSources[ 0 ].loop    = true;
		this.musicSources[ 0 ].buffer  = audioBuffer;
		this.musicSources[ 0 ].connect( this.musicGain[ 0 ] );

		this.musicGain[ 0 ].connect( audioContext.destination );
		this.musicGain[ 0 ].gain.value = 0.1; // setting it to 10%
		this.musicSources[ 0 ].start();
		this.musicGain[ 0 ].gain.exponentialRampToValueAtTime( 1.0 , audioContext.currentTime + 10 );
		
	}
}