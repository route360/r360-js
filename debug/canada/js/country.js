$(document).ready(function(){

    // do not change these values
    // this is a predefined travel day 
    var date = '20150813';
    // this is a predefined time of the day = h * 3600 + m * 60 + secs
    var time = '39600';

    var radius = 500;
    var types = [];
    // var types = ['google:food'];
    // var types = ['google:food', 'yelp:restaurants'];
    // var types = [encodeURIComponent('yellow:ATM Machine'), 'google:food', 'yelp:restaurants'];
    var timeout = 10000;

    // all the visible markers are collected in this array
    var source = undefined;

    // timeout after which an error message is shown in milliseconds
    r360.config.requestTimeout = 10000;
    // set the service key
    r360.config.serviceKey     = 'uhWrWpUhyZQy8rPfiC7X';
    // the url of the route360 service
    r360.config.serviceUrl     = 'http://api-us.route360.net/canada/';
    PLACES_API_URL = "http://dev.route360.net/places/places";
    // PLACES_API_URL = "http://localhost:8080/api/places";

    // add the map and set the initial center to paris
    var map = L.map('map', {zoomControl : false, scrollWheelZoom : true}).setView([49.2827, -123.1207], 13);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | Transit Data © <a href='http://opendatasoft.com' target='_blank'>OpenDataSoft</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    var mapStyleId = 'mi.0ad4304c';
    // note that mapbox is a paided service 
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/'+mapStyleId+'/{z}/{x}/{y}.png', { maxZoom: 22, attribution: attribution }).addTo(map);

    // define the travel time slider and 6 five minute intervals 
    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 600 * 1 * 0.5, color : "#006837", opacity : 1.0 },
        { time : 600 * 2 * 0.5, color : "#39B54A", opacity : 1.0 },
        { time : 600 * 3 * 0.5, color : "#8CC63F", opacity : 1.0 },
        { time : 600 * 4 * 0.5, color : "#F7931E", opacity : 1.0 },
        { time : 600 * 5 * 0.5, color : "#F15A24", opacity : 1.0 },
        { time : 600 * 6 * 0.5, color : "#C1272D", opacity : 1.0 }
    ];
    var travelTimeControl = r360.travelTimeControl({
        travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
        position    : 'topright', // this is the position in the map
        label       : 'Travel time', // the label, customize for i18n
        unit        : 'min',
        initValue   : 5 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    // if someone releases the button we query the service again
    travelTimeControl.onSlideStop(getPolygons);
    
    // add to map
    map.addControl(travelTimeControl);

    // creating the checkboxes for the different place types
    var apiSourceButtons = r360.checkboxButtonControl({
        buttons : [
            { label : "Google", key: "google",  checked : false  },
            { label : "Yellow", key: "yellow",  checked : false  },
            { label : "Yelp",   key: "yelp",    checked : false  },
        ],
        position : 'topleft',
        onChange : getPolygons
    });

    var typesButtons = r360.checkboxButtonControl({
        buttons : [
            { label : "ATM Machine", key: "atm",         checked : false  },
            { label : "School",      key: "school",      checked : false  },
            { label : "Supermarket", key: "supermarket", checked : false  },
        ],
        position : 'topleft',
        onChange : getPolygons
    });

    // add a radio element with all the different transport types
    var buttonOptions = {
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events 
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<i class="fa fa-bicycle"></i>', key: 'bike',     
              tooltip: 'Cycling speed is on average 15km/h', checked : false },

            { label: '<i class="fa fa-male"></i>', key: 'walk',     
              tooltip: 'Walking speed is on average 5km/h', checked : true  },

            { label: '<i class="fa fa-car"></i>', key: 'car',      
              tooltip: 'Car speed is limited by speed limit', checked : false },

            { label: '<i class="fa fa-bus"></i>', key: 'transit',  
              tooltip: '', checked : false }
        ]
    };

    // create a new readio button control with the given options
    var travelTypeButtons = r360.radioButtonControl(buttonOptions);
    travelTypeButtons.onChange(getPolygons);

    // adding order is important for visual effect
    map.addControl(apiSourceButtons);
    map.addControl(typesButtons);
    map.addControl(travelTypeButtons);

    // creating one layer for all markers
    var sourceLayer      = L.featureGroup().addTo(map);
    var routeLayer      = L.featureGroup().addTo(map);
    var reachableLayer   = L.featureGroup().addTo(map);
    var unreachableLayer = L.featureGroup().addTo(map);

    var overlayMaps = {
        "Reachable": reachableLayer,
        "Unreachable": unreachableLayer
    };

    L.control.layers(null, overlayMaps).addTo(map);

    // and one layer for the polygons
    var polygonLayer          = r360.leafletPolygonLayer({inverse : false}).addTo(map);

    // add the controls to the map
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);
    map.addControl(L.control.zoom({ position : 'bottomright' }));

    $('span[lang="de"]').hide();
    $('span[lang="no"]').hide();

    // ==================================================================================================================================
    // ----------------------------------------------------------------------------------------------------------------------------------
    // 
    //                                              END OF INITIALIZE
    // 
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ==================================================================================================================================

    map.on('click', function(e){

        if ( typeof source === 'undefined' ) {

            sourceLayer.clearLayers();
            reachableLayer.clearLayers();
            unreachableLayer.clearLayers();

            var latlng = [e.latlng.lat, e.latlng.lng];

            source = L.marker(latlng, { draggable : true , icon: L.AwesomeMarkers.icon({ icon: 'fa fa-home', prefix : 'fa', markerColor: 'blue' })})
                .addTo(sourceLayer);

            source.on('dragend', getPolygons)
            getPolygons();
        }
    });

    function getPlaces() {

        reachableLayer.clearLayers();
        unreachableLayer.clearLayers();

        waitControl.updateText("Querying places ...")
        waitControl.show();

        var parameters = [
            "lat="+source.getLatLng().lat,
            "lng="+source.getLatLng().lng,
            "radius="+radius,
            "timeout="+timeout,
            "types=" + types.join("&types=")
        ];

        $.get(PLACES_API_URL+ "?" + parameters.join("&"), function(places){

            waitControl.hide();

            if ( places.length == 0 )
                { alert("No places could be found!"); return; }

            var travelOptions = r360.travelOptions();
            travelOptions.setTravelType(travelTypeButtons.getValue());
            travelOptions.addSource(source);
            travelOptions.setTargets(places);
            travelOptions.setTravelTimes(travelTimeControl.getValues());
            travelOptions.setWaitControl(waitControl);
            travelOptions.setDate(date);
            travelOptions.setTime(time);
            travelOptions.setMaxRoutingTime(_.max(travelTimeControl.getValues()));
            travelOptions.setMinPolygonHoleSize(500000);

            // call the service
            r360.TimeService.getRouteTime(travelOptions, function(sources){

                waitControl.hide();

                // get each target for the first source (only one source was supplied to the service)
                _.each(sources[0].targets, function(target){

                    var place = _.find(places, function(place){ return place.id == target.id ; }); 
                    place.travelTime = target.travelTime;

                    var reachable = place.travelTime > 0 && place.travelTime <= travelOptions.getMaxRoutingTime();
                    var opacity = reachable ? 1 : 0.5;
                    var layer   = reachable ? reachableLayer : unreachableLayer;

                    var marker = L.marker([place.lat, place.lng], { icon: getIcon(place), opacity : opacity }).addTo(layer).bindPopup(getPopup(place));

                    marker.on('click', function(){

                        routeLayer.clearLayers();

                        var travelOptions = r360.travelOptions();
                        travelOptions.setTravelType(travelTypeButtons.getValue());
                        travelOptions.addSource(source);
                        travelOptions.addTarget(marker);
                        travelOptions.setTravelTimes(travelTimeControl.getValues());
                        travelOptions.setWaitControl(waitControl);
                        travelOptions.setDate(date);
                        travelOptions.setTime(time);

                        r360.RouteService.getRoutes(travelOptions, function(routes) {

                            _.each(routes, function(route, index){
                                r360.LeafletUtil.fadeIn(routeLayer, route, 500, "travelDistance", { color : "red", haloColor : "#ffffff" });

                                place.travelTime = route.travelTime;
                                marker.getPopup().setContent(getPopup(place).getContent());
                            });
                        });
                    })
                })
            });
        });
    }

    /**
     * getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map
     */
    function getPolygons(){

        var apiSources    = apiSourceButtons.getValue();
        var selectedTypes = typesButtons.getValue();

        if ( typeof source === 'undefined' && !apiSources.google && !apiSources.yellow && !apiSources.yelp ) {
            noty( { layout : 'bottom', text : "Please select at least one API source!", timeout : 3000 });
        }
        else if ( typeof source === 'undefined' && !selectedTypes.atm && !selectedTypes.school && !selectedTypes.supermarket ) {
            noty( { layout : 'bottom', text : "Please select at least one POI type!", timeout : 3000 });
        }
        else if ( typeof source === 'undefined' ) {
            noty( { layout : 'bottom', text : "Please click on the map to select a source point!", timeout : 3000 });
        }
        else if ( typeof source !== 'undefined' && !apiSources.google && !apiSources.yellow && !apiSources.yelp ) {
            noty( { layout : 'bottom', text : "Please select at least one API source!", timeout : 3000 });
        }
        else if ( typeof source !== 'undefined' && !selectedTypes.atm && !selectedTypes.school && !selectedTypes.supermarket  ) {
            noty( { layout : 'bottom', text : "Please select at least one POI type!", timeout : 3000 });
        }
        else {

            setTypes(apiSources, selectedTypes);

            routeLayer.clearLayers();

            var travelOptions = r360.travelOptions();
            // get the selected travel type
            travelOptions.setTravelType(travelTypeButtons.getValue());
            // set all the places which matched the selected buttons
            travelOptions.addSource(source);
            // get all the travel times from the travel time slider
            travelOptions.setTravelTimes(travelTimeControl.getValues());
            // show the waiting div on the map
            travelOptions.setWaitControl(waitControl);
            // set date and time
            travelOptions.setDate(date);
            travelOptions.setTime(time);
            // square meter of areas that are shown as hole, no need to change
            travelOptions.setMinPolygonHoleSize(500000);

            // call the service
            r360.PolygonService.getTravelTimePolygons(travelOptions, 
                // what should happen if everything works as expected
                function(polygons){

                    // remove the old polygon and add the new one
                    // and zoom as far in as possible (see the whole polygon)
                    polygonLayer.clearAndAddLayers(polygons, true);

                    getPlaces();
                }, 
                // what should happen if something does not work as expected
                function(error) {

                    alert("Sorry... an error occured. Please try again!");
                }
            );
        }
    }

    // google:atm, google:post_office
    // google:school
    // google:grocery_or_supermarket, google:convenience_store
    // 
    // yelp:banks, yelp:postoffices
    // yelp:highschools, yelp:highschools
    // yelp:convenience, (not match for supermarket)
    // 
    // yellow:Bank, yellow:Post Offices
    // yellow:Elementary & High Schools
    // yellow:Grocery Stores, yellow:Convenience Stores
    function setTypes(apis, selectedTypes) {

        types = [];

        if ( apis.google ) {
            if (selectedTypes.atm)         types.push("google:atm");
            if (selectedTypes.school)      types.push("google:school");
            if (selectedTypes.supermarket) types.push("google:grocery_or_supermarket");
        }

        if ( apis.yelp ) {
            if (selectedTypes.atm)         types.push("yelp:banks");
            if (selectedTypes.school)      types.push("yelp:highschools");
            if (selectedTypes.supermarket) types.push("yelp:convenience");
        }

        if ( apis.yellow ) {
            if (selectedTypes.atm)          types.push('yellow:' + encodeURIComponent('ATM Machine'));
            if (selectedTypes.school)       types.push('yellow:' + encodeURIComponent('Elementary & High Schools'));
            if (selectedTypes.supermarket)  types.push('yellow:' + encodeURIComponent('Grocery Stores'));
        }
    }

    function getIcon(place){

        var supermarkerIcon = L.AwesomeMarkers.icon({ icon: 'fa fa-cutlery',     prefix : 'fa', markerColor: 'green' });
        var atmIcon         = L.AwesomeMarkers.icon({ icon: 'fa fa-money',       prefix : 'fa', markerColor: 'red' });
        var schhoolIcon     = L.AwesomeMarkers.icon({ icon: 'fa fa-graduation-cap', prefix : 'fa', markerColor: 'orange' });

        if ( place.type == 'google:school' || place.type == 'yelp:highschools' || place.type == 'yellow:Elementary & High Schools' )     
            icon = schhoolIcon;
        else if ( place.type == 'google:atm' || place.type == 'yelp:banks' || place.type == 'yellow:ATM Machine' )        
            icon = atmIcon;
        else if ( place.type == 'google:grocery_or_supermarket' || place.type == 'yelp:convenience' || place.type == 'yellow:Grocery Stores') 
            icon = supermarkerIcon;

        return icon;
    }

    function getPopup(place){

        if ( place.matchedPlaces.length == 0 ) place.matchedPlaces.push(place);

        var sources = '';
        place.matchedPlaces.forEach(function(place){  

            if ( place.source == 'yellow' )
                sources += '<img class="yellow-logo logo" src="images/yellow.png"><br/>' + (place.matchedPlaces.length == 1 ? '' : place.name) + '<br/>';
            if ( place.source == 'google' )
                sources += '<img class="google-logo" src="images/google.png"><br/>' + (place.matchedPlaces.length == 1 ? '' : place.name) + '<br/>';
            if ( place.source == 'yelp' ) 
                sources += '<img class="yelp-logo" src="images/yelp.png"><br/>' + (place.matchedPlaces.length == 1 ? '' : place.name) + '<br/>';
        });

        var popup = L.popup().setContent('<h4>'+place.name+'</h4>\
                <p><i class="fa fa-clock-o"></i> Travel time: '+ r360.Util.secondsToHoursAndMinutes(place.travelTime) +'</p> \
                <p>Source: <br/>'+ sources +'</p>')

        return popup;
    }
});








