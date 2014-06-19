/*
 *
 */
r360.TravelOptions = function(){

    var sources;
    var targets;
    var service;

    var bikeSpeed       = 15;
    var bikeUphill      = 20;
    var bikeDownhill    = -10;
    var walkSpeed       = 5;
    var walkUphill      = 10;
    var walkDownhill    = 0;

    var travelTimes     = [300, 600, 900, 1200, 1500, 1800];
    var travelMode      = "walk";

    var time            = r360.Util.getTimeInSeconds();
    var date            = r360.Util.getCurrentDate();
    var errors          = [];
    var waitControl;

    this.valid = function(){

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getSources()) === '[object Array]' ) {

            if ( this.getSources().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getSources, function(source){

                    if ( source.getLatLng().lat === 'undefined' ) this.getErrors().push('Sources contains source with undefined latitude!');
                    if ( source.getLatLng().lng === 'undefined' ) this.getErrors().push('Sources contains source with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getTargets()) === '[object Array]' ) {

            if ( this.getTargets().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getTargets, function(target){

                    if ( target.getLatLng().lat === 'undefined' ) this.getErrors().push('Targets contains target with undefined latitude!');
                    if ( target.getLatLng().lng === 'undefined' ) this.getErrors().push('Targets contains target with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        return false;
    }

    /*
     *
     *
     *
     */
    this.getErrors = function(){

        return errors;
    }

    /*
     *
     *
     *
     */
    this.getSources = function(){

        return sources;
    }

    /*
     *
     *
     *
     */
    this.getTargets = function(){

        return targets;
    }

    /*
     *
     *
     *
     */
    this.getBikeSpeed = function(){

        return bikeSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeUphill = function(){

        return bikeUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeDownhill = function(){

        return bikeDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkSpeed = function(){

        return walkSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkUphill = function(){

        return walkUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkDownhill = function(){

        return walkDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelTimes = function(){

        return travelTimes;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelMode = function(){

        return travelMode;
    }
    
    /*
     *
     *
     *
     */
    this.getTime = function(){

        return time;
    }
    
    /*
     *
     *
     *
     */
    this.getDate = function(){

        return date;
    }
    
    /*
     *
     *
     *
     */
    this.getWaitControl = function(){

        return waitControl;
    }


    /*
     *
     *
     *
     */
    this.getService = function(){

        return service;
    }
    
    /*
     *
     *
     *
     */
    this.setService = function(service){

        this.service = service;
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
    this.setTravelMode = function(travelMode){

        this.travelMode = travelMode;
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
};

r360.travelOptions = function () { 
    return new r360.TravelOptions();
};