r360.polygon = function (traveltime, area, outerBoundary) {
    return new r360.Polygon(traveltime, area, outerBoundary);
};

/*
 *
 */
r360.Polygon = function(traveltime, area, outerBoundary) {

    this.travelTime  = traveltime;
    this.area        = area;
    this.color       = 'black';
    this.opacity     = 0.5;
    this.lineStrings = [outerBoundary];
    this.bounds      = undefined;

    /**
     * [setTravelTime description]
     * @param {type} travelTime [description]
     */
    this.setTravelTime = function(travelTime){
        this.travelTime = travelTime;
    }

    /**
     * [getTravelTime description]
     * @return {type} [description]
     */
    this.getTravelTime = function(){
        return this.travelTime;
    }

        /**
     * [getColor description]
     * @return {type} [description]
     */
    this.getColor = function(){
        return this.color;
    }

    /**
     * [setColor description]
     * @param {type} color [description]
     */
    this.setColor = function(color){
        this.color = color;
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
    this.getOpacity =function(){
        return this.opacity;
    }

    /**
     * [getArea description]
     * @return {type} [description]
     */
    this.getArea = function(){
        return this.area;
    }

    /**
     * [setArea description]
     * @param {type} area [description]
     */
    this.setArea = function(area){
        this.area = area;
    }

    /**
     * [getOuterBoundary description]
     * @return {type} [description]
     */
    this.getOuterBoundary = function() {
        return this.lineStrings[0];
    }

    /**
     * [getInnerBoundary description]
     * @return {type} [description]
     */
    this.getInnerBoundary = function() {
        return this.lineStrings.slice(1);
    }

    /**
     * [getTopRight4326 description]
     * @return {type} [description]
     */
    this.getTopRight4326 = function(){
        return this.getOuterBoundary().getTopRight4326();
    }

    /**
     * [getTopRight3857 description]
     * @return {type} [description]
     */
    this.getTopRight3857 = function(){
        return this.getOuterBoundary().getTopRight3857();
    }

    /**
     * [getTopRightDecimal description]
     * @return {type} [description]
     */
    this.getTopRightDecimal = function(){
        return this.getOuterBoundary().getTopRightDecimal();
    }

    /**
     * [getBottomLeft4326 description]
     * @return {type} [description]
     */
    this.getBottomLeft4326 = function(){
        return this.getOuterBoundary().getBottomLeft4326();
    }

    /**
     * [getBottomLeft3857 description]
     * @return {type} [description]
     */
    this.getBottomLeft3857 = function(){
        return this.getOuterBoundary().getBottomLeft3857();
    }

    /**
     * [getBottomLeftDecimal description]
     * @return {type} [description]
     */
    this.getBottomLeftDecimal = function(){
        return this.getOuterBoundary().getBottomLeftDecimal();
    }

    /**
     * [addInnerBoundary description]
     * @param {type} innerBoundary [description]
     */
    this.addInnerBoundary = function(innerBoundary){
        this.lineStrings.push(innerBoundary);
    }
}