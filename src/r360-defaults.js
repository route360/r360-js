r360.config = {

    serviceUrl      : 'https://api.route360.net/api_dev/',
    serviceUrl      : 'http://localhost:8080/api/',
    nominatimUrl    : 'https://geocode.route360.net/',
    osmServiceUrl   : 'https://api.route360.net/r360-osm-api-norway/',
    serviceVersion  : 'v1',
    pathSerializer  : 'compact',
    requestTimeout  : 10000,
    maxRoutingTime  : 3600,
    bikeSpeed       : 15,
    bikeUphill      : 20,
    bikeDownhill    : -10,
    walkSpeed       : 5,
    walkUphill      : 10,
    walkDownhill    : 0,
    travelTimes     : [300, 600, 900, 1200, 1500, 1800],
    travelType      : "walk",
    logging         : false,

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

    defaultPlaceAutoCompleteOptions : {
        serviceUrl : "https://geocode.route360.net/solr/select?",
        position : 'topleft',
        reset : false,
        reverse : false,
        placeholder : 'Select source',
        maxRows : 5,
        width : 300
    },

    photonPlaceAutoCompleteOptions : {
        serviceUrl : "https://geocode2.route360.net/photon/api?",
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
    },

    i18n : {

        language             : 'en',
        configuredLangguages : ['en', 'de', 'no'],

        slow                 : { en : 'Slow',
                                 de : 'Langsam', 
                                 no : 'Sakte'},
        
        medium               : { en : 'Medium',
                                 de : 'Mittel', 
                                 no : 'Medium'},

        fast                 : { en : 'Fast',
                                 de : 'Schnell', 
                                 no : 'Raskt' },

        departure            : { en : 'Departure',
                                 de : 'Abfahrt', 
                                 no : 'TODO TRANSLATION: '},
        
        placeholderSrc       : { en : 'Select source!',
                                 de : 'Start wählen!',   
                                 no : 'Velg start!'},
        
        placeholderTrg       : { en : 'Select target!',
                                 de : 'Ziel wählen!' ,   
                                 no : 'Velg en destinasjon!' },
        
        line                 : { en : 'Line',
                                 de : 'Linie', 
                                 no : 'TODO TRANSLATION: ' },
        
        arrival              : { en : 'Arrival',
                                 de : 'Ankunft',
                                 no : 'TODO TRANSLATION: ' },
        
        from                 : { en : 'From',
                                 de : 'Von' , 
                                 no : 'TODO TRANSLATION: '},
        
        to                   : { en : 'To',
                                 de : 'Nach', 
                                 no : 'TODO TRANSLATION: ' },
        
        travelTime           : { en : 'Travel time',
                                 de : 'Reisezeit', 
                                 no : 'Reisetid' },
        
        totalTime            : { en : 'Total time',
                                 de : 'Gesamtzeit', 
                                 no : 'TODO TRANSLATION: ' },
       
        batteryCapacity      : { en : 'Battery capacity: ',
                                 de : 'Akkuleistung: ', 
                                 no : 'TODO TRANSLATION: ' },
       
        distance             : { en : 'Distance',
                                 de : 'Distanz', 
                                 no : 'Avstand' },
        
        wait                 : { en : 'Please wait!',
                                 de : 'Bitte warten!' ,  
                                 no : 'Vennligst vent!' },
       
        polygonWait          : { en : 'Calculating reachable area!',
                                 de : 'Berechne erreichbare Fläche!' ,  
                                 no : 'TODO TRANSLATION' },
       
        routeWait            : { en : 'Searching route to target(s)!',
                                 de : 'Suche Route zum Ziel!' ,  
                                 no : 'TODO TRANSLATION' },
       
        timeWait             : { en : 'Getting travel times to target(s)!',
                                 de : 'Berechne Reisezeiten für Ziele!' ,  
                                 no : 'TODO TRANSLATION' },
       
        osmWait              : { en : 'Searching for points of interests!',
                                 de : 'Suche nach Sehenswürdigkeiten!' ,  
                                 no : 'TODO TRANSLATION' },
       
        populationWait       : { en : 'Calculating population statistics!',
                                 de : 'Berechne Bevölkerungsstatistik!',
                                 no : 'TODO TRANSLATION' },
 
        elevation            : { en : 'Elevation',       
                                 de : 'Höhenunterschied',
                                 no : 'Stigning' },
        
        timeFormat           : { en : 'a.m.',            
                                 de : 'Uhr',
                                 no : 'TODO_TRANSLATION' },
        
        reset                : { en : 'Reset input',     
                                 de : 'Eingeben löschen', 
                                 no : 'Tilbakestill innspill' },
        
        reverse              : { en : 'Switch source and target',   
                                 de : 'Start und Ziel tauschen', 
                                 no : 'Sett på start og slutt' },
        
        settings             : { en : 'Switch travel type',   
                                 de : 'Reisemodus wechseln', 
                                 no : 'TODO TRANSLATION' },
        
        noRouteFound         : { en : 'No route found!', 
                                 de : 'Keine Route gefunden!',
                                 no : 'TODO TRANSLATION' },
        
        monthNames           : { en : ['January','February','March','April','May','June','July','August','September','October','November','December'] ,
                                 de : ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'],
                                 no : ['TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION','TODO_TRANSLATION']},
        
        dayNames             : { en : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                                 de : ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag','Samstag'],
                                 no : ['TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION','TODO_TRANSLATION'] },
        
        dayNamesMin          : { en : ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                                 de : ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
                                 no : ['TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION', 'TODO_TRANSLATION'] },

        museum               : { en : 'Museums', 
                                 de : 'Museen',
                                 no : 'Museer' },

        swimming_pool        : { en : 'Schwimmbäder', 
                                 de : 'Swimming pools',
                                 no : 'Svømmebassenger' },

        restaurant           : { en : 'Restaurants', 
                                 de : 'Restaurants',
                                 no : 'Restauranter' },
        
        getSpan : function(key, langs) {

            var translation = "";    
            _.each(_.keys(r360.config.i18n[key]), function(language){
                translation += '<span lang="'+language+'">'+r360.config.i18n[key][language]+'</span>';
            })

            return translation;             
        },
        
        get : function(key){

            var translation;
            _.each(_.keys(r360.config.i18n), function(aKey){
                if ( key == aKey ) translation = r360.config.i18n[key][r360.config.i18n.language];
            })

            return translation;
        }
    }
}