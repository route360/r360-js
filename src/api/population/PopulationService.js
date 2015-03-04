
r360.PopulationService = {

    cache : {},

    /*
     *
     */
    getPopulationStatistics : function(travelOptions, populationStatistics, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidPolygonServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

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
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.rentbike.speed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.rentbike.uphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.rentbike.downhill = travelOptions.getBikeDownhill();
                }
                if ( travelType == 'rentandreturnbike' ) {
                    
                    src.tm.rentandreturnbike = {};
                    if ( typeof travelOptions.getBikeSpeed()    != 'undefined' ) src.tm.rentandreturnbike.speed    = travelOptions.getBikeSpeed();
                    if ( typeof travelOptions.getBikeUphill()   != 'undefined' ) src.tm.rentandreturnbike.uphill   = travelOptions.getBikeUphill();
                    if ( typeof travelOptions.getBikeDownhill() != 'undefined' ) src.tm.rentandreturnbike.downhill = travelOptions.getBikeDownhill();
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

                cfg.sources.push(src);
            });

            var statistics = [];
            _.each(populationStatistics, function(statistic) { statistics.push('statistics=' + statistic); })

            if ( !_.has(r360.PopulationService.cache, JSON.stringify(cfg + statistics.join("&"))) ) {

                // make the request to the Route360° backend 
                $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/population?cfg=' + 
                    encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey + '&' + statistics.join("&"), 
                        function(result){

                            // cache the result
                            r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")] = result;
                            // hide the please wait control
                            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                            // call callback with returned results
                            callback(result);
                        })
                        .error(function(e) { alert("error occurred ", e); });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")]);
            }
        }
        else {

            alert('Travel options are not valid!')
            console.log(travelOptions.getErrors());
        }
    }
}