/*
 *
 */
r360.MultiPolygon = function() {

    this.travelTime;
    this.color;
    this.polygons      = new Array();

    // default min/max values
    this.topRight_3857          = new r360.Point(-20026377, -20048967);
    this.bottomLeft_3857        = new r360.Point(+20026377, +20048967);

    /**
     * [addPolygon description]
     * @param {type} polygon [description]
     */
    this.addPolygon = function(polygon){
        this.polygons.push(polygon);

        if ( polygon.getOuterBoundary().getTopRight3857().x > this.topRight_3857.x)     this.topRight_3857.x   = polygon.getOuterBoundary().getTopRight3857().x;
        if ( polygon.getOuterBoundary().getTopRight3857().y > this.topRight_3857.y)     this.topRight_3857.y   = polygon.getOuterBoundary().getTopRight3857().y;
        if ( polygon.getOuterBoundary().getBottomLeft3857().x < this.bottomLeft_3857.x) this.bottomLeft_3857.x = polygon.getOuterBoundary().getBottomLeft3857().x;
        if ( polygon.getOuterBoundary().getBottomLeft3857().y < this.bottomLeft_3857.y) this.bottomLeft_3857.y = polygon.getOuterBoundary().getBottomLeft3857().y;
    }

    /**
     * [getBoundingBox3857 description]
     * @return {type} [description]
     */
    this.getBoundingBox3857 = function() {

        return r360.bounds(this.bottomLeft_3857, this.topRight_3857);
    }

    /**
     * [getBoundingBox4326 description]
     * @return {type} [description]
     */
    this.getBoundingBox4326 = function() {

        return r360.latLngBounds(r360.Util.webMercatorToLatLng(this.bottomLeft_3857), r360.Util.webMercatorToLatLng(this.topRight_3857));
    }

    /**
     * [setOpacity description]
     * @param {type} opacity [description]
     */
    this.setOpacity = function(opacity){
        this.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {type} [description]
     */
    this.getOpacity = function(){
        return this.opacity;
    }

    /**
     * [getArea description]
     * @return {type} [description]
     */
    this.getArea = function(){

        var area = 0;
        this.polygons.forEach(function(polygon){ area += polygon.getArea(); });
        return area;
    }

    /**
     * [getPolygons description]
     * @return {type} [description]
     */
    this.getPolygons = function(){
        return this.polygons;
    }

    /**
     * [setColor description]
     * @param {type} color [description]
     */
    this.setColor = function(color){
        this.color = color;
    }

    /**
     * [getColor description]
     * @return {type} [description]
     */
    this.getColor = function(){
        return this.color;
    }

    /**
     * [getTravelTime description]
     * @return {type} [description]
     */
    this.getTravelTime = function(){
        return this.travelTime;
    }

    /**
     * [setTravelTime description]
     * @param {type} travelTime [description]
     */
    this.setTravelTime = function(travelTime){
        this.travelTime = travelTime;
    }
};

r360.multiPolygon = function () {
    return new r360.MultiPolygon();
};