function gettingStartedExample(){

    var latlon = [52.51, 13.37];

    // Secondly we are initializing the Leaflet map, set a tile layer and add a marker, 
    // which could be an appartment, a hotel or your store etc.:
    // add the map and set the initial center to berlin
    var map = L.map('map-example1').setView(latlon, 13);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

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

    // create a marker and add it to the map
    var marker = L.marker(latlon).addTo(map);

    // No we add a layer for the reachability polygons, call the Route360° 
    // web service and render the resulting polygons on the map:
    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(polygonLayer);

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(marker);
    // we want to have polygons for 5 to 30 minutes
    travelOptions.setTravelTimes([300, 600,900, 1200, 1500, 1800]);
    // and we want to go by foot
    travelOptions.setTravelType('walk')

    // call the service
    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            
        // add the returned polygons to the polygon layer 
        polygonLayer.addLayer(polygons);
        
        // zoom the map to fit the polygons perfectly
        map.fitBounds(polygonLayer.getBoundingBox());
    });
}