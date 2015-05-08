function colorRouteExample(){

    var latlons = {

        map  : [52.51, 13.37],
        src1 : [52.50086, 13.36581], 
        trg1 : [52.52562, 13.30195], trg2 : [52.51998, 13.41714], trg3 : [52.51998, 13.33714],
        trg4 : [52.495, 13.32195]
    };

    // add the map and set the initial center to berlin
    var map = L.map('map-colorRouteExample').setView(latlons.map, 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> \
    contributors | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> \
    | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

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

    // create a target marker icon to be able to distingush source and targets
    var redIcon = L.icon({iconUrl: 'lib/leaflet/images/marker-icon-red.png', 
        shadowUrl: 'lib/leaflet/images/marker-shadow.png', iconAnchor: [12,45], popupAnchor:  [0, -35] });

    // create a source and a two target markers and add them to the map
    var sourceMarker1 = L.marker(latlons.src1).addTo(map);
    var targetMarker1 = L.marker(latlons.trg1, {icon:redIcon}).addTo(map);
    var targetMarker2 = L.marker(latlons.trg2, {icon:redIcon}).addTo(map);
    var targetMarker3 = L.marker(latlons.trg3, {icon:redIcon}).addTo(map);
    var targetMarker4 = L.marker(latlons.trg4, {icon:redIcon}).addTo(map);

    // add a layer in which we will paint the route
    var routeLayer = L.featureGroup().addTo(map);

    // you need to define some options for the routing service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    travelOptions.addSource(sourceMarker1);
    travelOptions.setTargets([targetMarker1, targetMarker2, targetMarker3]);
    travelOptions.setTravelType('transit');
    
    // start the service
    r360.RouteService.getRoutes(travelOptions, function(routes){

        // paint a route with overwritten colors for transit segments and walk segments
        // and custom transfer segments
        routes[0].fadeIn(routeLayer, 1000, "travelDistance", { 
            color               : '#FF0600',
            transferColor       : '#FF9A33',
            transferHaloColor   : '#FFFFFF',
            transferFillOpacity : 1,
            transferOpacity     : 1,
            transferStroke      : true,
            transferWeight      : 10,
            transferRadius      : 15
            // paintTransfer : true --> is the default
        });

        // overwrite transit color, let walk be default color
        routes[1].fadeIn(routeLayer, 1000, "travelDistance", 
            { color : '#156ab8', haloColor : 'white', paintTransfer : true });
        // no fade in and no markers inbetween segments
        routes[2].fadeIn(routeLayer, 0,    "travelDistance", 
            { color : '#006F35', haloColor : 'white', paintTransfer : false });
    });

    var travelOptions = r360.travelOptions();
    travelOptions.addSource(sourceMarker1);
    travelOptions.addTarget(targetMarker4);
    travelOptions.setTravelType('walk');
    
    // start the service
    r360.RouteService.getRoutes(travelOptions, function(routes){

        var psychoOptions = {
            opacity         : 0.9,
            weight          : 8,
            walkColor       : '#D34AFC',
            walkWeight      : 4,
            walkDashArray   : '3, 10', // use this option to disable dashing: '1'
            haloColor       : '#FCC0AC',
            haloOpacity     : 0.5,
            haloWeight      : 14
        }

        routes[0].fadeIn(routeLayer, 1000, "travelDistance", psychoOptions);
    });
}