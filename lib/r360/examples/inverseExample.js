function inverseExample(){

    var latlng = [52.51, 13.37];
    // add the map and set the initial center to berlin
    var map = L.map('map-inverseExample', {zoomControl : false}).setView([52.51, 13.37], 13);

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

    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer({ inverse : true });
    // add it to the map
    map.addLayer(polygonLayer);

    // define the opacity values
    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 300  , color : "#006837", opacity : 0.0 },
        { time : 600  , color : "#39B54A", opacity : 0.8 },
        { time : 900  , color : "#8CC63F", opacity : 0.0 },
        { time : 1200 , color : "#F7931E", opacity : 0.6 },
        { time : 1800 , color : "#C1272D", opacity : 0.4 },
        { time : 1500 , color : "#F15A24", opacity : 0.0 }
    ];

    // adjust the background color to fit your design
    r360.config.defaultPolygonLayerOptions.backgroundColor   = 'black';
    r360.config.defaultPolygonLayerOptions.backgroundOpacity = 0.3;

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(L.marker(latlng).addTo(map));
    // for inverse (black and white) polygons we only need one travel time
    travelOptions.setTravelTimes([600, 1200, 1800]);
    // set the travel type to walk
    travelOptions.setTravelType('walk');

    // call the service
    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
        
        // in case there are already polygons on the map/layer
        polygonLayer.clearAndAddLayers(polygons);

        // zoom the map to fit the polygons perfectly
        map.fitBounds(polygonLayer.getBoundingBox());
    });
}