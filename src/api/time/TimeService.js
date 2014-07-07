r360.TimeService = {

    getRouteTime : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidTimeServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { 
                sources : [], targets : [],
                pathSerializer : travelOptions.getPathSerializer(), 
                maxRoutingTime : travelOptions.getMaxRoutingTime(),
                key : r360.config.serviceKey
            };

            // configure sources
            _.each(travelOptions.getSources(), function(source){

                // set the basic information for this source
                var src = {
                    id  : _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng,
                    lat : source.getLatLng().lat,
                    lon : source.getLatLng().lng,
                    tm  : {}
                };
                src.tm[travelOptions.getTravelType()] = {};

                // set special routing parameters depending on the travel mode
                if ( travelOptions.getTravelType() == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelOptions.getTravelType() == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelOptions.getTravelType() == "walk") {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
                }
                
                // add to list of sources
                cfg.sources.push(src);
            });
            
            // configure targets for routing
            _.each(travelOptions.getTargets(), function(target){

                var trg = {};
                trg.id  = _.has(target, "id") ? target.id : target.getLatLng().lat + ";" + target.getLatLng().lng;
                trg.lat = target.getLatLng().lat;
                trg.lon = target.getLatLng().lng;
                cfg.targets.push(trg);
            });

            // execute routing time service and call callback with results
            $.ajax({
                url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time',
                type:        "POST",
                data:        JSON.stringify(cfg),
                contentType: "application/json",
                dataType:    "json",
                success: function (result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // return the results
                    callback(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};