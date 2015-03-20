
r360.PopulationService = {

    cache : {},

    /*
     *
     */
    getPopulationStatistics : function(travelOptions, populationStatistics, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('populationWait'));
        }

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {}; 
        cfg.sources = [];

        if ( typeof travelOptions.isElevationEnabled() != 'undefined' ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( typeof travelOptions.getTravelTimes() != 'undefined' || typeof travelOptions.getIntersectionMode() != 'undefined' || 
             typeof travelOptions.getRenderWatts() != 'undefined' || typeof travelOptions.getSupportWatts()     != 'undefined' ) {

            cfg.polygon = {};

            if ( typeof travelOptions.getTravelTimes()      != 'undefined' ) cfg.polygon.values           = travelOptions.getTravelTimes();
            if ( typeof travelOptions.getIntersectionMode() != 'undefined' ) cfg.polygon.intersectionMode = travelOptions.getIntersectionMode();
            if ( typeof travelOptions.getRenderWatts()      != 'undefined' ) cfg.polygon.renderWatts      = travelOptions.getRenderWatts();
            if ( typeof travelOptions.getSupportWatts()     != 'undefined' ) cfg.polygon.supportWatts     = travelOptions.getSupportWatts();
        }
            
        // add each source point and it's travel configuration to the cfg
        _.each(travelOptions.getSources(), function(source){

            var src = {
                lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : _.has(source, 'id')  ? source.id  : source.lat + ';' + source.lng,
                tm  : {}
            };

            var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' ) {
                
                src.tm.transit.frame = {};
                if ( !_.isUndefined(travelOptions.getTime()) ) src.tm.transit.frame.time = travelOptions.getTime();
                if ( !_.isUndefined(travelOptions.getDate()) ) src.tm.transit.frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {
                
                src.tm.ebike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {
                
                src.tm.rentbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {
                
                src.tm.rentandreturnbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {
                
                src.tm.bike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {
                
                src.tm.walk = {};
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            cfg.sources.push(src);
        });

        var statistics = [];
        _.each(populationStatistics, function(statistic) { statistics.push('statistics=' + statistic); })

        if ( !_.has(r360.PopulationService.cache, JSON.stringify(cfg) + statistics.join("&")) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.serviceUrl + r360.config.serviceVersion + '/population?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey + '&' + statistics.join("&"),
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {
                    
                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( _.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")] = result.data;
                            // call successCallback with returned results
                            successCallback(result.data);
                        }
                        else 
                            // check if the error callback is defined
                            if ( _.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")] = result;
                        // call successCallback with returned results
                        successCallback(r360.Util.parsePolygons(result));
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // call error callback if defined
                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The population service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call callback with returned results
            successCallback(r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")]);
        }
    }
}