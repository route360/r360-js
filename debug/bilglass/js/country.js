// do not change these values
// this is a predefined travel day & time
var date = '20150910';
var time = '29000';

// all the visible markers are collected in this array
var sources  = [];

// all the temporary visible markers are collected in this array
var tempSources = [];

// timeout after which an error message is shown in milliseconds
r360.config.requestTimeout = 10000;
// set the service key
r360.config.serviceKey     = 'uhWrWpUhyZQy8rPfiC7X';
// the url of the route360 service
r360.config.serviceUrl     = 'https://dev.route360.net/norway/';
L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

// add the map and set the initial center to paris
var map = L.map('map', {
    zoomControl : false,
    scrollWheelZoom : true,
    contextmenu: true,
    contextmenuWidth: 160,
    contextmenuItems: [
        {
            text: 'New Bilglass marker',
            callback: newTempBilglassMarker
        },
        {
            text: 'New partner marker',
            callback: newTempPartnerMarker
        },
        {
            text: 'New competitor marker',
            callback: newTempCompetitorMarker
        }]}).setView([65.4354527, 16.1535915], 5);

// attribution to give credit to OSM map data and public transportation
var attribution ="<a href='http://www.mapquest.com/' target='_blank'>© MapQuest © OpenStreetMap</a> | Transit Data © <a href='https://ruter.no/' target='_blank'>Ruter</a> (Oslo) © <a href='https://www.kolumbus.no/en/' target='_blank'>Kolumbus</a> (Stavanger) | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";
// map tile from mapquest
var tileLayer = L.tileLayer('http://otile1.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', { maxZoom: 22, attribution: attribution }).addTo(map);
// define the travel time slider and 6 five minute intervals
r360.config.defaultTravelTimeControlOptions.travelTimes = [
    { time : 600 * 1 , color : "#006837", opacity : 1.0 },
    { time : 600 * 2 , color : "#39B54A", opacity : 1.0 },
    { time : 600 * 3 , color : "#8CC63F", opacity : 1.0 },
    { time : 600 * 4 , color : "#F7931E", opacity : 1.0 },
    { time : 600 * 5 , color : "#F15A24", opacity : 1.0 },
    { time : 600 * 6 , color : "#C1272D", opacity : 1.0 }
];
var travelTimeControl = r360.travelTimeControl({
    travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
    position    : 'topright', // this is the position in the map
    label       : 'Travel Time', // the label, customize for i18n
    unit        : 'min',
    initValue   : 30 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
});

// if someone releases the button we query the service again
travelTimeControl.onSlideStop(getPolygons);

// add to map
map.addControl(travelTimeControl);

// creating the checkboxes for the different place types
var poiTypeButtons = r360.checkboxButtonControl({
    buttons : [
        { icon: '<i style="font-size: 1.2em; color: blue;" class="ion-home"></i>',             label : "Bilglass",             key: "bilglass",          checked : false },
        { icon: '<i style="font-size: 1.2em; color: orange" class="ion-heart"></i> ',      label : "Partners",     key: "servicePartner",           checked : false  },
        { icon: '<i style="font-size: 1.2em; color: red" class="ion-alert-circled"></i> ', label : "Competitors",      key: "competitor", checked : false  }
    ],
    position : 'topleft',
    onChange : showMarkers
});

// add a radio element with all the different transport types
var buttonOptions = { 
    buttons : [
        // each button has a label which is displayed, a key, a tooltip for mouseover events 
        // and a boolean which indicates if the button is selected by default
        // labels may contain html
        { label: '<i class="fa fa-bicycle"></i>', key: 'bike',     
          tooltip: 'Cycling speed is on average 15km/h', checked : false },

        { label: '<i class="fa fa-male"></i>', key: 'walk',     
          tooltip: 'Walking speed is on average 5km/h', checked : false  },

        { label: '<i class="fa fa-car"></i>', key: 'car',      
          tooltip: 'Car speed is limited by speed limit', checked : true },

        { label: '<i class="fa fa-bus"></i>', key: 'transit',  
          tooltip: '', checked : false }
    ]
};

// create a new readio button control with the given options
var travelTypeButtons = r360.radioButtonControl(buttonOptions);
travelTypeButtons.onChange(getPolygons);

// adding order is important for visual effect
map.addControl(poiTypeButtons);
map.addControl(travelTypeButtons);

// creating one layer for all markers
var shopLayerGroup = L.featureGroup().addTo(map);

// creating one layer temp markers
var tempLayer = L.featureGroup().addTo(map);

// and one layer for the polygons
var polygonLayer          = r360.leafletPolygonLayer({inverse : false, extendWidthX: 1000, extendWidthY: 1000}).addTo(map);

// defining markers for every type of sports facility, prefix stands for the used marker symbol font
var bilglassIcon            = L.AwesomeMarkers.icon({ icon: 'ion-home',              prefix : 'ion', markerColor: 'blue' });
var partnerIcon             = L.AwesomeMarkers.icon({ icon: 'ion-heart',         prefix : 'ion', markerColor: 'orange' });
var competitorIcon          = L.AwesomeMarkers.icon({ icon: 'ion-alert-circled', prefix : 'ion', markerColor: 'red' });

// add the controls to the map
var waitControl = r360.waitControl({ position : 'bottomright' });
map.addControl(waitControl);
map.addControl(L.control.zoom({ position : 'bottomright' }));

$('span[lang="de"]').hide();
$('span[lang="no"]').hide();


// ==================================================================================================================================
// ----------------------------------------------------------------------------------------------------------------------------------
// 
//                                              END OF INITIALIZE
// 
// ----------------------------------------------------------------------------------------------------------------------------------
// ==================================================================================================================================

function showMarkers(){

    // remove all the preselected places from the map
    shopLayerGroup.clearLayers();
    // and from this collection
    sources = [];

    // get the value from the button
    var poiTypeOptions = poiTypeButtons.getValue();

    // we go through all the given places
    places.features.forEach(function(feature){

        // coordinates need to be turned around. Otherwise we end up east of africa
        var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

        // Own Shops
        if ( feature.properties["company"] == "Riis Bilglass" && poiTypeOptions.bilglass ){
            
            sources.push(L.marker(latlng, {
                icon: bilglassIcon,
                contextmenu: true,
                contextmenuItems: [{
                    // Add the context menu and bind marker delete function
                    text: 'Delete marker',
                    callback: deleteMarker,
                    index: 0,
                }, {
                    separator: true,
                    index: 1
                }]}).addTo(shopLayerGroup).bindPopup( 
                    "<h4> " + feature.properties["name"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Company: </td><td>"   + feature.properties["company"] + "</td></tr>" +
                    "<tr><td> Adress: </td><td>"     + feature.properties["adresse_full"] + "</td></tr>" +
                    "<tr><td> URL: </td><td><a href='"    + feature.properties["url"] + "' target='_blank'>" + feature.properties["url"] + "</a></td></tr>" +
                    "</table>"));
        }

        // Service Partners
        if ( feature.properties["company"] == "Riis Bilglass Servicepartner" && poiTypeOptions.servicePartner ){

            sources.push(L.marker(latlng, {
                icon: partnerIcon,
                contextmenu: true,
                contextmenuItems: [{
                    // Add the context menu and bind marker delete function
                    text: 'Delete marker',
                    callback: deleteMarker,
                    index: 0,
                }, {
                    separator: true,
                    index: 1
                }]}).addTo(shopLayerGroup).bindPopup( 
                    "<h4> " + feature.properties["name"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Company: </td><td>"   + feature.properties["company"] + "</td></tr>" +
                    "<tr><td> Adress: </td><td>"     + feature.properties["adresse_full"] + "</td></tr>" +
                    "<tr><td> URL: </td><td><a href='"    + feature.properties["url"] + "' target='_blank'>" + feature.properties["url"] + "</a></td></tr>" +
                    "</table>"));
        }

        // Competitors
        if( feature.properties["company"] != "Riis Bilglass" && feature.properties["company"] != "Riis Bilglass Servicepartner"  && poiTypeOptions.competitor){

            sources.push(L.marker(latlng, {
                icon: competitorIcon,
                contextmenu: true,
                contextmenuItems: [{
                    // Add the context menu and bind marker delete function
                    text: 'Delete marker',
                    callback: deleteMarker,
                    index: 0,
                }, {
                    separator: true,
                    index: 1
                }]}).addTo(shopLayerGroup).bindPopup( 
                    "<h4> " + feature.properties["name"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Company: </td><td>"   + feature.properties["company"] + "</td></tr>" +
                    "<tr><td> Adress: </td><td>"     + feature.properties["adresse_full"] + "</td></tr>" +
                    "<tr><td> URL: </td><td><a href='"    + feature.properties["url"] + "' target='_blank'>" + feature.properties["url"] + "</a></td></tr>" +
                    "</table>"));
        }

    });
    
    // get the polygons
    getPolygons();
};

// helper var for marker deletion
var lastRelatedTarget;

// listener to save context marker to lastRelatedTarget when context menu is shown
map.on("contextmenu.show", function(e){
    console.log(e.relatedTarget);
  lastRelatedTarget = e.relatedTarget;
});

// delete marker from sources
function deleteMarker(e) {
    console.log("remove" + lastRelatedTarget);
    shopLayerGroup.removeLayer(lastRelatedTarget);
    tempLayer.removeLayer(lastRelatedTarget);
    sources.forEach(function (value, index) {
          if(sources[index]._leaflet_id == lastRelatedTarget._leaflet_id) {
              sources.splice(index, 1);
              return;
          }
    });
    getPolygons();
}

// delete marker from tempSources
function deleteTempMarker(e) {
    console.log("remove" + lastRelatedTarget);
    shopLayerGroup.removeLayer(lastRelatedTarget);
    tempLayer.removeLayer(lastRelatedTarget);
    tempSources.forEach(function (value, index) {
          if(tempSources[index]._leaflet_id == lastRelatedTarget._leaflet_id) {
              tempSources.splice(index, 1);
              return;
          }
    });
    getPolygons();
}

// new bilglass marker
function newTempBilglassMarker(e) {
    var icon = L.AwesomeMarkers.icon({ icon: 'ion-home', prefix : 'ion', markerColor: 'green' });
    newTempMarker(e,icon);
}

// new service partner marker
function newTempPartnerMarker(e) {
    var icon = L.AwesomeMarkers.icon({ icon: 'ion-heart', prefix : 'ion', markerColor: 'green' });
    newTempMarker(e,icon);
}

// new competitor marker
function newTempCompetitorMarker(e) {
    var icon = L.AwesomeMarkers.icon({ icon: 'ion-alert-circled', prefix : 'ion', markerColor: 'green' });
    newTempMarker(e,icon);
}

// function to create new markers
function newTempMarker(e,icon) {
    tempSources.push(L.marker(e.latlng, {
                icon: icon,
                contextmenu: true,
                contextmenuItems: [{
                    text: 'Delete marker',
                    callback: deleteTempMarker,
                    index: 0
                }, {
                    separator: true,
                    index: 1
                }]})
                .addTo(tempLayer).bindPopup(
                    "<h4> Temporary Marker </h4>" +
                    "<table>" +
                    "<tr><td> Company: </td><td> Bilglass</td></tr>" +
                    "<tr><td> Adress: </td><td> Temporary Marker</td></tr>" +
                    "<tr><td> URL: </td><td> Temporary Marker</td></tr>" +
                    "</table>"));
    getPolygons();
}

/**
 * getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
 * The returned travel type polygons are then painted on the map
 */
function getPolygons(){

    // merge static and temp sources
    var allSources = sources.concat(tempSources);

    // clear everything
    polygonLayer.clearLayers();

    // just a safety precaution to not send a faulty request
    if ( allSources.length == 0 ) {
        return;
    }
    var travelOptions = r360.travelOptions();
    // get the selected travel type
    travelOptions.setTravelType(travelTypeButtons.getValue());
    // set all the places which matched the selected buttons
    travelOptions.setSources(allSources);
    // get all the travel times from the travel time slider
    travelOptions.setTravelTimes(travelTimeControl.getValues());
    // show the waiting div on the map
    travelOptions.setWaitControl(waitControl);
    // set date and time
    travelOptions.setDate(date);
    travelOptions.setTime(time);
    // square meter of areas that are shown as hole, no need to change
    travelOptions.setMinPolygonHoleSize(travelTimeControl.getMaxValue() * 50000);

    // call the service
    r360.PolygonService.getTravelTimePolygons(
        // the options for this request
        travelOptions, 
        // what should happen if everything works as expected
        function(polygons){

            // remove the old polygon and add the new one
            // and zoom as far in as possible (see the whole polygon)
            polygonLayer.clearAndAddLayers(polygons, false);
        }, 
        // what should happen if something does not work as expected
        function(error) {
            alert("Sorry... an error occured. Please try again!");
        }, 
        // make a post request, because get is to long with hundreds of markers
        'POST'
    );
}
