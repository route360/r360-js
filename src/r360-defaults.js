r360.config = {

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
    },

    i18n : {

        language             : 'en',
        configuredLanguages  : ['en', 'de', 'no'],

        info                 : { en : 'More information',
                                 de : 'Mehr informationen', 
                                 no : 'Mer Informasjon'},

        fullscreen           : { en : 'Fullscreen',
                                 de : 'Vollbild', 
                                 no : 'Fullskjerm'},

        slow                 : { en : 'Slow',
                                 de : 'Langsam', 
                                 no : 'Sakte'},

        low                  : { en : 'Low',
                                 de : 'Gering', 
                                 no : 'Lav'},
        
        medium               : { en : 'Medium',
                                 de : 'Mittel', 
                                 no : 'Medium'},

        fast                 : { en : 'Fast',
                                 de : 'Schnell', 
                                 no : 'Raskt' },

        high                 : { en : 'High',
                                 de : 'Hoch', 
                                 no : 'Høy' },

        departure            : { en : 'Departure',
                                 de : 'Abfahrt', 
                                 no : 'TODO TRANSLATION: '},
        
        placeholderSrc       : { en : 'Select source!',
                                 de : 'Start wählen!',   
                                 no : 'Start'},
        
        placeholderTrg       : { en : 'Select target!',
                                 de : 'Ziel wählen!' ,   
                                 no : 'Mål' },
        
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
       
        batteryCapacity      : { en : 'Battery capacity',
                                 de : 'Akkuleistung', 
                                 no : 'Batterikapasitet' },
       
        distance             : { en : 'Distance',
                                 de : 'Distanz', 
                                 no : 'Avstand' },
        
        wait                 : { en : 'Please wait!',
                                 de : 'Bitte warten!' ,  
                                 no : 'Vennligst vent!' },
       
        polygonWait          : { en : 'Calculating reachable area!',
                                 de : 'Berechne erreichbare Fläche!' ,  
                                 no : 'Vennligst vent!' },
       
        routeWait            : { en : 'Searching route to target(s)!',
                                 de : 'Suche Route zum Ziel!' ,  
                                 no : 'Vennligst vent!' },
       
        timeWait             : { en : 'Getting travel times to target(s)!',
                                 de : 'Berechne Reisezeiten für Ziele!' ,  
                                 no : 'Vennligst vent!' },
       
        osmWait              : { en : 'Searching for points of interests!',
                                 de : 'Suche nach Sehenswürdigkeiten!' ,  
                                 no : 'Vennligst vent!' },
       
        populationWait       : { en : 'Calculating population statistics!',
                                 de : 'Berechne Bevölkerungsstatistik!',
                                 no : 'Vennligst vent!' },
 
        elevation            : { en : 'Elevation',       
                                 de : 'Höhenunterschied',
                                 no : 'Stigning' },
        
        timeFormat           : { en : 'a.m.',            
                                 de : 'Uhr',
                                 no : 'TODO_TRANSLATION' },
        
        reset                : { en : 'Reset input',     
                                 de : 'Eingeben löschen', 
                                 no : 'Reset' },
        
        reverse              : { en : 'Switch source and target',   
                                 de : 'Start und Ziel tauschen', 
                                 no : 'Motsatt' },
        
        settings             : { en : 'Switch travel type',   
                                 de : 'Reisemodus wechseln', 
                                 no : 'Reisemåte' },
        
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

        museum               : { en : 'Museum', 
                                 de : 'Museum',
                                 no : 'Museum' },

        swimming_pool        : { en : 'Swimming pool', 
                                 de : 'Schwimmbad',
                                 no : 'Svømmebassenger' },

        restaurant           : { en : 'Restaurant', 
                                 de : 'Restaurant',
                                 no : 'Restaurant' },

        cinema               : { en : 'Cinema', 
                                 de : 'Kino',
                                 no : 'Kino' },

        theater              : { en : 'Theater', 
                                 de : 'Theater',
                                 no : 'Teater' },

        library              : { en : 'Library', 
                                 de : 'Bibliothek',
                                 no : 'Bibliotek' },

        bike_rental_station  : { en : 'Bike rental station', 
                                 de : 'Fahrradleihstation',
                                 no : 'TODO TRANSLATION' },

        cycling_speed_help   : { en : 'Cycling speed: {}km/h', 
                                 de : 'Fahrradgeschwindigkeit: {}km/h',
                                 no : 'G Fart: {}km/h, Fart: {}km/h' },

        walking_speed_help   : { en : 'Walk speed: {}km/h', 
                                 de : 'Laufgeschwindigkeit: {}km/h',
                                 no : 'Fart: {}km/h' },

        walking_and_cycling_speed_help  : { en : 'Walk speed: {}km/h, Cycling speed: {}km/h', 
                                 de : 'Laufgeschwindigkeit: {}km/h, Fahrradgeschwindigkeit: {}km/h',
                                 no : 'Fart: {}km/h (Gå), Fart: {}km/h (Sykle)' },

        ebike_speed_help_fast : { en : 'Little support from the pedelec', 
                                 de : 'Keine Unterstützung durch das Pedelec',
                                 no : 'Høy egeninnsats - Lav motorinnsats' },

        ebike_speed_help_medium: { en : 'Medium support from the pedelec', 
                                 de : 'Mittlere Unterstützung durch das Pedelec',
                                 no : 'Medium egeninnsats - Medium motorinnsats' },

        ebike_speed_help_slow: { en : 'Full support from the pedelec', 
                                 de : 'Volle Unterstützung durch das Pedelec',
                                 no : 'Lav egeninnsats - Høy motorinnsats' },

        contribution:          { en : 'Personal contribution', 
                                 de : 'Eigenleistung',
                                 no : 'Egeninnsats' },

        low_contribution:      { en : 'Low personal contribution', 
                                 de : 'Geringe Eigenleistung',
                                 no : 'Lav Egeninnsats' },

        switchLanguage : function() {

            var selector = [];
            _.each(r360.config.i18n.configuredLanguages, function(language){
                selector.push("[lang='"+language+"']"); 
            });

            $(selector.join(", ")).hide();
            $("[lang='"+r360.config.i18n.language+"']").show();
        },

        getSpan : function(key) {

            var translation = "";    
            _.each(_.keys(r360.config.i18n[key]), function(language){
                translation += '<span lang="'+language+'">'+r360.config.i18n[key][language]+'</span>';
            })

            return translation;             
        },

        getSpan : function(key, variables) {

            var translation = "";    
            _.each(_.keys(r360.config.i18n[key]), function(language){

                var template = r360.config.i18n[key][language];
                _.each(variables, function(variable){
                    template = template.replace("{}", variable);
                })

                translation += '<span lang="' + language + '">' + template + '</span>';
            })

            return translation == '' ? '_' + key + '_' : translation;             
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
