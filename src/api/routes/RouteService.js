
r360.RouteService = {

    /*
     *
     */
    getRoutes : function(travelOptions, callback) {

        var sources;
        var targets;
        var speed       = 15;
        var uphill      = 20;
        var downhill    = -10;
        var time        = 28800;
        var date        = 20140331;

        /*
         *   as in getPolygons the travelOptions needs to be organised properly. Maybe an extra private function?

         * TODO DANIEL refactor
         */

        if(typeof travelOptions == 'undefined')
            alert('define travel options');
        else{
            if(typeof travelOptions.sources == 'undefined')
                alert("we need a source point");
            else
                sources = travelOptions.sources;

            if(typeof travelOptions.targets == 'undefined')
                alert("we need a target point");
            else
                targets = travelOptions.targets;

            if(typeof travelOptions.travelTimes != 'undefined')
                travelTimes = travelOptions.travelTimes;
            else
                travelTimes = MiConfig.defaultTravelTimeSliderOptions.travelTimes;
            if(typeof travelOptions.travelMode != 'undefined'){
                travelMode = travelOptions.travelMode;
            }               
            else
                travelMode = MiConfig.defaultTravelMode;

            if(typeof travelOptions.speed != 'undefined'){
                if(travelOptions.speed < 1){
                    alert("invalid paramters. speed needs to be higher")
                    return;
                }
                speed = travelOptions.speed;
            }
            if(typeof travelOptions.uphill != 'undefined'){
                uphill = travelOptions.uphill;
            }

            if(typeof travelOptions.downhill != 'undefined'){
                downhill = travelOptions.downhill;
            }

            if(typeof travelOptions.time != 'undefined'){
                time = travelOptions.time;
            }

            if(typeof travelOptions.date != 'undefined'){
                date = travelOptions.date;
            }

            if(uphill < 0 || downhill > 0 || uphill < -(downhill)){
                alert("wrong parameters for uphill and downhill")
                return;
            }
        }     

        // if there are no target points available, no routing is possible! 
        if ( sources.length != 0 && targets.length != 0 ) {

            var cfg = { sources : [], targets : [] };
            
            _.each(sources, function(source){

                // set the basic information for this source
                var src = {
                    id  : source.id,
                    lat : source.getLatLng().lat,
                    lon : source.getLatLng().lng,
                    tm  : {}
                };
                src.tm[travelMode.type] = {};

                // set special routing parameters depending on the travel mode
                if ( travelMode.type == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : time,
                        date : date
                    };
                }
                if ( travelMode.type == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : speed,
                        uphill      : uphill,
                        downhill    : downhill
                    };
                }
                if ( travelMode.type == "walk") {
                    
                    src.tm.walk = {
                        speed       : speed,
                        uphill      : uphill,
                        downhill    : downhill
                    };
                }

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(targets, function(target){

                var trg = {};
                trg.id  = target.id;
                trg.lat = target.getLatLng().lat;
                trg.lon = target.getLatLng().lng;
                cfg.targets.push(trg);
            });

            $.getJSON(MiConfig.serviceUrl + MiConfig.serviceVersion + '/route?cfg=' +  encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", callback);
        }
    }
};