function addPlaceAutoCompleteControl(){

    // add the map and set the initial center to berlin
    var map = L.map('map-addPlaceAutoCompleteControlExample', {zoomControl : false}).setView([52.51, 13.37], 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

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

    // create a marker and but dont add it to the map yet
    var marker;

    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(polygonLayer);

    // define which options the user is going to have
    var options = { car : true, bike : true, walk : true, transit : true, init : 'transit' };

    // create an auto complete control and set it to return only german cities, streets etc. 
    // add an image which will be displayed next to the users input to know which markers
    // belong to which auto complete & and add a reset button to delete user inputs
    var placeAutoComplete = r360.placeAutoCompleteControl({country : "Deutschland", placeholder : 'Select start!', reset : true , image : 'lib/leaflet/images/marker-icon-red.png', options : options});
    // add the controls to the map
    map.addControl(placeAutoComplete);
    map.addControl(L.control.zoom({ position : 'topright' }));

    // select language
    $('span[lang="de"]').hide();

    // define what happens if someone clicks an item in the autocomplete
    placeAutoComplete.onSelect(function(item){

        // if the source marker is on the map already, move it to the new position
        if ( map.hasLayer(marker) ) marker.setLatLng(item.latlng);
        // otherwise add it and attach the action for marker dragging
        else {
            
            // add a marker to the map
            marker = r360.Util.getMarker(item.latlng, 
                { color : 'red', iconPath: 'lib/leaflet/images/', draggable : true }).addTo(map);
    
            // we need to update some stuff on the 'dragend' action of the marker
            marker.on('dragend', function(){

                // redraw the polygons
                showPolygons(placeAutoComplete.getTravelType());
                // update the street in the autocomplete
                r360.Util.getAddressByCoordinates(marker.getLatLng(), 'de', function(json){
                    
                    var displayName = r360.Util.formatReverseGeocoding(json);
                    placeAutoComplete.setFieldValue(displayName);
                    marker.bindPopup(displayName);
                });
            });
        }

        // and show the polygons for the new source
        marker.bindPopup(item.firstRow);
        showPolygons(placeAutoComplete.getTravelType());
    });

    // define what happens if someone clicks the reset button
    placeAutoComplete.onReset(function(){

        // remove the polygons and the marker
        polygonLayer.clearLayers();
        map.removeLayer(marker);
        // remove the label and value from the autocomplete
        placeAutoComplete.reset();
    });

    placeAutoComplete.onTravelTypeChange(function(){

        // we can only show polygons if a place was already defined
        if ( typeof placeAutoComplete.getValue() !== 'undefined' &&
                Object.keys(placeAutoComplete.getValue()).length !== 0 )
            showPolygons(placeAutoComplete.getTravelType());
    });

    // helper function to encapsulate the show polygon action
    function showPolygons(travelType){

        // you need to define some options for the polygon service
        // for more travel options check out the other tutorials
        var travelOptions = r360.travelOptions();
        // we only have one source which is the marker we just added
        travelOptions.addSource(marker);
        // we want to have polygons for 5 to 30 minutes
        travelOptions.setTravelTimes([300, 600,900, 1200, 1500, 1800]);
        // set the travel type if defined
        if ( typeof travelType !== 'undefined') {


            travelOptions.setTravelType(travelType)
        };

        travelOptions.getTravelType();

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            
            // in case there are already polygons on the map/layer
            polygonLayer.clearLayers();

            // add the returned polygons to the polygon layer 
            polygonLayer.addLayer(polygons);
            
            // zoom the map to fit the polygons perfectly
            map.fitBounds(polygonLayer.getBoundingBox());
        });
    };
}