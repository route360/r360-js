
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
                    lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                    id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lng,
                    tm  : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();
                
                src.tm[travelType] = {};

                // set special routing parameters depending on the travel type
              if ( travelType == 'transit' ) {
                    
                    src.tm.transit.frame = {};
                    if ( typeof travelOptions.getTime() != 'undefined' ) src.tm.transit.frame.time = travelOptions.getTime();
                    if ( typeof travelOptions.getDate() != 'undefined' ) src.tm.transit.frame.date = travelOptions.getDate();
                }
                if ( travelType == 'ebike' ) {
                    
                    src.tm.ebike = {};
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.ebike.downhill = travelOptions.getBikeDownhill();
                }
                if ( travelType == 'rentbike' ) {
                    
                    src.tm.rentbike = {};
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                    if ( typeof travelOptions.getWalkSpeed()    != 'undefined' ) src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                    if ( typeof travelOptions.getWalkUphill()   != 'undefined' ) src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                    if ( typeof travelOptions.getWalkDownhill() != 'undefined' ) src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();

                }
                if ( travelType == 'rentandreturnbike' ) {
                    
                    src.tm.rentandreturnbike = {};
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                    if ( typeof travelOptions.getWalkSpeed()    != 'undefined' ) src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                    if ( typeof travelOptions.getWalkUphill()   != 'undefined' ) src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                    if ( typeof travelOptions.getWalkDownhill() != 'undefined' ) src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
                }
                if ( travelType == 'bike' ) {
                    
                    src.tm.bike = {};
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.bike.speed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.bike.uphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.bike.downhill = travelOptions.getBikeDownhill();
                }
                if ( travelType == 'walk') {
                    
                    src.tm.walk = {};
                    if ( typeof travelOptions.getWalkSpeed()    != 'undefined' ) src.tm.walk.speed    = travelOptions.getWalkSpeed();
                    if ( typeof travelOptions.getWalkUphill()   != 'undefined' ) src.tm.walk.uphill   = travelOptions.getWalkUphill();
                    if ( typeof travelOptions.getWalkDownhill() != 'undefined' ) src.tm.walk.downhill = travelOptions.getWalkDownhill();
                }

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(travelOptions.getTargets(), function(target){

                 cfg.targets.push({

                    lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                    lng : _.has(target, 'lon') ? target.lon : _.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                    id  : _.has(target, 'id')  ? target.id  : target.lat + ';' + target.lng,
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