$(document).ready(function(){

    var latlon = [59.91295532794218, 10.74239730834961];

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView(latlon, 12);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.94c056dc/{z}/{x}/{y}.png', {
        maxZoom: 18, attribution: attribution }).addTo(map);

    var currentRoute;
    var elevationData = [];

    var sourceMarker = '';
    var targetMarker = '';
    var travelType   = '';
    var routeLayer   = L.featureGroup().addTo(map);
    var sourceLayer  = L.featureGroup().addTo(map);
    var rentalLayer  = L.featureGroup().addTo(map);
    var targetLayer  = L.featureGroup().addTo(map);
    var polygonLayer = r360.route360PolygonLayer().addTo(map);

    _.each(rentals, function(rental){

        var redMarker = L.AwesomeMarkers.icon({
            // icon: 'fa fa-bicycle',
            icon: 'bicycle',
            prefix : 'fa',
            markerColor: 'cadetblue'
        });

        // L.marker([rental.lat, rental.lng], {icon: redMarker}).addTo(rentalLayer);
    });

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl = 'http://dev.route360.net/api_norway_dev/';
    r360.config.serviceUrl = 'http://dev.route360.net/api_norway/';
    // r360.config.serviceUrl = 'http://localhost:8080/api/';
    
    // define which options the user is going to have
    var options = { bike : true, walk : true, init : 'bike' };
    var sourceAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select source!', reset : true, reverse : true  , image : 'images/marker-icon-red.png', options : options});
    var targetAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select target!', reset : true, reverse : false , image : 'images/marker-icon.png'});

    // add the controls to the map
    map.addControl(sourceAutoComplete);
    map.addControl(targetAutoComplete);
    map.addControl(L.control.zoom({ position : 'bottomleft' }));

    var travelTimeControl       = r360.travelTimeControl({
        travelTimes     : [
            { time : 300  , color : "#006837"},
            { time : 600  , color : "#39B54A"},
            { time : 900  , color : "#8CC63F"},
            { time : 1200 , color : "#F7931E"},
            { time : 1500 , color : "#F15A24"},
            { time : 1800 , color : "#C1272D"}
        ],
        position : 'topright', // this is the position in the map
        label: 'Travel time: ', // the label, customize for i18n
        initValue: 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    // create a new readio button control with the given options
    var travelTypeButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events 
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> slow', key: 'slow',     
              tooltip: 'Cycling speed is on average 12km/h', checked : false },

            { label: '<span class=""></span> medium', key: 'medium',     
              tooltip: 'Cycling speed is on average 17km/h', checked : true  },

            { label: '<span class=""></span> fast', key: 'fast',      
              tooltip: 'Cycling speed is on average 27km/h', checked : false }
        ]
    });

    // what happens if action is performed
    travelTypeButtons.onChange(function(){ getPolygons(); });
    travelTimeControl.onSlideStop(function(){ getPolygons(); });
    
    // add to map
    map.addControl(travelTimeControl);
    map.addControl(travelTypeButtons);

    // define what happens if someone clicks an item in the autocomplete
    sourceAutoComplete.onSelect(function(item){

        sourceLayer.clearLayers();
        sourceMarker = L.marker(item.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'home', prefix : 'fa', markerColor: 'red' })}).addTo(sourceLayer);

        // we need to update some stuff on the 'dragend' action of the marker
        sourceMarker.on('dragend', function(){

            getPolygons();

            // update the street in the autocomplete
            r360.Util.getAddressByCoordinates(sourceMarker.getLatLng(), 'de', function(json){
                
                var displayName = r360.Util.formatReverseGeocoding(json);
                sourceAutoComplete.setFieldValue(displayName);
                sourceMarker.bindPopup(displayName);
            });

            if ( targetMarker !== '' ) getRoutes();
        });

        // and show the polygons for the new source
        sourceMarker.bindPopup(item.firstRow);
        getPolygons();
    });

    // define what happens if someone clicks the reset button
    sourceAutoComplete.onReset(function(){

        // remove the polygons and the marker
        polygonLayer.clearLayers();
        routeLayer.clearLayers();
        targetLayer.clearLayers();
        sourceLayer.clearLayers();
        
        // remove the label and value from the autocomplete
        sourceAutoComplete.reset();
    });

    sourceAutoComplete.onTravelTypeChange(function(){

        console.log('travelTypeChange');
        console.log(sourceAutoComplete.getValue());

        // we can only show polygons if a place was already defined
        if ( typeof sourceAutoComplete.getValue() !== 'undefined' && Object.keys(sourceAutoComplete.getValue()).length !== 0 ) {

            getPolygons();

            if ( targetMarker !== '' ) {


                console.log(targetMarker);
                getRoutes();
            }
        }
    });

    // define what happens if someone clicks an item in the autocomplete
    targetAutoComplete.onSelect(function(item){

        // add a marker to the map
        var targetMarker = L.marker(item.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'home', prefix : 'fa', markerColor: 'red' })}).addTo(targetLayer);

        // we need to update some stuff on the 'dragend' action of the marker
        targetMarker.on('dragend', function(){

            showRoute();

            // update the street in the autocomplete
            r360.Util.getAddressByCoordinates(marker.getLatLng(), 'de', function(json){
                
                var displayName = r360.Util.formatReverseGeocoding(json);
                targetAutoComplete.setFieldValue(displayName);
                targetMarker.bindPopup(displayName);
            });
        });

        // and show the polygons for the new source
        targetMarker.bindPopup(item.firstRow);
        getPolygons();
    });

    // define what happens if someone clicks the reset button
    targetAutoComplete.onReset(function(){

        // remove the polygons and the marker
        routeLayer.clearLayers();
        targetLayer.clearLayers();
        
        // remove the label and value from the autocomplete
        targetAutoComplete.reset();
    });

    map.on('click', function(e){

        if ( sourceMarker == '' ) {

            // add a marker to the map
            sourceMarker = L.marker(e.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'home', prefix : 'fa', markerColor: 'red' })}).addTo(sourceLayer);

            // update the street in the autocomplete
            r360.Util.getAddressByCoordinates(sourceMarker.getLatLng(), 'de', function(json){
                
                var displayName = r360.Util.formatReverseGeocoding(json);
                sourceAutoComplete.setValue({ firstRow : displayName, latlng : sourceMarker.getLatLng(), label : displayName });
                sourceAutoComplete.setFieldValue(displayName);
                sourceMarker.bindPopup(displayName);
            });

            // we need to update some stuff on the 'dragend' action of the marker
            sourceMarker.on('dragend', function(){

                getPolygons();

                // update the street in the autocomplete
                r360.Util.getAddressByCoordinates(sourceMarker.getLatLng(), 'de', function(json){
                    
                    var displayName = r360.Util.formatReverseGeocoding(json);
                    sourceAutoComplete.setFieldValue(displayName);
                    sourceMarker.bindPopup(displayName);
                });

                if ( targetMarker !== '' ) getRoutes();
            });

            getPolygons();
        }
        else {

            routeLayer.clearLayers();
            targetLayer.clearLayers();

            targetMarker = L.marker(e.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })}).addTo(targetLayer);

            // update the street in the autocomplete
            r360.Util.getAddressByCoordinates(targetMarker.getLatLng(), 'de', function(json){
                
                var displayName = r360.Util.formatReverseGeocoding(json);
                targetAutoComplete.setValue({ firstRow : displayName, latlng : targetMarker.getLatLng(), label : displayName });
                targetAutoComplete.setFieldValue(displayName);
                targetMarker.bindPopup(displayName);
            });

            targetMarker.on('dragend', function(){

                getRoutes();

                // update the street in the autocomplete
                r360.Util.getAddressByCoordinates(targetMarker.getLatLng(), 'de', function(json){
                    
                    var displayName = r360.Util.formatReverseGeocoding(json);
                    targetAutoComplete.setValue({ firstRow : displayName, latlng : targetMarker.getLatLng(), label : displayName });
                    targetAutoComplete.setFieldValue(displayName);
                    targetMarker.bindPopup(displayName);
                });
            });

            getRoutes();
        }
    });
    
    function getRoutes(){

        routeLayer.clearLayers();

        var travelOptions = r360.travelOptions();
        travelOptions.addSource(sourceMarker);
        travelOptions.setElevationEnabled(true);
        travelOptions.setTravelType(sourceAutoComplete.getTravelType());
        travelOptions.addTarget(targetMarker);

        // to update target auto complete

        r360.RouteService.getRoutes(travelOptions, function(routes) {
            _.each(routes, function(route){

                currentRoute = route;
                route.fadeIn(routeLayer, 500, "travelDistance");

                targetMarker.bindPopup(L.popup().setContent("\
                    <div style='width: 250px;'>\
                        <div class='row'>\
                            <div class='col-md-4'>\
                                Reisezeit:\
                            </div>\
                            <div class='col-md-4'>\
                                Länge:\
                            </div>\
                            <div class='col-md-4'>\
                                Höhenunterschied:\
                            </div>\
                        </div>\
                        <div class='row'>\
                            <div class='col-md-4'>\
                                " + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + "\
                            </div>\
                            <div class='col-md-4'>\
                                " + currentRoute.getDistance().toFixed(2) + "km\
                            </div>\
                            <div class='col-md-4'>\
                                " + currentRoute.getElevationGain().toFixed(0) + "m\
                            </div>\
                        </div>\
                    </div><br>\
                    <canvas id='elevationChart' width='300' height='200' style='margin-bottom: -50px;'></canvas> \
                    "));

                setTimeout(function() { targetMarker.openPopup(); }, 10);

                map.on('popupopen', function(e){
            
                    elevationData = _.map(currentRoute.getPoints(), function(point){ return point.alt; });

                    var myLineChart = new Chart(document.getElementById("elevationChart").getContext("2d")).Line({
                        labels: _.range(0, elevationData.length),
                        datasets: [
                            {
                                fillColor: "rgba(57, 181, 74, 0.2)",
                                strokeColor: "rgba(57, 181, 74, 0.7)",
                                data: elevationData
                            }
                        ]
                    }, {
                        pointDot : false,
                        scaleShowGridLines: false,
                        showTooltips: false
                    });
                });
            });
        });
    };

    function getPolygons(){

        console.log("getPolygons");

        var travelOptions = r360.travelOptions();
        travelOptions.addSource(sourceMarker);
        travelOptions.setTravelType(sourceAutoComplete.getTravelType());

        if ( sourceAutoComplete.getTravelType() == 'bike' )
            travelOptions.setBikeSpeed(travelTypeButtons.getValue() == 'slow' ? 12 : travelTypeButtons.getValue() == 'medium' ? 17 : travelTypeButtons.getValue() == 'fast' ? 27 : 17);

        if ( sourceAutoComplete.getTravelType() == 'walk' )
            travelOptions.setWalkSpeed(travelTypeButtons.getValue() == 'slow' ? 4 : travelTypeButtons.getValue() == 'medium' ? 5 : travelTypeButtons.getValue() == 'fast' ? 7 : 5);

        travelOptions.setTravelTimes(travelTimeControl.getValues());

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            polygonLayer.clearAndAddLayers(polygons);
        });
    }

    // select language
    $('span[lang="de"]').hide();
});