/*
 *
 */
r360.TravelOptions = function(){

    this.sources            = [];
    this.targets            = [];

    this.bikeSpeed          = undefined;
    this.bikeUphill         = undefined;
    this.bikeDownhill       = undefined;
    this.walkSpeed          = undefined;
    this.walkUphill         = undefined;
    this.walkDownhill       = undefined;

    this.travelTimes        = undefined;
    this.travelType         = undefined;
    this.elevationEnabled   = undefined;
    this.rushHour           = undefined;

    this.minPolygonHoleSize = undefined;
    this.buffer             = undefined;
    this.simplify           = undefined;
    this.srid               = undefined;
    this.quadrantSegments   = undefined;

    this.time               = undefined;
    this.date               = undefined;
    this.frameDuration      = undefined;
    this.reverse            = undefined;
    this.recommendations    = undefined;

    this.intersectionMode   = undefined;
    this.pathSerializer     = 'compact';
    this.polygonSerializer  = 'json';
    this.pointReduction     = true;
    this.maxRoutingTime     = undefined;     // Deprecated
    this.maxRoutingLength   = undefined;     // Deprecated
    this.maxEdgeWeight		= undefined;
    this.edgeWeight			= 'time';
    this.serviceUrl         = undefined;
    this.serviceKey         = undefined;

    this.travelTimeFactors  = undefined;
    this.maxTransfers       = undefined;

    this.getReverse = function(){ return this.reverse; }
    this.setReverse = function(reverse){ this.reverse = reverse; }

    this.getFrameDuration = function(){ return this.frameDuration; }
    this.setFrameDuration = function(frameDuration){ this.frameDuration = frameDuration; }


    this.getBuffer = function(){ return this.buffer; }

    /**
    * @description Set the buffer to apply to the polygons. Buffer is in units as defined by the srid. For WGS84 (lat/long, srid: 4326) the unit is degrees. The length of a degree varies depending on location, and specifically for longitute, which converges at the poles. You may want to [calculate](http://msi.nga.mil/MSISiteContent/StaticFiles/Calculators/degree.html) the buffer in degrees based on location, if using WGS84.
    * For
    *
    * @param {long} buffer - The polygon's buffer width (in srid units).
    */
    this.setBuffer = function(buffer){ this.buffer = buffer; }

    this.getSimplifyMeter = function(){ return this.simplify; }
    this.setSimplifyMeter = function(simplify){ this.simplify = simplify; }

    this.getSrid = function(){ return this.srid; }
    this.setSrid = function(srid){ this.srid = srid; }

    this.getQuadrantSegments = function(){ return this.quadrantSegments; }
    this.setQuadrantSegments = function(quadrantSegments){ this.quadrantSegments = quadrantSegments; }

    /*
     *
     *
     *
     */
    this.getSources = function(){

        return this.sources;
    }

    /*
     *
     *
     *
     */
    this.addSource = function(source){

        this.sources.push(source);
    }



    /*
     *
     *
     *
     */
    this.addTarget = function(target){

        this.targets.push(target);
    }

    /*
     *
     *
     *
     */
    this.getTargets = function(){

        return this.targets;
    }

    /*
     *
     *
     *
     */
    this.getBikeSpeed = function(){

        return this.bikeSpeed;
    }

    /*
     *
     *
     *
     */
    this.getBikeUphill = function(){

        return this.bikeUphill;
    }

    /*
     *
     *
     *
     */
    this.getBikeDownhill = function(){

        return this.bikeDownhill;
    }

    /*
     *
     *
     *
     */
    this.getWalkSpeed = function(){

        return this.walkSpeed;
    }

    /*
     *
     *
     *
     */
    this.getWalkUphill = function(){

        return this.walkUphill;
    }

    /*
     *
     *
     *
     */
    this.getWalkDownhill = function(){

        return this.walkDownhill;
    }

    /*
     *
     *
     *
     */
    this.getTravelTimes = function(){

        return this.travelTimes;
    }

    /*
     *
     *
     *
     */
    this.getTravelType = function(){

        return this.travelType;
    }

    /*
     *
     *
     *
     */
    this.getTime = function(){

        return this.time;
    }

    /*
     *
     *
     *
     */
    this.getDate = function(){

        return this.date;
    }


    /*
     *
     *
     *
     */
    this.getPathSerializer = function(){

        return this.pathSerializer;
    }

    /**
     * [getPolygonSerializer description]
     * @return {type} [description]
     */
    this.getPolygonSerializer = function(){

        return this.polygonSerializer;
    }

    /*
     *
     *
     *
     */
    this.getMaxRoutingTime = function(){

        console.warn("getMaxRoutingTime is deprecated. use getMaxEdgeWeight instead")
        return this.maxRoutingTime;
    }

    /*
     *
     *
     *
     */
    this.getMaxRoutingLength = function(){
        console.warn("getMaxRoutingLength is deprecated. use getMaxEdgeWeight instead")
        return this.maxRoutingLength;
    }

    this.getMaxEdgeWeight = function(){
        return this.maxEdgeWeight;
    }

    /*
     *
     *
     *
     */
    this.getIntersectionMode = function(){

        return this.intersectionMode;
    }

    /*
     *
     *
     *
     */
    this.getRecommendations = function(){

        return this.recommendations;
    }

    /*
     *
     *
     *
     */
    this.getServiceUrl = function(){

        return this.serviceUrl;
    }

    /*
     *
     *
     *
     */
    this.getServiceKey = function(){

        return this.serviceKey;
    }

    /*
     *
     *
     *
     */
    this.setServiceKey = function(serviceKey){

        this.serviceKey = serviceKey;
    }

    /*
     *
     *
     *
     */
    this.setServiceUrl = function(serviceUrl){

        this.serviceUrl = serviceUrl;
    }

    /*
     *
     *
     *
     */
    this.setRecommendations = function(recommendations){

        this.recommendations = recommendations;
    }

    /*
     *
     *
     *
     */
    this.setIntersectionMode = function(intersectionMode){

        this.intersectionMode = intersectionMode;
    }

    /*
     *
     *
     *
     */
    this.setMaxRoutingTime = function(maxRoutingTime){

        console.warn("setMaxRoutingTime is deprecated. use setMaxEdgeWeight instead")
        this.maxRoutingTime = maxRoutingTime;
    }

    /*
     *
     *
     *
     */
    this.setMaxRoutingLength = function(maxRoutingLength){
        console.warn("setMaxRoutingLength is deprecated. use setMaxEdgeWeight instead")
        this.maxRoutingLength = maxRoutingLength;
    }


    this.setMaxEdgeWeight = function(maxEdgeWeight){
        this.maxEdgeWeight = maxEdgeWeight;
    }

    /*
     *
     *
     *
     */
    this.setPathSerializer = function(pathSerializer){

        this.pathSerializer = pathSerializer;
    }

    this.setPolygonSerializer = function(polygonSerializer){

        this.polygonSerializer = polygonSerializer;
    }


    /**
    * [setMinPolygonHoleSize description]
    * @param {type} minPolygonHoleSize [description]
    */
    this.setMinPolygonHoleSize = function(minPolygonHoleSize){

        this.minPolygonHoleSize = minPolygonHoleSize;
    }

    /**
     * [getMinPolygonHoleSize description]
     * @return {type} [description]
     */
    this.getMinPolygonHoleSize = function(){

        return this.minPolygonHoleSize;
    }

    /*
     *
     *
     *
     */
    this.setSources = function(sources){

        this.sources = sources;
    }

    /*
     *
     *
     *
     */
    this.setTargets = function(targets){

        this.targets = targets;
    }

    /*
     *
     *
     *
     */
    this.setBikeSpeed = function(bikeSpeed){

        this.bikeSpeed = bikeSpeed;
    }

    /*
     *
     *
     *
     */
    this.setBikeUphill = function(bikeUphill){

        this.bikeUphill = bikeUphill;
    }

    /*
     *
     *
     *
     */
    this.setBikeDownhill = function(bikeDownhill){

        this.bikeDownhill = bikeDownhill;
    }

    /*
     *
     *
     *
     */
    this.setWalkSpeed = function(walkSpeed){

        this.walkSpeed = walkSpeed;
    }

    /*
     *
     *
     *
     */
    this.setWalkUphill = function(walkUphill){

        this.walkUphill = walkUphill;
    }

    /*
     *
     *
     *
     */
    this.setWalkDownhill = function(walkDownhill){

        this.walkDownhill = walkDownhill;
    }

    /*
     *
     *
     *
     */
    this.setTravelTimes = function(travelTimes){

        this.travelTimes = travelTimes;
    }

    /*
     *
     *
     *
     */
    this.setTravelType = function(travelType){

        this.travelType = travelType;
    }

    /*
     *
     *
     *
     */
    this.setTime = function(time){

        this.time = time;
    }

    /*
     *
     *
     *
     */
    this.setDate = function(date){

        this.date = date;
    }

    /**
     * [isElevationEnabled if true the service will return elevation data, if the backend is
     * configured with elevation data, if the backend is not configured with elevation data
     * the z value of all points in routes is 0]
     *
     * @return {boolean} [returns true if elevation enabled]
     */
    this.isElevationEnabled = function() {

        return this.elevationEnabled;
    }

    /**
     * [setElevationEnabled if set to true the service will return elevation data, if the backend is
     * configured with elevation data, if the backend is not configured with elevation data
     * the z value of all points in routes is 0]
     * @param {type} elevationEnabled [set the backend to consider elevation data for polygonizing and routing]
     */
    this.setElevationEnabled = function(elevationEnabled){

        this.elevationEnabled = elevationEnabled;
    }

    /**
     * [isRushHour if true the service will return congested speed data, if the backend is
     * configured with rush hour data
     *
     * @return {boolean} [returns true if rush hour is enabled]
     */
    this.isRushHour = function() {

        return this.rushHour;
    }

    this.setRushHour = function(rushHour){

        this.rushHour = rushHour;
}

    /**
     * @deprecated since v0.3.2. use isRushHour instead
     *
     * @return {boolean} [returns true if rush hour is enabled]
     */
    this.isCongestionEnabled = function() {
        console.warn("Calling deprecated function \"isCongestionEnabled()\". Use \"isRushHour()\" instead.");
        return this.rushHour;
    }

    /**
     * @deprecated since v0.3.2. Use setRushHour instead
     */
    this.setCongestionEnabled = function(rushHour){
        console.warn("Calling deprecated function \"setCongestionEnabled()\". Use \"setRushHour()\" instead.")
        this.rushHour = rushHour;
    }

    this.disablePointReduction = function(){
        this.pointReduction = false;
    }

    this.enablePointReduction = function(){
        this.pointReduction = true;
    }

    this.isPointReductionEnabled = function(){
        return this.pointReduction;
    }

    this.getEdgeWeight = function(){
    	return this.edgeWeight;
    }

    this.setEdgeWeight = function(edgeWeight){
    	this.edgeWeight = edgeWeight;
    }

    this.getTravelTimeFactors = function(){
    	return this.travelTimeFactors;
    }

    this.setTravelTimeFactors = function(travelTimeFactors){
    	this.travelTimeFactors = travelTimeFactors;
    }

    this.getMaxTransfers = function(){
        return this.maxTransfers;
    }

    this.setMaxTransfers = function(maxTransfers){
        this.maxTransfers = maxTransfers;
    }
};

r360.travelOptions = function () {
    return new r360.TravelOptions();
};
