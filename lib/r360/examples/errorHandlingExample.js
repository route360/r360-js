function errorHandlingExample(){

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'YWtKiQB7MiZETbCoVsG6';

    var travelOptions = r360.travelOptions();
    travelOptions.addSource(L.marker([52.50086, 13.36581]));
    travelOptions.addTarget(L.marker([52.52562, 13.30195]));

    // force the exception with an unspported travel type
    travelOptions.setTravelType('THIS_IS_A_NOT_SUPPORTED_TRAVEL_TYPE');
    
    // define what happens if everything goes smoothly
    var successCallback = function(routes){};

    // what should happen if an error occurs
    var errorCallback = function(status, message){

        // fake some server side activity
        setTimeout(function(){ $("#r360-error").show('fade').html(status + ": " + message); }, 2000);
    };

    // start the service
    r360.RouteService.getRoutes(travelOptions, successCallback, errorCallback);
}