function htmlControlExample(){

    var latlng = [52.51, 13.37];
    // add the map and set the initial center to berlin
    var map = L.map('map-htmlControlExample', {zoomControl : false}).setView([52.51, 13.37], 13);

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
    r360.config.defaultPolygonLayerOptions.inverse = false;

    // create the layer to add the polygons and add it to the map
    var polygonLayer = r360.leafletPolygonLayer().addTo(map);

    // create and add the control to the map
    var htmlControl = r360.htmlControl({ classes : "html-control" });
    map.addControl(htmlControl);

    // needs to be set AFTER added to the map
    htmlControl.setHtml(
        '<div style="width:316px; height: 100%;"> \
            <h1>A want to eat your brainzz..</h1> \
            <p>Or maybe better some kittens: <img src="http://placekitten.com/316/400"> \
        </div>');

    // add marker
    var marker = L.marker(latlng).addTo(map);
    marker.on('click', function(){ htmlControl.toggle(); marker.openPopup(); });
    marker.bindPopup('Click me to toogle (hide/show) the Html control!').openPopup();

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(marker);
    // we want to have polygons for 5 to 30 minutes
    travelOptions.setTravelTimes([300, 600,900, 1200, 1500, 1800]);
    // set the travel type to walk
    travelOptions.setTravelType('walk');

    // call the service
    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
        
        // in case there are already polygons on the map/layer
        polygonLayer.clearAndAddLayers(polygons);

        // this will be refactored in future version to return a leaflet
        // LatLngBounds object to fit the map
        var bounds = polygonLayer.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        // zoom the map to fit the polygons and the html control perfectly
        map.fitBounds(
            L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})),
            {paddingTopLeft : [300,0]});
    });
}