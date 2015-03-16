
r360.OsmService = {

    cache : {},

    /*
     *
     */
    getPoisInBoundingBox : function(map, tags, waitControl, successCallback, errorCallback) {

        // hide the please wait control
        if ( waitControl ) waitControl.show();

        var data = $.param({
            northEast : map.getBounds()._northEast.lng + '-' + map.getBounds()._northEast.lat,
            southWest : map.getBounds()._southWest.lng + '-' + map.getBounds()._southWest.lat,
            tags      : tags
        }, true);

        if ( !_.has(r360.OsmService.cache, data) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.osmServiceUrl + 'pois/search?callback=?&' + data,
                timeout     : 5000,
                dataType    : "json",
                success     : function(result) {

                    if ( waitControl ) 
                        waitControl.hide();

                    successCallback(result);
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    if ( waitControl ) 
                        waitControl.hide();

                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( waitControl ) waitControl.hide();
            // call successCallback with returned results
            successCallback(r360.OsmService.cache[data]);
        }
    }
}