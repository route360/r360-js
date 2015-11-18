$(document).ready(function(){


    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView([49.28438,-123.12035], 12);


    var layer = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});



map.addLayer(layer);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | Transit Data © <a href='http://www.gbrail.info/' target='_blank'>GB Rail</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service mi.0ad4304c
    //var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', {
    //    maxZoom: 22, attribution: attribution }).addTo(map);

    var maxSources = 1;
    var currentRoute;
    var elevationData = [];
    var date = '20151021';
    var time = '28800';

    var elevationColors = [{
        label               : "1",
        fillColor           : "#d43e2a",
        fillColorOpacity    : 0.1,
        strokeColor         : "#d43e2a",
        strokeColorOpacity  : 0.7
    },{
        label               : "2",
        fillColor           : "#f69730",
        fillColorOpacity    : 0.1,
        strokeColor         : "#f69730",
        strokeColorOpacity  : 0.7
    },{
        label               : "3",
        fillColor           : "#38aadd",
        fillColorOpacity    : 0.1,
        strokeColor         : "#38aadd",
        strokeColorOpacity  : 0.7
    }];

    var sourceMarker  = '';
    var targetMarker  = '';
    var travelType    = '';
    var autoCompletes = [];
    var sourceMarkers = _.range(maxSources);
    var routeLayer    = L.featureGroup().addTo(map);
    var sourceLayer   = L.featureGroup().addTo(map);
    var rentalLayer   = L.featureGroup().addTo(map);
    var targetLayer   = L.featureGroup().addTo(map);
    var polygonLayer  = r360.leafletPolygonLayer().addTo(map);


 

     




    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.requestTimeout                              = 5000;
    r360.config.serviceKey                                  = '7LBINW7PEBZEF25L744F';
    r360.config.serviceKey                                  = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl                                  = 'http://dev.route360.net/api_norway/';
    r360.config.serviceUrl                                  = 'http://localhost:8080/api/';
    //r360.config.serviceUrl                                  = 'http://api1-eu.route360.net/denmark/';
    //r360.config.serviceUrl                                  = 'http://dev.route360.net/xxx/';

    //r360.config.serviceUrl                                  = "https://api1-eu.route360.net/norway/";
    r360.config.defaultPlaceAutoCompleteOptions.serviceUrl  = "http://geocode.route360.net/solr/select?"; 
    r360.config.defaultPolygonLayerOptions.inverse          = true;
    r360.config.nominatimUrl                                = 'http://geocode.route360.net/nominatim/';


    r360.config.defaultPolygonLayerOptions.tolerance = 15


    var totalSize = 90; // bei zehn Feldern und zwei Routen
    var resultSet = [totalSize];

     for(var i = 0; i < totalSize; i++){
        resultSet[i] = {r360time: 0, googletime : 0, startname: 'null', targetname: 'null'};
    }
   

   

    getRandomCoordinatesInBoundingBox = function(csv, size){

        var res = csv.split(",");
        var longWest = parseFloat(res[0]);
        var longEast = parseFloat(res[2]);
        var latSouth = parseFloat(res[1]);
        var latNorth = parseFloat(res[3]);    
    
        var longDelta = longEast - longWest;
        var latDelta = latNorth - latSouth;

        var latLngs = [size];



        for(var i = 0; i < size; i++){
            latLngs[i] = new L.latLng(latSouth + latDelta * Math.random(),longWest + longDelta * Math.random());
        }

        return latLngs;
    }


    getR360Time = function(latLngSource, latLngTarget, sourcename, targetname, numberOfRoutes) {
        var travelOptions = r360.travelOptions();
        travelOptions.addSource(latLngSource);
        travelOptions.addTarget(latLngTarget);
        travelOptions.setTravelType('car');    
        r360.RouteService.getRoutes(travelOptions, function(routes) {
        for(var i = 0; i < routes.length; i++){
            var seconds = routes[i].getTravelTime();
            var time = r360.Util.secondsToHoursAndMinutes(routes[i].getTravelTime());
            var dist = routes[i].getDistance().toFixed(2);
            resultSet[numberOfRoutes].r360time = seconds;
            resultSet[numberOfRoutes].startname = sourcename;
            resultSet[numberOfRoutes].targetname = targetname;
            r360.LeafletUtil.fadeIn(routeLayer, routes[i], 500, "travelDistance", { color : "#ff00ff", haloColor : "#ffffff" });

            //console.log("r360time: " + seconds + " FROM: " + sourcename + " TO: " + targetname )
            }
        });
    };

    getGoogleTime = function(latLngSource, latLngTarget, sourcename, targetname, numberOfRoutes) {

        var source = latLngSource.lat + "," +  latLngSource.lng;
        var target = latLngTarget.lat + "," +  latLngTarget.lng;

        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
            origin: source,
            destination: target,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        directionsService.route(directionsRequest,
          function(response, status)
          {
            if (status == google.maps.DirectionsStatus.OK)
            {
                resultSet[numberOfRoutes].googletime = response.routes[0].legs[0].duration.value;
            }
            else
              $("#error").append("Unable to retrieve your route<br />");
        }
        );
    };

    /*
    var abbotsford = "-123.3435,49.0235,-122.135,49.568";    
    var latLngSourcesAbbotsFord     = getRandomCoordinatesInBoundingBox(abbotsford, 100);

    for(var i = 0; i < latLngSourcesAbbotsFord.length; i++){
         L.circleMarker( latLngSourcesAbbotsFord[i]).addTo(map);
    }*/
   


    

   
    

    var abbotsford = "-122.361603,49.019409,-122.24968,49.079713";
    var downtown = "-123.106956,49.214906,-122.995033,49.274973";
    var westvancouver = "-123.182487,49.230154,-123.139572,49.270493";
    var northVancouver = "-123.132362,49.324227,-123.035374,49.342013";
    var surrey = "-122.883196,49.163522,-122.835045,49.204813";
    var langley = "-122.69484,49.101859,-122.646689,49.133318";
    var steveston = "-123.184247,49.135676,-123.136096,49.167114";
    var squamish = "-123.138971,49.734549,-123.115196,49.742731";
    var chilliwack = "-121.972275,49.15544,-121.928329,49.177664";
    var northdelta = "-122.916756,49.135115,-122.87281,49.157348";

  
    var size = 2;

    var latLngSourcesAbbotsFord     = getRandomCoordinatesInBoundingBox(abbotsford, size);
    var latLngTargetsDowntown       = getRandomCoordinatesInBoundingBox(downtown, size);
    var latLngTargetsWestvancouver  = getRandomCoordinatesInBoundingBox(westvancouver, size);
    var latLngTargetsNorthVancouver = getRandomCoordinatesInBoundingBox(northVancouver, size);
    var latLngTargetsSurrey         = getRandomCoordinatesInBoundingBox(surrey, size);
    var latLngTargetsLangley        = getRandomCoordinatesInBoundingBox(langley, size);
    var latLngTargetsSteveston      = getRandomCoordinatesInBoundingBox(steveston, size);
    var latLngTargetsSqamish        = getRandomCoordinatesInBoundingBox(squamish, size);
    var latLngTargetsChilliwack     = getRandomCoordinatesInBoundingBox(chilliwack, size);
    var latLngTargetsNorthdelta     = getRandomCoordinatesInBoundingBox(northdelta, size);

    var coordinateArray = [
        latLngSourcesAbbotsFord,
        latLngTargetsDowntown,
        latLngTargetsWestvancouver,
        latLngTargetsNorthVancouver,
        latLngTargetsSurrey,
        latLngTargetsLangley,
        latLngTargetsSteveston,
        latLngTargetsSqamish,
        latLngTargetsChilliwack,
        latLngTargetsNorthdelta
    ];

    var nameArray = [
        "AbbotsFord",
        "Downtown",
        "Westvancouver",
        "northVancouver",
        "Surrey",
        "Langley",
        "steveston",
        "squamish",
        "chilliwack",
        "northdelta"
    ]

    
    // abbotsfor to downtown

    for(var i = 0; i < size; i++){
        var marker = L.marker(latLngSourcesAbbotsFord[i], {icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'red' })});
        marker.addTo(map);
    }

    function doSetTimeOut(sourcelLatLng, targetLatLng, sourcename, targetname, millis, numberOfRoutes){
        setTimeout(function(){
            getR360Time(sourcelLatLng, targetLatLng, sourcename, targetname, numberOfRoutes);
            getGoogleTime(sourcelLatLng, targetLatLng, sourcename, targetname, numberOfRoutes);
        }, millis);
    };

    var numberOfRoutes = 0;
    // for every zone
    for(var i = 0; i < coordinateArray.length - 1; i++){
        // for every point in zone
        for(var j = 0; j < coordinateArray[i].length; j++){

            var sourcelLatLng = coordinateArray[i][j];
            var marker = L.marker(sourcelLatLng, {icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'red' })});
            marker.addTo(map);
            // routing from nth point of zone to each other nth point of other zones
            for(var k = i + 1; k < coordinateArray.length; k++){
                
                var targetLatLng = coordinateArray[k][j];
                doSetTimeOut(sourcelLatLng, targetLatLng, nameArray[i], nameArray[k], numberOfRoutes * 1000, numberOfRoutes);
                numberOfRoutes++;
            }
        }
    }

    setTimeout(function(){

        var totalr360   = 0;
        var totalGoogle = 0;

        var r360fails = 0;
        var googleFails = 0;

        for(var i = 0; i < resultSet.length; i++){


            totalr360   += resultSet[i].r360time;
            totalGoogle += resultSet[i].googletime;

            if(resultSet[i].r360time == 0){
                r360fails++;
                console.log("r360 failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            if(resultSet[i].googletime == 0){
                googleFails++;
                console.log("google failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            var diff    = resultSet[i].googletime - resultSet[i].r360time;
            var percent = (resultSet[i].r360time/resultSet[i].googletime) * 100
            
            console.log("google time: " + resultSet[i].googletime + " \t r360time: " + resultSet[i].r360time  + " \tdiff: " + diff + " \tr360 is " + percent + " \tof Google \tFrom " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);

        }

      

        var totalDiff = totalGoogle - totalr360;
        var totalPercent = (totalr360 / totalGoogle) * 100;

        console.log("TotalRoute360: " + totalr360 + " TotalGoogle: " + totalGoogle + " totalDiff " +  totalDiff + " totalPercent " + totalPercent);
        console.log("google failed: " + googleFails + " r360 failed: " + r360fails);
        console.log("------------PRINTING THOSE WITH AT LEAST 10% DIFFERENCE---------")

        var countMore = 0;
        var countLess = 0;

          for(var i = 0; i < resultSet.length; i++){


           

            if(resultSet[i].r360time == 0){
                r360fails++;
                console.log("r360 failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            if(resultSet[i].googletime == 0){
                googleFails++;
                console.log("google failed from " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                continue;
            }

            var diff    = resultSet[i].googletime - resultSet[i].r360time;
            var percent = (resultSet[i].r360time/resultSet[i].googletime) * 100

            if(percent < 90 || percent > 110){
                console.log("google time: " + resultSet[i].googletime + " \t r360time: " + resultSet[i].r360time  + " \tdiff: " + diff + " \tr360 is " + percent + " \tof Google \tFrom " + resultSet[i].startname + " \tto: " + resultSet[i].targetname);
                if(percent < 90)
                    countLess++;
                else
                    countMore++;

            }
           
        }
        console.log("-TOTAL AMOUNT: " + resultSet.length + " -----IN TOTAL.." + (countLess + countMore) + " LESS THAN 90%:  " + countLess + "   MORE THAN 110%:   " + countMore);

    }, (numberOfRoutes * 1000) + 2500);

    



/*

    for(var i = 0; i < 5; i++){

        getR360Time(latLngSourcesAbbotsFord, latLngTargetsDowntown, resultSet, i, i);
        getGoogleTime(latLngSourcesAbbotsFord, latLngTargetsDowntown, resultSet, i, i);

    }

        setTimeout(function(){

            for(var i = 5; i < 10; i++){

            getR360Time(latLngTargetsWestvancouver, latLngTargetsNorthVancouver, resultSet, i - 5, i);
            getGoogleTime(latLngTargetsWestvancouver, latLngTargetsNorthVancouver, resultSet, i -5, i);

            }
        },1500);

        setTimeout(function(){

            for(var i = 10; i < 15; i++){
            getR360Time(latLngTargetsSurrey, latLngTargetsLangley, resultSet, i - 10, i);
            getGoogleTime(latLngTargetsSurrey, latLngTargetsLangley, resultSet, i - 10, i);

              }
        }, 3000);

        setTimeout(function(){

               for(var i = 15; i < 20; i++){ 
            getR360Time(latLngTargetsSteveston, latLngTargetsSqamish, resultSet, i -15, i);
            getGoogleTime(latLngTargetsSteveston, latLngTargetsSqamish, resultSet, i -15, i);
        }
        }, 4500);
        
        setTimeout(function(){    
              for(var i = 20; i < 25; i++){
            getR360Time(latLngTargetsChilliwack, latLngTargetsNorthdelta, resultSet, i -20, i);
            getGoogleTime(latLngTargetsChilliwack, latLngTargetsNorthdelta, resultSet, i -20, i);
        }
        }, 6000);
    

    setTimeout(function(){

        var totalr360 = 0;
        var totalGoogle = 0;

        for(var i = 0; i < totalSize; i++){

            if(i == 0)
                console.log("abbotsford to downtown")
            if(i == 5)
                console.log("west vancouver to north vancouver")
            if(i == 10)
                console.log("surrey to langley")
            if(i == 15)
                console.log("steveston to squamish")
            if(i == 24)
                console.log("chilliwack to northdelta")

            if(resultSet[i].r360time == 0){
                console.log("r360 = 0");
                continue;
            }

            if(resultSet[i].googletime == 0){
                console.log("googletime = 0");
                continue;
            }

            totalr360   += resultSet[i].r360time;
            totalGoogle += resultSet[i].googletime;



            var diff    = resultSet[i].googletime - resultSet[i].r360time;
            var percent = (resultSet[i].r360time/resultSet[i].googletime) * 100
            console.log("google time: " + resultSet[i].googletime + " \t r360time: " + resultSet[i].r360time  + " \tdiff: " + diff + " \tr360 is " + percent + " \tof Google");
        }

        var totalDiff = totalGoogle - totalr360;
        var totalPercent = (totalr360 / totalGoogle) * 100;

        console.log("TotalRoute360: " + totalr360 + " TotalGoogle: " + totalGoogle + " totalDiff " +  totalDiff + " totalPercent " + totalPercent);


    }, 8000);



*/
   









/*
    var ll_18thAve = new L.LatLng(49.229689,-122.927012);
    var ll_W14thAve = new L.LatLng(49.260158,-123.190763);
    var ll_7188Kingsway = new L.LatLng(49.218156,-122.955237);
    var ll_6038Kingsway = new L.LatLng( 49.220464,-122.975908);
    var ll_AustinRoad = new L.LatLng(49.251674,-122.896105);
    var ll_Macdonald = new L.LatLng(49.257312,-123.168078);
    var ll_Alma = new L.LatLng(49.263847,-123.186073);
    var ll_Sprott = new L.LatLng(49.250002,-122.970675);

*/


   


    

    




    polygonLayer.setInverse(true);

    var options = { bike : true, walk : true, car : true, transit : true, init : 'biketransit', biketransit : true };

    // define which options the user is going to have
    for ( var i = 0 ; i < maxSources ; i++ ) {

        var addAutoComplete = function(i) {

            var autoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select source!', reset : true, index : i, reverse : false, image : 'images/source'+i+'.png', options : options});

            // // if someone changes the travel type for the source
            // we need to get new polygons and new routes
            autoComplete.onTravelTypeChange(updateSource);

            // if someone clicks a place from the dropdown, we remove the old source
            // and create a new one and get new polygons
            autoComplete.onSelect(function(item){

                sourceLayer.clearLayers();
                createMarker(item.latlng, 'home', item.index == 0 ? 'red' : (item.index == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', item.index);
                updateSource();
            });

            autoComplete.onReset(function(){

                polygonLayer.clearLayers();
                routeLayer.clearLayers();
                autoComplete.reset();
                sourceLayer.removeLayer(sourceMarkers[autoComplete.getIndex()]);
                sourceMarkers[autoComplete.getIndex()] = autoComplete.getIndex();
                updateSource();
            });

            autoCompletes.push(autoComplete);
            map.addControl(autoComplete);
        }

        addAutoComplete(i);
    }

    var targetAutoComplete = r360.placeAutoCompleteControl({ country : "Switzerland", placeholder : 'Select source!', reset : true, reverse : false , image : 'images/target.png' });
    // map.addControl(targetAutoComplete);

    targetAutoComplete.onSelect(function(item){

        targetLayer.clearLayers();

        targetMarker = L.marker(item.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
        if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
        targetMarker.on('dragend', updateTarget);
        targetMarker.addTo(targetLayer);

        updateTarget();
    });

    targetAutoComplete.onReset(function(){

        routeLayer.clearLayers();
        targetLayer.clearLayers();
        targetAutoComplete.reset();
        targetMarker = '';
    });

    // add the controls to the map
    map.addControl(L.control.zoom({ position : 'bottomleft' }));
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);

    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 600 * 1 , color : "#006837", opacity : 1.0 },
        { time : 600 * 2 , color : "#39B54A", opacity : 1.0 },
        { time : 600 * 3 , color : "#8CC63F", opacity : 1.0 },
        { time : 600 * 4 , color : "#F7931E", opacity : 1.0 },
        { time : 600 * 5 , color : "#F15A24", opacity : 1.0 },
        { time : 600 * 6 , color : "#C1272D", opacity : 1.0 }
    ];

    var travelTimeControl       = r360.travelTimeControl({
        travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
        position    : 'topright', // this is the position in the map
        label       : 'Travel time', // the label, customize for i18n
        unit        : 'min',
        initValue   : 20 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    var intersectionButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events 
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> Union', key: 'union', checked : true },
            { label: '<span class=""></span> Intersection', key: 'intersection', checked : false  },
            { label: '<span class=""></span> Average', key: 'average', checked : false }
        ]
    });

    var polygonButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events 
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> Color', key: 'color',   checked : false  },
            { label: '<span class=""></span> B/W',   key: 'inverse', checked : true }
        ]
    });

    function test(){

        var strokeWidths = [];
        for ( var i = 0 ; i < 101 ; i++ ) {
            strokeWidths.push({ time : i * 60, color : "grey" });
        }

        var strokeWidthsControl       = r360.travelTimeControl({
            travelTimes : strokeWidths,
            position    : 'topright', // this is the position in the map
            label       : 'Stroke width', // the label, customize for i18n
            unit        : 'px',
            initValue   : 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
        });

        map.addControl(strokeWidthsControl);
        strokeWidthsControl.onSlideStop(function(){

            r360.config.defaultPolygonLayerOptions.strokeWidth = _.max(strokeWidthsControl.getValues()) / 60;
            updateSource();
        });
    };

    // test();

    // what happens if action is performed
    polygonButtons.onChange(function(){ 

        r360.config.defaultPolygonLayerOptions.inverse = !r360.config.defaultPolygonLayerOptions.inverse;
        polygonLayer.setInverse(r360.config.defaultPolygonLayerOptions.inverse);
        updateSource();
    });
    intersectionButtons.onChange(updateSource);
    travelTimeControl.onSlideStop(updateSource);
    
    // add to map
    map.addControl(travelTimeControl);
    // map.addControl(intersectionButtons);
    map.addControl(polygonButtons);

    $('span[lang="de"]').hide();
    $('span[lang="no"]').hide();

    // ==================================================================================================================================
    // ----------------------------------------------------------------------------------------------------------------------------------
    // 
    //                                              END OF INITIALIZE
    // 
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ==================================================================================================================================

    // the first click on a map creates a source marker
    // the second click creates or relocates the target marker
    map.on('click', function(e){

        var index0 = _.indexOf(sourceMarkers, 0);
        var index1 = _.indexOf(sourceMarkers, 1);
        var index2 = _.indexOf(sourceMarkers, 2);
        var index1 = -1;var index2 = -1;

        // create source marker and make a polygon request
        if (  index0 >= 0 || index1 >= 0 || index2 >= 0 ) {

            var min = _.min(_.without([index0, index1, index2], -1));
            createMarker(e.latlng, 'home',  min == 0 ? 'red' : (min == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', min);
            updateSource();
        }
        // // only so many source markers are allowed
        else {

            targetLayer.clearLayers();

            targetMarker = L.marker(e.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
            if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
            targetMarker.on('dragend', updateTarget);
            targetMarker.addTo(targetLayer);

            updateTarget();
        }
    });

    /**
     * [updateAutocomplete Updates the label and latlng value of an autocomplete component, by a reverse geocoding request to nominatim.]
     * @param  {[type]} autoComplete [the autocomplete to update]
     * @param  {[type]} marker       [the marker from which the latlng object get's reverse geocoded.]
     */
    function updateAutocomplete(){

        for ( var j = 0 ; j < maxSources ; j++ ) {

            if ( typeof sourceMarkers[j] != 'number' ) {

                var sourceMarker        = sourceMarkers[j];
                sourceMarker.travelType = autoCompletes[j].getTravelType();
                sourceMarker.index      = autoCompletes[j].getIndex();

                var update = function(index) {

                    // update the street in the autocomplete
                    r360.Util.getAddressByCoordinates(sourceMarker.getLatLng(), 'de', function(json){

                        var displayName = r360.Util.formatReverseGeocoding(json);
                        autoCompletes[index].setValue({ firstRow : displayName, latlng : sourceMarker.getLatLng(), label : displayName });
                        autoCompletes[index].setFieldValue(displayName);
                        sourceMarker.bindPopup(displayName);
                    });    
                };

                update(autoCompletes[j].getIndex());
            }
        }
    }

    function updateTargetAutocomplete(){

        // update the street in the autocomplete
        r360.Util.getAddressByCoordinates(targetMarker.getLatLng(), 'de', function(json){

            var displayName = r360.Util.formatReverseGeocoding(json);
            targetAutoComplete.setValue({ firstRow : displayName, latlng : targetMarker.getLatLng(), label : displayName });
            targetAutoComplete.setFieldValue(displayName);
            targetMarker.bindPopup(displayName);
        });    
    }

    /**
     * [updateSource This method updates the polygons, and performs a reverse geocoding for the update of the
     * autoComplete and get's new routes if a target is defined.]
     */
    function updateSource() {

        getPolygons();
        updateAutocomplete();
        if ( targetMarker !== '' ) getRoutes();
    }

    /**
     * [updateTarget This method gets new routes and updates the target autocomplete with a reverse geocoding.]
     * @return {[type]} [description]
     */
    function updateTarget() {

        getRoutes();
        updateTargetAutocomplete();
    }

    /**
     * [createMarker Creates a leaflet awesome marker with predefined properties]
     * @param  {[LatLng]} latLng  [the lat/lng location of the marker]
     * @param  {[type]} icon    [the string value of font awesome icon, e.g. 'home' (no 'fa-')]
     * @param  {[type]} color   [the color of the marker, as defined by awesomeMarkers.css]
     * @param  {[type]} layer   [the layer to which to add the marker]
     * @param  {[type]} dragend [the callback function that is called if the marker is draged in the map]
     * @param  {[type]} popup   [the popup to show if someone clicks on the marker]
     * @return {[Marker]}         [the leaflet marker]
     */
    function createMarker(latLng, icon, color, layer, dragend, popup, index){

        var marker = L.marker(latLng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: icon, prefix : 'fa', markerColor: color })});
        if ( typeof popup != 'undefined') marker.bindPopup(popup);
        marker.on('dragend', dragend);

        sourceMarkers[index] = marker;

        for ( var i = 0 ; i < maxSources ; i++ ) 
            if ( typeof sourceMarkers[i] != 'number' )
                sourceMarkers[i].addTo(layer);

        return marker;
    }

    /**
     * [getRoutes This method performs a request to the r360 webservice for the configured source and target with the specified travel options.
     * The returned data from the service is then used to paint the routes on the map and to create a pretty popup with elevation data in the 
     * leaflet marker popup.]
     */
    function getRoutes(){

        routeLayer.clearLayers();

        var travelOptions = r360.travelOptions();
        for ( var i = 0 ; i < maxSources ; i++ ) {
            if ( typeof sourceMarkers[i] != 'number' ) {

                var sourceMarker        = sourceMarkers[i];
                sourceMarker.travelType = autoCompletes[i].getTravelType();
                travelOptions.addSource(sourceMarker);            
            }
        }

        travelOptions.setDate(date);
        travelOptions.setTime(time);
        travelOptions.setElevationEnabled(false);
        travelOptions.setWaitControl(waitControl);
        travelOptions.addTarget(targetMarker);

        r360.RouteService.getRoutes(travelOptions, function(routes) {

            var data         = [];
            var longestLabel = [];
            var html        = 
                '<table class="table table-striped"> \
                    <thead>\
                        <tr>\
                          <th>Source</th>\
                          <th>Travel time</th>\
                          <th>Distance</th>\
                        </tr>\
                    </thead>';

            _.each(routes, function(route, index){

                currentRoute = route;
                r360.LeafletUtil.fadeIn(routeLayer, route, 500, "travelDistance", { color : elevationColors[index].strokeColor, haloColor : "#ffffff" });

                html +=
                    '<tr style="margin-top:5px;">\
                        <td class="routeModus routeModus'+index+'"><img style="height: 25px;" src="images/source'+index+'.png"></td>\
                        <td>' + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + '</td>\
                        <td>' + currentRoute.getDistance().toFixed(2) + ' km / ' + (currentRoute.getDistance() * 0.621371).toFixed(2) +' mi</td>\
                    </tr>'

                var elevations = currentRoute.getElevations();

                if ( elevations.x.length > longestLabel.length) 
                    longestLabel = elevations.x;

                data.push({
                    data        : elevations.y.reverse(),
                    fillColor   : "rgba(" + hexToRgb(elevationColors[index].fillColor).join(', ') + ", " +  elevationColors[index].fillColorOpacity + ")",
                    strokeColor : "rgba(" + hexToRgb(elevationColors[index].strokeColor).join(', ') + ", " +  elevationColors[index].strokeColorOpacity + ")",
                });
            });

            html += '</table>';

            targetMarker.bindPopup(html);
            targetMarker.openPopup();

            $('.routeModus0').css('background-color', "rgba(" + hexToRgb(elevationColors[0].fillColor).join(', ') + ", " +  elevationColors[0].fillColorOpacity + ")");
            $('.routeModus1').css('background-color', "rgba(" + hexToRgb(elevationColors[1].fillColor).join(', ') + ", " +  elevationColors[1].fillColorOpacity + ")");
            $('.routeModus2').css('background-color', "rgba(" + hexToRgb(elevationColors[2].fillColor).join(', ') + ", " +  elevationColors[2].fillColorOpacity + ")");
            $('.routeModus0').css('border', "1px solid rgba(" + hexToRgb(elevationColors[0].strokeColor).join(', ') + ", " +  elevationColors[0].strokeColorOpacity + ")");
            $('.routeModus1').css('border', "1px solid rgba(" + hexToRgb(elevationColors[1].strokeColor).join(', ') + ", " +  elevationColors[1].strokeColorOpacity + ")");
            $('.routeModus2').css('border', "1px solid rgba(" + hexToRgb(elevationColors[2].strokeColor).join(', ') + ", " +  elevationColors[2].strokeColorOpacity + ")");
        }, function(code, message){

            if ( 'travel-time-exceeded' == code ) 
                alert("The travel time to the given target exceeds the server limit.");
            if ( 'could-not-connect-point-to-network' == code ) 
                alert("We could not connect the target point to the network.");
        });
    };

    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {[type]} [description]
     */
    function getPolygons(){

        var index0 = _.indexOf(sourceMarkers, 0);
        var index1 = _.indexOf(sourceMarkers, 1);
        var index2 = _.indexOf(sourceMarkers, 2);

        // create source marker and make a polygon request
        if (  index0 == -1 || index1 == -1 || index2 == -1 ) {

            var travelOptions = r360.travelOptions();

            for ( var i = 0 ; i < maxSources ; i++ ) {
                if ( typeof sourceMarkers[i] != 'number' ) {

                    var sourceMarker        = sourceMarkers[i];
                    sourceMarker.travelType = autoCompletes[i].getTravelType();
                    travelOptions.addSource(sourceMarker);            
                }
            }

            if ( travelOptions.getSources().length > 0 ) {

                travelOptions.setIntersectionMode(intersectionButtons.getValue());
                travelOptions.setTravelTimes(travelTimeControl.getValues());
                travelOptions.setWaitControl(waitControl);
                travelOptions.setElevationEnabled(false);
                //travelOptions.setPolygonSerializer("geojson");
                travelOptions.setDate(date);
                travelOptions.setTime(time);

                var maxTravelTime = _.max(travelTimeControl.getValues());

                if ( maxTravelTime == 1200 || maxTravelTime == 2400 )
                    travelOptions.setMinPolygonHoleSize(10 * 1000 * 1000);
                if ( maxTravelTime == 3600 || maxTravelTime == 4800 )
                    travelOptions.setMinPolygonHoleSize(100 * 1000 * 1000);
                if ( maxTravelTime == 6000 || maxTravelTime == 7200 )
                    travelOptions.setMinPolygonHoleSize(1000 * 1000 * 1000);

                if ( r360.config.defaultPolygonLayerOptions.inverse ) 
                    travelOptions.setTravelTimes([_.max(travelTimeControl.getValues())]);

                // call the service
                r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){

                    polygonLayer.clearAndAddLayers(polygons);
                    polygonLayer.fitMap();
                    
                }, function(error) {

                    alert("Sorry... an error occured. Please try again!");
                });
            }
        }
    }

    /**
     * [hexToRgb This method returns the rgb values of a hex color in form of an array.]
     * @param  {[type]} hex [the color in hex]
     * @return {[type]}     [an array with 3 entries for r, g and b]
     */
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
});