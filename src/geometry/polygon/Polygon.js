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

    that.projectOuterBoundary = function(map){
        that.outerProjectedBoundary = new Array();
        for(var i = 0; i < that.outerBoundary.length; i++){     
            that.outerProjectedBoundary.push(r360.Util.webMercatorToLeaflet(that.outerBoundary[i]));
        }
    }

    that.projectInnerBoundaries = function(map){
        that.innerProjectedBoundaries = new Array();
        for(var i = 0; i < that.innerBoundaries.length; i++){
            var innerProjectedBoundary = new Array();
            that.innerProjectedBoundaries.push(innerProjectedBoundary);
            for(var j = 0; j < that.innerBoundaries[i].length; j++){
                innerProjectedBoundary.push(r360.Util.webMercatorToLeaflet(that.innerBoundaries[i][j]));
            }
        }
    }

    that.project = function(map){
        that.projectOuterBoundary(map);
        that.projectInnerBoundaries(map);
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

        var bottomLeft  = new L.Point(20026377, 20048967);
        var topRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box

        for(var i = this.outerBoundary.length - 1; i >= 0; i--){
            if(this.outerBoundary[i].x > topRight.x)      topRight.x      = this.outerBoundary[i].x;
            if(this.outerBoundary[i].x < bottomLeft.x)    bottomLeft.x    = this.outerBoundary[i].x;

            if(this.outerBoundary[i].y > topRight.y)      topRight.y      = this.outerBoundary[i].y;
            if(this.outerBoundary[i].y < bottomLeft.y)    bottomLeft.y    = this.outerBoundary[i].y;
        }


        that.topRight   = r360.Util.webMercatorToLatLng(topRight);
        that.bottomLeft = r360.Util.webMercatorToLatLng(bottomLeft);

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
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /**
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
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