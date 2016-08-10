$(document).ready(function(){

    var city = cities.vancouver;
    var city = cities.paris;
    var city = cities.northamerica;

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView([city.lat, city.lng], 4);
    // attribution to give credit to OSM map data and VBB for public transportation
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | \
        Transit Data © <a href='http://opendatasoft.com/'>Paris</a>, <a href='https://data.toulouse-metropole.fr/'>Toulouse</a>, <a href='http://data.keolis-rennes.com'>Rennes</a>, <a href='http://opendata.cts-strasbourg.fr'>Strasbourg</a> | \
        developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service mi.0ad4304c
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', {
        maxZoom: 22, attribution: attribution }).addTo(map);

    var maxSources = 1;
    var currentRoute;
    var elevationData = [];
    var date = '20150813';
    var time = '39600';

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
    var routeLayer    = L.featureGroup().addTo(map);
    var sourceLayer   = L.featureGroup().addTo(map);
    var rentalLayer   = L.featureGroup().addTo(map);
    var targetLayer   = L.featureGroup().addTo(map);
    var polygonLayer  = r360.leafletPolygonLayer({ extendWidthX: 300, extendWidthY : 300 }).addTo(map);

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.requestTimeout                              = 500000;
    r360.config.serviceKey                                  = city.key;
    r360.config.defaultPlaceAutoCompleteOptions.serviceUrl  = "http://photon.komoot.de/api/";
    polygonLayer.setInverse(false);

    var options = { bike : true, walk : true, car : true, transit : true, init : 'transit' };

    var autoComplete = r360.photonPlaceAutoCompleteControl({ serviceUrl : 'http://photon.komoot.de/api/', placeholder : 'Select source!', reset : true, index : 0, reverse : false, image : 'images/source'+0+'.png', options : options});

    // sourceMarker = createMarker([48.8565056, 2.3521334], 'home', 'red', sourceLayer, updateSource, 'undefined');

    // // if someone changes the travel type for the source
    // we need to get new polygons and new routes
    autoComplete.onTravelTypeChange(updateSource);

    // if someone clicks a place from the dropdown, we remove the old source
    // and create a new one and get new polygons
    autoComplete.onSelect(function(item){

        sourceLayer.clearLayers();
        sourceMarker = createMarker(item.latlng, 'home', item.index == 0 ? 'red' : (item.index == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', item.index);
        updateSource(false);
    });

    autoComplete.onReset(function(){

        polygonLayer.clearLayers();
        routeLayer.clearLayers();
        autoComplete.reset();
        sourceLayer.clearLayers();
        sourceMarker = '';
    });

    map.addControl(autoComplete);

    var targetAutoComplete = r360.photonPlaceAutoCompleteControl({ serviceUrl : 'http://photon.komoot.de/api/', placeholder : 'Select target!', reset : true, reverse : true , image : 'images/target.png' });
    map.addControl(targetAutoComplete);

    targetAutoComplete.onSelect(function(item){

        targetLayer.clearLayers();

        targetMarker = L.marker(item.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
        if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
        targetMarker.on('dragend', updateTarget);
        targetMarker.addTo(targetLayer);

        updateTarget(false);
    });

    targetAutoComplete.onReset(function(){

        routeLayer.clearLayers();
        targetLayer.clearLayers();
        targetAutoComplete.reset();
        targetMarker = '';
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
            targetAutoComplete.setValue(autoComplete.getValue());
            autoComplete.setValue(tempValue);

            var tempDisplayValue = targetAutoComplete.getFieldValue();
            targetAutoComplete.setFieldValue(autoComplete.getFieldValue());
            autoComplete.setFieldValue(tempDisplayValue);

            getPolygons(getRoutes);
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
            targetAutoComplete.setValue(autoComplete.getValue());
            targetAutoComplete.setFieldValue(autoComplete.getFieldValue());
            autoComplete.reset();
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
            autoComplete.setValue(targetAutoComplete.getValue());
            autoComplete.setFieldValue(targetAutoComplete.getFieldValue());
            targetAutoComplete.reset();
        }
        // simply pushing the button when no source and no target is defined should not do anything
        else {}
    });

    // add the controls to the map
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);
    map.addControl(L.control.zoom({ position : 'bottomright' }));

    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 1200 * 1 * 0.5, color : "#006837", opacity : 1.0 },
        { time : 1200 * 2 * 0.5, color : "#39B54A", opacity : 1.0 },
        { time : 1200 * 3 * 0.5, color : "#8CC63F", opacity : 1.0 },
        { time : 1200 * 4 * 0.5, color : "#F7931E", opacity : 1.0 },
        { time : 1200 * 5 * 0.5, color : "#F15A24", opacity : 1.0 },
        { time : 1200 * 6 * 0.5, color : "#C1272D", opacity : 1.0 }
    ];

    var travelTimeControl       = r360.travelTimeControl({
        travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
        position    : 'topright', // this is the position in the map
        label       : 'Travel time', // the label, customize for i18n
        unit        : 'min',
        initValue   : 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    var polygonButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> Color', key: 'color',   checked : true  },
            { label: '<span class=""></span> Black & White',   key: 'inverse', checked : false }
        ]
    });

    // what happens if action is performed
    polygonButtons.onChange(function(){

        polygonLayer.setInverse(!polygonLayer.getInverse());
        updateSource();
    });
    travelTimeControl.onSlideStop(updateSource);

    // add to map
    map.addControl(travelTimeControl);
    map.addControl(polygonButtons);

    $('span[lang="de"]').hide();
    $('span[lang="no"]').hide();

    // initial polygons
    // getPolygons();
    // autoComplete.setFieldValue("Paris, France");
    noty({ text : 'Select a target by clicking on the map or by selecting one from the auto-complete!', timeout : 5000, type : 'alert', layout: 'bottomCenter' });

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
        if (  sourceMarker == '' ) {

            sourceMarker = createMarker(e.latlng, 'home',  'red', sourceLayer, updateSource, 'undefined');
            updateSource(true);
        }
        // // only so many source markers are allowed
        else {

            targetLayer.clearLayers();

            targetMarker = L.marker(e.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
            if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
            targetMarker.on('dragend', updateTarget);
            targetMarker.addTo(targetLayer);

            updateTarget(true);
        }
    });

    /**
     * [updateAutocomplete Updates the label and latlng value of an autocomplete component, by a reverse geocoding request to nominatim.]
     * @param  {type} autoComplete [the autocomplete to update]
     * @param  {type} marker       [the marker from which the latlng object get's reverse geocoded.]
     */
    function updateAutocomplete(){

        if ( sourceMarker != '' ) {

            $.getJSON('http://photon.komoot.de/reverse?&lat=' + sourceMarker.getLatLng().lat + '&lon=' + sourceMarker.getLatLng().lng,
                function(json){

                    var displayName = r360.Util.formatPhotonReverseGeocoding(json.features[0].properties);
                    autoComplete.setFieldValue(displayName);
                    sourceMarker.bindPopup(displayName);
                }
            );
        }
    }

    function updateTargetAutocomplete(){

        // http://photon.komoot.de/reverse?lon=10&lat=52
        $.getJSON('http://photon.komoot.de/reverse?&lat=' + targetMarker.getLatLng().lat + '&lon=' + targetMarker.getLatLng().lng,
            function(json){

                var displayName = r360.Util.formatPhotonReverseGeocoding(json.features[0].properties);
                targetAutoComplete.setFieldValue(displayName);
                targetMarker.bindPopup(displayName);
            }
        );
    }

    /**
     * [updateSource This method updates the polygons, and performs a reverse geocoding for the update of the
     * autoComplete and get's new routes if a target is defined.]
     */
    function updateSource(updateAutoComplete) {

        var callback = targetMarker !== '' ? getRoutes : function(){};

        getPolygons(callback);
        if ( typeof updateAutoComplete !== 'undefined' && updateAutoComplete ) updateAutocomplete();
    }

    /**
     * [updateTarget This method gets new routes and updates the target autocomplete with a reverse geocoding.]
     * @return {type} [description]
     */
    function updateTarget(updateAutoComplete) {

        if ( sourceMarker != '' ) getRoutes();
        if ( typeof updateAutoComplete !== 'undefined' && updateAutoComplete ) updateTargetAutocomplete();
    }

    /**
     * [createMarker Creates a leaflet awesome marker with predefined properties]
     * @param  {[LatLng]} latLng  [the lat/lng location of the marker]
     * @param  {type} icon    [the string value of font awesome icon, e.g. 'home' (no 'fa-')]
     * @param  {type} color   [the color of the marker, as defined by awesomeMarkers.css]
     * @param  {type} layer   [the layer to which to add the marker]
     * @param  {type} dragend [the callback function that is called if the marker is draged in the map]
     * @param  {type} popup   [the popup to show if someone clicks on the marker]
     * @return {[Marker]}         [the leaflet marker]
     */
    function createMarker(latLng, icon, color, layer, dragend, popup){

        var marker = L.marker(latLng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: icon, prefix : 'fa', markerColor: color })});
        if ( typeof popup != 'undefined') marker.bindPopup(popup);
        marker.on('dragend', dragend);
        marker.addTo(layer);

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
        travelOptions.addSource(sourceMarker);
        travelOptions.setDate(date);
        travelOptions.setTime(time);
        travelOptions.setTravelType(autoComplete.getTravelType());
        travelOptions.setElevationEnabled(true);
        travelOptions.setWaitControl(waitControl);
        travelOptions.addTarget(targetMarker);

        r360.RouteService.getRoutes(travelOptions, function(routes) {

            var html        =
                '<table class="table table-striped" style="width: 100%"> \
                    <thead>\
                        <tr>\
                          <th>Source</th>\
                          <th>Time</th>\
                          <th>Distance</th>\
                          <th>Target</th>\
                        </tr>\
                    </thead>';

            _.each(routes, function(route, index){

                currentRoute = route;
                r360.LeafletUtil.fadeIn(routeLayer, route, 500, "travelDistance", { color : elevationColors[index].strokeColor, haloColor : "#ffffff" });

                html +=
                    '<tr style="margin-top:5px;">\
                        <td class="routeModus routeModus'+index+'"><img style="height: 25px;" src="images/source'+index+'.png"></td>\
                        <td>' + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + '</td>\
                        <td>' + currentRoute.getDistance().toFixed(2) + ' km </td>\
                        <td class="routeModus routeModus'+index+'"><img style="height: 25px;" src="images/target.png"></td>\
                    </tr>'
            });

            html += '</table>';

            targetMarker.bindPopup(html);
            targetMarker.openPopup();
        },
        function(code, message){

            if ( 'travel-time-exceeded' == code )
                alert("The travel time to the given target exceeds the server limit.");
            if ( 'could-not-connect-point-to-network' == code )
                alert("We could not connect the target point to the network.");
        });
    };

    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {type} [description]
     */
    function getPolygons(callback){

        if ( sourceMarker != '' ) {

            if ( setServiceUrl() ) {

                var travelOptions = r360.travelOptions();
                travelOptions.addSource(sourceMarker);
                travelOptions.setTravelTimes(travelTimeControl.getValues());
                travelOptions.setWaitControl(waitControl);
                travelOptions.setElevationEnabled(true);
                travelOptions.setTravelType(autoComplete.getTravelType());
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
                r360.PolygonService.getTravelTimePolygons(travelOptions,
                    function(polygons){

                        polygonLayer.clearAndAddLayers(polygons, true);
                        if ( typeof callback !== 'undefined') callback();
                    },
                    function(error) {

                        console.log(error);
                        alert("Sorry... an error occured. Please try again!");
                    });
            }
            else
                noty({ text : 'Start point outside of north america!', timeout : 5000, type : 'alert', layout: 'topCenter' });
        }
    }

    function setServiceUrl() {

        var lat = sourceMarker.getLatLng().lat;
        var lng = sourceMarker.getLatLng().lng;

        var context = "";

        if ( lng <= -100 && lat <= 36 ) context = 'southwest';
        else if ( lng <= -100 && lat >= 36 ) context = 'northwest';
        else if ( lng >= -100 && lat >= 36 ) context = 'northeast';
        else if ( lng >= -100 && lat <= 36 ) context = 'southeast';
        else
            return false;

        r360.config.serviceUrl = 'http://api-us.route360.net/na_'+context+'/';

        return true;
    }
});