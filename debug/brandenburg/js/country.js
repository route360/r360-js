$(document).ready(function(){

    var city = cities.vancouver;
    var city = cities.berlin;
    // var city = cities.vienna;

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false}).setView([city.lat, city.lng], 12);
    // attribution to give credit to OSM map data and VBB for public transportation
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | Transit Data © <a href='http://www.gbrail.info/' target='_blank'>GB Rail</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service mi.0ad4304c
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', {
        maxZoom: 22, attribution: attribution }).addTo(map);

    var maxSources = 1;
    var currentRoute;
    var elevationData = [];
    var date = '20150813';
    var time = '39600';
    var date = '20140825';
    var time = '39600';

    // var date = '20151016';
    // var time = '28800';
    //
    var date = '20151020';
    var time = '30000';

    var elevationColors = [{
        label               : "1",
        fillColor           : "#d43e2a",
        fillColorOpacity    : 0.1,
        strokeColor         : "#d43e2a",
        strokeColorOpacity  : 0.7
    },{
        label               : "2",
        fillColor           : "#f69730",
        fillColorOpacity    : 0.1,
        strokeColor         : "#f69730",
        strokeColorOpacity  : 0.7
    },{
        label               : "3",
        fillColor           : "#38aadd",
        fillColorOpacity    : 0.1,
        strokeColor         : "#38aadd",
        strokeColorOpacity  : 0.7
    }];

    var sourceMarker  = '';
    var targetMarker  = '';
    var travelType    = '';
    var autoCompletes = [];
    var sourceMarkers = _.range(maxSources);
    var routeLayer    = L.featureGroup().addTo(map);
    var sourceLayer   = L.featureGroup().addTo(map);
    var rentalLayer   = L.featureGroup().addTo(map);
    var targetLayer   = L.featureGroup().addTo(map);
    var polygonLayer  = r360.leafletPolygonLayer().addTo(map);
    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.requestTimeout                              = 500000;
    r360.config.serviceKey                                  = city.key;
    r360.config.serviceUrl                                  = city.serviceUrl;
    r360.config.serviceUrl                                  = "http://localhost:8080/api/";
    // r360.config.serviceUrl                                  = "http://api1-eu.route360.net/brandenburg/";
    r360.config.defaultPlaceAutoCompleteOptions.serviceUrl  = "http://geocode2.route360.net/solr/select?";
    r360.config.defaultPolygonLayerOptions.inverse          = false;
    r360.config.nominatimUrl                                = 'http://geocode2.route360.net/nominatim/';
    polygonLayer.setInverse(false);

    var options = { bike : true, walk : true, car : true, transit : true, biketransit: true, init : 'biketransit' };

    // define which options the user is going to have
    for ( var i = 0 ; i < maxSources ; i++ ) {

        var addAutoComplete = function(i) {

            var autoComplete = r360.placeAutoCompleteControl({ country : "Switzerland", placeholder : 'Select source!', reset : true, index : i, reverse : false, image : 'images/source'+i+'.png', options : options});

            // // if someone changes the travel type for the source
            // we need to get new polygons and new routes
            autoComplete.onTravelTypeChange(updateSource);

            // if someone clicks a place from the dropdown, we remove the old source
            // and create a new one and get new polygons
            autoComplete.onSelect(function(item){

                sourceLayer.clearLayers();
                createMarker(item.latlng, 'home', item.index == 0 ? 'red' : (item.index == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', item.index);
                updateSource();
            });

            autoComplete.onReset(function(){

                polygonLayer.clearLayers();
                routeLayer.clearLayers();
                autoComplete.reset();
                sourceLayer.removeLayer(sourceMarkers[autoComplete.getIndex()]);
                sourceMarkers[autoComplete.getIndex()] = autoComplete.getIndex();
                updateSource();
            });

            autoCompletes.push(autoComplete);
            map.addControl(autoComplete);
        }

        addAutoComplete(i);
    }

    var targetAutoComplete = r360.placeAutoCompleteControl({ country : "Switzerland", placeholder : 'Select source!', reset : true, reverse : false , image : 'images/target.png' });
    // map.addControl(targetAutoComplete);

    targetAutoComplete.onSelect(function(item){

        targetLayer.clearLayers();

        targetMarker = L.marker(item.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
        if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
        targetMarker.on('dragend', updateTarget);
        targetMarker.addTo(targetLayer);

        updateTarget();
    });

    targetAutoComplete.onReset(function(){

        routeLayer.clearLayers();
        targetLayer.clearLayers();
        targetAutoComplete.reset();
        targetMarker = '';
    });

    // add the controls to the map
    map.addControl(L.control.zoom({ position : 'bottomleft' }));
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);

    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 1200 * 1 * 0.5 , color : "#006837", opacity : 1.0 },
        { time : 1200 * 2 * 0.5 , color : "#39B54A", opacity : 1.0 },
        { time : 1200 * 3 * 0.5 , color : "#8CC63F", opacity : 1.0 },
        { time : 1200 * 4 * 0.5 , color : "#F7931E", opacity : 1.0 },
        { time : 1200 * 5 * 0.5 , color : "#F15A24", opacity : 1.0 },
        { time : 1200 * 6 * 0.5 , color : "#C1272D", opacity : 1.0 }
    ];

    var travelTimeControl       = r360.travelTimeControl({
        travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
        position    : 'topright', // this is the position in the map
        label       : 'Travel time', // the label, customize for i18n
        unit        : 'min',
        initValue   : 20 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    var intersectionButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> Union', key: 'union', checked : true },
            { label: '<span class=""></span> Intersection', key: 'intersection', checked : false  },
            { label: '<span class=""></span> Average', key: 'average', checked : false }
        ]
    });

    var polygonButtons = r360.radioButtonControl({
        buttons : [
            // each button has a label which is displayed, a key, a tooltip for mouseover events
            // and a boolean which indicates if the button is selected by default
            // labels may contain html
            { label: '<span class=""></span> Color', key: 'color',   checked : true  },
            { label: '<span class=""></span> B/W',   key: 'inverse', checked : false }
        ]
    });

    function test(){

        var strokeWidths = [];
        for ( var i = 0 ; i < 101 ; i++ ) {
            strokeWidths.push({ time : i * 60, color : "grey" });
        }

        var strokeWidthsControl       = r360.travelTimeControl({
            travelTimes : strokeWidths,
            position    : 'topright', // this is the position in the map
            label       : 'Stroke width', // the label, customize for i18n
            unit        : 'px',
            initValue   : 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
        });

        map.addControl(strokeWidthsControl);
        strokeWidthsControl.onSlideStop(function(){

            r360.config.defaultPolygonLayerOptions.strokeWidth = _.max(strokeWidthsControl.getValues()) / 60;
            updateSource();
        });
    };

    // test();

    // what happens if action is performed
    polygonButtons.onChange(function(){

        r360.config.defaultPolygonLayerOptions.inverse = !r360.config.defaultPolygonLayerOptions.inverse;
        polygonLayer.setInverse(r360.config.defaultPolygonLayerOptions.inverse);
        updateSource();
    });
    intersectionButtons.onChange(updateSource);
    travelTimeControl.onSlideStop(updateSource);

    // add to map
    map.addControl(travelTimeControl);
    // map.addControl(intersectionButtons);
    map.addControl(polygonButtons);

    $('span[lang="de"]').hide();
    $('span[lang="no"]').hide();

    // ==================================================================================================================================
    // ----------------------------------------------------------------------------------------------------------------------------------
    //
    //                                              END OF INITIALIZE
    //
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ==================================================================================================================================

    // the first click on a map creates a source marker
    // the second click creates or relocates the target marker
    map.on('click', function(e){

        var index0 = _.indexOf(sourceMarkers, 0);
        var index1 = _.indexOf(sourceMarkers, 1);
        var index2 = _.indexOf(sourceMarkers, 2);
        var index1 = -1;var index2 = -1;

        // create source marker and make a polygon request
        if (  index0 >= 0 || index1 >= 0 || index2 >= 0 ) {

            var min = _.min(_.without([index0, index1, index2], -1));
            createMarker(e.latlng, 'home',  min == 0 ? 'red' : (min == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', min);
            // createMarker([52.53224576102008, 13.360444755304684], 'home',  min == 0 ? 'red' : (min == 1 ? 'orange' : 'blue'), sourceLayer, updateSource, 'undefined', min);
            updateSource();
        }
        // // only so many source markers are allowed
        else {

            targetLayer.clearLayers();

            targetMarker = L.marker(e.latlng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: 'flag-checkered', prefix : 'fa', markerColor: 'green' })});
            if ( typeof popup != 'undefined') targetMarker.bindPopup(popup);
            targetMarker.on('dragend', updateTarget);
            targetMarker.addTo(targetLayer);

            updateTarget();
        }
    });

    function asd() {

        var src = [52.53346056530662, 13.333769900910015];  var trg = [52.5334539630736,13.356824378970545]; var travelType = 'car';
        var src = [52.50201169900509, 13.374309539794922]; var trg = [52.50786308797268,13.4197998046875]; var travelType = 'transit';


        var travelOptions = r360.travelOptions();
        travelOptions.addSource({lat : src[0], lng : src[1]});
        travelOptions.addTarget({lat : trg[0], lng : trg[1]});
        travelOptions.setDate(20140825);
        travelOptions.setTime(39600);
        travelOptions.setTravelType(travelType);

        var routes = {"routes":[{"travelTime":1313,"length":4287.950658875248,"id":"id2","segments":[{"travelTime":190,"length":214.07663686407022,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892482,1493870,37],[6892482,1493870,37],[6892466,1493862,37],[6892466,1493862,37],[6892447,1493784,37],[6892342,1493733,36],[6892342,1493733,36],[6892352,1493712,36],[6892352,1493712,36],[6892247,1493670,37],[6892247,1493670,37],[6892247,1493669,37],[6892247,1493669,37],[6892247,1493669,37]]},{"travelTime":0,"length":0,"endname":"Heinrich-Heine-Platz (Berlin)","type":"TRANSFER","startname":"walk","points":[[6892247,1493669,37],[6892247,1493669,37]]},{"departureTime":41940,"travelTime":120,"routeShortName":"147","arrivalTime":42060,"length":870.3860880369576,"endname":"Heinrich-Heine-Platz (Berlin)","type":"TRANSIT","startname":"U Märkisches Museum (Berlin)","routeType":700,"tripHeadSign":"S Ostbahnhof","isTransit":true,"points":[[6892247,1493669,37],[6892557,1493211,0],[6892557,1493211,0],[6893237,1492657,0]]},{"travelTime":240,"length":0,"endname":"U Märkisches Museum (Berlin)","type":"TRANSFER","startname":"U Märkisches Museum (Berlin)","points":[[6893237,1492657,0],[6893237,1492657,0]]},{"departureTime":41220,"travelTime":480,"routeShortName":"U2","arrivalTime":41700,"length":2885.698703620759,"endname":"U Märkisches Museum (Berlin)","type":"TRANSIT","startname":"U Mendelssohn-Bartholdy-Park (Berlin)","routeType":400,"tripHeadSign":"S+U Pankow (Berlin)","isTransit":true,"points":[[6893237,1492657,0],[6893108,1491943,0],[6893108,1491943,0],[6893485,1491163,42],[6893485,1491163,42],[6893267,1490535,0],[6893267,1490535,0],[6893148,1489877,0],[6893148,1489877,0],[6892700,1489229,39],[6892700,1489229,39],[6891737,1488866,0]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"U Mendelssohn-Bartholdy-Park (Berlin)","points":[[6891737,1488866,38],[6891737,1488866,0]]},{"travelTime":283,"length":317.78923035346213,"endname":"target","type":"WALK","startname":"source","points":[[6891737,1488866,38],[6891761,1488803,37],[6891761,1488803,37],[6891703,1488781,37],[6891703,1488781,37],[6891594,1488891,34],[6891594,1488891,34],[6891574,1488887,34],[6891574,1488887,34],[6891511,1488876,37],[6891511,1488876,37],[6891506,1488875,37],[6891506,1488875,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]}
        r360.LeafletUtil.fadeIn(routeLayer, r360.Util.parseRoutes(routes)[0], 500, "travelDistance", { color : 'green', haloColor : "#ffffff" });

        // routes = {"routes":[{"travelTime":2889,"length":3744.477431106685,"id":"id2","segments":[{"travelTime":2538,"length":3004.44727594984,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892482,1493870,37],[6892482,1493870,37],[6892502,1493826,37],[6892502,1493826,37],[6892519,1493787,37],[6892519,1493787,37],[6892544,1493743,36],[6892544,1493743,36],[6892536,1493740,36],[6892536,1493740,36],[6892478,1493609,34],[6892478,1493609,34],[6892484,1493575,34],[6892484,1493575,34],[6892509,1493523,34],[6892509,1493523,34],[6892529,1493515,34],[6892575,1493417,36],[6892575,1493417,36],[6892570,1493388,36],[6892538,1493373,36],[6892555,1493335,37],[6892555,1493335,37],[6892487,1493298,37],[6892486,1493273,37],[6892486,1493273,37],[6892504,1493254,37],[6892504,1493254,37],[6892548,1493203,36],[6892548,1493203,36],[6892564,1493185,36],[6892564,1493185,36],[6892575,1493172,36],[6892575,1493172,36],[6892520,1493143,36],[6892520,1493143,36],[6892453,1493106,35],[6892453,1493106,35],[6892420,1493091,37],[6892420,1493091,37],[6892413,1493085,37],[6892413,1493085,37],[6892377,1493036,37],[6892377,1493036,37],[6892373,1493025,37],[6892373,1493025,37],[6892368,1493008,37],[6892368,1493008,37],[6892367,1492981,36],[6892367,1492981,36],[6892367,1492968,36],[6892367,1492968,36],[6892358,1492923,36],[6892358,1492923,36],[6892339,1492885,36],[6892339,1492885,36],[6892312,1492829,37],[6892312,1492829,37],[6892301,1492806,37],[6892301,1492806,37],[6892326,1492795,37],[6892326,1492795,37],[6892322,1492789,37],[6892322,1492789,37],[6892274,1492711,36],[6892274,1492711,36],[6892258,1492686,36],[6892258,1492686,36],[6892226,1492633,36],[6892226,1492633,36],[6892191,1492578,38],[6892191,1492578,38],[6892181,1492572,38],[6892181,1492572,38],[6892172,1492557,38],[6892172,1492557,38],[6892153,1492524,38],[6892153,1492524,38],[6892117,1492464,38],[6892117,1492464,38],[6892101,1492437,38],[6892101,1492437,38],[6892093,1492424,38],[6892093,1492424,38],[6892048,1492352,37],[6892048,1492352,37],[6892016,1492306,37],[6892016,1492306,37],[6892009,1492298,37],[6892009,1492298,37],[6891984,1492273,37],[6891984,1492273,37],[6891983,1492271,37],[6891983,1492271,37],[6892052,1492118,37],[6892052,1492118,37],[6892070,1492080,39],[6892070,1492080,39],[6892095,1492024,39],[6892095,1492024,39],[6892134,1491939,39],[6892134,1491939,39],[6892147,1491909,39],[6892147,1491909,39],[6892166,1491866,39],[6892166,1491866,39],[6892265,1491646,38],[6892265,1491646,38],[6892274,1491626,38],[6892274,1491626,38],[6892328,1491505,42],[6892328,1491505,42],[6892334,1491490,42],[6892334,1491490,42],[6892348,1491426,42],[6892348,1491426,42],[6892344,1491374,42],[6892344,1491374,42],[6892314,1491055,40],[6892314,1491055,40],[6892304,1490961,44],[6892304,1490961,44],[6892291,1490839,45],[6892291,1490839,45],[6892272,1490662,43],[6892272,1490662,43],[6892268,1490624,43],[6892268,1490624,43],[6892242,1490372,39],[6892242,1490372,39],[6892218,1490130,38],[6892218,1490130,38],[6892118,1490162,38],[6892118,1490162,38],[6892023,1490192,36],[6892023,1490192,36],[6891914,1489849,37],[6891914,1489849,37],[6891868,1489718,41],[6891868,1489718,41],[6891866,1489715,41],[6891866,1489715,41],[6891864,1489716,41]]},{"travelTime":0,"length":0,"endname":"S Anhalter Bahnhof (Berlin)","type":"TRANSFER","startname":"walk","points":[[6891864,1489716,0],[6891864,1489716,41]]},{"departureTime":40020,"travelTime":60,"routeShortName":"M29","arrivalTime":40080,"length":394.2922137955492,"endname":"S Anhalter Bahnhof (Berlin)","type":"TRANSIT","startname":"Schöneberger Brücke (Berlin)","routeType":700,"tripHeadSign":"U Hermannplatz","isTransit":true,"points":[[6891864,1489716,0],[6891468,1489204,34]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"Schöneberger Brücke (Berlin)","points":[[6891468,1489204,34],[6891468,1489204,34]]},{"travelTime":291,"length":345.7379413612956,"endname":"target","type":"WALK","startname":"source","points":[[6891468,1489204,34],[6891468,1489204,34],[6891468,1489204,34],[6891409,1489125,36],[6891409,1489125,36],[6891397,1489108,36],[6891397,1489108,36],[6891380,1489084,36],[6891380,1489084,36],[6891349,1489044,39],[6891349,1489044,39],[6891342,1489036,39],[6891342,1489036,39],[6891335,1489028,39],[6891335,1489028,39],[6891447,1488911,37],[6891447,1488911,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]};
        // r360.LeafletUtil.fadeIn(routeLayer, r360.Util.parseRoutes(routes)[0], 500, "travelDistance", { color : elevationColors[0].strokeColor, haloColor : "#ffffff" });

        // routes = {"routes":[{"travelTime":2422,"length":4174.75598977377,"id":"id2","segments":[{"travelTime":1420,"length":1676.9779867066186,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892482,1493870,37],[6892482,1493870,37],[6892502,1493826,37],[6892502,1493826,37],[6892519,1493787,37],[6892519,1493787,37],[6892544,1493743,36],[6892544,1493743,36],[6892536,1493740,36],[6892536,1493740,36],[6892478,1493609,34],[6892478,1493609,34],[6892484,1493575,34],[6892484,1493575,34],[6892509,1493523,34],[6892509,1493523,34],[6892529,1493515,34],[6892575,1493417,36],[6892575,1493417,36],[6892570,1493388,36],[6892538,1493373,36],[6892555,1493335,37],[6892555,1493335,37],[6892487,1493298,37],[6892486,1493273,37],[6892486,1493273,37],[6892504,1493254,37],[6892504,1493254,37],[6892372,1493193,39],[6892372,1493193,39],[6892308,1493161,39],[6892308,1493161,39],[6892192,1493105,34],[6892192,1493105,34],[6892153,1493086,34],[6892153,1493086,34],[6891939,1492985,37],[6891939,1492985,37],[6891875,1492954,37],[6891875,1492954,37],[6891854,1492943,37],[6891854,1492943,37],[6891779,1492910,36],[6891779,1492910,36],[6891747,1492883,36],[6891747,1492883,36],[6891727,1492836,36],[6891727,1492836,36],[6891688,1492836,34],[6891669,1492855,34],[6891669,1492855,34],[6891554,1492798,35],[6891554,1492798,35],[6891457,1492752,35],[6891457,1492752,35],[6891433,1492740,35],[6891433,1492740,35],[6891361,1492707,35],[6891361,1492707,35],[6891044,1492553,38],[6891044,1492553,38],[6890847,1492460,38],[6890847,1492460,38],[6890774,1492429,37],[6890774,1492429,37],[6890759,1492422,37],[6890759,1492422,37],[6890733,1492411,37],[6890733,1492411,37],[6890725,1492408,37],[6890725,1492408,37],[6890726,1492408,37]]},{"travelTime":0,"length":0,"endname":"U Prinzenstr. (Berlin)","type":"TRANSFER","startname":"walk","points":[[6890726,1492408,0],[6890726,1492408,37]]},{"departureTime":43740,"travelTime":240,"routeShortName":"U1","arrivalTime":43980,"length":1593.4238949652006,"endname":"U Prinzenstr. (Berlin)","type":"TRANSIT","startname":"U Möckernbrücke (Berlin)","routeType":400,"tripHeadSign":"S+U Warschauer Str. (Berlin)","isTransit":true,"points":[[6890726,1492408,0],[6890634,1490763,0],[6890634,1490763,0],[6890848,1489817,31]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"U Möckernbrücke (Berlin)","points":[[6890848,1489817,31],[6890848,1489817,31]]},{"travelTime":762,"length":904.3541081019515,"endname":"target","type":"WALK","startname":"source","points":[[6890848,1489817,31],[6890847,1489791,31],[6890847,1489791,31],[6890866,1489790,31],[6890866,1489790,31],[6890879,1489792,31],[6890873,1489730,31],[6890873,1489730,31],[6890872,1489715,31],[6890872,1489715,31],[6890900,1489713,31],[6890900,1489713,31],[6890896,1489684,31],[6890896,1489684,31],[6890891,1489610,31],[6890891,1489610,31],[6890905,1489503,31],[6890905,1489503,31],[6890911,1489483,31],[6890911,1489483,31],[6890930,1489427,37],[6890930,1489427,37],[6890952,1489385,35],[6890952,1489385,35],[6890975,1489344,35],[6890975,1489344,35],[6891056,1489273,35],[6891175,1489219,40],[6891175,1489219,40],[6891292,1489169,39],[6891292,1489169,39],[6891397,1489108,36],[6891397,1489108,36],[6891380,1489084,36],[6891380,1489084,36],[6891349,1489044,39],[6891349,1489044,39],[6891342,1489036,39],[6891342,1489036,39],[6891335,1489028,39],[6891335,1489028,39],[6891447,1488911,37],[6891447,1488911,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]};
        // r360.LeafletUtil.fadeIn(routeLayer, r360.Util.parseRoutes(routes)[0], 500, "travelDistance", { color : elevationColors[1].strokeColor, haloColor : "#ffffff" });

        // routes = {"routes":[{"travelTime":1675,"length":3934.024938925732,"id":"id2","segments":[{"travelTime":664,"length":764.4186349888998,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892470,1493898,38],[6892470,1493898,38],[6892454,1493891,38],[6892454,1493891,38],[6892415,1493920,38],[6892358,1493907,38],[6892358,1493907,38],[6892341,1493944,38],[6892341,1493944,38],[6892265,1493912,37],[6892265,1493912,37],[6892158,1493865,36],[6892158,1493865,36],[6892128,1493852,36],[6892128,1493852,36],[6892093,1493839,36],[6892093,1493839,36],[6891984,1493779,38],[6891967,1493722,39],[6891967,1493722,39],[6891959,1493689,39],[6891795,1493620,36],[6891795,1493620,36],[6891758,1493603,36],[6891758,1493603,36],[6891713,1493583,36],[6891713,1493583,36],[6891696,1493576,36],[6891696,1493576,36],[6891545,1493509,40],[6891545,1493509,40],[6891553,1493492,41],[6891553,1493492,41],[6891538,1493485,41],[6891538,1493485,41],[6891544,1493473,41],[6891544,1493473,41],[6891482,1493446,41],[6891482,1493446,41],[6891477,1493444,41],[6891477,1493444,41],[6891451,1493432,41],[6891451,1493432,41],[6891452,1493432,41]]},{"travelTime":0,"length":0,"endname":"Oranienplatz (Berlin)","type":"TRANSFER","startname":"walk","points":[[6891452,1493432,0],[6891452,1493432,41]]},{"departureTime":40620,"travelTime":720,"routeShortName":"M29","arrivalTime":41340,"length":2823.8683625755366,"endname":"Oranienplatz (Berlin)","type":"TRANSIT","startname":"Schöneberger Brücke (Berlin)","routeType":700,"tripHeadSign":"U Hermannplatz","isTransit":true,"points":[[6891452,1493432,0],[6891725,1492899,36],[6891725,1492899,36],[6891984,1492273,37],[6891984,1492273,37],[6892170,1491885,0],[6892170,1491885,0],[6892314,1491499,39],[6892314,1491499,39],[6892300,1490961,0],[6892300,1490961,0],[6892262,1490664,0],[6892262,1490664,0],[6892118,1490162,0],[6892118,1490162,0],[6891864,1489716,0],[6891864,1489716,0],[6891468,1489204,34]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"Schöneberger Brücke (Berlin)","points":[[6891468,1489204,34],[6891468,1489204,34]]},{"travelTime":291,"length":345.7379413612956,"endname":"target","type":"WALK","startname":"source","points":[[6891468,1489204,34],[6891468,1489204,34],[6891468,1489204,34],[6891409,1489125,36],[6891409,1489125,36],[6891397,1489108,36],[6891397,1489108,36],[6891380,1489084,36],[6891380,1489084,36],[6891349,1489044,39],[6891349,1489044,39],[6891342,1489036,39],[6891342,1489036,39],[6891335,1489028,39],[6891335,1489028,39],[6891447,1488911,37],[6891447,1488911,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]};
        routes = {"routes":[{"travelTime":2103,"length":4451.751742908207,"id":"id2","segments":[{"travelTime":981,"length":1157.9801890035826,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892470,1493898,38],[6892470,1493898,38],[6892454,1493891,38],[6892454,1493891,38],[6892415,1493920,38],[6892358,1493907,38],[6892358,1493907,38],[6892341,1493944,38],[6892341,1493944,38],[6892265,1493912,37],[6892265,1493912,37],[6892158,1493865,36],[6892158,1493865,36],[6892128,1493852,36],[6892128,1493852,36],[6892093,1493839,36],[6892093,1493839,36],[6891984,1493779,38],[6891967,1493722,39],[6891967,1493722,39],[6891959,1493689,39],[6891795,1493620,36],[6891795,1493620,36],[6891758,1493603,36],[6891758,1493603,36],[6891713,1493583,36],[6891713,1493583,36],[6891696,1493576,36],[6891696,1493576,36],[6891545,1493509,40],[6891545,1493509,40],[6891514,1493570,40],[6891514,1493570,40],[6891420,1493527,40],[6891420,1493527,40],[6891405,1493521,40],[6891405,1493521,40],[6891357,1493499,40],[6891357,1493499,40],[6891138,1493598,40],[6891138,1493598,40],[6891090,1493619,40],[6891090,1493619,40],[6891065,1493628,41],[6891065,1493628,41],[6891065,1493644,41],[6891065,1493644,41],[6891045,1493652,41],[6891045,1493652,41],[6891043,1493653,41],[6891043,1493653,41],[6891034,1493639,41],[6891034,1493639,41],[6891028,1493638,41],[6891028,1493638,41],[6890990,1493658,41],[6890990,1493658,41],[6890982,1493663,41],[6890982,1493663,41],[6890939,1493672,41],[6890939,1493672,41],[6890943,1493703,41],[6890943,1493703,41],[6890920,1493708,38],[6890920,1493708,38],[6890915,1493698,38],[6890915,1493698,38],[6890904,1493703,38]]},{"travelTime":0,"length":0,"endname":"U Kottbusser Tor (Berlin)","type":"TRANSFER","startname":"walk","points":[[6890904,1493703,0],[6890904,1493703,38]]},{"departureTime":41340,"travelTime":360,"routeShortName":"U1","arrivalTime":41700,"length":2389.4174458026732,"endname":"U Kottbusser Tor (Berlin)","type":"TRANSIT","startname":"U Möckernbrücke (Berlin)","routeType":400,"tripHeadSign":"S+U Warschauer Str. (Berlin)","isTransit":true,"points":[[6890904,1493703,0],[6890726,1492408,0],[6890726,1492408,0],[6890634,1490763,0],[6890634,1490763,0],[6890848,1489817,31]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"U Möckernbrücke (Berlin)","points":[[6890848,1489817,31],[6890848,1489817,31]]},{"travelTime":762,"length":904.3541081019515,"endname":"target","type":"WALK","startname":"source","points":[[6890848,1489817,31],[6890847,1489791,31],[6890847,1489791,31],[6890866,1489790,31],[6890866,1489790,31],[6890879,1489792,31],[6890873,1489730,31],[6890873,1489730,31],[6890872,1489715,31],[6890872,1489715,31],[6890900,1489713,31],[6890900,1489713,31],[6890896,1489684,31],[6890896,1489684,31],[6890891,1489610,31],[6890891,1489610,31],[6890905,1489503,31],[6890905,1489503,31],[6890911,1489483,31],[6890911,1489483,31],[6890930,1489427,37],[6890930,1489427,37],[6890952,1489385,35],[6890952,1489385,35],[6890975,1489344,35],[6890975,1489344,35],[6891056,1489273,35],[6891175,1489219,40],[6891175,1489219,40],[6891292,1489169,39],[6891292,1489169,39],[6891397,1489108,36],[6891397,1489108,36],[6891380,1489084,36],[6891380,1489084,36],[6891349,1489044,39],[6891349,1489044,39],[6891342,1489036,39],[6891342,1489036,39],[6891335,1489028,39],[6891335,1489028,39],[6891447,1488911,37],[6891447,1488911,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]};
        r360.LeafletUtil.fadeIn(routeLayer, r360.Util.parseRoutes(routes)[0], 500, "travelDistance", { color : 'blue', haloColor : "#ffffff" });



        // routes = {"routes":[{"travelTime":2422,"length":4174.75598977377,"id":"id2","segments":[{"travelTime":1420,"length":1676.9779867066186,"endname":"target","type":"WALK","points":[[6892476,1493884,37],[6892482,1493870,37],[6892482,1493870,37],[6892502,1493826,37],[6892502,1493826,37],[6892519,1493787,37],[6892519,1493787,37],[6892544,1493743,36],[6892544,1493743,36],[6892536,1493740,36],[6892536,1493740,36],[6892478,1493609,34],[6892478,1493609,34],[6892484,1493575,34],[6892484,1493575,34],[6892509,1493523,34],[6892509,1493523,34],[6892529,1493515,34],[6892575,1493417,36],[6892575,1493417,36],[6892570,1493388,36],[6892538,1493373,36],[6892555,1493335,37],[6892555,1493335,37],[6892487,1493298,37],[6892486,1493273,37],[6892486,1493273,37],[6892504,1493254,37],[6892504,1493254,37],[6892372,1493193,39],[6892372,1493193,39],[6892308,1493161,39],[6892308,1493161,39],[6892192,1493105,34],[6892192,1493105,34],[6892153,1493086,34],[6892153,1493086,34],[6891939,1492985,37],[6891939,1492985,37],[6891875,1492954,37],[6891875,1492954,37],[6891854,1492943,37],[6891854,1492943,37],[6891779,1492910,36],[6891779,1492910,36],[6891747,1492883,36],[6891747,1492883,36],[6891727,1492836,36],[6891727,1492836,36],[6891688,1492836,34],[6891669,1492855,34],[6891669,1492855,34],[6891554,1492798,35],[6891554,1492798,35],[6891457,1492752,35],[6891457,1492752,35],[6891433,1492740,35],[6891433,1492740,35],[6891361,1492707,35],[6891361,1492707,35],[6891044,1492553,38],[6891044,1492553,38],[6890847,1492460,38],[6890847,1492460,38],[6890774,1492429,37],[6890774,1492429,37],[6890759,1492422,37],[6890759,1492422,37],[6890733,1492411,37],[6890733,1492411,37],[6890725,1492408,37],[6890725,1492408,37],[6890726,1492408,37]]},{"travelTime":0,"length":0,"endname":"U Prinzenstr. (Berlin)","type":"TRANSFER","startname":"walk","points":[[6890726,1492408,0],[6890726,1492408,37]]},{"departureTime":42240,"travelTime":240,"routeShortName":"U1","arrivalTime":42480,"length":1593.4238949652006,"endname":"U Prinzenstr. (Berlin)","type":"TRANSIT","startname":"U Möckernbrücke (Berlin)","routeType":400,"tripHeadSign":"S+U Warschauer Str. (Berlin)","isTransit":true,"points":[[6890726,1492408,0],[6890634,1490763,0],[6890634,1490763,0],[6890848,1489817,31]]},{"travelTime":0,"length":0,"endname":"walk","type":"TRANSFER","startname":"U Möckernbrücke (Berlin)","points":[[6890848,1489817,31],[6890848,1489817,31]]},{"travelTime":762,"length":904.3541081019515,"endname":"target","type":"WALK","startname":"source","points":[[6890848,1489817,31],[6890847,1489791,31],[6890847,1489791,31],[6890866,1489790,31],[6890866,1489790,31],[6890879,1489792,31],[6890873,1489730,31],[6890873,1489730,31],[6890872,1489715,31],[6890872,1489715,31],[6890900,1489713,31],[6890900,1489713,31],[6890896,1489684,31],[6890896,1489684,31],[6890891,1489610,31],[6890891,1489610,31],[6890905,1489503,31],[6890905,1489503,31],[6890911,1489483,31],[6890911,1489483,31],[6890930,1489427,37],[6890930,1489427,37],[6890952,1489385,35],[6890952,1489385,35],[6890975,1489344,35],[6890975,1489344,35],[6891056,1489273,35],[6891175,1489219,40],[6891175,1489219,40],[6891292,1489169,39],[6891292,1489169,39],[6891397,1489108,36],[6891397,1489108,36],[6891380,1489084,36],[6891380,1489084,36],[6891349,1489044,39],[6891349,1489044,39],[6891342,1489036,39],[6891342,1489036,39],[6891335,1489028,39],[6891335,1489028,39],[6891447,1488911,37],[6891447,1488911,37],[6891486,1488870,37],[6891486,1488870,37],[6891504,1488852,37],[6891504,1488852,37],[6891491,1488838,37],[6891491,1488838,37],[6891408,1488825,37]]}]}]};
        // r360.LeafletUtil.fadeIn(routeLayer, r360.Util.parseRoutes(routes)[0], 500, "travelDistance", { color : 'blue', haloColor : "#ffffff" });

        // r360.RouteService.getRoutes(travelOptions, function(routes) {

            // r360.LeafletUtil.fadeIn(routeLayer, routes[0], 500, "travelDistance", { color : elevationColors[0].strokeColor, haloColor : "#ffffff" });

            // console.log(routes[0]);
        // });
    };

    // asd();

    /**
     * [updateAutocomplete Updates the label and latlng value of an autocomplete component, by a reverse geocoding request to nominatim.]
     * @param  {type} autoComplete [the autocomplete to update]
     * @param  {type} marker       [the marker from which the latlng object get's reverse geocoded.]
     */
    function updateAutocomplete(){

        for ( var j = 0 ; j < maxSources ; j++ ) {

            if ( typeof sourceMarkers[j] != 'number' ) {

                var sourceMarker        = sourceMarkers[j];
                sourceMarker.travelType = autoCompletes[j].getTravelType();
                sourceMarker.index      = autoCompletes[j].getIndex();

                var update = function(index) {

                    // update the street in the autocomplete
                    r360.Util.getAddressByCoordinates(sourceMarker.getLatLng(), 'de', function(json){

                        var displayName = r360.Util.formatReverseGeocoding(json);
                        autoCompletes[index].setValue({ firstRow : displayName, latlng : sourceMarker.getLatLng(), label : displayName });
                        autoCompletes[index].setFieldValue('Source: ' + (index + 1));
                        sourceMarker.bindPopup(displayName);
                    });
                };

                update(autoCompletes[j].getIndex());
            }
        }
    }

    function updateTargetAutocomplete(){

        // update the street in the autocomplete
        r360.Util.getAddressByCoordinates(targetMarker.getLatLng(), 'de', function(json){

            var displayName = r360.Util.formatReverseGeocoding(json);
            targetAutoComplete.setValue({ firstRow : displayName, latlng : targetMarker.getLatLng(), label : displayName });
            targetAutoComplete.setFieldValue(displayName);
            targetMarker.bindPopup(displayName);
        });
    }

    /**
     * [updateSource This method updates the polygons, and performs a reverse geocoding for the update of the
     * autoComplete and get's new routes if a target is defined.]
     */
    function updateSource() {

        getPolygons();
        updateAutocomplete();
        if ( targetMarker !== '' ) getRoutes();
    }

    /**
     * [updateTarget This method gets new routes and updates the target autocomplete with a reverse geocoding.]
     * @return {type} [description]
     */
    function updateTarget() {

        getRoutes();
        updateTargetAutocomplete();
    }

    /**
     * [createMarker Creates a leaflet awesome marker with predefined properties]
     * @param  {[LatLng]} latLng  [the lat/lng location of the marker]
     * @param  {type} icon    [the string value of font awesome icon, e.g. 'home' (no 'fa-')]
     * @param  {type} color   [the color of the marker, as defined by awesomeMarkers.css]
     * @param  {type} layer   [the layer to which to add the marker]
     * @param  {type} dragend [the callback function that is called if the marker is draged in the map]
     * @param  {type} popup   [the popup to show if someone clicks on the marker]
     * @return {[Marker]}         [the leaflet marker]
     */
    function createMarker(latLng, icon, color, layer, dragend, popup, index){

        var marker = L.marker(latLng, { draggable : true, icon: L.AwesomeMarkers.icon({ icon: icon, prefix : 'fa', markerColor: color })});
        if ( typeof popup != 'undefined') marker.bindPopup(popup);
        marker.on('dragend', dragend);

        sourceMarkers[index] = marker;

        for ( var i = 0 ; i < maxSources ; i++ )
            if ( typeof sourceMarkers[i] != 'number' )
                sourceMarkers[i].addTo(layer);

        return marker;
    }

    /**
     * [getRoutes This method performs a request to the r360 webservice for the configured source and target with the specified travel options.
     * The returned data from the service is then used to paint the routes on the map and to create a pretty popup with elevation data in the
     * leaflet marker popup.]
     */
    function getRoutes(){

        routeLayer.clearLayers();

        var travelOptions = r360.travelOptions();
        for ( var i = 0 ; i < maxSources ; i++ ) {
            if ( typeof sourceMarkers[i] != 'number' ) {

                var sourceMarker        = sourceMarkers[i];
                sourceMarker.travelType = autoCompletes[i].getTravelType();
                travelOptions.addSource(sourceMarker);
            }
        }

        travelOptions.setDate(date);
        travelOptions.setTime(time);
        travelOptions.setElevationEnabled(true);
        travelOptions.setWaitControl(waitControl);
        travelOptions.addTarget(targetMarker);

        r360.RouteService.getRoutes(travelOptions, function(routes) {

            var data         = [];
            var longestLabel = [];
            var html        =
                '<table class="table table-striped"> \
                    <thead>\
                        <tr>\
                          <th>Source</th>\
                          <th>Travel time</th>\
                          <th>Distance</th>\
                        </tr>\
                    </thead>';

            _.each(routes, function(route, index){

                currentRoute = route;
                r360.LeafletUtil.fadeIn(routeLayer, route, 500, "travelDistance", { color : elevationColors[index].strokeColor, haloColor : "#ffffff" });

                html +=
                    '<tr style="margin-top:5px;">\
                        <td class="routeModus routeModus'+index+'"><img style="height: 25px;" src="images/source'+index+'.png"></td>\
                        <td>' + r360.Util.secondsToHoursAndMinutes(currentRoute.getTravelTime()) + '</td>\
                        <td>' + currentRoute.getDistance().toFixed(2) + ' km / ' + (currentRoute.getDistance() * 0.621371).toFixed(2) +' mi</td>\
                    </tr>'

                var elevations = currentRoute.getElevations();

                if ( elevations.x.length > longestLabel.length)
                    longestLabel = elevations.x;

                data.push({
                    data        : elevations.y.reverse(),
                    fillColor   : "rgba(" + hexToRgb(elevationColors[index].fillColor).join(', ') + ", " +  elevationColors[index].fillColorOpacity + ")",
                    strokeColor : "rgba(" + hexToRgb(elevationColors[index].strokeColor).join(', ') + ", " +  elevationColors[index].strokeColorOpacity + ")",
                });
            });

            html += '</table>';

            targetMarker.bindPopup(html);
            targetMarker.openPopup();

            $('.routeModus0').css('background-color', "rgba(" + hexToRgb(elevationColors[0].fillColor).join(', ') + ", " +  elevationColors[0].fillColorOpacity + ")");
            $('.routeModus1').css('background-color', "rgba(" + hexToRgb(elevationColors[1].fillColor).join(', ') + ", " +  elevationColors[1].fillColorOpacity + ")");
            $('.routeModus2').css('background-color', "rgba(" + hexToRgb(elevationColors[2].fillColor).join(', ') + ", " +  elevationColors[2].fillColorOpacity + ")");
            $('.routeModus0').css('border', "1px solid rgba(" + hexToRgb(elevationColors[0].strokeColor).join(', ') + ", " +  elevationColors[0].strokeColorOpacity + ")");
            $('.routeModus1').css('border', "1px solid rgba(" + hexToRgb(elevationColors[1].strokeColor).join(', ') + ", " +  elevationColors[1].strokeColorOpacity + ")");
            $('.routeModus2').css('border', "1px solid rgba(" + hexToRgb(elevationColors[2].strokeColor).join(', ') + ", " +  elevationColors[2].strokeColorOpacity + ")");
        }, function(code, message){

            if ( 'travel-time-exceeded' == code )
                alert("The travel time to the given target exceeds the server limit.");
            if ( 'could-not-connect-point-to-network' == code )
                alert("We could not connect the target point to the network.");
        });
    };

    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {type} [description]
     */
    function getPolygons(){

        var index0 = _.indexOf(sourceMarkers, 0);
        var index1 = _.indexOf(sourceMarkers, 1);
        var index2 = _.indexOf(sourceMarkers, 2);

        // create source marker and make a polygon request
        if (  index0 == -1 || index1 == -1 || index2 == -1 ) {

            var travelOptions = r360.travelOptions();

            for ( var i = 0 ; i < maxSources ; i++ ) {
                if ( typeof sourceMarkers[i] != 'number' ) {

                    var sourceMarker        = sourceMarkers[i];
                    sourceMarker.travelType = autoCompletes[i].getTravelType();
                    travelOptions.addSource(sourceMarker);
                }
            }

            // travelOptions.addSource({lat : 52.501175722709434, lng : 13.373794555664062, travelType : 'transit'});
            // travelOptions.addSource({lat : 52.53224576102008, lng : 13.360444755304684, travelType : 'car'});

            if ( travelOptions.getSources().length > 0 ) {

                travelOptions.setIntersectionMode(intersectionButtons.getValue());
                travelOptions.setTravelTimes(travelTimeControl.getValues());
                // travelOptions.setTravelTimes([600,1200,1800,2400,3000,3600]);
                // travelOptions.setTravelTimes([3600]);
                travelOptions.setWaitControl(waitControl);
                travelOptions.setElevationEnabled(true);
                // travelOptions.disablePointReduction();
                // travelOptions.setPolygonSerializer('geojson');
                travelOptions.setDate(date);
                // travelOptions.setDate("20141010");
                travelOptions.setTime(time);

                var maxTravelTime = _.max(travelTimeControl.getValues());

                if ( maxTravelTime == 1200 || maxTravelTime == 2400 )
                    travelOptions.setMinPolygonHoleSize(10 * 1000 * 1000);
                if ( maxTravelTime == 3600 || maxTravelTime == 4800 )
                    travelOptions.setMinPolygonHoleSize(100 * 1000 * 1000);
                if ( maxTravelTime == 6000 || maxTravelTime == 7200 )
                    travelOptions.setMinPolygonHoleSize(1000 * 1000 * 1000);

                if ( r360.config.defaultPolygonLayerOptions.inverse )
                    travelOptions.setTravelTimes([_.max(travelTimeControl.getValues())]);

                // call the service
                r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){

                    polygonLayer.clearAndAddLayers(polygons);
                    // polygonLayer.fitMap();

                }, function(error) {

                    console.log(error);
                    alert("Sorry... an error occured. Please try again!");
                },
                'GET');
            }
        }
    }

    /**
     * [hexToRgb This method returns the rgb values of a hex color in form of an array.]
     * @param  {type} hex [the color in hex]
     * @return {type}     [an array with 3 entries for r, g and b]
     */
    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }
});