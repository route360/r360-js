function addTravelTypeControl(){

    // add the map and set the initial center to berlin
    var latlon = [52.51, 13.37];
    var map = L.map('map-addTravelTypeControlExample').setView(latlon, 13);

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

    // create a marker and add it to the map
    var marker = L.marker(latlon).addTo(map);

    // create the layer to add the polygons
    var cpl = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(cpl);

    // add a radio element with all the different transport types
    var buttonOptions = {
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events 
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<i class="fa fa-bicycle"></i> Cycling', key: 'bike',     
              tooltip: 'Cycling speed is on average 15km/h', checked : false },

            { label: '<i class="fa fa-male"></i>  Walking', key: 'walk',     
              tooltip: 'Walking speed is on average 5km/h', checked : true  },

            { label: '<i class="fa fa-car"></i> Car', key: 'car',      
              tooltip: 'Car speed is limited by speed limit', checked : false },

            { label: '<i class="fa fa-bus"></i> Transit', key: 'transit',  
              tooltip: 'This demo only contains subways', checked : false }
        ]
    };

    // create a new readio button control with the given options
    var travelTypeButtons = r360.radioButtonControl(buttonOptions);

    // add the newly created control to the map
    map.addControl(travelTypeButtons);

    // bind the action to the change event of the radio travel mode element
    travelTypeButtons.onChange(function(value){ showPolygons(); });

    // call the helper function to display polygons with initial value
    showPolygons();

    // helper function to encapsulate the show polygon action
    function showPolygons(){

        // you need to define some options for the polygon service
        // for more travel options check out the other tutorials
        var travelOptions = r360.travelOptions();
        // we only have one source which is the marker we just added
        travelOptions.addSource(marker);
        // we want to have polygons for 5 to 30 minutes
        travelOptions.setTravelTimes([300, 600,900, 1200, 1500, 1800]);
        // get the selected travel type from the control
        travelOptions.setTravelType(travelTypeButtons.getValue());

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            
            // in case there are already polygons on the map/layer
            cpl.clearLayers();

            // add the returned polygons to the polygon layer 
            cpl.addLayer(polygons);
            
            // zoom the map to fit the polygons perfectly
            map.fitBounds(cpl.getBoundingBox());
        });
    };
}