r360.lineString = function (coordinateArray) {
    return new r360.LineString(coordinateArray);
};

r360.LineString = function(coordinateArray) {

    // default min/max values
    this.topRight_3857          = new r360.Point(-20026377, -20048967);
    this.bottomLeft_3857        = new r360.Point(+20026377, +20048967);

    // coordinates in leaflets own system
    this.coordinates = [];

    for ( var i = coordinateArray.length -1 ; i >= 0 ; i--) {
    	if ( coordinateArray[i].x > this.topRight_3857.x)   this.topRight_3857.x   = coordinateArray[i].x;
        if ( coordinateArray[i].y > this.topRight_3857.y)   this.topRight_3857.y   = coordinateArray[i].y;
        if ( coordinateArray[i].x < this.bottomLeft_3857.x) this.bottomLeft_3857.x = coordinateArray[i].x;
        if ( coordinateArray[i].y < this.bottomLeft_3857.y) this.bottomLeft_3857.y = coordinateArray[i].y;
    }

    // TODO refactore, this can be done in a single iteration of the array
    for ( var i = 0; i < coordinateArray.length; i++ ) {
    	this.coordinates.push(r360.Util.webMercatorToLeaflet(coordinateArray[i]));
    }

    /**
     * [getTopRight4326 description]
     * @return {type} [description]
     */
    this.getTopRight4326 = function(){
        return r360.Util.webMercatorToLatLng(new r360.Point(this.topRight_3857.x, this.topRight_3857.y));
    }

    /**
     * [getTopRight3857 description]
     * @return {type} [description]
     */
    this.getTopRight3857 = function(){
        return this.topRight_3857;
    }

    /**
     * [getTopRightDecimal description]
     * @return {type} [description]
     */
    this.getTopRightDecimal = function(){
        return r360.Util.webMercatorToLeaflet(this.topRight_3857);
    }

    /**
     * [getBottomLeft4326 description]
     * @return {type} [description]
     */
    this.getBottomLeft4326 = function(){
        return r360.Util.webMercatorToLatLng(new r360.Point(this.bottomLeft_3857.x, this.bottomLeft_3857.y));
    }

    /**
     * [getBottomLeft3857 description]
     * @return {type} [description]
     */
    this.getBottomLeft3857 = function(){
        return this.bottomLeft_3857;
    }

    /**
     * [getBottomLeftDecimal description]
     * @return {type} [description]
     */
    this.getBottomLeftDecimal = function(){
        return r360.Util.webMercatorToLeaflet(this.bottomLeft_3857);
    }

    /**
     * [getCoordinates description]
     * @return {type} [description]
     */
    this.getCoordinates = function(){
    	return this.coordinates;
    }

    /**
     * [getCoordinate description]
     * @param  {type} index [description]
     * @return {type}       [description]
     */
    this.getCoordinate = function(index){
    	return this.coordinates[index];
    }
}