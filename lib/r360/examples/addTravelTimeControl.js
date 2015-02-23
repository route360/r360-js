function addTravelTimeControl(){

    // add the map and set the initial center to berlin
    var latlon  = [52.51, 13.37];
    var map     = L.map('map-addTravelTimeControlExample').setView(latlon, 13);

    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution = "<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | ÖPNV Daten © <a href='http://www.vbb.de/de/index.html' target='_blank'>VBB</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service
    L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', { maxZoom: 18, attribution: attribution }).addTo(map);

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.serviceKey = 'YWtKiQB7MiZETbCoVsG6';

    // create a marker and add it to the map
    var marker = L.marker(latlon).addTo(map);

    // create the layer to add the polygons
    var polygonLayer = r360.route360PolygonLayer();
    // add it to the map
    map.addLayer(polygonLayer);

    // define time steps and colors here. Always use time values of the same distance and not too much time. 
    // the maximum travel time size is 2 hours, 7200s respectivly, higher values will be blocked be the server
    // travel times are defined in seconds the initial values in minutes... Also the label may be altered here
    var travelTimeControl       = r360.travelTimeControl({
        travelTimes     : [
            { time : 300  , color : "#006837"},
            { time : 600  , color : "#39B54A"},
            { time : 900  , color : "#8CC63F"},
            { time : 1200 , color : "#F7931E"},
            { time : 1500 , color : "#F15A24"},
            { time : 1800 , color : "#C1272D"}
        ],
        unit: 'min', // just a display value
        position : 'topright', // this is the position in the map
        label: 'Travel time: ', // the label, customize for i18n
        initValue: 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    //  bind the action to the travel time control
    travelTimeControl.onSlideStop(function(){ showPolygons(); });

    // add the newly created control to the map
    map.addControl(travelTimeControl);

    // call the helper function to display polygons with initial value
    showPolygons();

    // select language
    $('span[lang="de"]').hide();

    // helper function to encapsulate the show polygon action
    function showPolygons(){

        // you need to define some options for the polygon service
        // for more travel options check out the other tutorials
        var travelOptions = r360.travelOptions();
        // we only have one source which is the marker we just added
        travelOptions.addSource(marker);
        // we want to have polygons for whatever the user selects 
        travelOptions.setTravelTimes(travelTimeControl.getValues());
        // lets go via bike
        travelOptions.setTravelType('bike');

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