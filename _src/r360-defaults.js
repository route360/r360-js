r360.config = {

    serviceVersion  : 'v1',
    pathSerializer  : 'compact',
    requestTimeout  : 10000,
    maxRoutingTime  : 3600,
    maxRoutingLength : 100000,
    bikeSpeed       : 15,
    bikeUphill      : 20,
    bikeDownhill    : -10,
    walkSpeed       : 5,
    walkUphill      : 10,
    walkDownhill    : 0,
    travelTimes     : [300, 600, 900, 1200, 1500, 1800],
    travelType      : "walk",
    logging         : false,
    rushHour        : false,

    // options for the travel time slider; colors and lengths etc.
    defaultTravelTimeControlOptions : {
        travelTimes     : [
            { time : 300  , color : "#006837", opacity : 0.1 },
            { time : 600  , color : "#39B54A", opacity : 0.2 },
            { time : 900  , color : "#8CC63F", opacity : 0.3 },
            { time : 1200 , color : "#F7931E", opacity : 0.4 },
            { time : 1500 , color : "#F15A24", opacity : 0.5 },
            { time : 1800 , color : "#C1272D", opacity : 1.0 }
        ],
        position : 'topright',
        label: 'travel time',
        initValue: 30
    },

    routeTypes  : [

        // non transit
        { routeType : 'WALK'     , color : "red",   haloColor : "white"},
        { routeType : 'BIKE'     , color : "#558D54",   haloColor : "white"},
        { routeType : 'CAR'      , color : "#558D54",   haloColor : "white"},
        { routeType : 'TRANSFER' , color : "#C1272D",   haloColor : "white"},

        // berlin
        { routeType : 102        , color : "#006837",   haloColor : "white" },
        { routeType : 400        , color : "#156ab8",   haloColor : "white" },
        { routeType : 900        , color : "red",       haloColor : "white" },
        { routeType : 700        , color : "#A3007C",   haloColor : "white" },
        { routeType : 1000       , color : "blue",      haloColor : "white" },
        { routeType : 109        , color : "#006F35",   haloColor : "white" },
        { routeType : 100        , color : "red",       haloColor : "white" },
        // new york      
        { routeType : 1          , color : "red",       haloColor : "red"},
        { routeType : 2          , color : "blue",      haloColor : "blue"},
        { routeType : 3          , color : "yellow",    haloColor : "yellow"},
        { routeType : 0          , color : "green",     haloColor : "green"},
        { routeType : 4          , color : "orange",    haloColor : "orange"},
        { routeType : 5          , color : "red",       haloColor : "red"},
        { routeType : 6          , color : "blue",      haloColor : "blue"},
        { routeType : 7          , color : "yellow",    haloColor : "yellow" }
    ],

    photonPlaceAutoCompleteOptions : {
        serviceUrl : "https://service.route360.net/geocode/",
        position : 'topleft',
        reset : false,
        reverse : false,
        placeholder : 'Select source',
        maxRows : 5,
        width : 300
    },

    defaultRadioOptions: {
       position : 'topright',
    },

    // configuration for the Route360PolygonLayer
    defaultPolygonLayerOptions:{
        opacity : 0.4,
        strokeWidth: 30,

        tolerance: 15,

        // background values only matter if inverse = true
        backgroundColor : 'black',
        backgroundOpacity : 0.5,
        inverse : false,

        animate : false,
        animationDuration : 1
    }
}
