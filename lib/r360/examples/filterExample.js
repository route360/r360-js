function filterExample(){

    // add the map and set the initial center to berlin
    var latlon = [52.51, 13.37];
    var map    = L.map('map-filterExample').setView(latlon, 13);

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

    // create a target marker icon to be able to distingush source and targets
    var redIcon = L.icon({iconUrl: 'lib/leaflet/images/marker-icon-red.png', 
        shadowUrl: 'lib/leaflet/images/marker-shadow.png', iconAnchor: [12,45], popupAnchor:  [0, -35] });

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'YWtKiQB7MiZETbCoVsG6';

    // create a source and collect the targets
    var sourceMarker = L.marker(latlon).addTo(map);
    var targets = [];
    _.each(museumsBB, function(museum){

        var target = L.marker([museum.lat, museum.lon], { icon : redIcon , id : museum.id });
        target.id = museum.id;
        targets.push(target);
    });

    // you need to define some options for the polygon service
    // for more travel options check out the other tutorials
    var travelOptions = r360.travelOptions();
    // we only have one source which is the marker we just added
    travelOptions.addSource(sourceMarker);
    // add all the museums to the options
    travelOptions.setTargets(targets);
    // lets show polygons for 5 to 30 minutes
    travelOptions.setTravelTimes([300, 600, 900, 1200, 1500, 1800]);
    // set the travel type to transit
    travelOptions.setTravelType('transit');
    // for all museums which are not reachable within <maxRoutingTime>
    // no routing time will be returned 
    travelOptions.setMaxRoutingTime(1800);

    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(polygonLayer);

    r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
                    
        // add the returned polygons to the polygon layer 
        polygonLayer.addLayer(polygons);

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

                    // min and maximal scaling for the marker
                    var minMax = { maxPercent : 1.0 , minPercent : 0.5 };
                    // only a rule of three
                    // 1) calculate the distance
                    var frame = minMax.maxPercent - minMax.minPercent;

                    // 2) how much percent of the frame equal one second
                    var percentPerSecond = frame / travelOptions.getMaxRoutingTime();

                    // 3) scale factor for the marker
                    var scale = minMax.minPercent + (travelOptions.getMaxRoutingTime() - museum.travelTime) * percentPerSecond;

                    // lower bound
                    if ( scale < minMax.minPercent ) scale = minPercent;

                    var iconSize    = { width : 25 * scale, height : 41 * scale };
                    var shadowSize  = { width : 41 * scale, height : 41 * scale };

                    // create the icon with the calculated scaled width and height
                    var poiSymbol = L.marker([museum.lat, museum.lon], {icon : L.icon({ 
                        iconAnchor:     [iconSize.width / 2,   iconSize.height], 
                        iconSize:       [iconSize.width,   iconSize.height],
                        iconUrl :       "lib/leaflet/images/marker-icon-red-2x.png", 
                        shadowUrl:      "lib/leaflet/images/marker-shadow.png", 
                        shadowAnchor:   [shadowSize.width / 3,   shadowSize.height], 
                        shadowSize:     [shadowSize.width,       shadowSize.height],
                        popupAnchor:    [0,  - iconSize.height * scale]
                    })});
                }

                // add the museum to the map, and add a popup
                poiSymbol.bindPopup("<h2><a href='"+museum.url+"'>" + museum.name + "</a></h2>\
                    <p>" + r360.config.i18n.get('travelTime') + ": " + 
                    r360.Util.secondsToHoursAndMinutes(museum.travelTime) + "</p>");
                poiSymbol.addTo(map);
            });
        });
    });
}