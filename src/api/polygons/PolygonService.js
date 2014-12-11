
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
            var cfg = {
                polygon          : { 
                    values           : travelOptions.getTravelTimes(), 
                    intersectionMode : travelOptions.getIntersectionMode() 
                },
                sources          : []
            };

            // add each source point and it's travel configuration to the cfg
            _.each(travelOptions.getSources(), function(source){

                if ( source.getLatLng() instanceof L.LatLng ) 
                    source = r360.Util.latLngToWebMercator(source.getLatLng());

                else if ( _.has(source, 'lat') && _.has(source, 'lng') ) 
                    source = r360.Util.latLngToWebMercator(L.latLng(source.lat, source.lng));

                var src = {
                    x  : parseInt(source.x),
                    y  : parseInt(source.y),
                    id : _.has(source, 'id')  ? source.id  : source.x + ';' + source.y,
                    tm : {}
                };

                var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

                src.tm[travelType] = {};

                // set special routing parameters depending on the travel type
                if ( travelType == 'transit' ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelType == 'bike' ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelType == 'walk') {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
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
                        });
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