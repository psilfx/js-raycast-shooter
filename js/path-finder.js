class Path {
	x        = 0;
	y        = 0;
	key      = 0;
	node     = false;
	distance = [];
	nodes    = [];
	ghost    = [];  //Дистанция без учета препятствий
	constructor( x , y , key ) {
		this.x    = x;
		this.y    = y;
		this.key  = key;
	}
	GetClosestNodeKey() {
		let dist    = Number.POSITIVE_INFINITY;
		let closest = 0;
		this.nodes.forEach( ( distance , key ) => {
			if( distance < dist ) {
				dist    = distance;
				closest = key;
			}
		});
		return closest;
	}
}
class PathFinder {
	level;
	paths = [];
	walls = [];
	nodes = []; //Ключи нод
	constructor( level ) {
		this.level = level;
		this.Process();
	}
	Process() {
		for( let y = 0; y <= this.level.size.y; y++ ) {
			for( let x = 0; x <= this.level.size.x; x++ ) {
				let key = this.level.GetMapKey( x , y );
				if( this.level.CheckByKey( key ) ) {
					this.walls[ key ] = 1;
					let nodes = this.CheckNode( x , y );
					nodes.forEach( ( item , index ) => {
						if( item >= 0 ) {
							this.nodes.push( item );
						} 
					});
					continue;
				}; //Обрабатываем только пустые клетки
				//Двери
				if( this.level.doors[ key ] ) this.nodes.push( key );
				this.paths[ key ] = new Path( x , y , key );
			}
		}
		this.paths.forEach( ( path , pathIndex ) => {
			let start = new Vector3F( path.x , 0 , path.y );
			this.nodes.forEach( ( nodeKey , nodeIndex ) => {
				let npath    = this.paths[ nodeKey ];
				if( npath ) {
					npath.node   = true;
					let end      = new Vector3F( npath.x , 0 , npath.y );
					let distance = caster.CastCell( start.Plus( new Vector3F( 0.5 , 0 , 0.5 ) ) , end.Plus( new Vector3F( 0.5 , 0 , 0.5 ) ) );
					if( distance ) path.nodes.push( { nodeId : nodeIndex , key : nodeKey , distance : distance } );
				}
			});
			this.paths.forEach( ( distpath , distpathIndex ) => {
				let end      = new Vector3F( distpath.x , 0 , distpath.y );
				if( distpath.key == path.key ) return;
				let distance = caster.CastCell( start.Plus( new Vector3F( 0.5 , 0 , 0.5 ) ) , end.Plus( new Vector3F( 0.5 , 0 , 0.5 ) ) );
				if( distance ) path.distance[ distpath.key ] = distance;
				path.ghost[ distpath.key ] = start.Distance( end );
			});
		});
	}
	CheckNode( x , y ) {
		let nodes = [];
		
		let leftUpCorner      = [ this.level.CheckCellByXY( x - 1 , y ) , this.level.CheckCellByXY( x - 1 , y - 1 ) , this.level.CheckCellByXY( x , y - 1 ) ];
		let rightUpCorner     = [ this.level.CheckCellByXY( x + 1 , y ) , this.level.CheckCellByXY( x + 1 , y - 1 ) , this.level.CheckCellByXY( x , y - 1 ) ];
		let rightBottomCorner = [ this.level.CheckCellByXY( x + 1 , y ) , this.level.CheckCellByXY( x + 1 , y + 1 ) , this.level.CheckCellByXY( x , y + 1 ) ];
		let leftBottomCorner  = [ this.level.CheckCellByXY( x - 1 , y ) , this.level.CheckCellByXY( x - 1 , y + 1 ) , this.level.CheckCellByXY( x , y + 1 ) ];

		if( !leftUpCorner[ 0 ]      && !leftUpCorner[ 1 ]      && !leftUpCorner[ 2 ]      ) nodes.push( this.level.GetMapKey( x - 1 , y - 1 ) );
		if( !rightUpCorner[ 0 ]     && !rightUpCorner[ 1 ]     && !rightUpCorner[ 2 ]     ) nodes.push( this.level.GetMapKey( x + 1 , y - 1 ) );
		if( !rightBottomCorner[ 0 ] && !rightBottomCorner[ 1 ] && !rightBottomCorner[ 2 ] ) nodes.push( this.level.GetMapKey( x + 1 , y + 1 ) );
		if( !leftBottomCorner[ 0 ]  && !leftBottomCorner[ 1 ]  && !leftBottomCorner[ 2 ]  ) nodes.push( this.level.GetMapKey( x - 1 , y + 1 ) );
		
		return nodes;
	}
	Find( from , to ) {
		let cells = [];
		let start = this.paths[ from ];
		let end   = this.paths[ to ];
		let distance = start.distance[ to ];
		if( distance > 0 ) return [ new Vector3F( start.x , 0 , start.y ) , new Vector3F( end.x , 0 , end.y ) ]; //Если можно обойтись без обходного пути
		//let closestNode = this.GetClosest( start.nodes , start );
		let { wayNodes , ways } = this.FindNode( start , end , 0 );
		// let wayDist = Number.POSITIVE_INFINITY;
		// let minWay;
		// for( let w = 0; w < ways.length; w++ ) {
			// let way = ways[ w ];
			// if( way.distance < wayDist ) {
				// wayDist = way.distance;
				// minWay  = way;
			// }
		// }
		//Восстанавливаем массив
		let nodes = [];
		( ways.length > 0 ) ? nodes = this.GetNodesArrayFromWay( ways[ 0 ] ) : nodes.push( start );
		return this.AlignNodes( nodes );
	}
	//Удаляет не нужные промежуточные ноды (костыль)
	AlignNodes( nodes ) {
		let startArr = [];
		let endArr   = [];
		let stop     = false;
		//Сравнивает ноды от первой к последней, если можно добраться до последней, то удаляем то, что между
		for( let n = 0; n < nodes.length; n++ ) {
			let start = nodes[ n ];
			startArr.push( new Vector3F( start.x , 0 , start.y ) );
			for( let en = nodes.length - 1; en >= n; en-- ) {
				let end = nodes[ en ];
				endArr.push( new Vector3F( end.x , 0 , end.y ) );
				if( start.distance[ end.key ] ) {
					stop = true;
					break;
				}
			}
			if( stop ) break;
		}
		endArr = endArr.reverse();
		return startArr.concat( endArr );
	}
	GetNodesArrayFromWay( minWay ) {
		let nodes = [];
		while( minWay.parent ) {
			nodes.push( minWay.node ); //new Vector3F( minWay.node.x , 0 , minWay.node.y )
			minWay = minWay.parent;
		}
		nodes.push( minWay.node );
		return nodes.reverse();
	}
	InVision( from , to ) {
		let start = this.paths[ from ];
		if( !start ) return 0;
		return ( start.distance[ to ] > 0 );
	}
	GetClosest( nodes , target ) {
		let distance = Number.POSITIVE_INFINITY;
		let closest;
		for( let n in nodes ) {
			let nodeData = nodes[ n ];
			let node     = this.paths[ nodeData.key ];
			if( distance > node.ghost[ target.key ] ) {
				closest  = node;
				distance = node.ghost[ target.key ];
			}
		}
		return closest;
	}
	//WayNodes - все ноды путей, ways - найденные пути, nodeClosed - обработанные пути
	FindNode( start , end , parentNode , wayNodes = [] , ways = [] , nodeClosed = {} , distance = 0 ) {
		if( ways.length > 0 ) return;
		let closed = {};
		for( let n in nodeClosed ) {
			closed[ n ] = 1;
		}
		
		let wayPath = { node : start , parent : parentNode , distance : distance };
		wayNodes.push( wayPath );
		if( start.distance[ end.key ] > 0 ) { //Путь найден
			ways.push( { node : end , parent : wayPath , distance : wayPath.distance + start.distance[ end.key ] } );
			return;
		}
		for( let n in start.nodes ) {
			let nodeData = start.nodes[ n ];
			if( ways.length > 0 ) break;
			if( closed[ nodeData.key ] ) continue; 
				let distance = nodeData.distance;
				let node     = this.paths[ nodeData.key ];
				distance    += distance;
				closed[ nodeData.key ] = 1;
			this.FindNode( node , end , wayPath , wayNodes , ways , closed , distance );
		}
		return { wayNodes , ways };
	}
}