
r360.RouteService = {

    cache : {},

    /*
     *
     */
    getRoutes : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidRouteServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { sources : [], targets : [], 
                pathSerializer : travelOptions.getPathSerializer(),
                elevation : travelOptions.isElevationEnabled() };
            
            _.each(travelOptions.getSources(), function(source){

                // set the basic information for this source
                var src = {
                    lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                    lon : _.has(source, 'lon') ? source.lon : source.getLatLng().lng,
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

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(travelOptions.getTargets(), function(target){

                 cfg.targets.push({

                    lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                    lon : _.has(target, 'lon') ? target.lon : target.getLatLng().lng,
                    id  : _.has(target, 'id')  ? target.id  : target.lat + ';' + target.lon,
                });
            });

            if ( !_.has(r360.RouteService.cache, JSON.stringify(cfg)) ) {

                $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' +  
                    encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+r360.config.serviceKey, 
                        function(result){

                            // cache the result
                            r360.RouteService.cache[JSON.stringify(cfg)] = result;
                            // hide the please wait control
                            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                            // call callback with returned results
                            callback(r360.Util.parseRoutes(result)); 
                        });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.Util.parseRoutes(r360.RouteService.cache[JSON.stringify(cfg)])); 
            }
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};