
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
        var time        = r360.Util.getTime();
        var date        = r360.Util.getCurrentDate();

        if ( typeof callback       == 'undefined') alert('callback needs to be defined');
        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "targets") ) targets = travelOptions.targets;
            else alert("No targets for routing given!");

            if ( _.has(travelOptions, "travelTimes") ) travelTimes = travelOptions.travelTimes;
            else travelTimes = r360.config.defaultTravelTimeControlOptions.travelTimes;
            
            if ( _.has(travelOptions, "travelMode") ) travelMode = travelOptions.travelMode;
            else travelMode = r360.config.defaultTravelMode;
 
            if ( _.has(travelOptions, "speed") ) { 
                
                if ( travelOptions.speed < 1) alert("Speed needs to larger then 0.");
                else speed = travelOptions.speed;
            }

            if ( _.has(travelOptions, "uphill") )   uphill   = travelOptions.uphill;
            if ( _.has(travelOptions, "downhill") ) downhill = travelOptions.downhill;
            if ( _.has(travelOptions, "time") )     time     = travelOptions.time;
            if ( _.has(travelOptions, "date") )     date     = travelOptions.date;

            if ( uphill < 0 || downhill > 0 || uphill < -(downhill) )  
                alert("Uphill speed has to be larger then 0. Downhill speed has to be smaller then 0. \
                    Absolute value of downhill speed needs to be smaller then uphill speed.");

            if ( _.has(travelOptions, 'wait') ) travelOptions.wait.show();
        }
        else alert('Travel options not defined! Cannot call Route360° service!');   

        // if there are no target points available, no routing is possible! 
        if ( sources.length != 0 && targets.length != 0 ) {

            var cfg = { sources : [], targets : [] };
            
            _.each(sources, function(source){

                // set the basic information for this source
                var src = {
                    id  : _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng,
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

            $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' +  
                encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", function(result){

                    // hide the please wait control
                    if ( _.has(travelOptions, 'wait') ) travelOptions.wait.hide();
                    // call callback with returned results
                    callback(r360.Util.parseRoutes(result)); 
            });
        }
    }
};