$(document).ready(function(){

    var latlon = [59.91295532794218, 10.74239730834961];

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView(latlon, 12);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    var _0e455ea3 = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0e455ea3/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution });
    var _0ad4304c = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution });
    _0e455ea3.addTo(map);

    var currentRoute;
    var elevationData = [];

    var elevationColors = [{
        label : "fast",  fillColor : "#006837", fillColorOpacity : 0.1, strokeColor : "#006837", strokeColorOpacity  : 0.7 },{
        label : "short", fillColor : "#F7931E", fillColorOpacity : 0.1, strokeColor : "#F7931E", strokeColorOpacity  : 0.7 },{
        label : "hilly", fillColor : "#C1272D", fillColorOpacity : 0.1, strokeColor : "#C1272D", strokeColorOpacity  : 0.7
    }];

    var sourceMarker = '';
    var targetMarker = '';
    var travelType   = '';
    var routeLayer   = L.featureGroup().addTo(map);
    var sourceLayer  = L.featureGroup().addTo(map);
    var rentalLayer  = L.featureGroup().addTo(map);
    var targetLayer  = L.featureGroup().addTo(map);
    var polygonLayer = r360.route360PolygonLayer().addTo(map);

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.i18n.language   = 'en';
    r360.config.serviceKey      = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl      = 'http://api.route360.net/api_norway_0.0.3/';
    // r360.config.serviceUrl      = 'http://localhost:8080/api/';
    
    // define which options the user is going to have
    var options = { bike : true, walk : true, ebike: true, rentbike: true, rentandreturnbike : true, init : 'bike' };
    var sourceAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select source!', reset : true, reverse : false , image : 'images/source.png', options : options});
    var targetAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select target!', reset : true, reverse : true  , image : 'images/target.png'});

    // add the controls to the map
    map.addControl(sourceAutoComplete);
    map.addControl(targetAutoComplete);
    map.addControl(L.control.zoom({ position : 'bottomleft' }));
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);

    $('span[lang="de"]').hide();
    var rentalsLayer = L.layerGroup();

    _.each(rentals, function(station){

        var marker = L.circleMarker([station.lat, station.lng], { 
                    color:          "white", 
                    fillColor:      "#FF4D4F", 
                    fillOpacity:    0.7, 
                    opacity:        1, 
                    stroke:         true, 
                    weight:         3, 
                    radius:         6 
                }).addTo(rentalsLayer);

         marker.bindPopup("<b>" + station.description + "!</b>");
    })

    map.addControl(L.control.layers({ "Nature": _0e455ea3, "Monochrom": _0ad4304c }, { "Bike Rental Stations" : rentalsLayer }, { position : 'bottomright' }));
    var travelTimeControl, travelWattControl, bikeSpeedButtons, rentbikeSpeedButtons, supportLevelButtons, walkSpeedButtons;

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

        // create source marker and make a polygon request
        if ( sourceMarker == '' ) {

            sourceMarker = createMarker(e.latlng, 'home', 'red', sourceLayer, updateSource);
            updateSource();
        }
        // create a target marker and get the routes for the target
        else {

            targetLayer.clearLayers();
            targetMarker = createMarker(e.latlng, 'flag-checkered', 'green', targetLayer, updateTarget);
            updateTarget();
        }
    });

    // if someone clicks a place from the dropdown, we remove the old source
    // and create a new one and get new polygons
    sourceAutoComplete.onSelect(function(item){

        sourceLayer.clearLayers();
        sourceMarker = createMarker(item.latlng, 'home', 'red', sourceLayer, updateSource, item.firstRow);
        updateSource();
    });

    // on source removal we need to remove the source marker
    // clear the autocomplete and remove the routes
    // the target can stay where it is
    sourceAutoComplete.onReset(function(){

        polygonLayer.clearLayers();
        routeLayer.clearLayers();
        sourceLayer.clearLayers();
        sourceAutoComplete.reset();
        sourceMarker = '';
    });

    // if someone changes the travel type for the source
    // we need to get new polygons and new routes
    sourceAutoComplete.onTravelTypeChange(function(){

        addControls();

        // we can only show polygons if a place was already defined
        if ( typeof sourceAutoComplete.getValue() !== 'undefined' && Object.keys(sourceAutoComplete.getValue()).length !== 0 )
            updateSource()
    });

    // if someone selects a new target we need to get new routes
    // and update the marker to the new location
    targetAutoComplete.onSelect(function(item){
        targetLayer.clearLayers();
        targetMarker = createMarker(item.latlng, 'flag-checkered', 'green', targetLayer, updateTarget, item.firstRow);
        updateTarget();
    });

    // in case we have a defined source and target we need to switch them,
    // get new polygons and create routes for the opposite direction, furthermore 
    // we have to switch the labels in the source and target autocompletes
    targetAutoComplete.onReverse(function(){

        // we have one source and one target
        if ( sourceMarker != '' && targetMarker != '' ) {

            var tempMarker = targetMarker;
            targetMarker = createMarker(sourceMarker.getLatLng(), 'flag-checkered', 'green', targetLayer, updateTarget);
            sourceMarker = createMarker(tempMarker.getLatLng(), 'home', 'red', sourceLayer, updateSource);

            polygonLayer.clearLayers();
            routeLayer.clearLayers();
            targetLayer.clearLayers();
            sourceLayer.clearLayers();

            targetMarker.addTo(targetLayer);
            sourceMarker.addTo(sourceLayer);

            var tempValue = targetAutoComplete.getValue();
            targetAutoComplete.setValue(sourceAutoComplete.getValue());
            sourceAutoComplete.setValue(tempValue);

            var tempDisplayValue = targetAutoComplete.getFieldValue();
            targetAutoComplete.setFieldValue(sourceAutoComplete.getFieldValue());
            sourceAutoComplete.setFieldValue(tempDisplayValue);

            getPolygons();
            getRoutes();
        }
        // only source selected is present, means we switch the source to target (marker and autocomplete)
        // but we can't get new polygons or routes since we don't have a start
        else if ( sourceMarker != '' && targetMarker == '' ) {

            polygonLayer.clearLayers();
            routeLayer.clearLayers();
            targetLayer.clearLayers();
            sourceLayer.clearLayers();
            targetMarker = createMarker(sourceMarker.getLatLng(), 'flag-checkered', 'green', targetLayer, updateTarget);
            sourceMarker = '';
            targetAutoComplete.setValue(sourceAutoComplete.getValue());
            targetAutoComplete.setFieldValue(sourceAutoComplete.getFieldValue());
            sourceAutoComplete.reset();
        }
        // only target selected, means we have to switch the target and source (marker and autocomplete)
        // and we can get new poylgons, but no routes (since we don't have a target) 
        else if ( sourceMarker == '' && targetMarker != '' ) {

            polygonLayer.clearLayers();
            routeLayer.clearLayers();
            targetLayer.clearLayers();
            sourceLayer.clearLayers();
            sourceMarker = createMarker(targetMarker.getLatLng(), 'home', 'red', sourceLayer, updateSource);
            targetMarker = '';
            sourceAutoComplete.setValue(targetAutoComplete.getValue());
            sourceAutoComplete.setFieldValue(targetAutoComplete.getFieldValue());
            targetAutoComplete.reset();
        }
        // simply pushing the button when no source and no target is defined should not do anything
        else {}
    });

    // removing the target involves removing the marker and the routes, as well as removing text
    // in the autocomplete
    targetAutoComplete.onReset(function(){

        routeLayer.clearLayers();
        targetLayer.clearLayers();
        targetAutoComplete.reset();
        targetMarker = '';
    });

    /**
     * [updateAutocomplete Updates the label and latlng value of an autocomplete component, by a reverse geocoding request to nominatim.]
     * @param  {[type]} autoComplete [the autocomplete to update]
     * @param  {[type]} marker       [the marker from which the latlng object get's reverse geocoded.]
     */
    function updateAutocomplete(autoComplete, marker){

        // update the street in the autocomplete
        r360.Util.getAddressByCoordinates(marker.getLatLng(), 'de', function(json){
            
            var displayName = r360.Util.formatReverseGeocoding(json);
            autoComplete.setValue({ firstRow : displayName, latlng : marker.getLatLng(), label : displayName });
            autoComplete.setFieldValue(displayName);
            marker.bindPopup(displayName);
        });
    }

    // ==================================================================================================================================
    // ----------------------------------------------------------------------------------------------------------------------------------
    // 
    //                                              END OF AUTOCOMPLETE STUFF
    // 
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ==================================================================================================================================

    /**
     * [updateSource This method updates the polygons, and performs a reverse geocoding for the update of the
     * autoComplete and get's new routes if a target is defined.]
     */
    function updateSource() {

        getPolygons();
        updateAutocomplete(sourceAutoComplete, sourceMarker);
        if ( targetMarker !== '' ) getRoutes();
    }

    /**
     * [updateTarget This method gets new routes and updates the target autocomplete with a reverse geocoding.]
     * @return {[type]} [description]
     */
    function updateTarget() {

        getRoutes();
        updateAutocomplete(targetAutoComplete, targetMarker);
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
    function createMarker(latLng, icon, color, layer, dragend, popup){

        var marker = L.marker(latLng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: icon, prefix : 'fa', markerColor: color })}).addTo(layer);
        if ( typeof popup != 'undefined') marker.bindPopup(popup);
        marker.on('dragend', dragend);

        return marker;
    }

    /**
     * [getRoutes This method performs a request to the r360 webservice for the configured source and target with the specified travel options.
     * The returned data from the service is then used to paint the routes on the map and to create a pretty popup with elevation data in the 
     * leaflet marker popup.]
     */
    function getRoutes(){

        //route needs to have both source and target
        if(sourceMarker == '' || targetMarker == '')
            return;

        routeLayer.clearLayers();

        var travelOptions = r360.travelOptions();
        travelOptions.addSource(sourceMarker);
        travelOptions.setElevationEnabled(true);
        travelOptions.setTravelType(sourceAutoComplete.getTravelType());
        travelOptions.setWaitControl(waitControl);
        travelOptions.addTarget(targetMarker);
        setTravelingSpeeds(travelOptions);

        r360.RouteService.getRoutes(travelOptions, function(routes) {

            var data         = [];
            var longestLabel = [];
            var html        = 
                '<table class="table table-striped"> \
                    <thead>\
                        <tr>\
                          <th>Travel time</th>\
                          <th>Distance</th>\
                          <th>Elevation difference</th>\
                        </tr>\
                    </thead>';

            _.each(routes, function(route, index){

                currentRoute = route;
                route.fadeIn(routeLayer, 500, "travelDistance", { colorr : elevationColors[index].strokeColor, haloColor : "#ffffff" });

                html +=
                    '<tr style="margin-top:5px;">\
                        <td style="vertical-align: middle;">' + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + '</td>\
                        <td style="vertical-align: middle;">' + currentRoute.getDistance().toFixed(2) + ' km</td>\
                        <td style="vertical-align: middle;">' + currentRoute.getTotalElevationDifference() + 'm<br> <i class="fa fa-arrow-up" style="color:#C1272D;">' + currentRoute.getUphillElevation() + 'm</i> <i class="fa fa-arrow-down" style="color:#006837;">' + currentRoute.getDownhillElevation() + 'm</i></td>\
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

            html += 
                '</table>\
                <canvas id="elevationChart" width="400" height="200"></canvas>';

            targetMarker.bindPopup(html);
            targetMarker.openPopup();
            targetMarker.html = html;
            targetMarker.data = data;
            targetMarker.longestLabel = longestLabel;

            targetMarker.on('click' , function(){

                targetMarker.bindPopup(targetMarker.html).openPopup();

                new Chart(document.getElementById("elevationChart").getContext("2d")).Line({
                    labels: targetMarker.longestLabel,
                    datasets: targetMarker.data
                }, { pointDot : false, scaleShowGridLines: false, showXLabels : 10, showTooltips: false });
            });

            new Chart(document.getElementById("elevationChart").getContext("2d")).Line({
                labels: longestLabel,
                datasets: data
            }, { pointDot : false, scaleShowGridLines: false, showXLabels : 10, showTooltips: false });

            $('.routeModus0').css('background-color', "rgba(" + hexToRgb(elevationColors[0].fillColor).join(', ') + ", " +  elevationColors[0].fillColorOpacity + ")");
            $('.routeModus0').css('border', "1px solid rgba(" + hexToRgb(elevationColors[0].strokeColor).join(', ') + ", " +  elevationColors[0].strokeColorOpacity + ")");
        },
        function(code, message){ showErrorMessage(code, message); });
    };

    showErrorMessage = function(code, message, timeout) {

        var errorMessage = "";

        switch(code) {
            case 'service-not-available':
                errorMessage = message;
                break;
            case 'no-route-found':
                errorMessage = "Your destination point is not reachable from the given source.";
                break;
            case 'travel-time-exceeded':
                errorMessage = "The travel time to the given target exceeds the maximal travel time!";
                break;
            case 'wrong-configuration':
                errorMessage = "There was an error with the service configuration!";
                break;
            case 'could-not-connect-point-to-network':
                errorMessage = "Your destination point is not connectable to the main network.";
                break;
            default: 
                errorMessage = "There was an error with your request. Please try again.";
        }

        var n = noty({
            text: errorMessage,
            type: 'error',
            theme: 'bootstrapTheme',
            timeout : typeof timeout !== 'undefined' ? timeout : 3500,
            animation: {
                open: 'animated zoomIn', // Animate.css class names
                close: 'animated zoomOut', // Animate.css class names
                easing: 'swing', // unavailable - no need
                speed: 500 // unavailable - no need
            }
        });
    };

    /**
     * [setTravelingSpeeds This method is a helper method used to set different travel speeds and penalties for the choosen travel speeds.]
     * @param {[type]} travelOptions [the travel option object used to pass to the webservice]
     * @param {[type]} travelSpeed   [the travel speed setting, one of: 'slow', 'medium' or 'fast']
     */
    function setTravelingSpeeds(travelOptions){

        var travelSpeed;
        if ( sourceAutoComplete.getTravelType() == 'bike' )              travelSpeed = bikeSpeedButtons.getValue();
        if ( sourceAutoComplete.getTravelType() == 'rentbike' )          travelSpeed = rentbikeSpeedButtons.getValue();
        if ( sourceAutoComplete.getTravelType() == 'walk' )              travelSpeed = walkSpeedButtons.getValue();
        if ( sourceAutoComplete.getTravelType() == 'rentandreturnbike' ) travelSpeed = rentAndReturnBikeSpeedButtons.getValue();

        if ( travelSpeed == 'slow' ) {

            travelOptions.setBikeUphill(40);
            travelOptions.setBikeDownhill(-20);
            travelOptions.setBikeSpeed(12);
            travelOptions.setWalkSpeed(4);
            travelOptions.setWalkUphill(12);
            travelOptions.setWalkDownhill(0);
        }

        if ( travelSpeed == 'medium' ) {

            travelOptions.setBikeSpeed(20);
            travelOptions.setBikeUphill(40);
            travelOptions.setBikeDownhill(-20);
            travelOptions.setWalkSpeed(5);
            travelOptions.setWalkUphill(10);
            travelOptions.setWalkDownhill(0);  
        }

        if ( travelSpeed == 'fast' ) {
            
            travelOptions.setBikeSpeed(27);
            travelOptions.setBikeUphill(40);
            travelOptions.setBikeDownhill(-20);
            travelOptions.setWalkSpeed(6);
            travelOptions.setWalkUphill(8);
            travelOptions.setWalkDownhill(0);
        }
    }

    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {[type]} [description]
     */
    function getPolygons(){

        // polygon needs source
        if(sourceMarker == '')
            return;

        var travelOptions = r360.travelOptions();
        travelOptions.addSource(sourceMarker);
        travelOptions.setTravelType(sourceAutoComplete.getTravelType());
        travelOptions.setWaitControl(waitControl);

        if ( sourceAutoComplete.getTravelType() == 'bike' ) {

            travelOptions.setTravelTimes(travelTimeControl.getValues());
            setTravelingSpeeds(travelOptions);    
        }
        if ( sourceAutoComplete.getTravelType() == 'walk' ) {

            travelOptions.setTravelTimes(travelTimeControl.getValues());
            setTravelingSpeeds(travelOptions);    
        }
        if ( sourceAutoComplete.getTravelType() == 'ebike' ) {

            travelOptions.setRenderWatts(true);
            travelOptions.setSupportWatts(supportLevelButtons.getValue());
            travelOptions.setTravelTimes([travelWattControl.getMaxValue() / 60]);
            travelOptions.setBikeSpeed(20);
            travelOptions.setBikeUphill(10);
            travelOptions.setBikeDownhill(-5);
        }
        if ( sourceAutoComplete.getTravelType() == 'rentbike' ) {

            setTravelingSpeeds(travelOptions);    
            travelOptions.setTravelTimes(travelTimeControl.getValues());
        }
        if ( sourceAutoComplete.getTravelType() == 'rentandreturnbike' ) {

            setTravelingSpeeds(travelOptions);    
            travelOptions.setTravelTimes(travelTimeControl.getValues());
        }
        
        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions,
            function(polygons){
                polygonLayer.setInverse(sourceAutoComplete.getTravelType() == 'ebike' ? true : false);
                polygonLayer.clearAndAddLayers(polygons);
            },
            function(code, message){ showErrorMessage(code, message); }
        );
    }

    function removeControls() {

        if ( typeof travelTimeControl    != 'undefined' ) map.removeControl(travelTimeControl);
        if ( typeof travelWattControl    != 'undefined' ) map.removeControl(travelWattControl);
        if ( typeof bikeSpeedButtons     != 'undefined' ) map.removeControl(bikeSpeedButtons);
        if ( typeof rentbikeSpeedButtons != 'undefined' ) map.removeControl(rentbikeSpeedButtons);
        if ( typeof walkSpeedButtons     != 'undefined' ) map.removeControl(walkSpeedButtons);
        if ( typeof supportLevelButtons  != 'undefined' ) map.removeControl(supportLevelButtons);
        if ( typeof rentAndReturnBikeSpeedButtons  != 'undefined' ) map.removeControl(rentAndReturnBikeSpeedButtons);
    }

    function addControls() {

        removeControls();

        if ( sourceAutoComplete.getTravelType() == 'bike' ) {

            travelTimeControl       = r360.travelTimeControl({
                travelTimes     : [
                    { time : 300  , color : "#006837"}, 
                    { time : 600  , color : "#39B54A"},
                    { time : 900  , color : "#8CC63F"},
                    { time : 1200 , color : "#F7931E"},
                    { time : 1500 , color : "#F15A24"},
                    { time : 1800 , color : "#C1272D"}
                ],
                position : 'topright', label: 'Travel time', unit : 'min', initValue: 30
            });

            bikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: '<span class=""></span> Slow',   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: '<span class=""></span> Medium', key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: '<span class=""></span> Fast',   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
                ]
            });

            travelTimeControl.onSlideStop(getPolygons);
            bikeSpeedButtons.onChange(function(){
                getRoutes(); getPolygons();
            });
         
            map.addControl(travelTimeControl);
            map.addControl(bikeSpeedButtons);
            
            travelWattControl    = undefined;
            supportLevelButtons  = undefined;
            walkSpeedButtons     = undefined;
            rentbikeSpeedButtons = undefined;
            rentAndReturnBikeSpeedButtons = undefined;
        }
        else if ( sourceAutoComplete.getTravelType() == 'walk' ) {

            travelTimeControl       = r360.travelTimeControl({
                travelTimes     : [
                    { time : 300  , color : "#006837"}, 
                    { time : 600  , color : "#39B54A"},
                    { time : 900  , color : "#8CC63F"},
                    { time : 1200 , color : "#F7931E"},
                    { time : 1500 , color : "#F15A24"},
                    { time : 1800 , color : "#C1272D"}
                ],
                position : 'topright', label: 'Travel time', unit : 'min', initValue: 30
            });

            walkSpeedButtons = r360.radioButtonControl({
                buttons : [
                    // each button has a label which is displayed, a key, a tooltip for mouseover events 
                    // and a boolean which indicates if the button is selected by default
                    // labels may contain html
                    { label: '<span class=""></span> Slow', key: 'slow',     
                      tooltip: 'Walking speed: 4km/h', checked : false },

                    { label: '<span class=""></span> Medium', key: 'medium',     
                      tooltip: 'Walking speed: 5km/h', checked : true  },

                    { label: '<span class=""></span> Fast', key: 'fast',      
                      tooltip: 'Walking speed: 6km/h', checked : false }
                ]
            });

            travelTimeControl.onSlideStop(getPolygons);
            walkSpeedButtons.onChange(function(){
                getRoutes(); getPolygons();
            });

            map.addControl(travelTimeControl);
            map.addControl(walkSpeedButtons);
            
            travelWattControl    = undefined;
            supportLevelButtons  = undefined;
            bikeSpeedButtons     = undefined;
            rentbikeSpeedButtons = undefined;
            rentAndReturnBikeSpeedButtons = undefined;
        }
        else if ( sourceAutoComplete.getTravelType() == 'ebike' ) {

            travelWattControl       = r360.travelTimeControl({
                travelTimes     : [
                    { time : 60 * 60 , color : "#006837"}, 
                    { time : 60 * 120  , color : "#39B54A"},
                    { time : 60 * 180  , color : "#8CC63F"},
                    { time : 60 * 240 , color : "#F7931E"},
                    { time : 60 * 300 , color : "#F15A24"},
                    { time : 60 * 360 , color : "#C1272D"}
                ],
                position : 'topright', label: 'Battery capacity', unit : 'Wh', initValue: 180
            });

            supportLevelButtons = r360.radioButtonControl({
                buttons : [
                    { label: '<span class=""></span> Easy',   key: 0,   tooltip: 'Let the e-bike do the work', checked : false },
                    { label: '<span class=""></span> Medium', key: 75,  tooltip: 'Do a little bit of work by yourself', checked : true  },
                    { label: '<span class=""></span> Hard',   key: 150, tooltip: 'Lets save some energy', checked : false }
                ]});

            travelWattControl.onSlideStop(getPolygons);
            supportLevelButtons.onChange(function(){
                getRoutes(); getPolygons();
            });

            map.addControl(travelWattControl);
            map.addControl(supportLevelButtons);

            travelTimeControl    = undefined;
            bikeSpeedButtons     = undefined;
            walkSpeedButtons     = undefined;
            rentbikeSpeedButtons = undefined;
            rentAndReturnBikeSpeedButtons = undefined;
        }
        else if ( sourceAutoComplete.getTravelType() == 'rentbike' ) {

            travelTimeControl       = r360.travelTimeControl({
                travelTimes     : [
                    { time : 300  , color : "#006837"}, 
                    { time : 600  , color : "#39B54A"},
                    { time : 900  , color : "#8CC63F"},
                    { time : 1200 , color : "#F7931E"},
                    { time : 1500 , color : "#F15A24"},
                    { time : 1800 , color : "#C1272D"}
                ],
                position : 'topright', label: 'Travel time', unit : 'min', initValue: 30
            });

            rentbikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: '<span class=""></span> Slow',   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: '<span class=""></span> Medium', key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: '<span class=""></span> Fast',   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
                ]});

            travelTimeControl.onSlideStop(getPolygons);
            rentbikeSpeedButtons.onChange(function(){
                getRoutes(); getPolygons();
            });

            map.addControl(travelTimeControl);
            map.addControl(rentbikeSpeedButtons);

            bikeSpeedButtons    = undefined;
            walkSpeedButtons    = undefined;
            supportLevelButtons = undefined;
            travelWattControl   = undefined;
            rentAndReturnBikeSpeedButtons = undefined;
        }
        else if ( sourceAutoComplete.getTravelType() == 'rentandreturnbike' ) {

            travelTimeControl       = r360.travelTimeControl({
                travelTimes     : [
                    { time : 300  , color : "#006837"}, 
                    { time : 600  , color : "#39B54A"},
                    { time : 900  , color : "#8CC63F"},
                    { time : 1200 , color : "#F7931E"},
                    { time : 1500 , color : "#F15A24"},
                    { time : 1800 , color : "#C1272D"}
                ],
                position : 'topright', label: 'Travel time', unit : 'min', initValue: 30
            });

            rentAndReturnBikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: '<span class=""></span> Slow',   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: '<span class=""></span> Medium', key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: '<span class=""></span> Fast',   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
                ]});

            travelTimeControl.onSlideStop(getPolygons);
            rentAndReturnBikeSpeedButtons.onChange(function(){
                getRoutes(); getPolygons();
            });

            map.addControl(travelTimeControl);
            map.addControl(rentAndReturnBikeSpeedButtons);

            bikeSpeedButtons    = undefined;
            walkSpeedButtons    = undefined;
            supportLevelButtons = undefined;
            travelWattControl   = undefined;
            rentbikeSpeedButtons = undefined;
        }
    }

    addControls();

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