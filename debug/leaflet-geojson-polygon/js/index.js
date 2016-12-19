// GeoJSON layer (UTM15)
proj4.defs('EPSG:3857');

// define a pair of coordinates, where the map should be centered
// and should serve a the source for polygonization
var latlon = [52.51, 13.37];

// add the map and set the initial center to berlin
var map = L.map('map').setView(latlon, 14);

// attribution to give credit to OSM map data and VBB for public transportation
var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='https://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='https://www.route360.net/de/' target='_blank'>Route360°</a>";

// initialise the base map. To change the base map just change following
// lines as described by cloudmade, mapbox etc..
// note that mapbox is a paid service
L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png',
            { maxZoom: 18, attribution: attribution }).addTo(map);

// create the marker and add it to the map
var marker = L.marker((latlon)).addTo(map);

// create the layer to add the polygons
var polygonLayer = r360.leafletPolygonLayer().addTo(map);

// you need to define some options for the polygon service
// for more travel options check out the other tutorials
var travelOptions = r360.travelOptions();
// set the service API-key, this is a demo key
// please contact us and request your own key
travelOptions.setServiceKey('uhWrWpUhyZQy8rPfiC7X');
// set the service url for your area
travelOptions.setServiceUrl('https://service.route360.net/africa/');
// travelOptions.setServiceUrl('http://localhost:8080/');


travelOptions.setQuadrantSegments(8);
travelOptions.setSimplifyMeter(10);
// ~50m in degrees at 52° latitude
travelOptions.setBuffer(0.00073);
travelOptions.setSrid(4326);

// we only have one source which is the marker we just added
travelOptions.addSource(marker);
// we want to have polygons for 5 to 30 minutes
travelOptions.setTravelTimes([900, 1800]);
// go by foot
travelOptions.setTravelType('walk');
// request geojson
travelOptions.setPolygonSerializer('geojson');

// call the r360°- service
r360.PolygonService.getTravelTimePolygons(travelOptions, function(geojsonPolygons){

    L.geoJson(geojsonPolygons, {
        "fillColor" : "#006837",
        "fillOpacity" : 0.4,
        "color" : "#006837",
        "stroke" : false,
        "weight" : 10,
        "fill" : true
    }).addTo(map);

    // L.Proj.geoJson(geojsonPolygons, {
    //     "fillColor" : "#006837",
    //     "fillOpacity" : 0.4,
    //     "color" : "#006837",
    //     "stroke" : true,
    //     "weight" : 10,
    //     "fill" : true
    // }).addTo(map);
});
