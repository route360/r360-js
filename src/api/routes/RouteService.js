
r360.RouteService = {

    /*
     *
     */
    getRoutes : function(travelOptions, callback) {

        // only make the request if we have a valid configuration
        if ( travelOptions.isValidRouteServiceOptions() ) {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().show();

            var cfg = { sources : [], targets : [], pathSerializer : travelOptions.getPathSerializer() };
            
            _.each(travelOptions.getSources(), function(source){

                // set the basic information for this source
                var src = {
                    id  : _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng,
                    lat : source.getLatLng().lat,
                    lon : source.getLatLng().lng,
                    tm  : {}
                };
                src.tm[travelOptions.getTravelType()] = {};

                // set special routing parameters depending on the travel mode
                if ( travelOptions.getTravelType() == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : travelOptions.getTime(),
                        date : travelOptions.getDate()
                    };
                }
                if ( travelOptions.getTravelType() == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : travelOptions.getBikeSpeed(),
                        uphill      : travelOptions.getBikeUphill(),
                        downhill    : travelOptions.getBikeDownhill()
                    };
                }
                if ( travelOptions.getTravelType() == "walk") {
                    
                    src.tm.walk = {
                        speed       : travelOptions.getWalkSpeed(),
                        uphill      : travelOptions.getWalkUphill(),
                        downhill    : travelOptions.getWalkDownhill()
                    };
                }

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(travelOptions.getTargets(), function(target){

                var trg = {};
                trg.id  = _.has(target, "id") ? target.id : target.getLatLng().lat + ";" + target.getLatLng().lng;
                trg.lat = target.getLatLng().lat;
                trg.lon = target.getLatLng().lng;
                cfg.targets.push(trg);
            });

            $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' +  
                encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+r360.config.serviceKey, 
                    function(result){

                        // hide the please wait control
                        if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                        // call callback with returned results
                        callback(r360.Util.parseRoutes(result)); 
                    });
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
};