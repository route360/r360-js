function filterExample(){

    // add the map and set the initial center to berlin
    var map = L.map('map-filterExample').setView([52.51, 13.37], 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.h220d1ec/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: attribution
    }).addTo(map);

    // create a target marker icon to be able to distingush source and targets
    var redIcon = L.icon({iconUrl: 'lib/leaflet/images/marker-icon-red.png', 
        shadowUrl: 'lib/leaflet/images/marker-shadow.png', iconAnchor: [12,45], popupAnchor:  [0, -35] });

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'iWJUcDfMWTzVDL69EWCG';

    // create a source and a two target markers and add them to the map
    var sourceMarker = L.marker([52.50086, 13.36581]).addTo(map);
    var targets = [];
    _.each(museumsBB, function(museum){

        var marker = L.marker([museum.lat, museum.lon], {icon:redIcon});
        marker.id = museum.id;
        targets.push(marker);
    });

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(sourceMarker);
    // add all the museums to the options
    travelOptions.setTargets(targets);
    // set the travel type to transit
    travelOptions.setTravelType('transit');
    // for all museums which are not reachable within <maxRoutingTime>
    // no routing time will be returned 
    travelOptions.setMaxRoutingTime(1800);

    // create the layer to add the polygons
    var cpl = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(cpl);

    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
                    
        // add the returned polygons to the polygon layer 
        cpl.addLayer(polygons);
    });

    // call the service
    r360.TimeService.getRouteTime(travelOptions, function(sources){

        // get each target for the first source (only one source was supplied to the service)
        _.each(sources[0].targets, function(target){

            // find the museum in our "database"
            var museum = _.find(museumsBB, function(museum){ return museum.id == target.id ; });
            // set the travel time for this museum
            museum.travelTime = target.travelTime;

            // the default marker is a plain circle marker
            var poiSymbol = L.circleMarker([museum.lat, museum.lon], 
                { color: "white", fillColor: 'red', fillOpacity: 1.0, stroke : true, radius : 5 });

            // the travel time to these museums is shorter then the maximum travel width
            // all other museum will remain with the circle marker
            if ( museum.travelTime > 0 && museum.travelTime <= travelOptions.getMaxRoutingTime() ) {

                // only a rule of three

                // 1) set min und max percent of the marker
                var maxPercent = 1.8;
                var minPercent = 0.7;

                // 2) calculate the distance
                var frame = maxPercent - minPercent;

                // 3) get maximum travel time
                var maxTravelTime = travelOptions.maxRoutingTime;

                // 4) how much percent of the frame equal one second
                var percentPerSecond = frame / maxTravelTime;

                // 5) scale factor for the marker
                var scale = minPercent + (maxTravelTime - museum.travelTime) * percentPerSecond;

                // lower bound
                if ( scale < minPercent ) scale = minPercent;

                // create the icon with the calculated scaled width and height
                var iconSize = { width : 25, height : 41 };
                var poiSymbol = L.marker([museum.lat, museum.lon], {icon : L.icon({ 
                    iconUrl :       "lib/leaflet/images/marker-icon-red-2x.png", 
                    shadowUrl:      "lib/leaflet/images/marker-shadow.png", 
                    iconAnchor:     [iconSize.width * scale,   iconSize.height * scale], 
                    shadowAnchor:   [iconSize.width * scale,   iconSize.height * scale], 
                    iconSize:       [iconSize.width * scale,   iconSize.height * scale],
                    shadowSize:     [iconSize.height * scale,  iconSize.height * scale],
                    popupAnchor:    [-15,  - iconSize.height * scale + 5]})});
            }

            // add the museum to the map, and add a popup
            poiSymbol.bindPopup("<h2><a href='"+museum.url+"'>" + museum.name + "</a></h2>\
                <p>" + r360.config.i18n.get('travelTime') + ": " + 
                r360.Util.secondsToHoursAndMinutes(museum.travelTime) + "</p>");
            poiSymbol.addTo(map);
        });
    });
}