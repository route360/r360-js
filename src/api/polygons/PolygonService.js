
r360.PolygonService = {

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, callback) {

        var sources;
        var travelTimes;
        var travelMode;
        var bikeSpeed        = 15;
        var bikeUphill      = 20;
        var bikeDownhill    = -10;
        var walkSpeed       = 5;
        var walkUphill      = 10;
        var walkDownhill    = 0;

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

            if ( _.has(travelOptions, "bikeSpeed") ) { 
                
                if ( travelOptions.bikeSpeed < 1) alert("Bike speed needs to larger then 0.");
                else bikeSpeed = travelOptions.bikeSpeed;
            }

             if ( _.has(travelOptions, "walkSpeed") ) { 
                
                if ( travelOptions.walkSpeed < 1) alert("Walk speed needs to larger then 0.");
                else walkSpeed = travelOptions.walkSpeed;
            }

            if ( bikeUphill < 0 || bikeDownhill > 0 || bikeUphill < -(bikeDownhill) )  
                alert("Uphill cycle speed has to be larger then 0. Downhill cycle speed has to be smaller then 0. \
                    Absolute value of downhill cycle speed needs to be smaller then uphill cycle speed.");

            if ( walkDownhill < 0 || walkDownhill > 0 || walkDownhill < -(walkDownhill) )  
                alert("Uphill walking speed has to be larger then 0. Downhill walking speed has to be smaller then 0. \
                    Absolute value of downhill walking speed needs to be smaller then uphill walking speed.");

            if ( _.has(travelOptions, "uphill") )       bikeUphill   = travelOptions.bikeUphill;
            if ( _.has(travelOptions, "downhill") )     bikeDownhill = travelOptions.bikeDownhill;
            if ( _.has(travelOptions, "walkUphill") )   walkUphill   = travelOptions.walkUphill;
            if ( _.has(travelOptions, "walkDownhill") ) walkDownhill = travelOptions.walkDownhill;

            if ( _.has(travelOptions, "time") ) time = travelOptions.time;
            if ( _.has(travelOptions, "date") ) date = travelOptions.date;
            if ( _.has(travelOptions, 'wait') ) travelOptions.wait.show();
        }
        else alert('define travel options');

        // // we need to define this before we can call valid()

        // if ( travelOptions.isValidPolygonServiceOptions() ) {

        // }
        // else {

        //     alert("Travel options are not valid!")
        //     console.log(travelOptions);
        // }

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
                    speed       : bikeSpeed,
                    uphill      : bikeUphill,
                    downhill    : bikeDownhill
                };
            }
            if ( travelMode.type == "walk") {
                
                src.tm.walk = {
                    speed       : walkSpeed,
                    uphill      : walkUphill,
                    downhill    : walkDownhill
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