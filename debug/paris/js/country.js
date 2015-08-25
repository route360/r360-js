$(document).ready(function(){

    var date = '20150813';
    var time = '39000';
    var sources  = [];

    // set the service key, this is a demo key
    // please contact us and request your own key
    r360.config.requestTimeout = 1000000;
    r360.config.serviceKey     = 'uhWrWpUhyZQy8rPfiC7X';
    r360.config.serviceUrl     = 'http://dev.route360.net/api_france/';
    r360.config.serviceUrl     = 'http://localhost:8080/api/';
    L.AwesomeMarkers.Icon.prototype.options.prefix = 'ion';

    // add the map and set the initial center to berlin
    var map = L.map('map', {zoomControl : false, scrollWheelZoom : false}).setView([48.86181000, 2.34679000], 12);
    // attribution to give credit to OSM map data and VBB for public transportation 
    var attribution ="<a href='https://www.mapbox.com/about/maps/' target='_blank'>© Mapbox © OpenStreetMap</a> | Transit Data © <a href='https://code.google.com/p/googletransitdatafeed/wiki/PublicFeeds' target='_blank'>Paris</a> | developed by <a href='http://www.route360.net/de/' target='_blank'>Route360°</a>";

    // initialising the base map. To change the base map just change following
    // lines as described by cloudmade, mapbox etc..
    // note that mapbox is a paided service mi.0ad4304c
    var tileLayer = L.tileLayer('https://a.tiles.mapbox.com/v3/mi.0ad4304c/{z}/{x}/{y}.png', { maxZoom: 22, attribution: attribution }).addTo(map);

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
        label       : 'Travel time', // the label, customize for i18n
        unit        : 'min',
        initValue   : 5 // the inital value has to match a time from travelTimes, e.g.: 40m == 2400s
    });

    travelTimeControl.onSlideStop(getPolygons);
    
    // add to map
    map.addControl(travelTimeControl);

    // creating the checkboxes
    var poiTypeButtons = r360.checkboxButtonControl({
        buttons : [
            { icon: '<i class="ion-waterdrop"></i>',           label : "Piscine",                 key: "swimmingPool",            checked : false },
            { icon: '<i class="ion-ios-tennisball"></i> ',     label : "Court de tennis",         key: "tennisCourt",             checked : false  },
            { icon: '<i class="ion-home"></i> ',               label : "Salle de sport",          key: "multiSportsIndoorHall",   checked : false  },
            { icon: '<i class="ion-ios-football"></i> ',       label : "Terrain de football",     key: "footBallField",           checked : false  }
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

    map.addControl(poiTypeButtons);
    map.addControl(travelTypeButtons);

    // creating one layer for all markers
    var sportsFacilitiesLayer   = L.featureGroup().addTo(map);
    var polygonLayer  = r360.leafletPolygonLayer({inverse : false }).addTo(map);

    // defining markers for every type of sports facility
    var swimmingPoolIcon            = L.AwesomeMarkers.icon({ icon: 'ion-waterdrop', prefix : 'ion', markerColor: 'green' });
    var tennisCourtIcon             = L.AwesomeMarkers.icon({ icon: 'ion-ios-tennisball', prefix : 'ion', markerColor: 'red' });
    var multiSportsIndoorHallIcon   = L.AwesomeMarkers.icon({ icon: 'ion-home', prefix : 'ion', markerColor: 'blue' });
    var footBallFieldIcon           = L.AwesomeMarkers.icon({ icon: 'ion-ios-football', prefix : 'ion', markerColor: 'orange' });


    function showMarkers(){

        sportsFacilitiesLayer.clearLayers();
        sources = [];

        var poiTypeOptions = poiTypeButtons.getValue();

        places.features.forEach(function(feature){

            // coordinates need to be turned around. Otherwise we end up east of africa
            var ll = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]];

            // type 1 = swimming pool
            if ( feature.properties["Code Famille"] == 1 && poiTypeOptions.swimmingPool ){                
                
                sources.push(L.marker(ll, {icon: swimmingPoolIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                        "<h4> " + feature.properties["Nom de l'installation"] + " (" + feature.properties['ID'] + ")</h4>" +
                        "<table>" +
                        "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                        "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                        "<tr><td> Longueur du bassin: </td><td>"    + feature.properties["Longueur du Bassin"] + "</td></tr>" +
                        "</table>"));
            }

            // type 5 = tennis court
            if ( feature.properties["Code Famille"] == 5 && poiTypeOptions.tennisCourt ){

                var marker = L.marker(ll, {icon: tennisCourtIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + " (" + feature.properties['ID'] + ")</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "</table>");

                marker.id = feature.properties['ID'];
                sources.push(marker);
            }

            // type 19 = multisports indoor hall
            if( feature.properties["Code Famille"] == 19 && poiTypeOptions.multiSportsIndoorHall){

                var marker = L.marker(ll, {icon: multiSportsIndoorHallIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + " (" + feature.properties['ID'] + ")</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "</table>");

                marker.id = feature.properties['ID'];
                sources.push(marker);
            }

            // type 28 = football field
            if ( feature.properties["Code Famille"] == 28 && poiTypeOptions.footBallField ) {
                
                sources.push(L.marker(ll, {icon: footBallFieldIcon}).addTo(sportsFacilitiesLayer).bindPopup( 
                    "<h4> " + feature.properties["Nom de l'installation"] + "</h4>" +
                    "<table>" +
                    "<tr><td> Nom de l’équipement: </td><td>"   + feature.properties["Nom de l'équipement"] + "</td></tr>" +
                    "<tr><td> Type d’équipement: </td><td>"     + feature.properties["Type d'équipement"] + "</td></tr>" +
                    "<tr><td> Type de terrain: </td><td>"    + feature.properties["Type de terrain"] + "</td></tr>" +
                    "</table>"));
            }
        });
        
        console.log(sources.length);
        getPolygons();
    };

    // add the controls to the map
    map.addControl(L.control.zoom({ position : 'bottomleft' }));
    var waitControl = r360.waitControl({ position : 'bottomright' });
    map.addControl(waitControl);

    $('span[lang="de"]').hide();
    $('span[lang="no"]').hide();

    showMarkers();

    // ==================================================================================================================================
    // ----------------------------------------------------------------------------------------------------------------------------------
    // 
    //                                              END OF INITIALIZE
    // 
    // ----------------------------------------------------------------------------------------------------------------------------------
    // ==================================================================================================================================


    /**
     * [getPolygons This method performs a webservice request to the r360 polygon service for the specified source and travel options.
     * The returned travel type polygons are then painted on the map]
     * @return {[type]} [description]
     */
    function getPolygons(){

        // http://localhost:8080/api/v1/polygon?cfg=%7B%22sources%22%3A%5B%7B%22lat%22%3A48.8719%2C%22lng%22%3A2.25966%2C%22id%22%3A%22%22%2C%22tm%22%3A%7B%22walk%22%3A%7B%7D%7D%7D%5D%2C%22polygon%22%3A%7B%22values%22%3A%5B60%2C120%2C180%2C240%2C300%5D%2C%22minPolygonHoleSize%22%3A500000%7D%7D&cb=jQuery110207376567316241562_1440427897014&key=uhWrWpUhyZQy8rPfiC7X&_=1440427897015

        if ( sources.length == 0 ) {

            polygonLayer.clearLayers();
            return;
        }

        var travelOptions = r360.travelOptions();
        travelOptions.setTravelType(travelTypeButtons.getValue());
        travelOptions.setSources(sources);
        travelOptions.setTravelTimes(travelTimeControl.getValues());

        if ( polygonLayer.getInverse() )
            travelOptions.setTravelTimes([_.max(travelTimeControl.getValues())]);

        // travelOptions.setTravelTimes([4 * 60, 5 * 60, 6 * 60]);
        // travelOptions.setTravelTimes([5 * 60]);
        // travelOptions.setTravelTimes([300, 600, 900, 1200]);

        travelOptions.setWaitControl(waitControl);
        travelOptions.setDate(date);
        travelOptions.setTime(time);
        travelOptions.setMinPolygonHoleSize(500000);

        // call the service
        r360.PolygonService.getTravelTimePolygons(travelOptions, function(polygons){

            polygonLayer.clearAndAddLayers(polygons);
            polygonLayer.fitMap();
            
        }, function(error) {

            alert("Sorry... an error occured. Please try again!");
        }, 
        // make a post request, because get is to long with hundreds of markers
        'POST');
    }
});