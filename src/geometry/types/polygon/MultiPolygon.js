/*
 *
 */
r360.MultiPolygon = function() {
    
    this.travelTime;
    this.color;
    this.polygons    = new Array();

    /*
     *
     */
    this.addPolygon = function(polygon){
        this.polygons.push(polygon);
    }

    /**
     * [setOpacity description]
     * @param {[type]} opacity [description]
     */
    this.setOpacity = function(opacity){
        this.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {[type]} [description]
     */
    this.getOpacity = function(){
        return this.opacity;
    }

    /*
     *
     */
    this.setColor = function(color){
        this.color = color;
    }

    /*
     *
     */
    this.getColor = function(){
        return this.color;
    }

    /*
     *
     */
    this.getTravelTime = function(){
        return this.travelTime;
    }

    /*
     *
     */
    this.setTravelTime = function(travelTime){
        this.travelTime = travelTime;
    }
};

r360.multiPolygon = function () { 
    return new r360.MultiPolygon();
};