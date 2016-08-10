/*
 *
 */
r360.TravelOptions = function(){

    this.sources            = [];
    this.targets            = [];
    this.service;

    this.bikeSpeed          = undefined;
    this.bikeUphill         = undefined;
    this.bikeDownhill       = undefined;
    this.walkSpeed          = undefined;
    this.walkUphill         = undefined;
    this.walkDownhill       = undefined;

    this.supportWatts       = undefined;
    this.renderWatts        = undefined;

    this.travelTimes        = undefined;
    this.travelType         = undefined;
    this.elevationEnabled   = undefined;
    this.minPolygonHoleSize = undefined;

    this.time               = undefined;
    this.date               = undefined;
    this.recommendations    = undefined;
    this.errors             = [];

    this.intersectionMode   = undefined;
    this.pathSerializer     = r360.config.pathSerializer;
    this.polygonSerializer  = 'json';
    this.pointReduction     = true;
    this.maxRoutingTime     = undefined;
    this.serviceUrl         = undefined;
    this.serviceKey         = undefined;
    this.waitControl;

    this.isValidPolygonServiceOptions = function(isRouteRequest){

        // reset errors
        this.errors = [];

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getSources()) === '[object Array]' ) {

            if ( this.getSources().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                this.getSources().forEach(function(source){

                    if ( !r360.has(source, 'lat') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined latitude!');
                    if ( !r360.has(source, 'lon') && !r360.has(source, 'lng') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        // is the given travel type supported
        if ( !r360.contains(['bike', 'transit', 'walk', 'car', 'rentbike', 'rentandreturnbike', 'ebike'], this.getTravelType() ) )
            this.getErrors().push('Not supported travel type given: ' + this.getTravelType() );
        else {

            if ( this.getTravelType() == 'car' ) ; // nothing to do
            else if ( this.getTravelType() == 'bike' || this.getTravelType() == 'rentbike' || this.getTravelType() == 'rentandreturnbike') {

                if ( typeof this.getBikeUphill() != '' && typeof this.getBikeDownhill() != '' && typeof this.getBikeUphill() != 'undefined') {

                    // validate downhill/uphill penalties
                    if ( this.getBikeUphill() < 0 || this.getBikeDownhill() > 0 || this.getBikeUphill() < -(this.getBikeDownhill()) )
                        this.getErrors().push("Uphill cycle speed has to be larger then 0. Downhill cycle speed has to be smaller then 0. \
                            Absolute value of downhill cycle speed needs to be smaller then uphill cycle speed.");
                }

                // we need to have a positiv speed
                if ( this.getBikeSpeed() <= 0 ) this.getErrors().push("Bike speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'walk' ) {

                if ( typeof this.getBikeUphill() != '' && typeof this.getBikeDownhill() != '' && typeof this.getBikeUphill() != 'undefined') {

                    // validate downhill/uphill penalties
                    if ( this.getWalkUphill() < 0 || this.getWalkDownhill() > 0 || this.getWalkUphill() < -(this.getWalkDownhill()) )
                        this.getErrors().push("Uphill walking speed has to be larger then 0. Downhill walking speed has to be smaller then 0. \
                            Absolute value of downhill walking speed needs to be smaller then uphill walking speed.");
                }

                // we need to have a positiv speeds
                if ( this.getWalkSpeed() <= 0 ) this.getErrors().push("Walk speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'transit' ) {

                // so far no checks needed for transit, default values for date and time are generated on server side
            }
        }

        if ( !isRouteRequest ) {

            // travel times needs to be an array
            if ( typeof this.getTravelTimes() == 'undefined' || Object.prototype.toString.call(this.getTravelTimes()) !== '[object Array]' ) {
                this.getErrors().push('Travel times have to be an array!');
            }
            else {

                if ( r360.filter(this.getTravelTimes(), function(entry){ return typeof entry !== 'number'; }).length > 0 )
                    this.getErrors().push('Travel times contain non number entries: ' + this.getTravelTimes());
            }
        }

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidRouteServiceOptions = function(){

        this.isValidPolygonServiceOptions(true);

        // check if targets are of type array
        if ( Object.prototype.toString.call(this.getTargets()) === '[object Array]' ) {

            if ( this.getTargets().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                this.getTargets().forEach(function(target){

                    if ( !r360.has(target, 'lat') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined latitude!');
                    if ( !r360.has(target, 'lon') && !r360.has(target, 'lng') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Targets are not of type array!');

        // is the given path serializer supported
        if ( !r360.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidTimeServiceOptions = function(){

        this.isValidRouteServiceOptions();

        // is the given path serializer supported
        if ( !r360.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.getErrors = function(){

        return this.errors;
    }

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
    this.getWaitControl = function(){

        return this.waitControl;
    }


    /*
     *
     *
     *
     */
    this.getService = function(){

        return this.service;
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

        return this.maxRoutingTime;
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

        this.maxRoutingTime = maxRoutingTime;
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


    /*
     *
     *
     *
     */
    this.setService = function(service){

        this.service = service;
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

    /*
     *
     *
     *
     */
    this.setWaitControl = function(waitControl){

        this.waitControl = waitControl;
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
     * [setRenderingMode description]
     * @param {type} renderWatts [description]
     */
    this.setRenderWatts = function(renderWatts){
        this.renderWatts = renderWatts;
    }

    /**
     * [getRenderingMode description]
     * @return {type} [description]
     */
    this.getRenderWatts = function(){
       return this.renderWatts;
    }

    /**
     * [setSupportWatts description]
     * @param {type} supportWatts [description]
     */
    this.setSupportWatts = function(supportWatts){
        this.supportWatts = supportWatts;
    }

    /**
     * [getSupportWatts description]
     * @return {type} [description]
     */
    this.getSupportWatts = function(){
        return this.supportWatts;
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
};

r360.travelOptions = function () {
    return new r360.TravelOptions();
};