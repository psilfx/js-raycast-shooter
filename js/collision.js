class CollisionBox {
	x      = 0;
	y      = 0;
	width  = 0;
	height = 0;
	constructor( x , y , width , height ) {
		this.x      = x;
		this.y      = y;
		this.width  = width;
		this.height = height;
	}
}
class Collision {
	//Axis-Aligned Bounding Box
	AABB( box1 , box2 ) {
		return ( box1.x <= box2.x + box2.width && box2.x <= box1.x + box1.width && box1.y <= box2.y + box2.height && box2.y <= box1.y + box1.height );
	}
	AABBPoint( box , point ) {
		return ( point.x >= box.x && point.y >= box.y && point.x <= box.x + box.width && point.y <= box.y + box.height );
	}
}