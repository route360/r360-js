r360.TimeService = {

    getRouteTime : function(travelOptions, callback) {

        var cfg = { 
            sources : [], 
            targets : [], 
            pathSerializer : _.has(travelOptions, 'pathSerializer') ? travelOptions.pathSerializer : r360.pathSerializer, 
            maxRoutingTime : _.has(travelOptions, 'maxRoutingTime') ? travelOptions.pathSerializer : r360.maxRoutingTime 
        };

        // validate travel options
        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "targets") ) targets = travelOptions.targets;
            else alert("No targets for routing given!");
        }
        else alert('Travel options not defined! Cannot call Route360° service!'); 

        // configure sources
        _.each(sources, function(source){

            // set the basic information for this source
            var src = {
                id  : _.has(source, 'id') ? source.id : source.lat + ";" + source.lon,
                lat : source.lat,
                lon : source.lon,
                tm  : {}
            };
            
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

            cfg.targets.push({
                id  : _.has(target, 'id') ? target.id : target.lat + ";" + target.lon,
                lat : target.getLatLng().lat,
                lon : target.getLatLng().lng
            });
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