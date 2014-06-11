r360.config = {

    nominatimUrl        : 'http://geocode.route360.net/',  

    serviceUrl          : 'http://localhost:8080/api/',
    // serviceUrl          : 'http://144.76.246.52:8080/api/',
    serviceVersion      : 'v1',

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
        { routeType : 102  , color : "#006837"},
        { routeType : 400 , color : "#156ab8"},
        { routeType : 900 , color : "red"},
        { routeType : 700 , color : "#A3007C"},
        { routeType : 1000 , color : "blue"},
        { routeType : 109 , color : "#006F35"},
        { routeType : 100 , color : "red"}
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
    }
}