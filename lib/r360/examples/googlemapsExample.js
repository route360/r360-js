function googlemapsExample(){

    // create the map for colored polygones
    var colorMap = new google.maps.Map(document.getElementById('google-maps-color-map'), { 
                    zoom: 11, center: new google.maps.LatLng(52.5167, 13.3833), 
                    mapTypeId: google.maps.MapTypeId.STREETS });
    
    // create a map for the black and white polygones
    var bwMap = new google.maps.Map(document.getElementById('google-maps-bw-map'), { 
        zoom: 11, center: new google.maps.LatLng(52.5167, 13.3833), 
        mapTypeId: google.maps.MapTypeId.STREETS });

    // each map get's it's own polygon layer
    var colorPolygonLayer = new GoogleMapsPolygonLayer(colorMap);
    // make the 2nd one inverse
    var bwPolygonLayer    = new GoogleMapsPolygonLayer(bwMap, { inverse : true }); 
    
    // attach the click listeners
    google.maps.event.addListener(bwMap, 'click', function(event) {

        if ( typeof markerBW !== 'undefined' ) markerBW.setMap(null);

        markerBW = new google.maps.Marker({
              position: event.latLng,
              map: bwMap
        });
        showPolygons(event.latLng.lat(), event.latLng.lng(), bwPolygonLayer);
    });

    // attach the click listeners
    google.maps.event.addListener(colorMap, 'click', function(event) {

        if ( typeof markerColor !== 'undefined' ) markerColor.setMap(null);

        markerColor = new google.maps.Marker({
              position: event.latLng,
              map: colorMap
        });
        showPolygons(event.latLng.lat(), event.latLng.lng(), colorPolygonLayer);
    });

    // init the first marker
    markerColor = new google.maps.Marker({ position: new google.maps.LatLng(52.5167, 13.3833), 
        map: colorMap });
    showPolygons(52.5167, 13.3833, colorPolygonLayer);

    function showPolygons(lat, lng, layer) {

        var travelOptions = r360.travelOptions();
        travelOptions.addSource({ lat : lat, lng : lng });            
        travelOptions.setTravelTimes([300, 600, 900, 1200, 1500, 1800]);
        travelOptions.setTravelType('transit');
        travelOptions.setDate('20150706');
        travelOptions.setTime('39000');

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){
            
            layer.update(polygons);
        }, 
        function(status, message){

            $("#r360-gettingstarted-error").show('fade').html("We are currently performing service \
                maintenance. The service will be available shortly.");
        });
    }
}