/*
 *
 */
r360.Polygon = function(traveltime, area, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);
    that.centerPoint      = new L.latLng(0,0);

    that.travelTime       = traveltime;
    that.area             = area;
    that.color;
    that.outerBoundary    = outerBoundary;
    that.innerBoundaries  = new Array();

    that.innerProjectedBoundaries = new Array();

    /**
     *
     */
    that.setOuterBoundary = function(outerBoundary){
        that.outerBoundary = outerBoundary;
    }

    that.projectOuterBoundary = function(){
        that.outerProjectedBoundary = new Array();
        for(var i = 0; i < that.outerBoundary.length; i++){     
            that.outerProjectedBoundary.push(r360.Util.webMercatorToLeaflet(that.outerBoundary[i]));
        }
    }

 

    that.project = function(){
        that.projectOuterBoundary();
    }

    /**
     *
     */  
    that.addInnerBoundary = function(innerBoundary){
        var innerProjectedBoundary = {};

        innerProjectedBoundary.projectedBottomLeft  = new L.Point(20026377, 20048967);
        innerProjectedBoundary.projectedTopRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box

        for(var i = innerBoundary.length - 1; i >= 0; i--){
            if(innerBoundary[i].x > innerProjectedBoundary.projectedTopRight.x)      innerProjectedBoundary.projectedTopRight.x      = innerBoundary[i].x;
            if(innerBoundary[i].x < innerProjectedBoundary.projectedBottomLeft.x)    innerProjectedBoundary.projectedBottomLeft.x    = innerBoundary[i].x;

            if(innerBoundary[i].y > innerProjectedBoundary.projectedTopRight.y)      innerProjectedBoundary.projectedTopRight.y      = innerBoundary[i].y;
            if(innerBoundary[i].y < innerProjectedBoundary.projectedBottomLeft.y)    innerProjectedBoundary.projectedBottomLeft.y    = innerBoundary[i].y;
        }


        innerProjectedBoundary.topRight   = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedTopRight.x, innerProjectedBoundary.projectedTopRight.y));
        innerProjectedBoundary.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedBottomLeft.x, innerProjectedBoundary.projectedBottomLeft.y));

        innerProjectedBoundary.projectedBottomLeft = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedBottomLeft);
        innerProjectedBoundary.projectedTopRight   = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedTopRight);

        innerProjectedBoundary.points = new Array();
        that.innerProjectedBoundaries.push(innerProjectedBoundary);
        for(var j = 0; j < innerBoundary.length; j++){
            innerProjectedBoundary.points.push(r360.Util.webMercatorToLeaflet(innerBoundary[j]));
        }

        innerProjectedBoundary.getProjectedBottomLeft = function(){
            var that = this;
            return new L.Point(that.projectedBottomLeft.x, that.projectedBottomLeft.y);
        }

        innerProjectedBoundary.getProjectedTopRight = function(){
            var that = this;
            return new L.Point(that.projectedTopRight.x, that.projectedTopRight.y);
        }

    }

    /**
     * @return {LatLngBounds} the leaflet bounding box
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getBoundingBox = function(){
        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    }

    that.getProjectedBottomLeft = function(){
        return new L.Point(that.projectedBottomLeft.x, that.projectedBottomLeft.y);
    }

    that.getProjectedTopRight = function(){
        return new L.Point(that.projectedTopRight.x, that.projectedTopRight.y);
    }

    /**
     *
     */
    that.setBoundingBox = function() { 

        var that = this;

        that.projectedBottomLeft  = new L.Point(20026377, 20048967);
        that.projectedTopRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box

        for(var i = this.outerBoundary.length - 1; i >= 0; i--){
            if(this.outerBoundary[i].x > that.projectedTopRight.x)      
                that.projectedTopRight.x      = this.outerBoundary[i].x;
            if(this.outerBoundary[i].x < that.projectedBottomLeft.x)    
                that.projectedBottomLeft.x    = this.outerBoundary[i].x;

            if(this.outerBoundary[i].y > that.projectedTopRight.y)      
                that.projectedTopRight.y      = this.outerBoundary[i].y;
            if(this.outerBoundary[i].y < that.projectedBottomLeft.y)    
                that.projectedBottomLeft.y    = this.outerBoundary[i].y;
        }




        that.topRight   = r360.Util.webMercatorToLatLng(new L.Point(that.projectedTopRight.x, that.projectedTopRight.y));
        that.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(that.projectedBottomLeft.x, that.projectedBottomLeft.y));

        that.projectedBottomLeft = r360.Util.webMercatorToLeaflet(that.projectedBottomLeft);
        that.projectedTopRight   = r360.Util.webMercatorToLeaflet(that.projectedTopRight);

        // precompute the polygons center
        that.centerPoint.lat = that.topRight.lat - that.bottomLeft.lat;
        that.centerPoint.lon = that.topRight.lon - that.bottomLeft.lon;
    }

    /**
     * Returns the center for this polygon. More precisly a coordinate
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

    that.setOpacity = function(opacity){
        that.opacity = opacity;
    }

    that.getOpacity =function(){
        return that.opacity;
    }

    that.setArea = function(area){
        that.area = area;
    }

    that.getArea = function(){
        return that.area;
    }
}

r360.polygon = function (traveltime, area, outerBoundary) { 
    return new r360.Polygon(traveltime, area, outerBoundary);
};