
r360.PolygonService = {

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, callback) {

        var sources;
        var travelTimes;
        var travelMode;
        var speed = 15;
        var uphill = 20;
        var downhill = -10;

        var time = r360.Util.getTimeInSeconds();
        var date = r360.Util.getCurrentDate();

        // reading the parameter from either default values or travelOptions
        if ( typeof callback       == 'undefined') alert('callback needs to be defined');
        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "travelTimes") ) travelTimes = travelOptions.travelTimes;
            else travelTimes = r360.config.defaultTravelTimeControlOptions.travelTimes;
            
            if ( _.has(travelOptions, "travelMode") ) travelMode = travelOptions.travelMode;
            else travelMode = r360.config.defaultTravelMode;

            if ( _.has(travelOptions, "speed") ) { 
                
                if ( travelOptions.speed < 1) alert("Speed needs to larger then 0.");
                else speed = travelOptions.speed;
            }

            if ( typeof travelOptions.uphill   != 'undefined') uphill = travelOptions.uphill;
            if ( typeof travelOptions.downhill != 'undefined') downhill = travelOptions.downhill;


            if ( uphill < 0 || downhill > 0 || uphill < -(downhill) )  
                alert("Uphill speed has to be larger then 0. Downhill speed has to be smaller then 0. \
                    Absolute value of downhill speed needs to be smaller then uphill speed.");

            if ( _.has(travelOptions, "uphill") )   uphill   = travelOptions.uphill;
            if ( _.has(travelOptions, "downhill") ) downhill = travelOptions.downhill;
            if ( _.has(travelOptions, "time") )     time     = travelOptions.time;
            if ( _.has(travelOptions, "date") )     date     = travelOptions.date;

            if ( _.has(travelOptions, 'wait') ) travelOptions.wait.show();
        }
        else alert('define travel options');

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {
            polygon : { values : travelTimes },
            sources : []
        };

        // add each source point and it's travel configuration to the cfg
        _.each(sources, function(source){
            
            var src = {
                id  :  _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng,
                lat : source.getLatLng().lat,
                lon : source.getLatLng().lng,
                tm  : {}
            };
            // since we don't need special parameters for car for now, it's enough to create
            // this empty travel type object 'car'
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

            cfg.sources.push(src);
        });
            
        // make the request to the Route360° backend 
        $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + 
            encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", function(result){

            // hide the please wait control
            if ( _.has(travelOptions, 'wait') ) travelOptions.wait.hide();
            // call callback with returned results
            callback(r360.Util.parsePolygons(result));
        });
    }
}