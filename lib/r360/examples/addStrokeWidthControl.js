function addStrokeWidthControl(){
	
	var latlng = [52.51, 13.37];
    // add the map and set the initial center to berlin
    var map = L.map('map-addStrokeWidthControlExample', {zoomControl : false}).setView([52.51, 13.37], 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors \
    | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed \
    by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

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

    // create the layer to add the polygons and add it to the map
    var polygonLayer = r360.leafletPolygonLayer().addTo(map);

    // create an array with all gradiations of the polygon stroke width you wish (in px)
    var strokeWidths = [];
    for ( var i = 0 ; i < 101 ; i++ ) {
    	// note that we are utilizing TravelTimeControl as StrokeWidthControl
    	// to display the pixel valuesproperly, we have to pretend they are minutes
        strokeWidths.push({ time : i * 60, color : "grey" });
    }

    // create the TravelTimeControl
    var strokeWidthsControl       = r360.travelTimeControl({
        travelTimes : strokeWidths,
        position    : 'topright', // this is the position in the map
        label       : 'Stroke width', // the label, customize for i18n
        unit        : 'px', // unit to be displayed
        initValue   : 30 // the inital value has to match a time from travelTimes
    });

    // add the control to the map
    map.addControl(strokeWidthsControl);

    // configure the control to update the current value when changed
    strokeWidthsControl.onSlideStop(function(){
    	// dont forget to add / 60 here:
        r360.config.defaultPolygonLayerOptions.strokeWidth = _.max(strokeWidthsControl.getValues()) / 60;
        showPolygons();
    });

    // call the helper function to display polygons with initial value
    showPolygons();
    
	// helper function to encapsulate the show polygon action
    function showPolygons(){

        // you need to define some options for the polygon service
        // for more travel options check out the other tutorials
        var travelOptions = r360.travelOptions();
        // add the predefined source to the map
        travelOptions.addSource(L.marker(latlng).addTo(map));
        // add some travle time values
        travelOptions.setTravelTimes([600, 1200, 1800]);
        // lets go via bike
        travelOptions.setTravelType('bike');

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            
            // in case there are already polygons on the map/layer clear them
            // and fit the map to the polygon bounds ('true' parameter)
            polygonLayer.clearAndAddLayers(polygons, true);
        });
    };

}