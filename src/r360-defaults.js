r360.config = {

    nominatimUrl        : 'http://geocode.route360.net/',  

    serviceUrl          : 'http://localhost:8080/api/',
    // serviceUrl          : 'http://144.76.246.52:8080/api/',
    serviceVersion      : 'v1',

    pathSerializer      : 'compact',
    maxRoutingTime      : 7200,
    //serviceUrl          : 'http://api.route360.net:8080/api/',
    //serviceUrl          : 'http://144.76.246.53:8080/api_bb/',
    //serviceUrl          : 'http://141.89.192.241:8080/api/',

    // options for the travel time slider; colors and lengths etc.
    defaultTravelTimeControlOptions : {
        travelTimes     : [
            { time : 600  , color : "#006837"},
            { time : 1200 , color : "#39B54A"},
            { time : 1800 , color : "#8CC63F"},
            { time : 2400 , color : "#F7931E"},
            { time : 3000 , color : "#F15A24"},
            { time : 3600 , color : "#C1272D"}
        ],
        position : 'topright',
        label: 'travel time',
        initValue: 1800
    },

    routeTypes  : [
        // berlin
        { routeType : 102  , color : "#006837"},
        { routeType : 400 , color : "#156ab8"},
        { routeType : 900 , color : "red"},
        { routeType : 700 , color : "#A3007C"},
        { routeType : 1000 , color : "blue"},
        { routeType : 109 , color : "#006F35"},
        { routeType : 100 , color : "red"},
        // new york
        { routeType : 1 , color : "red"}
    ],

    defaultNamePickerOptions : {
        serviceUrl : "http://geocode.route360.net:8983/solr/select?",
        position : 'topleft',
        reset : false,
        placeholder : ''
    },

    defaultRadioOptions: {
       position : 'topright',
       icon: "../img/bike.png"
    },

    defaultButtonOptions : {
        position : 'topright',
        icon     : 'ui-icon-info'
    },

    defaultTravelMode: {
        type : 'bike',
        speed : 15,
        uphill : 20,
        downhill : -10
    },

    // configuration for the Route360PolygonLayer
    defaultPolygonLayerOptions:{
        opacity : 0.8,
        strokeWidth: 5
    },

    i18n : {

        language            : 'en',
        departure           : { en : 'Departure',       de : 'Abfahrt' },
        line                : { en : 'Line',            de : 'Linie' },
        arrival             : { en : 'Arrival',         de : 'Ankunft' },
        from                : { en : 'From',            de : 'Von' },
        to                  : { en : 'To',              de : 'Nach' },
        travelTime          : { en : 'Travel time',     de : 'Reisezeit' },
        totalTime           : { en : 'Total time',      de : 'Gesamtzeit' },
        distance            : { en : 'Distance',        de : 'Distanz' },
        wait                : { en : 'Please wait!',    de : 'Bitte warten!' },
        elevation           : { en : 'Elevation',       de : 'Höhenunterschied' },
        timeFormat          : { en : 'a.m.',            de : 'Uhr' },
        noRouteFound        : { en : 'No route found!', de : 'Keine Route gefunden!' },
        monthNames          : { de : ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'] },
        dayNames            : { de : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag','Samstag'] },
        dayNamesMin         : { de : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] },
        get : function(key){

            var translation;
            _.each(_.keys(r360.config.i18n), function(aKey){
                if ( key == aKey ) translation = r360.config.i18n[key][r360.config.i18n.language];
            })

            return translation;
        }
    }
}