
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

        var time = 28800;
        var date = 20140331;

        /*
        *   TODO reading the parameter from either default values or travelOptions needs to be done properly
        */
        if(typeof callback == 'undefined')
            alert('callback needs to be defined');
        if(typeof travelOptions == 'undefined')
            alert('define travel options');
        else{
            if(typeof travelOptions.sources == 'undefined')
                alert("we need a source point");
            else
                sources = travelOptions.sources;
            if(typeof travelOptions.travelTimes != 'undefined')
                travelTimes = travelOptions.travelTimes;
            else
                travelTimes = r360.config.defaultTravelTimeControlOptions.travelTimes;
            if(typeof travelOptions.travelMode != 'undefined'){
                travelMode = travelOptions.travelMode;
            }               
            else
                travelMode = r360.config.defaultTravelMode;

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

            if(uphill < 0 || downhill > 0 || uphill < -(downhill)){
                alert("wrong parameters for uphill and downhill")
                return;
            }

            if(typeof travelOptions.time != 'undefined'){
                time = travelOptions.time;
            }

            if(typeof travelOptions.date != 'undefined'){
                date = travelOptions.date;
            }

        }      

        /*
        TODO handling here is not nice. There need to be a better way to deal with different travelMode. Complex issue
        */  

        var times = new Array();

        for(var i = 0; i < travelTimes.length; i++){
            if(travelTimes[i].time > 7200){
                alert("invalid parameter: do not use times higher 7200");
                return;
            }
            times[i] = travelTimes[i].time;
        }
            
   
        var cfg = {};
        cfg.polygon = { values : times };
        cfg.sources = [];
        _.each(sources, function(source){
            var src = {};
            src.id = source.id;
            src.lat = source.getLatLng().lat;
            src.lon = source.getLatLng().lng;
            src.tm = {};   

                   
            src.tm[travelMode.type] = {};
            if(travelMode.type == "transit"){
               src.tm.transit.frame = {};
                src.tm.transit.frame.time = time;
                src.tm.transit.frame.date = date;
            }
            if(travelMode.type == "bike"){
                src.tm.bike.speed = speed;
                src.tm.bike.uphill = uphill;
                src.tm.bike.downhill = downhill;
            }
            if(travelMode.type == "walk"){
                src.tm.walk.speed = speed;
                src.tm.walk.uphill = uphill;
                src.tm.walk.downhill = downhill;
            }

            cfg.sources.push(src);
        });
        
        $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", function(result){
            callback(r360.Util.parsePolygons(result));
        });
    }
}