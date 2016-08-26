
r360.MobieService = {

    cache : {},

    getCfg : function(travelOptions){

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];
        cfg.x = travelOptions.getX();
        cfg.y = travelOptions.getY();
        cfg.z = travelOptions.getZ();
        cfg.decimalPlaces = travelOptions.getDecimalPlaces();
        cfg.edgeClasses = travelOptions.getEdgeClasses();

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) )
            cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getMaxRoutingTime()) )
            cfg.maxRoutingTime = travelOptions.getMaxRoutingTime();

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
    getGraph : function(id, travelOptions, successCallback, errorCallback) {

        var cfg = r360.MobieService.getCfg(travelOptions);

        if ( !r360.has(r360.MobieService.cache, JSON.stringify(cfg)) ) {

            var options = r360.MobieService.getAjaxOptions(id, travelOptions, cfg, successCallback, errorCallback);

            // make the request to the Route360° backend
            // use GET as fallback, otherwise use the supplied option
            $.ajax(options);
        }
        else {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call successCallback with returned results
            successCallback(r360.Util.parseNetwork(r360.MobieService.cache[JSON.stringify(cfg)]));
        }
    },

    /**
     * [getAjaxOptions description]
     * @param  {[type]} travelOptions   [description]
     * @param  {[type]} successCallback [description]
     * @param  {[type]} errorCallback   [description]
     * @return {[type]}                 [description]
     */
    getAjaxOptions : function(id, travelOptions, cfg, successCallback, errorCallback) {

        var serviceUrl = typeof travelOptions.getServiceUrl() !== 'undefined' ? travelOptions.getServiceUrl() : r360.config.serviceUrl;

        var options = {
            url         : serviceUrl + r360.config.serviceVersion + '/mobie?id='+id+'&cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+travelOptions.getServiceKey(),
            timeout     : r360.config.requestTimeout,
            dataType    : "json",
            type        : "GET",
            success     : function(result) {

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                // the new version is an object, old one an array
                if ( r360.has(result, 'data')  ) {

                    if ( result.code == 'ok' ) {

                        // cache the result
                        r360.MobieService.cache[JSON.stringify(cfg)] = result;
                        // call successCallback with returned results
                        successCallback(r360.Util.parseNetwork(result));
                    }
                    else
                        // check if the error callback is defined
                        if ( r360.isFunction(errorCallback) )
                            errorCallback(result.code, result.message);
                }
                // fallback for old clients
                else {

                    // cache the result
                    r360.MobieService.cache[JSON.stringify(cfg)] = result;
                    // call successCallback with returned results
                    successCallback(r360.Util.parseNetwork(result));
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

        return options;
    }
}
