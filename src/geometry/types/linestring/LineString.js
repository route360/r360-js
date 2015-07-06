r360.LineString = function (coordinateArray) { 
    return new r360.Polygon(coordinateArray);
};


r360.LineString = function(coordinateArray) {

    var that = this;
    // default min/max values
    that.topRight_3857          = new r360.Point(-20026377, -20048967);
    that.bottomLeft_3857        = new r360.Point(+20026377, +20048967);

    // coordinates in leaflets own system
    that.coordinates = [];


    for(var i = coordinateArray.length -1 ; i >= 0; i--){
    	if ( coordinateArray[i].x > that.topRight_3857.x)   that.topRight_3857.x   = coordinateArray[i].x;
        if ( coordinateArray[i].y > that.topRight_3857.y)   that.topRight_3857.y   = coordinateArray[i].y;
        if ( coordinateArray[i].x < that.bottomLeft_3857.x) that.bottomLeft_3857.x = coordinateArray[i].x;
        if ( coordinateArray[i].y < that.bottomLeft_3857.y) that.bottomLeft_3857.y = coordinateArray[i].y;
    }

    for(var i = 0; i < coordinateArray.length; i++){
    	that.coordinates.push(r360.Util.webMercatorToLeaflet(coordinateArray[i]));
    }

    console.log("bottomLeft: " + that.bottomLeft_3857)
    console.log("topRight: " + that.topRight_3857)

    that.topRight_4326		= r360.Util.webMercatorToLatLng(new r360.Point(that.topRight_3857.x, that.topRight_3857.y));
    that.bottomLeft_4326	= r360.Util.webMercatorToLatLng(new r360.Point(that.bottomLeft_3857.x, that.bottomLeft_3857.y));


    console.log("that.topRight_4326: " + that.topRight_4326);
    console.log("that.topRight_4326: " + that.bottomLeft_4326);

    that.getBoundingBox = function(){
        return new r360.Bounds(this.bottomLeft_4326, this.topRight_4326);
    }

    that.getBottomLeft = function(){
        return new r360.Point(that.bottomLeft.x, that.bottomLeft.y);
    }

    that.getTopRight = function(){
        return new r360.Point(that.topRight_4326.x, that.topRight_4326.y);
    }

    that.getCoordinates = function(){
    	return that.coordinates;
    }

    that.getCoordinate = function(index){
    	return that.coordinate[index];
    }

}