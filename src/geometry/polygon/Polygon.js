/*
 *
 */
r360.Polygon = function(traveltime, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);
    that.centerPoint      = new L.latLng(0,0);

    that.travelTime       = traveltime;
    that.color;
    that.outerBoundary    = outerBoundary;
    that.innerBoundaries  = new Array();

    /**
     *
     */
    that.setOuterBoundary = function(outerBoundary){
        that.outerBoundary = outerBoundary;
    }

    /**
     *
     */  
    that.addInnerBoundary = function(innerBoundary){
        that.innerBoundaries.push(innerBoundary);
    }

    /**
     * @return {LatLngBounds} the leaflet bounding box
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getBoundingBox = function(){

        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    }

    /**
     *
     */
    that.setBoundingBox = function() { 

        // calculate the bounding box
        _.each(this.outerBoundary, function(coordinate){

            if ( coordinate.lat > that.topRight.lat )   that.topRight.lat   = coordinate.lat;
            if ( coordinate.lat < that.bottomLeft.lat ) that.bottomLeft.lat = coordinate.lat;
            if ( coordinate.lng > that.topRight.lng )   that.topRight.lng   = coordinate.lng;
            if ( coordinate.lng < that.bottomLeft.lng ) that.bottomLeft.lng = coordinate.lng;
        });

        // precompute the polygons center
        that.centerPoint.lat = that.topRight.lat - that.bottomLeft.lat;
        that.centerPoint.lon = that.topRight.lon - that.bottomLeft.lon;
    }

    /**
     * Returns the center for this polygon. More precisly a gps coordinate
     * which is equal to the center of the polygons bounding box.
     * @return {latlng} gps coordinate of the center of the polygon
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getCenterPoint = function(){
        return that.centerPoint;
    },

    /**
     *
     */
    that.getColor = function(){
        return that.color;
    }

    /**
     *
     */
    that.setColor = function(color){
        that.color = color;
    }
}

r360.polygon = function (traveltime, outerBoundary) { 
    return new r360.Polygon(traveltime, outerBoundary);
};