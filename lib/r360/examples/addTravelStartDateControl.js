function addTravelStartDateControl(){

    // add the map and set the initial center to berlin
    var latlon = [52.51, 13.37];
    var map = L.map('map-addTravelStartDateControlExample').setView(latlon, 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors \
        | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | \
        developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: attribution
    }).addTo(map);

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'YWtKiQB7MiZETbCoVsG6';
    r360.config.i18n.language = 'en';

    // create a marker and add it to the map
    var marker = L.marker(latlon).addTo(map);

    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(polygonLayer);

    // create a new start date chooser
    var travelStartDateControl = r360.travelStartDateControl();
    var travelStartTimeControl = r360.travelStartTimeControl();
    // add a wait control to the lower left side of the map
    var waitControl = r360.waitControl({ position : 'bottomleft' });

    // add the newly created controls to the map
    map.addControl(waitControl);
    map.addControl(travelStartTimeControl);
    map.addControl(travelStartDateControl);

    // bind the action to the change event of the radio travel mode element
    travelStartDateControl.onChange(function(value){ showPolygons(); });
    travelStartTimeControl.onSlideStop(function(value){ showPolygons(); });

    // call the helper function to display polygons with initial value
    showPolygons();

    // helper function to encapsulate the show polygon action
    function showPolygons(){

        // you need to define some options for the polygon service
        // for more travel options check out the other tutorials
        var travelOptions = r360.travelOptions();
        // we only have one source which is the marker we just added
        travelOptions.addSource(marker);
        // we want to have polygons for 5 to 30 minutes
        travelOptions.setTravelTimes([300, 600, 900, 1200, 1500, 1800]);
        // get the selected travel type from the control
        travelOptions.setTravelType('transit');
        // and get the date and time from the controls
        travelOptions.setDate(travelStartDateControl.getValue());
        // travelOptions.setDate('20140825');
        travelOptions.setTime(travelStartTimeControl.getValue());
        // give the wait control to let the api display a waiting sign if
        // request take long time, might happen for transit with long travel times
        travelOptions.setWaitControl(waitControl);

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){

            // add the returned polygons to the polygon layer 
            polygonLayer.clearAndAddLayers(polygons);

            // zoom the map to fit the polygons perfectly
            map.fitBounds(polygonLayer.getBoundingBox());
        });
    };
}