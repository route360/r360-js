r360.TimeService = {

    cache : {},

    getCfg : function(travelOptions) {

        var cfg = {
            sources : [], targets : [],
            pathSerializer : travelOptions.getPathSerializer(),
            maxRoutingTime : travelOptions.getMaxRoutingTime(),
            maxRoutingLength : travelOptions.getMaxRoutingLength()
        };

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) )   cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getTravelTimeFactors()) ) cfg.travelTimeFactors = travelOptions.getTravelTimeFactors();
        if ( !r360.isUndefined(travelOptions.getTravelTimes()) || !r360.isUndefined(travelOptions.getIntersectionMode()) ) {

            cfg.polygon = {};

            if ( !r360.isUndefined(travelOptions.getTravelTimes()) )        cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )   cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) ) cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }

        // configure sources
        travelOptions.getSources().forEach(function(source){

            // set the basic information for this source
            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            if ( src.id == '' ) src.id = src.lat + ';' + src.lng;

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time              = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date              = travelOptions.getDate();
                if ( !r360.isUndefined(travelOptions.getFrameDuration()) ) src.tm[travelType].frame.duration = travelOptions.getFrameDuration();
                if ( !r360.isUndefined(travelOptions.getMaxTransfers()) ) src.tm[travelType].maxTransfers    = travelOptions.getMaxTransfers();
            }
            if ( travelType == 'ebike' ) {

                src.tm.ebike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {

                src.tm.rentbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {

                src.tm.rentandreturnbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }
            if (travelType == 'car') {
                src.tm.car.rushHour = false;
                if ( !r360.isUndefined(travelOptions.isRushHour()) ) src.tm.car.rushHour = travelOptions.isRushHour();
            }
            // add to list of sources
            cfg.sources.push(src);
        });

        // configure targets for routing
        travelOptions.getTargets().forEach(function(target){

            var target = {

                lat : r360.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                lng : r360.has(target, 'lon') ? target.lon : r360.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                id  : r360.has(target, 'id')  ? target.id  : '',
            };

            if ( target.id == '' ) target.id = target.lat + ';' + target.lng;

            cfg.targets.push(target);
        });

        return cfg;
    },

    getRouteTime : function(travelOptions, successCallback, errorCallback) {

        var cfg = r360.TimeService.getCfg(travelOptions);

        if ( !r360.has(r360.TimeService.cache, JSON.stringify(cfg)) ) {

            // execute routing time service and call callback with results
            $.ajax({
                url:         travelOptions.getServiceUrl() + r360.config.serviceVersion + '/time?key=' +travelOptions.getServiceKey(),
                type:        "POST",
                data:        JSON.stringify(cfg) ,
                contentType: "application/json",
                timeout:     r360.config.requestTimeout,
                dataType:    "json",
                success: function (result) {

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.TimeService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(result.data);
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.TimeService.cache[JSON.stringify(cfg)] = result;
                        // call successCallback with returned results
                        successCallback(result);
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){

                    // call error callback if defined
                    if ( r360.isFunction(errorCallback) ) {

                        if ( data.status == 403 )
                            errorCallback("not-authorized", data.responseText);
                        else
                            errorCallback("service-not-available", "The time service is currently not available, please try again later.");
                    }
                }
            });
        }
        else {

            // call callback with returned results
            successCallback(r360.TimeService.cache[JSON.stringify(cfg)]);
        }
    }
};
