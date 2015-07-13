$(document).ready(function(){

    r360.config.serviceKey = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.requestTimeout = 5000;


    http://dev.route360.net/api_greatbritain/v1/route?cfg=%7B%22sources%22%3A%5B%7B%22lat%22%3A51.51280224425956%2C%22lng%22%3A-0.11398315429687499%2C%22id%22%3A%22%22%2C%22tm%22%3A%7B%22transit%22%3A%7B%22frame%22%3A%7B%22time%22%3A%2239000%22%2C%22date%22%3A%2220150701%22%7D%7D%7D%7D%5D%2C%22targets%22%3A%5B%7B%22lat%22%3A53.39203053281581%2C%22lng%22%3A-1.2795639038085938%2C%22id%22%3A%22%22%7D%5D%2C%22pathSerializer%22%3A%22compact%22%2C%22elevation%22%3Atrue%7D&cb=jQuery1102020896841352805495_1436513829535&key=uhWrWpUhyZQy8rPfiC7X&_=1436513829605

    var polygonRequests = [{
            type : 'polygon',
            serviceUrl : 'http://dev.route360.net/api_greatbritain/',
            sources : [[51.510665, -0.120849]],
            travelTimes : [300, 600, 900],
            travelTypes : ['car', 'bike', 'walk', 'transit'],
            // travelTypes : ['car'],
            holeSize : 10 * 1000 * 1000,
            intersection : 'union',
            elevation : true,
            date : r360.Util.getCurrentDate(),
            time : r360.Util.getTimeInSeconds(),
            code : {},
            requestTime : {},
            error : {}
        }];


    polygonRequests.forEach(function(request) {

        request.travelTypes.forEach(function(travelType){

            var travelOptions = r360.travelOptions();

            request.sources.forEach(function(source){ travelOptions.addSource({lat : source[0], lng : source[1]}); });

            travelOptions.setIntersectionMode(request.intersection);
            travelOptions.setTravelTimes(request.travelTimes);
            travelOptions.setElevationEnabled(request.elevation);
            travelOptions.setTravelType(travelType);
            travelOptions.setDate(request.date);
            travelOptions.setTime(request.time);
            travelOptions.setMinPolygonHoleSize(request.holeSize);

            var cfg = getCfg(travelOptions);

            console.log('request started');

            getPolygons(request, travelType, cfg);
    
            console.log('request finished 2');            
        });
    });

    function getPolygons(request, travelType, cfg) {

        $.ajax({
                url         : request.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey,
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                async       : false,
                success     : function(result) {


                    console.log('request finished 1');

                    request.code[travelType] = result.code;

                    if ( request.code[travelType] == 'ok' ) 
                        request.requestTime[travelType] = result.requestTime;
                    else 
                        request.error[travelType] = result.code + ' -- ' + result.message;
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    request.error[travelType] = "service-not-available -- The travel time polygon service is currently not available, please try again later."; 
                }
            });
    }

    function getCfg(travelOptions) {
        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {}; 
        cfg.sources = [];

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getTravelTimes()) || !r360.isUndefined(travelOptions.getIntersectionMode()) || 
             !r360.isUndefined(travelOptions.getRenderWatts()) || !r360.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !r360.isUndefined(travelOptions.getTravelTimes()) )        cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )   cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !r360.isUndefined(travelOptions.getRenderWatts()) )        cfg.polygon.renderWatts        = travelOptions.getRenderWatts();
            if ( !r360.isUndefined(travelOptions.getSupportWatts()) )       cfg.polygon.supportWatts       = travelOptions.getSupportWatts();
            if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) ) cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
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
    }

    console.log(polygonRequests);
});