r360.polygon = function (traveltime, area, outerBoundary) { 
    return new r360.Polygon(traveltime, area, outerBoundary);
};

/*
 *
 */
r360.Polygon = function(traveltime, area, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);

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
        
        for ( var i = 0 ; i < that.outerBoundary.length ; i++)     
            that.outerProjectedBoundary.push(r360.Util.webMercatorToLeaflet(that.outerBoundary[i]));
    }

    /**
     * [project description]
     * @return {[type]} [description]
     */
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
        for ( var i = innerBoundary.length - 1 ; i >= 0 ; i--) {
            
            if ( innerBoundary[i].x > innerProjectedBoundary.projectedTopRight.x)   innerProjectedBoundary.projectedTopRight.x   = innerBoundary[i].x;
            if ( innerBoundary[i].y > innerProjectedBoundary.projectedTopRight.y)   innerProjectedBoundary.projectedTopRight.y   = innerBoundary[i].y;
            if ( innerBoundary[i].x < innerProjectedBoundary.projectedBottomLeft.x) innerProjectedBoundary.projectedBottomLeft.x = innerBoundary[i].x;
            if ( innerBoundary[i].y < innerProjectedBoundary.projectedBottomLeft.y) innerProjectedBoundary.projectedBottomLeft.y = innerBoundary[i].y;
        }

        innerProjectedBoundary.topRight   = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedTopRight.x, innerProjectedBoundary.projectedTopRight.y));
        innerProjectedBoundary.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedBottomLeft.x, innerProjectedBoundary.projectedBottomLeft.y));

        innerProjectedBoundary.projectedBottomLeft = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedBottomLeft);
        innerProjectedBoundary.projectedTopRight   = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedTopRight);

        innerProjectedBoundary.points = new Array();
        that.innerProjectedBoundaries.push(innerProjectedBoundary);
        
        for ( var j = 0; j < innerBoundary.length; j++)
            innerProjectedBoundary.points.push(r360.Util.webMercatorToLeaflet(innerBoundary[j]));

        innerProjectedBoundary.getProjectedBottomLeft = function() {
            return new L.Point(this.projectedBottomLeft.x, this.projectedBottomLeft.y);
        }

        innerProjectedBoundary.getProjectedTopRight = function(){
            return new L.Point(this.projectedTopRight.x, this.projectedTopRight.y);
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

        this.projectedBottomLeft  = new L.Point(20026377, 20048967);
        this.projectedTopRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box
        for ( var i = this.outerBoundary.length - 1 ; i >= 0 ; i--) {
            
            if ( this.outerBoundary[i].x > this.projectedTopRight.x)    this.projectedTopRight.x   = this.outerBoundary[i].x;
            if ( this.outerBoundary[i].y > this.projectedTopRight.y)    this.projectedTopRight.y   = this.outerBoundary[i].y;
            if ( this.outerBoundary[i].x < this.projectedBottomLeft.x)  this.projectedBottomLeft.x = this.outerBoundary[i].x;
            if ( this.outerBoundary[i].y < this.projectedBottomLeft.y)  this.projectedBottomLeft.y = this.outerBoundary[i].y;
        }

        this.topRight   = r360.Util.webMercatorToLatLng(new L.Point(this.projectedTopRight.x, this.projectedTopRight.y));
        this.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(this.projectedBottomLeft.x, this.projectedBottomLeft.y));

        this.projectedTopRight   = r360.Util.webMercatorToLeaflet(this.projectedTopRight);
        this.projectedBottomLeft = r360.Util.webMercatorToLeaflet(this.projectedBottomLeft);
    }
    
    that.setBoundingBox();

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

    /**
     * [setOpacity description]
     * @param {[type]} opacity [description]
     */
    that.setOpacity = function(opacity){
        that.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {[type]} [description]
     */
    that.getOpacity =function(){
        return that.opacity;
    }

    /**
     * [setArea description]
     * @param {[type]} area [description]
     */
    that.setArea = function(area){
        that.area = area;
    }

    /**
     * [getArea description]
     * @return {[type]} [description]
     */
    that.getArea = function(){
        return that.area;
    }
}