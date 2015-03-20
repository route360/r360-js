$(document).ready(function(){

    var latlon = [59.91295532794218, 10.74239730834961];
    // latlon = [60.260935867848005,11.014480590820312];

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    var _0e455ea3 = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0e455ea3/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution });
    var _0ad4304c = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution });

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

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.i18n.language   = 'no';
    r360.config.serviceKey      = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl      = 'http://api.route360.net/api_norway_0.0.3/';
    r360.config.serviceUrl      = 'http://localhost:8080/api/';
    
    // define which options the user is going to have
    var options = { bike : true, walk : true, ebike: true, rentbike: false, rentandreturnbike : true, init : 'bike' };
    var sourceAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select source!', reset : true, reverse : false , showOnStartup : true, image : 'images/source.png', options : options});
    var targetAutoComplete = r360.placeAutoCompleteControl({ country : "Norge", placeholder : 'Select target!', reset : true, reverse : true  , image : 'images/target.png'});
    // sourceAutoComplete.toggleOptions();

    var rentalsLayer            = L.layerGroup();
    var museumsLayer            = L.layerGroup();
    var unreachableTargetLayer  = L.layerGroup();
    var polygonLayer            = r360.route360PolygonLayer();

    var baseLayers = { "Nature": _0e455ea3, "Monochrom": _0ad4304c } ;
    var overlays   = { //"<span lang='de'>Fahrradleihstationen</span><span lang='en'>Bike Rental Stations</span><span lang='no'>TODO TRANSLATION</span>" : rentalsLayer, 
                       // "<span lang='de'>Museen</span><span lang='en'>Museums</span><span lang='no'>TODO TRANSLATION</span>" : museumsLayer,
                       "<span lang='de'>Nicht erreichbare Ziele</span><span lang='en'>Unreachable targets</span><span lang='no'>TODO TRANSLATION</span>" : unreachableTargetLayer,
                       "<span lang='de'>Reisezeitpolygone</span><span lang='en'>Travel time polygons</span><span lang='no'>TODO TRANSLATION</span>" : polygonLayer };

    // add the map and set the initial center to berlin
    var map                 = L.map('map', {zoomControl : false, layers : [_0e455ea3, polygonLayer]}).setView(latlon, 12);
    var routeLayer          = L.featureGroup().addTo(map);
    var rentalLayer         = L.featureGroup().addTo(map);
    var targetClickLayer    = L.featureGroup().addTo(map);
    var targetEntityLayer   = L.featureGroup().addTo(map);
    var sourceLayer         = L.featureGroup().addTo(map);

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

         marker.bindPopup("<b>" + station.description + "</b>");
    });

    var poiTypeButtons = r360.checkboxButtonControl({
            buttons : [
                { icon: '<i class="fa fa-university"></i>', label : r360.config.i18n.getSpan('museum'),         key: "tourism='museum'",        checked : true },
                { icon: '<i class="fa fa-tint"></i>',       label : r360.config.i18n.getSpan('swimming_pool'),  key: "leisure='swimming_pool'", checked : false },
                { icon: '<i class="fa fa-cutlery"></i>',    label : r360.config.i18n.getSpan('restaurant'),     key: "amenity='restaurant'",    checked : false  }
            ],
            position : 'bottomleft',
            onChange : getPolygons
        });
    
    var languageButtons = r360.radioButtonControl({
            buttons : [
                { label: '<img src="images/us.png"></div> en', key: 'en', tooltip: 'English', checked : false },
                { label: '<img src="images/no.png"></div> no', key: 'no', tooltip: 'Norsk',   checked : true },
                { label: '<img src="images/de.png"></div> de', key: 'de', tooltip: 'Deutsch', checked : false  }
            ],
            position : 'bottomleft',
            onChange : switchLanguage
        });

    // add the controls to the map
    map.addControl(sourceAutoComplete);
    map.addControl(targetAutoComplete);
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);
    map.addControl(poiTypeButtons);
    map.addControl(languageButtons);
    switchLanguage(r360.config.i18n.language);

    map.addControl(L.control.layers(baseLayers, overlays, { position : 'bottomright' }));
    map.addControl(L.control.zoom({ position : 'bottomright' }));
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

            targetClickLayer.clearLayers();
            targetMarker = createMarker(e.latlng, 'flag-checkered', 'green', targetClickLayer, updateTarget);
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
        targetClickLayer.clearLayers();
        targetMarker = createMarker(item.latlng, 'flag-checkered', 'green', targetClickLayer, updateTarget, item.firstRow);
        updateTarget();
    });

    // in case we have a defined source and target we need to switch them,
    // get new polygons and create routes for the opposite direction, furthermore 
    // we have to switch the labels in the source and target autocompletes
    targetAutoComplete.onReverse(function(){

        // we have one source and one target
        if ( sourceMarker != '' && targetMarker != '' ) {

            var tempMarker = targetMarker;
            targetMarker = createMarker(sourceMarker.getLatLng(), 'flag-checkered', 'green', targetClickLayer, updateTarget);
            sourceMarker = createMarker(tempMarker.getLatLng(), 'home', 'red', sourceLayer, updateSource);

            polygonLayer.clearLayers();
            routeLayer.clearLayers();
            targetClickLayer.clearLayers();
            sourceLayer.clearLayers();

            targetMarker.addTo(targetClickLayer);
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
            targetClickLayer.clearLayers();
            sourceLayer.clearLayers();
            targetMarker = createMarker(sourceMarker.getLatLng(), 'flag-checkered', 'green', targetClickLayer, updateTarget);
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
            targetClickLayer.clearLayers();
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
        targetClickLayer.clearLayers();
        targetAutoComplete.reset();
        targetMarker = '';
    });

    /**
     * [updateAutocomplete Updates the label and latlng value of an autocomplete component, by a reverse geocoding request to nominatim.]
     * @param  {[type]} autoComplete [the autocomplete to update]
     * @param  {[type]} marker       [the marker from which the latlng object get's reverse geocoded.]
     */
    function updateAutocomplete(autoComplete, marker){

        marker.name = 'undefined';

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
    function updateTarget(event) {

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

        var marker = L.marker(latLng, { draggable : true, riseOnHover :  icon == 'home', icon: L.AwesomeMarkers.icon({ icon: icon, prefix : 'fa', markerColor: color })}).addTo(layer);
        if ( typeof popup != 'undefined') marker.bindPopup(popup);
        marker.on('dragend', dragend);

        return marker;
    }

    /**
     * [getRoutes This method performs a request to the r360 webservice for the configured source and target with the specified travel options.
     * The returned data from the service is then used to paint the routes on the map and to create a pretty popup with elevation data in the 
     * leaflet marker popup.]
     */
    function getRoutes(target, event){

        if ( typeof target !== 'undefined') targetMarker = target;

        //route needs to have both source and target
        if (sourceMarker == '' || targetMarker == '')
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
            var name         = (targetMarker.name !== 'undefined' ? "<h4 class='text-center' id='target-name'>"+targetMarker.name+"</h4>" : "");
            var urlName      = (_.has(targetMarker, 'url') && targetMarker.url  !== 'undefined' ? '<a href="'+targetMarker.url+'" target="_blank">' + name + '</a>' : name);
            var html = 
                urlName +
                '<table class="table table-striped"> \
                    <thead>\
                        <tr>\
                          <th>'+ r360.config.i18n.getSpan('travelTime')+'</th>\
                          <th>'+ r360.config.i18n.getSpan('distance')+'</th>\
                          <th>'+ r360.config.i18n.getSpan('elevation')+'</th>\
                        </tr>\
                    </thead>';

            _.each(routes, function(route, index){

                currentRoute = route;
                route.fadeIn(routeLayer, 500, "travelDistance", { color : '#0e4858', haloColor : "#ffffff" });

                html +=
                    '<tr style="margin-top:5px;">\
                        <td style="vertical-align: middle;">' + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + '</td>\
                        <td style="vertical-align: middle;">' + currentRoute.getDistance().toFixed(2) + ' km</td>\
                        <td style="vertical-align: middle;">' + currentRoute.getTotalElevationDifference() + 'm <i class="fa fa-arrow-up" style="color:#C1272D;">' + currentRoute.getUphillElevation() + 'm</i> <i class="fa fa-arrow-down" style="color:#006837;">' + currentRoute.getDownhillElevation() + 'm</i></td>\
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
                <canvas id="elevationChart" width="350" height="150"></canvas>';

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
                switchLanguage();
            });

            new Chart(document.getElementById("elevationChart").getContext("2d")).Line({
                labels: longestLabel,
                datasets: data
            }, { pointDot : false, scaleShowGridLines: false, showXLabels : 10, showTooltips: false });
            switchLanguage();
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
                errorMessage = "<span lang='en'>Your destination point is not reachable from the given source.</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
                break;
            case 'travel-time-exceeded':
                errorMessage = "<span lang='en'>The travel time to the given target exceeds the maximal travel time!</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
                break;
            case 'wrong-configuration':
                errorMessage = "<span lang='en'>There was an error with the service configuration!</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
                break;
            case 'could-not-connect-point-to-network':
                errorMessage = "<span lang='en'>Your destination point is not connectable to the main network.</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
                break;
            case 'no-source-marker':
                errorMessage = "<span lang='en'>Please first select a point on the map or select an entry from the dropdown menu.</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
                break;
            default: 
                errorMessage = "<span lang='en'>There was an error with your request. Please try again.</span><span lang='no'>TODO TRANSLATION</span><span lang='de'>TODO TRANSLATION</span>";
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
            },
            callback : { onShow : switchLanguage }
        });
    };

    showInfoMessage = function(message, timeout) {

        var n = noty({
            text: message,
            type: 'info',
            theme: 'bootstrapTheme',
            timeout : typeof timeout !== 'undefined' ? timeout : 3500,
            animation: {
                open: 'animated zoomIn', // Animate.css class names
                close: 'animated zoomOut', // Animate.css class names
                easing: 'swing', // unavailable - no need
                speed: 500 // unavailable - no need
            },
            callback : { onShow : switchLanguage }
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

    function getIcon(poi) {

        var faIcon = poi.type == "tourism='museum'"        ? 'university'   : 'home';
        var color  = poi.type == "tourism='museum'"        ? 'orange'       : 'black';
        faIcon =     poi.type == "leisure='swimming_pool'" ? 'tint'         : faIcon;
        color  =     poi.type == "leisure='swimming_pool'" ? 'darkblue'     : color;
        faIcon =     poi.type == "amenity='restaurant'"    ? 'cutlery'      : faIcon;
        color  =     poi.type == "amenity='restaurant'"    ? 'purple'       : color;

        return L.marker([poi.lat, poi.lng], { icon : L.AwesomeMarkers.icon({ icon: faIcon, prefix : 'fa', markerColor: color }) });
    }

    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {[type]} [description]
     */
    function getPolygons(){

        // polygon needs source
        if ( sourceMarker == '' ) {

            showErrorMessage('no-source-marker');
            return;
        }

        var travelOptions = r360.travelOptions();
        travelOptions.addSource(sourceMarker);
        travelOptions.setTravelType(sourceAutoComplete.getTravelType());
        travelOptions.setWaitControl(waitControl);
        setTravelingSpeeds(travelOptions);
        
        if ( typeof travelTimeControl !== 'undefined' )
            travelOptions.setTravelTimes(travelTimeControl.getValues());
        
        if ( sourceAutoComplete.getTravelType() == 'ebike' ) {

            travelOptions.setRenderWatts(true);
            travelOptions.setSupportWatts(supportLevelButtons.getValue());
            travelOptions.setTravelTimes([travelWattControl.getMaxValue() / 60]);
            travelOptions.setBikeSpeed(20);
            travelOptions.setBikeUphill(10);
            travelOptions.setBikeDownhill(-5);
        }
        
        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions,
            function(polygons){

                polygonLayer.setInverse(sourceAutoComplete.getTravelType() == 'ebike' ? true : false);
                polygonLayer.clearAndAddLayers(polygons).fitMap();

                targetEntityLayer.clearLayers();
                unreachableTargetLayer.clearLayers();

                var poiTypes = [];
                _.each(_.keys(poiTypeButtons.getValue()), function(key){
                    if ( poiTypeButtons.getValue()[key] == true ) poiTypes.push(key);
                });

                if ( poiTypes.length != 0 ) {

                    r360.OsmService.getPoisInBoundingBox(undefined, poiTypes, waitControl, function(pois){

                        var notInBoundingBox = [];

                        if ( pois.length == 0 ) 
                            showInfoMessage(noPoisInTravelTime());
                        else {

                            _.each(pois, function(poi) { 

                                if ( polygonLayer.getBoundingBox().contains([poi.lat, poi.lng] )  ) 
                                    travelOptions.addTarget({ lat : poi.lat, lng : poi.lng, id : poi.id }); 
                                else 
                                    notInBoundingBox.push(poi);
                                
                            })
                            travelOptions.setMaxRoutingTime(_.max(travelOptions.getTravelTimes()));

                            r360.TimeService.getRouteTime(travelOptions, function(sources){

                                var withinTravelTime = 0;

                                _.each(sources[0].targets, function(target){

                                    var poi = _.find(pois, function(poi){ return poi.id == target.id ; });
                                    poi.travelTime = travelOptions.getRenderWatts() ? target.travelTime / 3600 : target.travelTime;

                                    // the travel time to these pois is shorter then the maximum travel width
                                    if ( poi.travelTime > 0 && poi.travelTime <= travelOptions.getMaxRoutingTime() ) {

                                        var marker = getIcon(poi).addTo(targetEntityLayer);
                                        marker.name = (poi.name ? poi.name : 'undefined');//"<span lang='en'>Name unknown</span><span lang='de'>Name unbekannt</span><span lang='no'>nevne ukjent</span>");


if ( marker.name == 'Astrup Fearnley Museet' )
    console.log(poi.travelTime);

                                        if ( typeof poi.url != 'undefined' )
                                            marker.url  = /^https?:\/\//i.test(poi.url) ? poi.url : "http://" + poi.url;

                                        withinTravelTime++;

                                        marker.on('click mouseovvvvvver', function(){

                                            targetClickLayer.clearLayers();
                                            getRoutes(marker);
                                        });
                                    }
                                    else 
                                        addMarker(poi, unreachableTargetLayer, 0.5);
                                });

                                _.each(notInBoundingBox, function(poi){

                                    addMarker(poi, unreachableTargetLayer, 0.5);
                                });

                                showInfoMessage(xPoisWithInTravelTime(withinTravelTime));
                            })
                        }

                        switchLanguage();
                    }, 
                    function() {

                        showErrorMessage();
                    });
                }
            },
            function(code, message){ showErrorMessage(code, message); }
        );
    };

    function addMarker(poi, layer, opacity) {

        var marker = getIcon(poi).addTo(layer);
        marker.setOpacity(opacity);

        marker.on('click mouseovvvvvver', function(){

            targetClickLayer.clearLayers();
            getRoutes(marker);
        });
    }

    function xPoisWithInTravelTime(numberOfPois){

        return buildHtmlSpan([{ lang : 'de', text : 'Es wurden ' + numberOfPois + ' Sehenswürdigkeiten in der angegebenen Reisezeit gefunden.'}, 
                               { lang : 'en', text : 'There were ' + numberOfPois + ' point of interests found in the given travel time.'},
                               { lang : 'no', text : 'TODO TRANSLATION'}] );   
    }

    function noPoisInTravelTime() {
        return buildHtmlSpan([{ lang : 'de', text : 'Es wurden in der angegebenen Reisezeit leider keine Sehenswürdigkeiten gefunden.'}, 
                               { lang : 'en', text : 'Unfortunately there were no point of interests found in the given travel time.'},
                               { lang : 'no', text : 'TODO TRANSLATION'}] );
    }

    function buildHtmlSpan(strings) {

        var result = "";
        _.each(strings, function(string) {
            result += "<span lang='"+string.lang+"'>"+string.text+"</span>";
        });

        return result;
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

    function switchLanguage() {

        r360.config.i18n.language = languageButtons.getValue();
        $("[lang='de'], [lang='en'], [lang='no']").hide();
        $("[lang='"+languageButtons.getValue()+"']").show();

        sourceAutoComplete.updateI18n(true);
        targetAutoComplete.updateI18n(false);
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
                position : 'topright', label : r360.config.i18n.getSpan('travelTime'), unit : 'min', initValue: 15
            });

            bikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: '<span lang="en">Slow</span><span lang="de">Langsam</span><span lang="no">Sakte</span>',   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: '<span lang="en">Medium</span><span lang="de">Mittel</span><span lang="no">Medium</span>', key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: '<span lang="en">Fast</span><span lang="de">Schnell</span><span lang="no">Raskt</span>',   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
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
                position : 'topright', label : r360.config.i18n.getSpan('travelTime'), unit : 'min', initValue: 15
            });

            walkSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: r360.config.i18n.getSpan('slow'),   key: 'slow',   tooltip: 'Walking speed: 4km/h', checked : false },
                    { label: r360.config.i18n.getSpan('medium'), key: 'medium', tooltip: 'Walking speed: 5km/h', checked : true  },
                    { label: r360.config.i18n.getSpan('fast'),   key: 'fast',   tooltip: 'Walking speed: 6km/h', checked : false }
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
                position : 'topright', label: r360.config.i18n.getSpan('batteryCapacity'), unit : 'Wh', initValue: 180
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
                position : 'topright', label : r360.config.i18n.getSpan('travelTime'), unit : 'min', initValue: 15
            });

            rentbikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: r360.config.i18n.getSpan('slow'),   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: r360.config.i18n.getSpan('medium'), key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: r360.config.i18n.getSpan('fast'),   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
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
                position : 'topright', label : r360.config.i18n.getSpan('travelTime'), unit : 'min', initValue: 15
            });

            rentAndReturnBikeSpeedButtons = r360.radioButtonControl({
                buttons : [
                    { label: r360.config.i18n.getSpan('slow'),   key: 'slow',   tooltip: 'Cycling speed: 12km/h', checked : false },
                    { label: r360.config.i18n.getSpan('medium'), key: 'medium', tooltip: 'Cycling speed: 17km/h', checked : true  },
                    { label: r360.config.i18n.getSpan('fast'),   key: 'fast',   tooltip: 'Cycling speed: 27km/h', checked : false }
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

        switchLanguage();
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