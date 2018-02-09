
r360.PolygonService = {

    cache : {},

    getCfg : function(travelOptions){

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) )   cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getReverse()) )           cfg.reverse = travelOptions.getReverse();
        if ( !r360.isUndefined(travelOptions.getEdgeWeight()) )        cfg.edgeWeight = travelOptions.getEdgeWeight();
        if ( !r360.isUndefined(travelOptions.getTravelTimeFactors()) ) cfg.travelTimeFactors = travelOptions.getTravelTimeFactors();

        cfg.polygon = {};

        if ( !r360.isUndefined(travelOptions.getTravelTimes()) )           cfg.polygon.values             = travelOptions.getTravelTimes();
        if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )      cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
        if ( !r360.isUndefined(travelOptions.getPolygonSerializer()) )     cfg.polygon.serializer         = travelOptions.getPolygonSerializer();
        if ( !r360.isUndefined(travelOptions.isPointReductionEnabled()) )  cfg.polygon.pointReduction     = travelOptions.isPointReductionEnabled();
        if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) )    cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        if ( !r360.isUndefined(travelOptions.getSrid()) )                  cfg.polygon.srid               = travelOptions.getSrid();
        if ( !r360.isUndefined(travelOptions.getSimplifyMeter()) )         cfg.polygon.simplify           = travelOptions.getSimplifyMeter();
        if ( !r360.isUndefined(travelOptions.getBuffer()) )                cfg.polygon.buffer             = travelOptions.getBuffer();
        if ( !r360.isUndefined(travelOptions.getQuadrantSegments()) )      cfg.polygon.quadrantSegments   = travelOptions.getQuadrantSegments(); 

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
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time              = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date              = travelOptions.getDate();
                if ( !r360.isUndefined(travelOptions.getFrameDuration()) ) src.tm[travelType].frame.duration = travelOptions.getFrameDuration();
                if ( !r360.isUndefined(travelOptions.getMaxTransfers()) ) src.tm[travelType].maxTransfers    = travelOptions.getMaxTransfers();
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
                src.tm[travelType].rushHour = false;
                if ( !r360.isUndefined(travelOptions.isRushHour()) ) src.tm[travelType].rushHour = travelOptions.isRushHour();
            }

            cfg.sources.push(src);
        });

        return cfg;
    },

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, successCallback, errorCallback, method) {

        var cfg = r360.PolygonService.getCfg(travelOptions);

        if ( !r360.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

            var options = r360.PolygonService.getAjaxOptions(travelOptions, cfg, successCallback, errorCallback, typeof method == 'undefined' ? 'GET' : method);

            // make the request to the Route360° backend
            // use GET as fallback, otherwise use the supplied option
            $.ajax(options);
        }
        else {

            // call successCallback with returned results
            successCallback(travelOptions.getPolygonSerializer() == 'geojson' ? r360.PolygonService.cache[JSON.stringify(cfg)] : r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
        }
    },

    /**
     * [getAjaxOptions description]
     * @param  {type} travelOptions   [description]
     * @param  {type} successCallback [description]
     * @param  {type} errorCallback   [description]
     * @return {type}                 [description]
     */
    getAjaxOptions : function(travelOptions, cfg, successCallback, errorCallback, method) {

        var serviceUrl = typeof travelOptions.getServiceUrl() !== 'undefined' ? travelOptions.getServiceUrl() : r360.config.serviceUrl;

        var options = {
                url         : serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+travelOptions.getServiceKey(),
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                type        : method,
                success     : function(result) {

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(travelOptions.getPolygonSerializer() == 'geojson' ? result.data : r360.Util.parsePolygons(result.data));
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
                        successCallback(travelOptions.getPolygonSerializer() == 'geojson' ? result.data : r360.Util.parsePolygons(result));
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){

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

            options.url         = serviceUrl + r360.config.serviceVersion + '/polygon?key=' + travelOptions.getServiceKey();
            options.data        = JSON.stringify(cfg);
            options.contentType = 'application/json';
            options.async       = false;
        }

        return options;
    }
}
