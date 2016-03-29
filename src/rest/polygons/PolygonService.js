
r360.PolygonService = {

    cache : {},

    getCfg : function(travelOptions){

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getTravelTimes()) || !r360.isUndefined(travelOptions.getIntersectionMode()) ||
             !r360.isUndefined(travelOptions.getRenderWatts()) || !r360.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !r360.isUndefined(travelOptions.getTravelTimes()) )           cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )      cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !r360.isUndefined(travelOptions.getPolygonSerializer()) )     cfg.polygon.serializer         = travelOptions.getPolygonSerializer();
            if ( !r360.isUndefined(travelOptions.isPointReductionEnabled()) )  cfg.polygon.pointReduction     = travelOptions.isPointReductionEnabled();
            if ( !r360.isUndefined(travelOptions.getRenderWatts()) )           cfg.polygon.renderWatts        = travelOptions.getRenderWatts();
            if ( !r360.isUndefined(travelOptions.getSupportWatts()) )          cfg.polygon.supportWatts       = travelOptions.getSupportWatts();
            if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) )    cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }

        // add each source point and it's travel configuration to the cfg
        travelOptions.getSources().forEach(function(source){

            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
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

            cfg.sources.push(src);
        });

        return cfg;
    },

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, successCallback, errorCallback, method) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('polygonWait'));
        }

        var cfg = r360.PolygonService.getCfg(travelOptions);

        if ( !r360.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

            var options = r360.PolygonService.getAjaxOptions(travelOptions, cfg, successCallback, errorCallback, typeof method == 'undefined' ? 'GET' : method);

            // make the request to the Route360° backend
            // use GET as fallback, otherwise use the supplied option
            $.ajax(options);
        }
        else {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call successCallback with returned results
            successCallback(r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
        }
    },

    /**
     * [getAjaxOptions description]
     * @param  {[type]} travelOptions   [description]
     * @param  {[type]} successCallback [description]
     * @param  {[type]} errorCallback   [description]
     * @return {[type]}                 [description]
     */
    getAjaxOptions : function(travelOptions, cfg, successCallback, errorCallback, method) {

        var serviceUrl = typeof travelOptions.getServiceUrl() !== 'undefined' ? travelOptions.getServiceUrl() : r360.config.serviceUrl;

        var options = {
                url         : serviceUrl+ r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey,
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                type        : method,
                success     : function(result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(r360.Util.parsePolygons(result.data));
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.PolygonService.cache[JSON.stringify(cfg)] = result;
                        // call successCallback with returned results
                        successCallback(r360.Util.parsePolygons(result));
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // call error callback if defined
                    if ( r360.isFunction(errorCallback) ) {

                        if ( data.status == 403 )
                            errorCallback("not-authorized", data.responseText);
                        else
                            errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later.");
                    }
                }
            };

        if ( method == 'POST' ) {

            options.url         = serviceUrl + r360.config.serviceVersion + '/polygon_post?key=' +r360.config.serviceKey;
            options.data        = JSON.stringify(cfg);
            options.contentType = 'application/json';
            options.async       = false;
        }

        return options;
    }
}
