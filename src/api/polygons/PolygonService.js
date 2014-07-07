
r360.PolygonService = {

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
                polygon : { values : travelOptions.getTravelTimes() },
                sources : []
            };

            // add each source point and it's travel configuration to the cfg
            _.each(travelOptions.getSources(), function(source){
                
                var src = {
                    id  :  _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng,
                    lat : source.getLatLng().lat,
                    lon : source.getLatLng().lng,
                    tm  : {}
                };
                src.tm[travelOptions.getTravelType()] = {};

                // set special routing parameters depending on the travel type
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

                cfg.sources.push(src);
            });

            // make the request to the Route360° backend 
            $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + 
                encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+r360.config.serviceKey, 
                    function(result){

                        // hide the please wait control
                        if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                        // call callback with returned results
                        callback(r360.Util.parsePolygons(result));
                    });
        }
        else {

            alert("Travel options are not valid!")
            console.log(travelOptions.getErrors());
        }
    }
}