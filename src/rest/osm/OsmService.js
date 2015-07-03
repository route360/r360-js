
r360.OsmService = {

    cache : {},

    /*
     *
     */
    getPoisInBoundingBox : function(boundingBox, tags, waitControl, successCallback, errorCallback) {

        // swho the please wait control
        if ( waitControl ) {
            waitControl.show();
            waitControl.updateText(r360.config.i18n.getSpan('osmWait'));
        }

        var data = $.param({
            tags      : tags
        }, true);

        if ( typeof boundingBox !== 'undefined' ) {

            data.northEast = boundingBox._northEast.lng + '|' + boundingBox._northEast.lat;
            data.southWest = boundingBox._southWest.lng + '|' + boundingBox._southWest.lat;
        }

        if ( !r360.has(r360.OsmService.cache, data) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.osmServiceUrl + 'pois/search?callback=?&' + data,
                timeout     : r360.config.requestTimeout,
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

                    if ( r360.isFunction(errorCallback) )
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