r360.TimeService = {

    getRouteTime : function(travelOptions, callback) {

        var sources;
        var targets;
        var time            = r360.Util.getTimeInSeconds();
        var date            = r360.Util.getCurrentDate();

        // validate travel options
        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "targets") ) targets = travelOptions.targets;
            else alert("No targets for routing given!");

            if ( _.has(travelOptions, "travelMode") ) travelMode = travelOptions.travelMode;
            else travelMode = r360.config.defaultTravelMode;
        }
        else alert('Travel options not defined! Cannot call Route360° service!'); 

        var cfg = { 
            sources : [], targets : [],
            pathSerializer : _.has(travelOptions, 'pathSerializer') ? travelOptions.pathSerializer : r360.config.pathSerializer, 
            maxRoutingTime : _.has(travelOptions, 'maxRoutingTime') ? travelOptions.pathSerializer : r360.config.maxRoutingTime 
        };

        // configure sources
        _.each(sources, function(source){

            console.log(source);

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
            if ( travelMode.type == "car" ) src.tm.car = {};
            
            // add to list of sources
            cfg.sources.push(src);
        });
        
        // configure targets for routing
        _.each(targets, function(target){

            var trg = {};
            trg.id  = _.has(target, "id") ? target.id : target.getLatLng().lat + ";" + target.getLatLng().lng;
            trg.lat = target.getLatLng().lat;
            trg.lon = target.getLatLng().lng;
            cfg.targets.push(trg);
        });

        // execute routing time service and call callback with results
        $.ajax({
            url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time',
            type:        "POST",
            data:        JSON.stringify(cfg),
            contentType: "application/json",
            dataType:    "json",
            success: function (result) {

                callback(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }
};