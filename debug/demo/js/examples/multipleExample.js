function multipleExample(){

    // add the map and set the initial center to berlin
    var map = L.map('map-multipleExample').setView([52.51, 13.37], 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.h220d1ec/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: attribution
    }).addTo(map);

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'iWJUcDfMWTzVDL69EWCG';

    // create the layer to add the polygons
    var cpl = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(cpl);

    // create a target marker icon to be able to distingush source and targets
    var redIcon = L.icon({iconUrl: 'lib/leaflet/images/marker-icon-red.png', 
        shadowUrl: 'lib/leaflet/images/marker-shadow.png', iconAnchor: [12,45], popupAnchor:  [0, -35] });

    // create a source and a two target markers and add them to the map
    var sourceMarker1 = L.marker([52.50086, 13.36581]).addTo(map);
    var sourceMarker2 = L.marker([52.50086, 13.38581]).addTo(map);
    
    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(sourceMarker2);
    travelOptions.addSource(sourceMarker1);

    // intersection means that areas are marker in a certain color
    // if they are reach from both locations in the same time
    travelOptions.setIntersectionMode('intersection');
    
    // we want to walk from all source points
    travelOptions.setTravelType('walk');
    // show 6 different travel time polygons for 5 to 30 minutes in
    // 5 minute steps
    travelOptions.setTravelTimes([300, 600, 900, 1200, 1500, 1800]);

    // call the service
    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
        
        // in case there are already polygons on the map/layer
        cpl.clearLayers();

        // add the returned polygons to the polygon layer 
        cpl.addLayer(polygons);
        
        // zoom the map to fit the polygons perfectly
        map.fitBounds(cpl.getBoundingBox());
    });
}