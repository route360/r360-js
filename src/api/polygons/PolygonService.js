
r360.PolygonService = {

    cache : {},

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, callback) {

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
                if ( typeof travelOptions.getMinPolygonHoleSize() != 'undefined' ) cfg.polygon.minPolygonHoleSize     = travelOptions.getMinPolygonHoleSize();
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

                cfg.sources.push(src);
            });

            if ( !_.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

                // make the request to the Route360° backend 
                $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + 
                    encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey, 
                        function(result){

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result;
                            // hide the please wait control
                            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                            // call callback with returned results
                            callback(r360.Util.parsePolygons(result));
                        })
                        .error(function() { alert("error occurred "); });
            }
            else { 

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                // call callback with returned results
                callback(r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
            }
        }
        else {

            alert('Travel options are not valid!')
            console.log(travelOptions.getErrors());
        }
    }
}