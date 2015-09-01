$(document).ready(function(){

    // do not change these values
    // this is a predefined travel day 
    var date = '20150813';
    // this is a predefined time of the day = h * 3600 + m * 60 + secs
    var time = '39600';

    // all the visible markers are collected in this array
    var sources  = [];

    // timeout after which an error message is shown in milliseconds
    r360.config.requestTimeout = 10000;
    // set the service key
    r360.config.serviceKey     = 'VG298MNJIQXB3VR1URPA';
    // the url of the route360 service
    r360.config.serviceUrl     = 'http://api2-eu.route360.net/france/';
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

    // add the map and set the initial center to paris
    var map = L.map('map', {zoomControl : false, scrollWheelZoom : true}).setView([48.86181000, 2.34679000], 13);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | Transit Data © <a href='http://opendatasoft.com' target='_blank'>OpenDataSoft</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    var mapStyleId = 'mi.0ad4304c';
    // note that mapbox is a paided service 
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/'+mapStyleId+'/{z}/{x}/{y}.png', { maxZoom: 22, attribution: attribution }).addTo(map);

    // define the travel time slider and 6 five minute intervals 
    r360.config.defaultTravelTimeControlOptions.travelTimes = [
        { time : 600 * 1 * 0.5, color : "#006837", opacity : 1.0 },
        { time : 600 * 2 * 0.5, color : "#39B54A", opacity : 1.0 },
        { time : 600 * 3 * 0.5, color : "#8CC63F", opacity : 1.0 },
        { time : 600 * 4 * 0.5, color : "#F7931E", opacity : 1.0 },
        { time : 600 * 5 * 0.5, color : "#F15A24", opacity : 1.0 },
        { time : 600 * 6 * 0.5, color : "#C1272D", opacity : 1.0 }
    ];
    var travelTimeControl = r360.travelTimeControl({
        travelTimes : r360.config.defaultTravelTimeControlOptions.travelTimes,
        position    : 'topright', // this is the position in the map
        label       : 'Temps de Voyage', // the label, customize for i18n
        unit        : 'min',
        initValue   : 15 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    // if someone releases the button we query the service again
    travelTimeControl.onSlideStop(getPolygons);
    
    // add to map
    map.addControl(travelTimeControl);

    // creating the checkboxes for the different place types
    var poiTypeButtons = r360.checkboxButtonControl({
        buttons : [
            { icon: '<i style="font-size: 1.2em; color: blue;" class="ion-waterdrop"></i>',             label : "Piscine",             key: "swimmingPool",          checked : false },
            { icon: '<i style="font-size: 1.2em; color: orange" class="ion-ios-tennisball"></i> ',      label : "Court de tennis",     key: "tennisCourt",           checked : false  },
            { icon: '<i style="font-size: 1.2em; color: red" class="ion-ios-basketball-outline"></i> ', label : "Salle de sport",      key: "multiSportsIndoorHall", checked : false  },
            { icon: '<i style="font-size: 1.2em; color: green" class="ion-ios-football"></i> ',         label : "Terrain de football", key: "footBallField",         checked : false  }
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
              tooltip: 'Walking speed is on average 5km/h', checked : true  },

            { label: '<i class="fa fa-car"></i>', key: 'car',      
              tooltip: 'Car speed is limited by speed limit', checked : false },

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
    var sportsFacilitiesLayer = L.featureGroup().addTo(map);
    // and one layer for the polygons
    var polygonLayer          = r360.leafletPolygonLayer({inverse : false}).addTo(map);

    // defining markers for every type of sports facility, prefix stands for the used marker symbol font
    var swimmingPoolIcon            = L.AwesomeMarkers.icon({ icon: 'ion-waterdrop',              prefix : 'ion', markerColor: 'blue' });
    var tennisCourtIcon             = L.AwesomeMarkers.icon({ icon: 'ion-ios-tennisball',         prefix : 'ion', markerColor: 'orange' });
    var multiSportsIndoorHallIcon   = L.AwesomeMarkers.icon({ icon: 'ion-ios-basketball-outline', prefix : 'ion', markerColor: 'red' });
    var footBallFieldIcon           = L.AwesomeMarkers.icon({ icon: 'ion-ios-football',           prefix : 'ion', markerColor: 'green' });

    // add the controls to the map
    map.addControl(L.control.zoom({ position : 'bottomright' }));
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);

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
        sportsFacilitiesLayer.clearLayers();
        // and from this collection
        sources = [];

        // get the value from the button
        var poiTypeOptions = poiTypeButtons.getValue();

        // we go through all the given places
        places.features.forEach(function(feature){

            // coordinates need to be turned around. Otherwise we end up east of africa
            var latlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

            // type 1 = swimming pool
            if ( feature.properties["Code Famille"] == 1 && poiTypeOptions.swimmingPool ){                
                
                sources.push(L.marker(latlng, {icon: swimmingPoolIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                        "<h4> " + feature.properties["Nom de l'installation"] + "</h4>" +
                        "<table>" +
                        "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                        "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                        "<tr><td> Longueur du bassin: </td><td>"    + feature.properties["Longueur du Bassin"] + "</td></tr>" +
                        "</table>"));
            }

            // type 5 = tennis court
            if ( feature.properties["Code Famille"] == 5 && poiTypeOptions.tennisCourt ){

                sources.push(L.marker(latlng, {icon: tennisCourtIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "</table>"));
            }

            // type 19 = multisports indoor hall
            if( feature.properties["Code Famille"] == 19 && poiTypeOptions.multiSportsIndoorHall){

                sources.push(L.marker(latlng, {icon: multiSportsIndoorHallIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "</table>"));
            }

            // type 28 = football field
            if ( feature.properties["Code Famille"] == 28 && poiTypeOptions.footBallField ) {
                
                sources.push(L.marker(latlng, {icon: footBallFieldIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "<tr><td> Type de terrain: </td><td>"    + feature.properties["Type de terrain"] + "</td></tr>" +
                    "</table>"));
            }
        });
        
        // get the polygons
        getPolygons();
    };

    /**
     * getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map
     */
    function getPolygons(){

        // just a safety precaution to not send a faulty request
        if ( sources.length == 0 ) {

            polygonLayer.clearLayers();
            return;
        }

        var travelOptions = r360.travelOptions();
        // get the selected travel type
        travelOptions.setTravelType(travelTypeButtons.getValue());
        // set all the places which matched the selected buttons
        travelOptions.setSources(sources);
        // get all the travel times from the travel time slider
        travelOptions.setTravelTimes(travelTimeControl.getValues());
        // show the waiting div on the map
        travelOptions.setWaitControl(waitControl);
        // set date and time
        travelOptions.setDate(date);
        travelOptions.setTime(time);
        // square meter of areas that are shown as hole, no need to change
        travelOptions.setMinPolygonHoleSize(500000);

        // call the service
        r360.PolygonService.getTravelTimePolygons(
            // the options for this request
            travelOptions, 
            // what should happen if everything works as expected
            function(polygons){

                // remove the old polygon and add the new one
                // and zoom as far in as possible (see the whole polygon)
                polygonLayer.clearAndAddLayers(polygons, true);
            }, 
            // what should happen if something does not work as expected
            function(error) {

                alert("Sorry... an error occured. Please try again!");
            }, 
            // make a post request, because get is to long with hundreds of markers
            'POST'
        );
    }
});