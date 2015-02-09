r360.TimeService = {

    cache : {},

    getRouteTime : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidTimeServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { 
                sources : [], targets : [],
                pathSerializer : travelOptions.getPathSerializer(), 
                maxRoutingTime : travelOptions.getMaxRoutingTime()
            };

            // configure sources
            _.each(travelOptions.getSources(), function(source){

                console.log(source);

                // set the basic information for this source
                var src = {
                    lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                    lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                    id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lon,
                    tm  : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

                src.tm[travelType] = {};

                // set special routing parameters depending on the travel mode
                if ( travelType == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelType == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelType == "walk") {
                    
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

                cfg.targets.push({

                    lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                    lng : _.has(target, 'lon') ? target.lon : _.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                    id  : _.has(target, 'id')  ? target.id  : target.lat + ';' + target.lon,
                });
            });

            if ( !_.has(r360.TimeService.cache, JSON.stringify(cfg)) ) {

                // execute routing time service and call callback with results
                $.ajax({
                    url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time?key=' +r360.config.serviceKey,
                    type:        "POST",
                    data:        JSON.stringify(cfg) ,
                    contentType: "application/json",
                    dataType:    "json",
                    success: function (result) {
                        // cache the request
                        r360.TimeService.cache[JSON.stringify(cfg)] = result;
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

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.TimeService.cache[JSON.stringify(cfg)]); 
            }
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};