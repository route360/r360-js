$(document).ready(function(){

    var regionConfig = {

        britishcolumbia : {
            center          : [49.28438,-123.12035],
            serviceUrl      : 'https://service.route360.net/britishcolumbia/',
            pointsPerBox    : 1,
            boundingBoxes   : [
                { box : "-122.361603,49.019409,-122.24968,49.079713",  name : "AbbotsFord" },
                { box : "-123.106956,49.214906,-122.99503,49.274973",  name : "Downtown" },
                { box : "-123.182487,49.230154,-123.13957,49.270493",  name : "West Vancouver" },
                { box : "-123.132362,49.324227,-123.035374,49.342013", name : "North Vancouver" },
                { box : "-122.883196,49.163522,-122.835045,49.204813", name : "Surrey" },
                { box : "-122.69484,49.101859,-122.646689,49.133318",  name : "Langley" },
                { box : "-123.184247,49.135676,-123.136096,49.167114", name : "Steveston" },
                { box : "-123.138971,49.734549,-123.115196,49.742731", name : "Squamish" },
                { box : "-121.972275,49.15544,-121.928329,49.177664",  name : "Chilliwack" },
                { box : "-122.916756,49.135115,-122.87281,49.157348",  name : "Northdelta" }]
        },
        france : {
            center          : [48.85974578950385,2.340087890625],
            serviceUrl      : 'https://service.route360.net/france/',
            pointsPerBox    : 1,
            boundingBoxes   : [
                { box : "2.327767,48.840716,2.377128,48.871995", name : "Paris Center" },
                { box : "2.336693,48.930567,2.386055,48.96179",  name : "Paris North" },
                { box : "2.260476,48.718549,2.309837,48.749904", name : "Paris South" },
                { box : "2.521401,48.812237,2.570762,48.843533", name : "Paris East" },
                { box : "2.10598,48.833484,2.155342,48.864768",  name : "Paris West" },
                { box : "1.435471,48.428577,1.484832,48.460113", name : "Chartres" },
                { box : "3.967476,49.219058,4.016838,49.2501",   name : "Reims" },
                { box : "2.1101,49.220123,2.159462,49.251165",   name : "Meru" },
                { box : "2.712717,47.983232,2.762079,48.015044", name : "Montargis" },
                { box : "1.876297,47.901674,1.925659,47.933536", name : "Orleans" }]
        }
    }

    var region = regionConfig.france;

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView(region.center, 10);

    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);

    r360.config.requestTimeout                              = 5000;
    r360.config.serviceKey                                  = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl                                  = region.serviceUrl;

    var resultSet                                           = [];
    var maxNumberOfRandomPointsPerBox                       = region.pointsPerBox;
    var boundingBoxes                                       = getBoundingBoxes(region.boundingBoxes);

    function getRandomCoordinatesInBoundingBox(csv, size){

        var res = csv.split(",");
        var longWest = parseFloat(res[0]);
        var longEast = parseFloat(res[2]);
        var latSouth = parseFloat(res[1]);
        var latNorth = parseFloat(res[3]);    
    
        var longDelta = longEast - longWest;
        var latDelta  = latNorth - latSouth;

        var latLngs = [];

        for ( var i = 1 ; i <= size * 2 ; i += 2 ) 
            latLngs.push(new L.latLng(latSouth + latDelta * random(i), longWest + longDelta * random(i + 1)));

        return latLngs;
    }

    /**
     * You can set seed to be any number, just avoid zero (or any multiple of Math.PI).
     */
    function random(seed) {
        var x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    function getR360Time(latLngSource, latLngTarget, sourcename, targetname, numberOfRoutes) {
        
        var travelOptions = r360.travelOptions();
        travelOptions.addSource(latLngSource);
        travelOptions.addTarget(latLngTarget);
        travelOptions.setTravelType('car');    
        r360.RouteService.getRoutes(travelOptions, function(routes) {
            
            routes.forEach(function(route, index){

                var seconds = route.getTravelTime();
                var time    = r360.Util.secondsToHoursAndMinutes(route.getTravelTime());
                var dist    = route.getDistance().toFixed(2);
                resultSet[numberOfRoutes].r360time   = seconds;
                resultSet[numberOfRoutes].startname  = sourcename;
                resultSet[numberOfRoutes].targetname = targetname;
                r360.LeafletUtil.fadeIn(map, route, 500, "travelDistance", { color : "#"+((1<<24)*Math.random()|0).toString(16), haloColor : "#ffffff" });
            });
        });
    };

    function getGoogleTime(latLngSource, latLngTarget, sourcename, targetname, numberOfRoutes) {

        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
            origin      : latLngSource.lat + "," +  latLngSource.lng,
            destination : latLngTarget.lat + "," +  latLngTarget.lng,
            travelMode  : google.maps.DirectionsTravelMode.DRIVING,
            unitSystem  : google.maps.UnitSystem.METRIC
        };

        directionsService.route(directionsRequest,
          function(response, status) {
            
            if (status == google.maps.DirectionsStatus.OK) 
                resultSet[numberOfRoutes].googletime = response.routes[0].legs[0].duration.value;
            else
                $("#error").append("Unable to retrieve your route<br />");
            }
        );
    };

    function getBoundingBoxes(boundingBoxes) {

        boundingBoxes.forEach(function(bb){
            bb.randomPoints = getRandomCoordinatesInBoundingBox(bb.box, maxNumberOfRandomPointsPerBox)
        })

        return boundingBoxes;
    }

    function routeR360AndGoogle(sourcelLatLng, targetLatLng, sourcename, targetname, millis, numberOfRoutes){
        
        setTimeout(function(){

            // create an object to save the results in
            resultSet.push({ r360time : 0, googletime : 0, startname: 'null', targetname: 'null' });
            // route r360 and google maps
            getR360Time(sourcelLatLng,   targetLatLng, sourcename, targetname, numberOfRoutes);
            getGoogleTime(sourcelLatLng, targetLatLng, sourcename, targetname, numberOfRoutes);

        }, millis);
    };

    var numberOfRoutes = 0;

    boundingBoxes.forEach(function(sourceBoundingBox, boundingBoxSourceIndex){
        sourceBoundingBox.randomPoints.forEach(function(source, randomPointSourceIndex){

            // add the source to the map
            L.marker(source, {icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'red' })}).addTo(map);
            // routing from nth point of zone to each other nth point of other zones
            getTargetPoints(boundingBoxSourceIndex, randomPointSourceIndex).forEach(function(target){

                routeR360AndGoogle(source, target.coordinate, sourceBoundingBox.name, target.name, numberOfRoutes * 1000, numberOfRoutes);
                numberOfRoutes++;
            });
        });
    });

    function getTargetPoints(boundingBoxSourceIndex, randomPointSourceIndex){

        var targets = [];

        boundingBoxes.forEach(function(targetBoundingBox, boundingBoxTargetIndex){
            targetBoundingBox.randomPoints.forEach(function(targetRandomPoint, randomPointTargetIndex){

                // we dont want to route where src == target
                if ( boundingBoxSourceIndex != boundingBoxTargetIndex )
                    targets.push({ name : targetBoundingBox.name, coordinate : targetBoundingBox.randomPoints[randomPointSourceIndex]});
            });
        });

        return targets;
    }

    function standardDeviation(values){
      var avg = average(values);
      
      var squareDiffs = values.map(function(value){
        var diff = value - avg;
        var sqrDiff = diff * diff;
        return sqrDiff;
      });
      
      var avgSquareDiff = average(squareDiffs);

      var stdDev = Math.sqrt(avgSquareDiff);
      return stdDev;
    }

    function average(data){
      var sum = data.reduce(function(sum, value){
        return sum + value;
      }, 0);

      var avg = sum / data.length;
      return avg;
    }
    
    setTimeout(function(){

        var totalr360   = 0;
        var totalGoogle = 0;
        var values      = [];
        var fails       = { google : 0, r360 : 0 };

        for ( var i = 0; i < resultSet.length ; i++ ){

            totalr360   += resultSet[i].r360time;
            totalGoogle += resultSet[i].googletime;

            if ( resultSet[i].r360time == 0 ){
                fails.r360++;
                console.log("r360 failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            if ( resultSet[i].googletime == 0 ){
                googleFails++;
                console.log("google failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            var diff    = resultSet[i].googletime - resultSet[i].r360time;
            var percent = (resultSet[i].r360time/resultSet[i].googletime) * 100;
            values.push(percent);
            
            console.log("google time: " + resultSet[i].googletime + "s r360time: " + resultSet[i].r360time  + "s   diff: " + diff + "s   r360 is " + percent.toFixed(1) + "% of Google --- From " + resultSet[i].startname + " To: " + resultSet[i].targetname);
        }

        var totalDiff = totalGoogle - totalr360;
        var totalPercent = (totalr360 / totalGoogle) * 100;

        console.log("Average: " + average(values).toFixed(1) + "% +/- " + standardDeviation(values).toFixed(2) + "%");

        console.log("TotalRoute360: " + totalr360    + " TotalGoogle: " + totalGoogle + " totalDiff " +  totalDiff + " totalPercent " + totalPercent);
        console.log("google failed: " + fails.google + " r360 failed: " + fails.r360);
        console.log("------------PRINTING THOSE WITH AT LEAST 10% DIFFERENCE---------")

        var countMore = 0;
        var countLess = 0;

        for ( var i = 0; i < resultSet.length ; i++ ) {

            if ( resultSet[i].r360time == 0 ) {
                fails.r360++;
                console.log("r360 failed from " + resultSet[i].startname + " to: " + resultSet[i].targetname);
                continue;
            }

            if (resultSet[i].googletime == 0 ) {
                fails.google++;
                console.log("google failed from " + resultSet[i].startname + " to: " + resultSet[i].targetname);
                continue;
            }

            var diff    = resultSet[i].googletime - resultSet[i].r360time;
            var percent = (resultSet[i].r360time/resultSet[i].googletime) * 100

            if ( percent < 90 || percent > 110 ) {

                console.log("google time: " + resultSet[i].googletime + "s   r360time: " + resultSet[i].r360time  + "s   diff: " + diff + "s   r360 is " + percent.toFixed(1) + " of Google --- From " + resultSet[i].startname + " To: " + resultSet[i].targetname);
                
                if ( percent < 90 )
                    countLess++;
                else
                    countMore++;
            }
           
        }
        console.log("---> # of request: " + resultSet.length + " /// 90% < req. < 110%: " + (countLess + countMore) + " /// < 90%: " + countLess + " /// > 110%: " + countMore);

    }, (numberOfRoutes * 1000) + 2500);
});