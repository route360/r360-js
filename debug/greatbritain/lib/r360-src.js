/*
 Route360° JavaScript API v0.0.9 (9ec6272), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg and Daniel Gerber, (c) 2014 Motion Intelligence GmbH
*/
(function (window, document, undefined) {
var r360 = {
	version: 'v0.0.9'
};

function expose() {
	var oldr360 = window.r360;

	r360.noConflict = function () {
		window.r360 = oldr360;
		return this;
	};

	window.r360 = r360;
}

// define r360 for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') 
	module.exports = r360;

// define r360 as an AMD module
else if (typeof define === 'function' && define.amd) define(r360);

// define r360 as a global r360 variable, saving the original r360 to restore later if needed
else expose();


/*
* IE 8 does not get the bind function. This is a workaround...
*/
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}

r360.config = {

    serviceUrl      : 'https://api.route360.net/api_dev/',
    // serviceUrl      : 'http://localhost:8080/api/',
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
        autoHide : true,
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

r360.PolygonUtil = {

    /**
     * [clip clipping like sutherland http://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript]
     * @param  {[type]} subjectPolygon [description]
     * @param  {[type]} clipPolygon    [description]
     * @return {[type]}                [description]
     */
    clip: function(subjectPolygon, clipPolygon) {
        
        var cp1, cp2, s, e;
        var inside = function (p) {
            return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
        };
        var intersection = function () {
            var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
                dp = [ s[0] - e[0], s[1] - e[1] ],
                n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                n2 = s[0] * e[1] - s[1] * e[0], 
                n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
            return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
        };
        var outputList = subjectPolygon;
        var cp1 = clipPolygon[clipPolygon.length-1];
        for (j in clipPolygon) {
            var cp2 = clipPolygon[j];
            var inputList = outputList;
            outputList = [];
            s = inputList[inputList.length - 1]; //last on the input list
            for (i in inputList) {
                var e = inputList[i];
                if (inside(e)) {
                    if (!inside(s)) {
                        outputList.push(intersection());
                    }
                    outputList.push(e);
                }
                else if (inside(s)) {
                    outputList.push(intersection());
                }
                s = e;
            }
            cp1 = cp2;
        }
        return outputList
    },

    /**
     * [isCollinear Checks if the given three points are collinear. Also see 
     *     https://en.wikipedia.org/wiki/Collinearity. This method uses a tolerance
     *     factor defined in r360.config.defaultPolygonLayerOptions.tolerance.]
     *     
     * @param  {[type]}  p1 [description]
     * @param  {[type]}  p2 [description]
     * @param  {[type]}  p3 [description]
     * @return {Boolean}    [description]
     */
    isCollinear: function(p1, p2, p3){

        if(p1.x == p3.x && p1.y == p3.y)
            return false;
        if(p1.x == p2.x && p2.x == p3.x)
            return true;
        if(p1.y == p2.y && p2.y == p3.y)
            return true;
        
        var val = (p1.x * (p2.y -p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

        if ( val < r360.config.defaultPolygonLayerOptions.tolerance  && 
             val > -r360.config.defaultPolygonLayerOptions.tolerance && 
             p1.x != p3.x && p1.y != p3.y )
            return true;
        
        return false;
    },

    /**
     * [scale Scales a point (x and y coordinate) by the given scale. This method changes
     *     the values of the given point.]
     * @param  {[type]} point [the point to be scaled]
     * @param  {[type]} scale [the scale]
     * @return {[type]}       [the scaled point]
     */
    scale: function(point, scale){
        point.x *= scale;
        point.y *= scale;
        return point;
    },

    /**
     * [subtract Subtracts the given x and y coordinate from the cooresponding values of the given point.
     *     This method changes the values of the given point. ]
     * @param  {[type]} point [the point to be changed]
     * @param  {[type]} x     [the x value to be subtracted]
     * @param  {[type]} y     [the y value to be subtracted]
     * @return {[type]}       [the subtracted point]
     */
    subtract: function(point, x, y){
        point.x -= x;
        point.y -= y;
        return point;
    },

    divide: function(point, quotient){
        point.x /= quotient;
        point.y /= quotient;
        return point;
    },

    /**
     * [roundPoint Rounds a point's x and y coordinate. The method changes the x and y 
     *     values of the given point. If the fractional portion of number (x and y) 
     *     is 0.5 or greater, the argument is rounded to the next higher integer. If the 
     *     fractional portion of number is less than 0.5, the argument is rounded to the 
     *     next lower integer.]
     *     
     * @param  {[type]} point [the point to rounded]
     * @return {[type]}       [the point to be rounded with integer x and y coordinate]
     */
    roundPoint: function(point){
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        return point;
    },

    /**
     * [buildPath Creates an SVG path. ]
     * @param  {[type]} point  [The point to add]
     * @param  {[type]} suffix [The svg suffix for the point]
     * @return {[type]}        [An array containing the suffix, point.x, point.y]
     */
    buildPath:function(point, suffix){
        
        return [suffix, Math.round(point.x), Math.round(point.y)];
    },

    /**
     * [getEuclidianDistance This method returns the euclidean distance between two points (x and y coordinates).]
     * @param  {[type]} point1 [the first point]
     * @param  {[type]} point2 [the second point]
     * @return {[type]}        [the distance]
     */
    getEuclidianDistance: function(point1, point2){
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    },

    /**
     * [getSvgFrame description]
     * @param  {[type]} width  [description]
     * @param  {[type]} height [description]
     * @return {[type]}        [description]
     */
    getSvgFrame: function(width, height){
        return [['M',0, 0], ['L',width, 0], ['L',width, height], ['L',0, height], ['z']];
    },

    /**
     * [extendBounds description]
     * @param  {[type]} bounds       [description]
     * @param  {[type]} extendWidthX [description]
     * @param  {[type]} extendWidthY [description]
     * @return {[type]}              [description]
     */
    extendBounds : function(bounds, extendWidthX, extendWidthY) {

        var extendX = Math.ceil(extendWidthX);
        var extendY = Math.ceil(extendWidthY);

        bounds.max.x += extendX;
        bounds.min.x -= extendX;
        bounds.max.y += extendY;
        bounds.min.y -= extendY;

        return bounds;
    },

    /**
     * [prepareMultipolygons description]
     * @param  {[type]} multiPolygons [description]
     * @param  {[type]} topRight      [description]
     * @param  {[type]} topLeft       [description]
     * @return {[type]}               [description]
     */
    prepareMultipolygons : function(multiPolygons, topRight, bottomLeft) {

        var preparedMultiPolygons = [];

        for ( var i = 0; i < multiPolygons.length ; i++){
            for ( var j = 0; j < multiPolygons[i].polygons.length ; j++) {

                var currentPolygon = multiPolygons[i].polygons[j];

                // project to 4326
                currentPolygon.project(); 
                // adjust the bounding box
                r360.PolygonUtil.updateBoundingBox(currentPolygon, topRight, bottomLeft);
                // find the multipolygon to which this polygon belongs (travel time matching)
                r360.PolygonUtil.addPolygonToMultiPolygon(preparedMultiPolygons, currentPolygon); 
            }
        }
        
        // make sure the multipolygons are sorted by the travel time ascendingly
        preparedMultiPolygons.sort(function(a,b) { return b.getTravelTime() - a.getTravelTime(); });

        return preparedMultiPolygons;
    },

    /**
     * [updateBoundingBox description]
     * @param  {[type]} polygon [description]
     * @return {[type]}         [description]
     */
    updateBoundingBox : function(polygon, topRight, bottomLeft){

        if ( polygon.topRight.lat   > topRight.lat)    topRight.lat   = polygon.topRight.lat;                
        if ( polygon.bottomLeft.lat < bottomLeft.lat)  bottomLeft.lat = polygon.bottomLeft.lat;
        if ( polygon.topRight.lng   > topRight.lng )   topRight.lng   = polygon.topRight.lng;
        if ( polygon.bottomLeft.lng < bottomLeft.lng ) bottomLeft.lng = polygon.bottomLeft.lng;
    },

    /*
     *
     */
    addPolygonToMultiPolygon: function(multiPolygons, polygon){

        var filteredMultiPolygons = _.filter(multiPolygons, function(multiPolygon){ return multiPolygon.getTravelTime() == polygon.travelTime; });

        // multipolygon with polygon's travetime already there
        if ( filteredMultiPolygons.length > 0 ) filteredMultiPolygons[0].addPolygon(polygon);
        else {

            var multiPolygon = new r360.multiPolygon();
            multiPolygon.setTravelTime(polygon.travelTime);
            multiPolygon.addPolygon(polygon);
            multiPolygon.setColor(polygon.getColor());
            multiPolygon.setOpacity(polygon.getOpacity());
            multiPolygons.push(multiPolygon);
        }
    },
}

r360.SvgUtil = {

    /**
     * [getGElement description]
     * @param  {[type]} svgData [description]
     * @param  {[type]} opacity [description]
     * @param  {[type]} color   [description]
     * @param  {[type]} animate [description]
     * @return {[type]}         [description]
     */
    getGElement : function(svgData, options){

        var randomId            = r360.Util.generateId();
        var initialOpacity      = options.opacity;

        return  "<g id=" + randomId + " style='opacity:" + initialOpacity + "'>"+
                    "<path style='stroke: " + options.color + "; fill: " + options.color + " ; stroke-opacity: 1; stroke-width: " + options.strokeWidth + "; fill-opacity:1'd='" + svgData.toString().replace(/\,/g, ' ') + "'/>"+
                "</g>";
    },

    /**
     * [getInverseSvgElement description]
     * @param  {[type]} gElements [description]
     * @return {[type]}           [description]
     */
    getInverseSvgElement: function(gElements, options){

        var svgFrame = r360.PolygonUtil.getSvgFrame(options.svgWidth, options.svgHeight);

        var svgStart = "<div id=svg_"+ options.id + " style='" + r360.Util.getTranslation(options.offset) + ";''><svg"  + 
                            " height=" + options.svgHeight + 
                            " width="  + options.svgWidth  + 
                            " style='fill:" + options.backgroundColor + " ; opacity: "+ options.backgroundOpacity + "; stroke-width: " + options.strokeWidth + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        var newSvg = "<defs>"+
                        "<mask id='mask_" + options.id + "'>"+
                            "<path style='fill-opacity:1;stroke: white; fill:white;' d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>"+
                                gElements.join('') + 
                        "</mask>"+
                    "</defs>";

        var frame = "<path style='mask: url(#mask_" + options.id + ")' d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>";

        return svgStart + frame + newSvg + svgEnd;
    },

    /**
     * [getNormalSvgElement description]
     * @param  {[type]} gElement [description]
     * @return {[type]}          [description]
     */
    getNormalSvgElement: function(gElements, options){

        var svgStart = "<div id=svg_"+ options.id + " style='" + r360.Util.getTranslation(options.offset) + ";''><svg "  + 
                            " height=" + options.svgHeight + 
                            " width="  + options.svgWidth  + 
                            " style='fill:" + options.backgroundColor + " ; opacity: " + options.opacity + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        return svgStart + gElements.join('') + svgEnd;
    },

    createSvgData : function(polygon, options) {

        var pathData = [];

        var polygonTopRight     = polygon.getProjectedTopRight();
        var polygonBottomLeft   = polygon.getProjectedBottomLeft();

        r360.PolygonUtil.scale(polygonTopRight, options.scale);
        r360.PolygonUtil.scale(polygonBottomLeft, options.scale);

        // the outer boundary       
        if ( !(polygonBottomLeft.x > options.bounds.max.x || polygonTopRight.x < options.bounds.min.x || 
               polygonTopRight.y > options.bounds.max.y   || polygonBottomLeft.y < options.bounds.min.y ))
            r360.SvgUtil.buildSVGPolygon(pathData, polygon.outerProjectedBoundary, options);

        // the inner boundaries
        for ( var i = 0 ; i < polygon.innerProjectedBoundaries.length ; i++ ) {

            var polygonTopRight     = polygon.innerProjectedBoundaries[i].getProjectedTopRight();
            var polygonBottomLeft   = polygon.innerProjectedBoundaries[i].getProjectedBottomLeft();

            r360.PolygonUtil.scale(polygonTopRight, scale);
            r360.PolygonUtil.scale(polygonBottomLeft, scale);

            if ( !(polygonBottomLeft.x > options.bounds.max.x || polygonTopRight.x < options.bounds.min.x || 
                   polygonTopRight.y > options.bounds.max.y   || polygonBottomLeft.y < options.bounds.min.y ))
                r360.SvgUtil.buildSVGPolygon(pathData, polygon.innerProjectedBoundaries[i].points, options);
        }

        return pathData;
    },

    /**
     * [buildSVGPolygon description]
     * @param  {[type]} pathData        [description]
     * @param  {[type]} coordinateArray [description]
     * @param  {[type]} bounds          [description]
     * @param  {[type]} scale           [description]
     * @return {[type]}                 [description]
     */
    buildSVGPolygon: function(pathData, coordinateArray, options){

        var projectedPoint, point, point1, point2, isCollinear, euclidianDistance, pointCount = 0;
        var boundArray = [[options.bounds.min.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.max.y], 
                          [options.bounds.min.x, options.bounds.max.y]];

        var pointsToClip = [];

        for ( var i = 0 ; i < coordinateArray.length ; i++ ) {
            projectedPoint  = coordinateArray[i];
            point           = new L.Point(projectedPoint.x, projectedPoint.y);

            r360.PolygonUtil.scale(point, options.scale);
            r360.PolygonUtil.roundPoint(point);

            euclidianDistance = (i > 0) ? r360.PolygonUtil.getEuclidianDistance(point2, point) : options.tolerance; 

            if ( euclidianDistance >= options.tolerance ) {

                isCollinear = false;

                if ( pointCount > 2 ) 
                    isCollinear = r360.PolygonUtil.isCollinear(point1, point2, point);

                if ( isCollinear ) {
                    pointsToClip[pointsToClip.length-1][0] = point.x;
                    pointsToClip[pointsToClip.length-1][1] = point.y;
                }
                else {
                    
                    pointsToClip.push([point.x, point.y]);
                    point1 = point2;
                    point2 = point;
                    pointCount++;
                }
            }
        }

        var clippedArray = r360.PolygonUtil.clip(pointsToClip, boundArray);
        var lastPoint;

        for ( var i = 0 ; i < clippedArray.length ; i++ ){
            
            point = new L.Point(clippedArray[i][0], clippedArray[i][1]);

            r360.PolygonUtil.subtract(point, options.pixelOrigin.x + options.offset.x, 
                                             options.pixelOrigin.y + options.offset.y) 

            pathData.push( i > 0 ? r360.PolygonUtil.buildPath(point, "L") : r360.PolygonUtil.buildPath(point, "M"));
            lastPoint = point;
        }
        
        if ( pathData.length > 0 )
            pathData.push(["z"]); // svgz

        return pathData;
    },
}

/*
 *
 */
r360.Util = {

    /* 
     * This method returns the current time, at the time this method is executed,
     * in seconds. This means that the current hours, minutes and seconds of the current
     * time are added up, e.g.: 12:11:15 pm: 
     *
     *      -> (12 * 3600) + (11 * 60) + 15 = 43875
     * 
     * @method getTimeInSeconds
     * 
     * @returns {Number} The current time in seconds
     */
    getTimeInSeconds : function() {

        var now = new Date();
        return (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
    },

    /* 
     * This method returns the current time, at the time this method is executed,
     * in seconds. This means that the current hours, minutes and seconds of the current
     * time are added up, e.g.: 12:11 pm: 
     *
     *      -> (12 * 3600) + (11 * 60) = 43875
     * 
     * @method getHoursAndMinutesInSeconds
     * 
     * @returns {Number} The current time in seconds
     */
    getHoursAndMinutesInSeconds : function() {

        var now = new Date();
        return (now.getHours() * 3600) + (now.getMinutes() * 60);
    },

    /*
      * Returns the current date in the form 20140508 (YYYYMMDD). Note that month is 
      * not zero but 1 based, which means 6 == June.
      *
      * @method getCurrentDate
      * 
      * @return {String} the date object in string representation YYYYMMDD
      */
    getCurrentDate : function() {

        var date  = new Date();
        var year  = date.getFullYear();
        var month = (date.getMonth() + 1) < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1); 
        var day   = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); 
        
        return year + "" + month + "" + day;
    },

    getTimeFormat : function(seconds) {

        var i18n = r360.config.i18n;
        if ( i18n.language == 'en' ) if ( seconds >= 43200 ) return 'p.m.';
        return i18n.get('timeFormat');
    },

    /*
     * Transforms the given seconds to a hour and minuten view. This means
     * that for example 10:15 (one hour and 15 minutes) is translates to the string:
     *      -> 10h 15min
     *
     * Note that no trailing zeros are returned. Also if hours < 1 only minute values will be returned.
     * 
     * @method secondsToHoursAndMinutes
     * @returns {String} the transformed seconds in "xh ymin"
     */
    secondsToHoursAndMinutes : function(seconds) {

        var minutes = (seconds / 60).toFixed(0);
        var hours = Math.floor(minutes / 60);

        minutes = minutes - hours * 60;
        var timeString = "";

        if (hours != 0) timeString += (hours + "h "); 
        timeString += (minutes + "min");

        return timeString;
    },

    /*
     * This methods transforms a given time in seconds to a format like:
     *      43200 -> 12:00:00
     * 
     * @method secondsToTimeOfDay
     * @returns {String} the formated time string in the format HH:MM:ss
     */
    secondsToTimeOfDay : function(seconds){

        var hours   = Math.floor(seconds/3600);
        var minutes = Math.floor(seconds/60)-hours*60;
        seconds     = seconds - (hours * 3600) - (minutes *60);
        return hours+":"+ ("0" + minutes).slice(-2) +":"+ ("0" + seconds).slice(-2);
    },

    /*
     * This methods generates a unique ID with the given length or 10 if no length was given.
     * The method uses all characters from [A-z0-9] but does not guarantuee a unique string.
     * It's more a pseudo random string. 
     * 
     * @method generateId
     * @param the length of the returnd pseudo random string
     * @return a random string with the given length
     */
    generateId : function(length) {
        
        var id       = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        _.each(_.range(length ? length : 10), function(){
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        })

        return id;
    },

    /*
     *
     */
    parseLatLonArray : function(latlngs) {

        var coordinates = new Array();

        for ( var i = 0 ; i < latlngs.length ; i++ )
            // coordinates.push(new L.Point(latlngs[i][1], latlngs[i][0]))
            coordinates.push(new L.Point(latlngs[i][0], latlngs[i][1]))

        return coordinates;
    },

    /*
     * deprecated
     */
    routeToLeafletPolylines : function(route, options) {

        options = typeof options !== 'undefined' ? options : {};

        var polylines = [];

        _.each(route.getSegments(), function(segment, index){

            if ( segment.getType() == "TRANSFER" ) return;

            var polylineOptions         = {};
            polylineOptions.color       = _.has(options, 'color') ? options.color : segment.getColor();

            var polylineHaloOptions     = {};
            polylineHaloOptions.weight  = 7;
            polylineHaloOptions.color   = "white";
            
            // the first and the last segment is walking so we need to dotted lines
            if ( index == 0 || index == (route.getLength() - 1) ) polylineOptions.dashArray = "1, 8";

            var halo = L.polyline(segment.getPoints(), polylineHaloOptions);
            var line = L.polyline(segment.getPoints(), polylineOptions);

            polylines.push([halo, line]);
        });

        return polylines;
    },

    /*
     * This methods uses the Rotue360° geocoding service to return
     * a street address for a given latitude/longitude coordinate pair.
     * This functionality is typically called reverse geocoding.
     * 
     * @method getAddressByCoordinates
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {String} [language] The country code, 'nb' for norway, 'de' for germany. 
     * @param {Function} [callback] The callback methods which processes the returned data.
     */
    getAddressByCoordinates : function(latlng, language, callback){

        $.getJSON(r360.config.nominatimUrl + 'reverse.php?&format=json&lat=' + latlng.lat + '&accept-language=' + language + '&lon=' + latlng.lng + '&json_callback=?', callback);
    },

    /* 
     * This method takes a result from the nominatim reverse geocoder and formats
     * it to a readable and displayable string. It builds up an address like this:
     *      'STREETNAME STREETNUMBER, POSTALCODE, CITY'
     * In case any of these values are undefined, they get removed from returned string.
     * In case all values are undefined, the 'display_name' property of the returned 
     * json (from nominatim) is used to generate the output value.
     * @return {String} a string representing the geocoordinates in human readable form
     */
    formatReverseGeocoding : function(json) {

        var streetAdress = [];
        if ( _.has(json.address, 'road') )          streetAdress.push(json.address.road);
        if ( _.has(json.address, 'house_number') )  streetAdress.push(json.address.house_number);

        var city = [];
        if ( _.has(json.address, 'postcode') )      city.push(json.address.postcode);
        if ( _.has(json.address, 'city') )          city.push(json.address.city);

        var address = [];
        if ( streetAdress.length > 0 )  address.push(streetAdress.join(' '));
        if ( city.length > 0)           address.push(city.join(', '));

        if ( streetAdress.length == 0 && city.length == 0 ) address.push(json.display_name);

        return address.join(', ');
    },

    /*
     *
     */
    parsePolygons : function(polygonsJson) {
               
        if ( polygonsJson.error ) return errorMessage;
        if ( r360.config.logging) var start   = new Date().getTime();

        var polygonList = [];

        _.each(polygonsJson, function(source){

            var sourcePolygons = { id : source.id , polygons : [] };

            _.each(source.polygons, function (polygonJson) {

                var polygon = r360.polygon(polygonJson.travelTime, polygonJson.area, r360.Util.parseLatLonArray(polygonJson.outerBoundary));

                var color = _.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() });
                polygon.setColor(!_.isUndefined(color) ? color.color : '#000000');
                
                var opacity = _.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() })
                polygon.setOpacity(!_.isUndefined(opacity) ? opacity.opacity : 1);
                
                _.each(polygonJson.innerBoundary, function (innerBoundary) {
                    polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
                });

                sourcePolygons.polygons.push(polygon);
            });

            polygonList.push(sourcePolygons);
        });

        if ( r360.config.logging )
            console.log("Polygon parsing took: " + (new Date().getTime() - start) + "ms");

        return polygonList;
    },

    /*
     * This method parses the JSON returned from the Route360 Webservice and generates
     * java script objects representing the values.
     */
    parseRoutes : function(json){

        var routes = new Array();

        for(var i = 0; i < json.routes.length; i++){
            routes.push(r360.route(json.routes[i].travelTime, json.routes[i].segments));
        }

        return routes;
    },

    /*
     * Convenients method to generate a Leaflet marker with the 
     * specified marker color. For available colors look at 'dist/images'
     * 
     * @method getMarker
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {Object} [options] The options for the marker
     * @param {Number} [options.color] The color for the marker icon.
     */
    getMarker : function(latlng, options){

        var color = _.has(options, 'color') ? '-' + options.color : '-blue';

        options.icon = L.icon({
            iconSize     : [25, 41], // size of the icon
            iconUrl      : options.iconPath + 'marker-icon' + color + '.png',
            iconAnchor   : [12, 41], // point of the icon which will correspond to marker's location
            
            shadowSize   : [41, 41], // size of the shadow
            shadowUrl    : options.iconPath + 'marker-shadow.png',
            shadowAnchor : [41 / 3, 41], // point of the shadow which will correspond to marker's location
            
            popupAnchor  : [0, -35]  // point from which the popup should open relative to the iconAnchor
        });

        return L.marker(latlng, options);
    },

    webMercatorToLeaflet : function(point){
        point.x /= 6378137;
        point.y /= 6378137;
        L.CRS.EPSG3857.transformation._transform(point);
        return point;
    },

    webMercatorToLatLng : function(point, elevation){

        var latlng = L.CRS.EPSG3857.projection.unproject(new L.Point(point.x /= 6378137, point.y /= 6378137));

        // x,y,z given so we have elevation data
        if ( typeof elevation !== 'undefined' ) 
            return L.latLng([latlng.lat, latlng.lng, elevation]);
        // no elevation given, just unproject coordinates to lat/lng
        else 
            return latlng;
    },

    latLngToWebMercator : function(latlng){

        var point = L.Projection.SphericalMercator.project(latlng);
        point.x *= 6378137;
        point.y *= 6378137;
        return point;
    },

    getUserAgent : function(){
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\bOPR\/(\d+)/)
            if(tem!= null) return 'Opera '+tem[1];
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    },

    /**
     * [isAnimated description]
     * @return {Boolean} [description]
     */
    isAnimated: function(){
        
        var userAgent = getUserAgent();

        if ( userAgent.indexOf("IE") != -1 )
            return false;
        if ( userAgent.indexOf("Safari") != -1 )
            return false;
        if ( userAgent.indexOf("Firefox") != -1 )
            return false;
        if ( r360.config.defaultPolygonLayerOptions.animate )
            return true;

        return false;
    },

    /**
     * [getTranslation description]
     * @param  {[type]} offset [description]
     * @return {[type]}        [description]
     */
    getTranslation: function(offset){
  
        var userAgent = r360.Util.getUserAgent();

        if ( userAgent.indexOf("IE 9") != -1 )
            return "transform:translate(" + offset.x + "px," + offset.y + "px)";

        if ( userAgent.indexOf("Safari") != -1 ) 
            return "-webkit-transform:translate3d(" + offset.x + "px," + offset.y + "px,0px)";
        
        if ( userAgent.indexOf("Firefox") != -1 ) 
            return "-moz-transform:translate3d(" + offset.x + "px," + offset.y + "px,0px)";
        
        else
            return "transform:translate3d(" + offset.x + "px," + offset.y + "px,0px)";
    },


    /**
    * @param {google.maps.Map} map
    * @param {google.maps.LatLng} latlng
    * @param {int} z
    * @return {google.maps.Point}
    */
    googleLatlngToPoint : function(map, latlng, z){
        var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
        var scale = Math.pow(2, z);
        return new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale); 
    },
    /**
    * @param {google.maps.Map} map
    * @param {google.maps.Point} point
    * @param {int} z
    * @return {google.maps.LatLng}
    */
     googlePointToLatlng : function(map, point, z){
        var scale = Math.pow(2, z);
        var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
        var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
        return latlng; 
    }
};

r360.DomUtil = {
    
    setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

        /*eslint-disable */
        el._leaflet_pos = point;
        /*eslint-enable */

        if (L.Browser.any3d) {
            r360.DomUtil.setTransform(el, point);
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
        }
    },

    setTransform: function (el, offset, scale) {
        var pos = offset || new L.Point(0, 0);

        el.style[r360.DomUtil.TRANSFORM] =
            'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
    },

    testProp: function (props) {

        var style = document.documentElement.style;

        for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    }
};

(function () {
    // prefix style property names

    r360.DomUtil.TRANSFORM = r360.DomUtil.testProp(
            ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);


    // // webkitTransition comes first because some browser versions that drop vendor prefix don't do
    // // the same for the transitionend event, in particular the Android 4.1 stock browser

    // var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
    //         ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

    // L.DomUtil.TRANSITION_END =
    //         transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';


    // if ('onselectstart' in document) {
    //     L.DomUtil.disableTextSelection = function () {
    //         L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
    //     };
    //     L.DomUtil.enableTextSelection = function () {
    //         L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
    //     };

    // } else {
    //     var userSelectProperty = L.DomUtil.testProp(
    //         ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

    //     L.DomUtil.disableTextSelection = function () {
    //         if (userSelectProperty) {
    //             var style = document.documentElement.style;
    //             this._userSelect = style[userSelectProperty];
    //             style[userSelectProperty] = 'none';
    //         }
    //     };
    //     L.DomUtil.enableTextSelection = function () {
    //         if (userSelectProperty) {
    //             document.documentElement.style[userSelectProperty] = this._userSelect;
    //             delete this._userSelect;
    //         }
    //     };
    // }

    // L.DomUtil.disableImageDrag = function () {
    //     L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
    // };
    // L.DomUtil.enableImageDrag = function () {
    //     L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
    // };

    // L.DomUtil.preventOutline = function (element) {
    //     L.DomUtil.restoreOutline();
    //     this._outlineElement = element;
    //     this._outlineStyle = element.style.outline;
    //     element.style.outline = 'none';
    //     L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
    // };
    // L.DomUtil.restoreOutline = function () {
    //     if (!this._outlineElement) { return; }
    //     this._outlineElement.style.outline = this._outlineStyle;
    //     delete this._outlineElement;
    //     delete this._outlineStyle;
    //     L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
    // };
})();


/*
 *
 */
r360.TravelOptions = function(){

    this.sources            = [];
    this.targets            = [];
    this.service;

    this.bikeSpeed          = undefined;
    this.bikeUphill         = undefined;
    this.bikeDownhill       = undefined;
    this.walkSpeed          = undefined;
    this.walkUphill         = undefined;
    this.walkDownhill       = undefined;

    this.supportWatts       = undefined;
    this.renderWatts        = undefined;
    
    this.travelTimes        = undefined;
    this.travelType         = undefined;
    this.elevationEnabled   = undefined;
    this.minPolygonHoleSize = undefined;

    this.time               = undefined;
    this.date               = undefined;
    this.recommendations    = undefined;
    this.errors             = [];

    this.intersectionMode   = undefined;
    this.pathSerializer     = r360.config.pathSerializer;
    this.maxRoutingTime     = undefined;
    this.waitControl;

    this.isValidPolygonServiceOptions = function(isRouteRequest){

        // reset errors
        this.errors = [];

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getSources()) === '[object Array]' ) {

            if ( this.getSources().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getSources(), function(source){

                    if ( !_.has(source, 'lat') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined latitude!');
                    if ( !_.has(source, 'lon') && !_.has(source, 'lng') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        // is the given travel type supported
        if ( !_.contains(['bike', 'transit', 'walk', 'car', 'rentbike', 'rentandreturnbike', 'ebike'], this.getTravelType() ) )
            this.getErrors().push('Not supported travel type given: ' + this.getTravelType() );
        else {

            if ( this.getTravelType() == 'car' ) ; // nothing to do
            else if ( this.getTravelType() == 'bike' || this.getTravelType() == 'rentbike' || this.getTravelType() == 'rentandreturnbike') {

                if ( typeof this.getBikeUphill() != '' && typeof this.getBikeDownhill() != '' && typeof this.getBikeUphill() != 'undefined') {

                    // validate downhill/uphill penalties
                    if ( this.getBikeUphill() < 0 || this.getBikeDownhill() > 0 || this.getBikeUphill() < -(this.getBikeDownhill()) )  
                        this.getErrors().push("Uphill cycle speed has to be larger then 0. Downhill cycle speed has to be smaller then 0. \
                            Absolute value of downhill cycle speed needs to be smaller then uphill cycle speed.");
                }

                // we need to have a positiv speed
                if ( this.getBikeSpeed() <= 0 ) this.getErrors().push("Bike speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'walk' ) {

                if ( typeof this.getBikeUphill() != '' && typeof this.getBikeDownhill() != '' && typeof this.getBikeUphill() != 'undefined') {

                    // validate downhill/uphill penalties
                    if ( this.getWalkUphill() < 0 || this.getWalkDownhill() > 0 || this.getWalkUphill() < -(this.getWalkDownhill()) )  
                        this.getErrors().push("Uphill walking speed has to be larger then 0. Downhill walking speed has to be smaller then 0. \
                            Absolute value of downhill walking speed needs to be smaller then uphill walking speed.");
                }

                // we need to have a positiv speeds
                if ( this.getWalkSpeed() <= 0 ) this.getErrors().push("Walk speed needs to be larger then 0.");
            }
            else if ( this.getTravelType() == 'transit' ) {

                // so far no checks needed for transit, default values for date and time are generated on server side
            }
        }

        if ( !isRouteRequest ) {

            // travel times needs to be an array
            if ( typeof this.getTravelTimes() == 'undefined' || Object.prototype.toString.call(this.getTravelTimes()) !== '[object Array]' ) {
                this.getErrors().push('Travel times have to be an array!');
            }
            else {

                if ( _.reject(this.getTravelTimes(), function(entry){ return typeof entry == 'number'; }).length > 0 )
                    this.getErrors().push('Travel times contain non number entries: ' + this.getTravelTimes());
            }
        }

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidRouteServiceOptions = function(){

        this.isValidPolygonServiceOptions(true);

        // check if targets are of type array
        if ( Object.prototype.toString.call(this.getTargets()) === '[object Array]' ) {

            if ( this.getTargets().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                _.each(this.getTargets(), function(target){

                    if ( !_.has(target, 'lat') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined latitude!');
                    if ( !_.has(target, 'lon') && !_.has(target, 'lng') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Targets are not of type array!');

        // is the given path serializer supported
        if ( !_.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.isValidTimeServiceOptions = function(){

        this.isValidRouteServiceOptions();

        // is the given path serializer supported
        if ( !_.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
            this.getErrors().push('Path serializer not supported: ' + this.getPathSerializer() );

        // false if we found errors
        return this.errors.length == 0;
    }

    /*
     *
     *
     *
     */
    this.getErrors = function(){

        return this.errors;
    }

    /*
     *
     *
     *
     */
    this.getSources = function(){

        return this.sources;
    }

    /*
     *
     *
     *
     */
    this.addSource = function(source){

        this.sources.push(source);
    }



    /*
     *
     *
     *
     */
    this.addTarget = function(target){

        this.targets.push(target);
    }

    /*
     *
     *
     *
     */
    this.getTargets = function(){

        return this.targets;
    }

    /*
     *
     *
     *
     */
    this.getBikeSpeed = function(){

        return this.bikeSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeUphill = function(){

        return this.bikeUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getBikeDownhill = function(){

        return this.bikeDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkSpeed = function(){

        return this.walkSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkUphill = function(){

        return this.walkUphill;
    }
    
    /*
     *
     *
     *
     */
    this.getWalkDownhill = function(){

        return this.walkDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelTimes = function(){

        return this.travelTimes;
    }
    
    /*
     *
     *
     *
     */
    this.getTravelType = function(){

        return this.travelType;
    }
    
    /*
     *
     *
     *
     */
    this.getTime = function(){

        return this.time;
    }
    
    /*
     *
     *
     *
     */
    this.getDate = function(){

        return this.date;
    }
    
    /*
     *
     *
     *
     */
    this.getWaitControl = function(){

        return this.waitControl;
    }


    /*
     *
     *
     *
     */
    this.getService = function(){

        return this.service;
    }

    /*
     *
     *
     *
     */
    this.getPathSerializer = function(){

        return this.pathSerializer;
    }

    /*
     *
     *
     *
     */
    this.getMaxRoutingTime = function(){

        return this.maxRoutingTime;
    }

    /*
     *
     *
     *
     */
    this.getIntersectionMode = function(){

        return this.intersectionMode;
    }

    /*
     *
     *
     *
     */
    this.getRecommendations = function(){

        return this.recommendations;
    }
    
    /*
     *
     *
     *
     */
    this.setRecommendations = function(recommendations){

        this.recommendations = recommendations;
    }
    
    /*
     *
     *
     *
     */
    this.setIntersectionMode = function(intersectionMode){

        this.intersectionMode = intersectionMode;
    }
    
    /*
     *
     *
     *
     */
    this.setMaxRoutingTime = function(maxRoutingTime){

        this.maxRoutingTime = maxRoutingTime;
    }
    
    /*
     *
     *
     *
     */
    this.setPathSerializer = function(pathSerializer){

        this.pathSerializer = pathSerializer;
    }

    
    /*
     *
     *
     *
     */
    this.setService = function(service){

        this.service = service;
    }

    /**
    * [setMinPolygonHoleSize description]
    * @param {[type]} minPolygonHoleSize [description]
    */
    this.setMinPolygonHoleSize = function(minPolygonHoleSize){

        this.minPolygonHoleSize = minPolygonHoleSize;
    }

    /**
     * [getMinPolygonHoleSize description]
     * @return {[type]} [description]
     */
    this.getMinPolygonHoleSize = function(){

        return this.minPolygonHoleSize;
    }
    
    /*
     *
     *
     *
     */
    this.setSources = function(sources){

        this.sources = sources;
    }
    
    /*
     *
     *
     *
     */
    this.setTargets = function(targets){

        this.targets = targets;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeSpeed = function(bikeSpeed){

        this.bikeSpeed = bikeSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeUphill = function(bikeUphill){

        this.bikeUphill = bikeUphill;
    }
    
    /*
     *
     *
     *
     */
    this.setBikeDownhill = function(bikeDownhill){

        this.bikeDownhill = bikeDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkSpeed = function(walkSpeed){

        this.walkSpeed = walkSpeed;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkUphill = function(walkUphill){

        this.walkUphill = walkUphill;
    }
    
    /*
     *
     *
     *
     */
    this.setWalkDownhill = function(walkDownhill){

        this.walkDownhill = walkDownhill;
    }
    
    /*
     *
     *
     *
     */
    this.setTravelTimes = function(travelTimes){

        this.travelTimes = travelTimes;
    }
    
    /*
     *
     *
     *
     */
    this.setTravelType = function(travelType){

        this.travelType = travelType;
    }
    
    /*
     *
     *
     *
     */
    this.setTime = function(time){

        this.time = time;
    }
    
    /*
     *
     *
     *
     */
    this.setDate = function(date){

        this.date = date;
    }
    
    /*
     *
     *
     *
     */
    this.setWaitControl = function(waitControl){

        this.waitControl = waitControl;
    }

    /**
     * [isElevationEnabled if true the service will return elevation data, if the backend is 
     * configured with elevation data, if the backend is not configured with elevation data
     * the z value of all points in routes is 0]
     * 
     * @return {[boolean]} [returns true if elevation enabled]
     */
    this.isElevationEnabled = function() {

        return this.elevationEnabled;
    }

    /**
     * [setElevationEnabled if set to true the service will return elevation data, if the backend is 
     * configured with elevation data, if the backend is not configured with elevation data
     * the z value of all points in routes is 0]
     * @param {[type]} elevationEnabled [set the backend to consider elevation data for polygonizing and routing]
     */
    this.setElevationEnabled = function(elevationEnabled){

        this.elevationEnabled = elevationEnabled;
    }

    /**
     * [setRenderingMode description]
     * @param {[type]} renderWatts [description]
     */
    this.setRenderWatts = function(renderWatts){
        this.renderWatts = renderWatts;
    }

    /**
     * [getRenderingMode description]
     * @return {[type]} [description]
     */
    this.getRenderWatts = function(){
       return this.renderWatts;
    }

    /**
     * [setSupportWatts description]
     * @param {[type]} supportWatts [description]
     */
    this.setSupportWatts = function(supportWatts){
        this.supportWatts = supportWatts;
    }

    /**
     * [getSupportWatts description]
     * @return {[type]} [description]
     */
    this.getSupportWatts = function(){
        return this.supportWatts;
    }
};

r360.travelOptions = function () { 
    return new r360.TravelOptions();
};


r360.PolygonService = {

    cache : {},

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('polygonWait'));
        }

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {}; 
        cfg.sources = [];

        if ( !_.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !_.isUndefined(travelOptions.getTravelTimes()) || !_.isUndefined(travelOptions.getIntersectionMode()) || 
             !_.isUndefined(travelOptions.getRenderWatts()) || !_.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !_.isUndefined(travelOptions.getTravelTimes()) )        cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !_.isUndefined(travelOptions.getIntersectionMode()) )   cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !_.isUndefined(travelOptions.getRenderWatts()) )        cfg.polygon.renderWatts        = travelOptions.getRenderWatts();
            if ( !_.isUndefined(travelOptions.getSupportWatts()) )       cfg.polygon.supportWatts       = travelOptions.getSupportWatts();
            if ( !_.isUndefined(travelOptions.getMinPolygonHoleSize()) ) cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }
            
        // add each source point and it's travel configuration to the cfg
        _.each(travelOptions.getSources(), function(source){

            var src = {
                lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : _.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {
                
                src.tm[travelType].frame = {};
                if ( !_.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !_.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {
                
                src.tm.ebike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {
                
                src.tm.rentbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {
                
                src.tm.rentandreturnbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {
                
                src.tm.bike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {
                
                src.tm.walk = {};
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            cfg.sources.push(src);
        });

        if ( !_.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+r360.config.serviceKey,
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( _.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(r360.Util.parsePolygons(result.data));
                        }
                        else 
                            // check if the error callback is defined
                            if ( _.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.PolygonService.cache[JSON.stringify(cfg)] = result;
                        // call successCallback with returned results
                        successCallback(r360.Util.parsePolygons(result));
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // call error callback if defined
                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call successCallback with returned results
            successCallback(r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
        }
    }
}

r360.RouteService = {

    cache : {},

    /*
     *
     */
    getRoutes : function(travelOptions, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('routeWait'));
        }

        var cfg = { sources : [], targets : [], 
            pathSerializer : travelOptions.getPathSerializer(),
            elevation : travelOptions.isElevationEnabled() };
        
        _.each(travelOptions.getSources(), function(source){

            // set the basic information for this source
            var src = {
                lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : _.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();
            
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {
                
                src.tm[travelType].frame = {};
                if ( !_.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !_.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {
                
                src.tm.ebike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {
                
                src.tm.rentbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {
                
                src.tm.rentandreturnbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {
                
                src.tm.bike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {
                
                src.tm.walk = {};
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            // add it to the list of sources
            cfg.sources.push(src);
        });

        cfg.targets = [];
        _.each(travelOptions.getTargets(), function(target){

             cfg.targets.push({

                lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                lng : _.has(target, 'lon') ? target.lon : _.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                id  : _.has(target, 'id')  ? target.id  : '',
            });
        });

        if ( !_.has(r360.RouteService.cache, JSON.stringify(cfg)) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+r360.config.serviceKey,
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {
                    
                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( _.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.RouteService.cache[JSON.stringify(cfg)] = JSON.parse(JSON.stringify(result.data));
                            // call successCallback with returned results
                            successCallback(r360.Util.parseRoutes(result.data));
                        }
                        else 
                            // check if the error callback is defined
                            if ( _.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.RouteService.cache[JSON.stringify(cfg)] = JSON.parse(JSON.stringify(result));
                        // call successCallback with returned results
                        successCallback(r360.Util.parseRoutes(result));
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data, test){ 

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // call error callback if defined
                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The routing service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call callback with returned results
            successCallback(r360.Util.parseRoutes(JSON.parse(JSON.stringify(r360.RouteService.cache[JSON.stringify(cfg)])))); 
        }
    }
};

r360.TimeService = {

    cache : {},

    getRouteTime : function(travelOptions, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('timeWait'));
        }

        var cfg = { 
            sources : [], targets : [],
            pathSerializer : travelOptions.getPathSerializer(), 
            maxRoutingTime : travelOptions.getMaxRoutingTime()
        };

        if ( !_.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !_.isUndefined(travelOptions.getTravelTimes()) || !_.isUndefined(travelOptions.getIntersectionMode()) || 
             !_.isUndefined(travelOptions.getRenderWatts()) || !_.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !_.isUndefined(travelOptions.getTravelTimes()) )        cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !_.isUndefined(travelOptions.getIntersectionMode()) )   cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !_.isUndefined(travelOptions.getRenderWatts()) )        cfg.polygon.renderWatts        = travelOptions.getRenderWatts();
            if ( !_.isUndefined(travelOptions.getSupportWatts()) )       cfg.polygon.supportWatts       = travelOptions.getSupportWatts();
            if ( !_.isUndefined(travelOptions.getMinPolygonHoleSize()) ) cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }

        // configure sources
        _.each(travelOptions.getSources(), function(source){

            // set the basic information for this source
            var src = {
                lat : _.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : _.has(source, 'lon') ? source.lon : _.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : _.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = _.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {
                
                src.tm[travelType].frame = {};
                if ( !_.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !_.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {
                
                src.tm.ebike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {
                
                src.tm.rentbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {
                
                src.tm.rentandreturnbike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {
                
                src.tm.bike = {};
                if ( !_.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !_.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !_.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {
                
                src.tm.walk = {};
                if ( !_.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !_.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !_.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }
            
            // add to list of sources
            cfg.sources.push(src);
        });
        
        // configure targets for routing
        _.each(travelOptions.getTargets(), function(target){

            cfg.targets.push({

                lat : _.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                lng : _.has(target, 'lon') ? target.lon : _.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                id  : _.has(target, 'id')  ? target.id  : '',
            });
        });

        if ( !_.has(r360.TimeService.cache, JSON.stringify(cfg)) ) {

            // execute routing time service and call callback with results
            $.ajax({
                url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time?key=' +r360.config.serviceKey,
                type:        "POST",
                data:        JSON.stringify(cfg) ,
                contentType: "application/json",
                timeout:     r360.config.requestTimeout,
                dataType:    "json",
                success: function (result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( _.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.TimeService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(result.data);
                        }
                        else 
                            // check if the error callback is defined
                            if ( _.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.TimeService.cache[JSON.stringify(cfg)] = result;
                        // call successCallback with returned results
                        successCallback(result);
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // call error callback if defined
                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The time service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call callback with returned results
            successCallback(r360.TimeService.cache[JSON.stringify(cfg)]); 
        }
    }
};


r360.OsmService = {

    cache : {},

    /*
     *
     */
    getPoisInBoundingBox : function(boundingBox, tags, waitControl, successCallback, errorCallback) {

        // swho the please wait control
        if ( waitControl ) {
            waitControl.show();
            waitControl.updateText(r360.config.i18n.getSpan('osmWait'));
        }

        var data = $.param({
            tags      : tags
        }, true);

        if ( typeof boundingBox !== 'undefined' ) {

            data.northEast = boundingBox._northEast.lng + '|' + boundingBox._northEast.lat;
            data.southWest = boundingBox._southWest.lng + '|' + boundingBox._southWest.lat;
        }

        if ( !_.has(r360.OsmService.cache, data) ) {

            // make the request to the Route360° backend 
            $.ajax({
                url         : r360.config.osmServiceUrl + 'pois/search?callback=?&' + data,
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {

                    if ( waitControl ) 
                        waitControl.hide();

                    successCallback(result);
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){ 

                    if ( waitControl ) 
                        waitControl.hide();

                    if ( _.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later."); 
                }
            });
        }
        else { 

            // hide the please wait control
            if ( waitControl ) waitControl.hide();
            // call successCallback with returned results
            successCallback(r360.OsmService.cache[data]);
        }
    }
}

r360.photonPlaceAutoCompleteControl = function (options) {
    return new r360.PhotonPlaceAutoCompleteControl(options);
};

r360.PhotonPlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.photonPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( _.has(options, 'position'))    this.options.position    = options.position;
            if ( _.has(options, 'label'))       this.options.label       = options.label;
            if ( _.has(options, 'country'))     this.options.country     = options.country;
            if ( _.has(options, 'reset'))       this.options.reset       = options.reset;
            if ( _.has(options, 'reverse'))     this.options.reverse     = options.reverse;
            if ( _.has(options, 'placeholder')) this.options.placeholder = options.placeholder;
            if ( _.has(options, 'width'))       this.options.width       = options.width;
            if ( _.has(options, 'maxRows'))     this.options.maxRows     = options.maxRows;
            if ( _.has(options, 'image'))       this.options.image       = options.image;
            if ( _.has(options, 'index'))       this.options.index       = options.index;
            if ( _.has(options, 'options')) {

                 this.options.options    = options.options;
                 this.options.travelType = _.has(this.options.options, 'init') ? this.options.options.init : 'walk';
            }   
        }
    },

    onAdd: function(map){
        
        var that = this;
        var i18n            = r360.config.i18n;   
        var countrySelector =  "";
        var nameContainer   = L.DomUtil.create('div', that._container);
        that.options.map    = map;
        that.options.id     = $(map._container).attr("id") + r360.Util.generateId(10);

        map.on("resize", that.onResize.bind(that));          

        // calculate the width in dependency to the number of buttons attached to the field
        var width = that.options.width;
        // if ( that.options.reset ) width += 44;
        // if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;width:'+width+'" \
                type="text" class="form-control r360-autocomplete" placeholder="' + that.options.placeholder + '" onclick="this.select()">';

        if ( that.options.image ) {

            that.options.input += 
                '<span id="'+that.options.id+'-image" class="input-group-addon btn-autocomplete-marker"> \
                    <img style="height:22px;" src="'+that.options.image+'"> \
                 </span>';
        }

        var optionsHtml = [];
        // if ( that.options.options ) {

            that.options.input += 
                '<span id="'+that.options.id+'-options-button" class="input-group-btn travel-type-buttons" ' + (!that.options.options ? 'style="display: none;"' : '') + '> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog fa-fw"></i></button> \
                </span>';

            optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center" style="color: black;width:'+width+'; display: none;">');
            optionsHtml.push('  <div class="btn-group text-center">');

            if ( that.options.options && that.options.options.walk ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button ' 
                    + (this.options.travelType == 'walk' ? 'active' : '') + 
                    '" travel-type="walk"><span class="map-icon-walking travel-type-icon"></span> <span lang="en">Walk</span><span lang="de">zu Fuß</span></button>');
            
            if ( that.options.options && that.options.options.bike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'bike' ? 'active' : '') + 
                    '" travel-type="bike"><span class="map-icon-bicycling travel-type-icon"></span> <span lang="en">Bike</span><span lang="de">Fahrrad</span></button>');

            if ( that.options.options && that.options.options.hirebike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'hirebike' ? 'active' : '') + 
                    '" travel-type="hirebike"> \
                            <span class="map-icon-bicycling travel-type-icon"></span> <span lang="en">Hire Bike</span><span lang="de">Leihfahrrad</span>\
                        </button>');
            
            if ( that.options.options && that.options.options.transit ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'transit' ? 'active' : '') + 
                    '" travel-type="transit"><span class="map-icon-train-station travel-type-icon"></span> <span lang="en">Transit</span><span lang="de">ÖPNV</span></button>');
            
            if ( that.options.options && that.options.options.car ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'car' ? 'active' : '') + 
                    '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="de">Auto</span></button>');
            
            optionsHtml.push('  </div>');
            optionsHtml.push('</div>');
        // }

        // add a reset button to the input field
        // if ( that.options.reset ) {

             that.options.input += 
                '<span id="'+that.options.id+'-reverse" ' + (!that.options.reverse ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v fa-fw"></i></button> \
                </span>';

            that.options.input += 
                '<span id="'+that.options.id+'-reset" ' + (!that.options.reset ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times fa-fw"></i></button> \
                </span>';
        // }
        // if ( that.options.reverse ) {

           
        // }

        that.options.input += '</div>';
        if ( that.options.options ) that.options.input += optionsHtml.join('');

        // add the control to the map
        $(nameContainer).append(that.options.input);

        $(nameContainer).find('#' + that.options.id + '-reset').click(function(){ that.options.onReset(); });
        $(nameContainer).find('#' + that.options.id + '-reverse').click(function(){ that.options.onReverse(); });
        $(nameContainer).find('#' + that.options.id + '-options-button').click(
            function(){ 
                // slide in or out on the click of the options button
                $('#' + that.options.id + '-options').slideToggle();
            });

        $(nameContainer).find('.travel-type-button').click(function(){

            $(nameContainer).find('.travel-type-button').removeClass('active');
            $(this).addClass('active');

            setTimeout(function() {
                  $('#' + that.options.id + '-options').slideToggle();
            }, 300);

            that.options.travelType = $(this).attr('travel-type');
            that.options.onTravelTypeChange();
        });

        // no click on the map, if click on container        
        L.DomEvent.disableClickPropagation(nameContainer);      

        if ( _.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

            source: function( request, response ) {

                that.source = this;

                var requestElements = request.term.split(" ");
                var numbers = new Array();
                var requestString = "";
                var numberString = "";
                    
                for(var i = 0; i < requestElements.length; i++){
                    
                    if(requestElements[i].search(".*[0-9].*") != -1)
                        numbers.push(requestElements[i]);
                    else
                        requestString += requestElements[i] + " ";
                }

                if ( numbers.length > 0 ) {
                    numberString += " OR ";
                    
                    for(var j = 0; j < numbers.length; j++){
                        var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                        numberString +=  n;
                    }
                }

                console.log(that.options.map.getCenter());

                $.ajax({
                    url: that.options.serviceUrl, 
                    // dataType: "jsonp",
                    // jsonp: 'json.wrf',
                    async: false,
                    data: {
                      // wt:'json',
                      // indent : true,
                      // rows: that.options.maxRows,
                      // qt: 'en',
                      // q:  "(" + requestString + numberString + ")" + countrySelector
                      q : requestString,
                      limit : that.options.maxRows
                      // lat : that.options.map.getCenter().lat,
                      // lon : that.options.map.getCenter().lng
                    }, 
                    success: function( data ) {

                        var places = new Array();
                        response( $.map( data.features, function( feature ) {

                            if ( feature.osm_key == "boundary" ) return;

                            var place           = {};
                            var firstRow        = [];
                            var secondRow       = [];
                            place.name          = feature.properties.name;
                            place.city          = feature.properties.city;
                            place.street        = feature.properties.street;
                            place.housenumber   = feature.properties.housenumber;
                            place.country       = feature.properties.country;
                            place.postalCode    = feature.properties.postcode;
                            if (place.name)       firstRow.push(place.name);
                            if (place.city)       firstRow.push(place.city);
                            if (place.street)     secondRow.push(place.street);
                            if (place.housenumber) secondRow.push(place.housenumber);
                            if (place.postalCode) secondRow.push(place.postalCode);
                            if (place.city)       secondRow.push(place.city);

                            // only show country if undefined
                            // if ( !_.has(that.options, 'country') && place.country ) 
                                secondRow.push(place.country);

                            // if same looking object is in list already: return 
                            if ( _.contains(places, firstRow.join() + secondRow.join()) ) return; 
                            else places.push(firstRow.join() + secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
                                index       : that.options.index,
                                latlng      : new L.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0])
                            }
                        }));
                    }
                });
            },
            minLength: 2,
              
            select: function( event, ui ) {
                that.options.value = ui.item;
                that.options.onSelect(ui.item);
            }
        })
        .data("ui-autocomplete")._renderItem = function( ul, item ) {

            // this has been copied from here: https://github.com/angular-ui/bootstrap/blob/master/src/typeahead/typeahead.js
            // thank you angular bootstrap team
            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            var highlightedFirstRow = 
                item.term ? (item.firstRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.firstRow;

            var highlightedSecondRow = 
                item.term ? (item.secondRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.secondRow;

            var html = "<a><span class='address-row1'>"+ highlightedFirstRow + "</span><br/><span class='address-row2'>  " + highlightedSecondRow + "</span></a>";

            return $( "<li>" ).append(html).appendTo(ul);
        };
        
        this.onResize();     

        return nameContainer;
    },

    onSelect: function(onSelect){

        this.options.onSelect = onSelect;
    },

    onReset: function(onReset){

        this.options.onReset = onReset;
    },

    onReverse: function(onReverse){
       
       this.options.onReverse = onReverse;
    },

    onTravelTypeChange: function(onTravelTypeChange){

        this.options.onTravelTypeChange = onTravelTypeChange;
    },

    reset : function(){

        this.options.value = {};
        this.setFieldValue("");
    },

    update : function(latLng, fieldValue) {

        this.setLatLng(latLng);
        this.setFieldValue(fieldValue);
    },

    setLatLng : function(latLng) {

        this.options.value.latlng = latLng
    },

    setFieldValue : function(value){

        var that = this;
        $("#autocomplete-" + that.options.id).val(value);
    },

    getFieldValue : function(){

        var that = this;
        return $("#autocomplete-" + that.options.id).val();
    },

    getTravelType : function(){

        return this.options.travelType;
    },

    setValue : function(value){
        this.options.value = value;
    },

    getValue : function(){
        return this.options.value;
    },

    getIndex : function(){
        return this.options.index;
    },

    onResize: function(){
        
        var that = this;
        if ( this.options.map.getSize().x < 550) $(that.options.input).css({'width':'45px'});
        else $(that.options.input).css({'width':''});
    }
})

r360.placeAutoCompleteControl = function (options) {
    return new r360.PlaceAutoCompleteControl(options);
};

r360.PlaceAutoCompleteControl = L.Control.extend({

    initialize: function(options){

        this.options = JSON.parse(JSON.stringify(r360.config.defaultPlaceAutoCompleteOptions));

        if ( typeof options !== "undefined" ) {
            
            if ( _.has(options, 'position'))      this.options.position      = options.position;
            if ( _.has(options, 'label'))         this.options.label         = options.label;
            if ( _.has(options, 'country'))       this.options.country       = options.country;
            if ( _.has(options, 'reset'))         this.options.reset         = options.reset;
            if ( _.has(options, 'reverse'))       this.options.reverse       = options.reverse;
            if ( _.has(options, 'placeholder'))   this.options.placeholder   = options.placeholder;
            if ( _.has(options, 'width'))         this.options.width         = options.width;
            if ( _.has(options, 'maxRows'))       this.options.maxRows       = options.maxRows;
            if ( _.has(options, 'showOnStartup')) this.options.showOnStartup = options.showOnStartup;
            if ( _.has(options, 'image'))         this.options.image         = options.image;
            if ( _.has(options, 'index'))         this.options.index         = options.index;
            if ( _.has(options, 'autoHide'))      this.options.autoHide      = options.autoHide;
            if ( _.has(options, 'options')) {

                 this.options.options    = options.options;
                 this.options.travelType = _.has(this.options.options, 'init') ? this.options.options.init : 'walk';
            }   
        }
    },

    toggleOptions : function(container){

        var that = this;

        if ( typeof container == 'undefined' )
            $('#' + that.options.id + '-options').slideToggle();
        else 
            $(container).find('#' + that.options.id + '-options').slideToggle();
    },

    onAdd: function(map){

        var that = this;
        var i18n            = r360.config.i18n;   
        var countrySelector =  "";
        var nameContainer   = L.DomUtil.create('div', that._container);
        that.options.map    = map;
        that.options.id     = $(map._container).attr("id") + r360.Util.generateId(10);

        // $(nameContainer).addClass("r360-box-shadow");

        map.on("resize", that.onResize.bind(that));          

        // calculate the width in dependency to the number of buttons attached to the field
        var width = that.options.width;
        // if ( that.options.reset ) width += 44;
        // if ( that.options.reverse ) width += 37;
        var style = 'style="width:'+ width +'px;"';

        that.options.input = 
            '<div class="input-group autocomplete r360-box-shadow" '+style+'> \
                <input id="autocomplete-'+that.options.id+'" style="color: black;widthe:'+width+'" \
                type="text" class="form-control r360-autocomplete" placeholder="' + that.options.placeholder + '" onclick="this.select()">';

        if ( that.options.image ) {

            that.options.input += 
                '<span id="'+that.options.id+'-image" class="input-group-addon btn-autocomplete-marker"> \
                    <img style="height:22px;" src="'+that.options.image+'"> \
                 </span>';
        }

        var optionsHtml = [];
        // if ( that.options.options ) {

            that.options.input += 
                '<span id="'+that.options.id+'-options-button" class="input-group-btn travel-type-buttons" ' + (!that.options.options ? 'style="display: none;"' : '') + '> \
                    <button id="'+that.options.id+'-options-btn" class="btn btn-autocomplete" type="button" title="' + i18n.get('settings') + '"><i class="fa fa-cog fa-fw"></i></button> \
                </span>';

            optionsHtml.push('<div id="'+that.options.id+'-options" class="text-center r360-box-shadoww" style="color: black;widtth:'+width+'; display: '+ (this.options.showOnStartup ? 'block' : 'none') +';">');
            optionsHtml.push('  <div class="btn-group text-center">');

            if ( that.options.options && that.options.options.walk ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button ' 
                    + (this.options.travelType == 'walk' ? 'active' : '') + 
                    '" travel-type="walk"><span class="fa fa-male travel-type-icon"></span> <span lang="en">Walk</span><span lang="no">Gå</span><span lang="de">zu Fuß</span></button>');
            
            if ( that.options.options && that.options.options.bike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'bike' ? 'active' : '') + 
                    '" travel-type="bike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Bike</span><span lang="no">Sykle</span><span lang="de">Fahrrad</span></button>');

            if ( that.options.options && that.options.options.rentbike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'rentbike' ? 'active' : '') + 
                    '" travel-type="rentbike"> \
                            <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
                        </button>');

            if ( that.options.options && that.options.options.rentandreturnbike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'rentandreturnbike' ? 'active' : '') + 
                    '" travel-type="rentandreturnbike"> \
                            <span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">Hire & Return Bike</span><span lang="no">Bysykkel</span><span lang="de">Leihfahrrad</span>\
                        </button>');
            
            if ( that.options.options && that.options.options.ebike ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'ebike' ? 'active' : '') + 
                    '" travel-type="ebike"><span class="fa fa-bicycle travel-type-icon"></span> <span lang="en">E-Bike</span><span lang="no">Elsykkel</span><span lang="de">E-Fahrrad</span></button>');
            
            if ( that.options.options && that.options.options.transit ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'transit' ? 'active' : '') + 
                    '" travel-type="transit"><span class="fa fa-bus travel-type-icon"></span> <span lang="en">Transit</span><span lang="no">TODO</span><span lang="de">ÖPNV</span></button>');
            
            if ( that.options.options && that.options.options.car ) 
                optionsHtml.push('<button type="button" class="btn btn-default travel-type-button '
                    + (this.options.travelType == 'car' ? 'active' : '') + 
                    '" travel-type="car"><span class="fa fa-car"></span> <span lang="en">Car</span><span lang="no">TODO</span><span lang="de">Auto</span></button>');
            
            optionsHtml.push('  </div>');
            optionsHtml.push('</div>');
        // }

        // add a reset button to the input field
        // if ( that.options.reset ) {

             that.options.input += 
                '<span id="'+that.options.id+'-reverse" ' + (!that.options.reverse ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button id="'+that.options.id+'-reverse-button" class="btn btn-autocomplete" type="button" title="' + i18n.get('reverse') + '"><i class="fa fa-arrows-v fa-fw"></i></button> \
                </span>';

            that.options.input += 
                '<span id="'+that.options.id+'-reset" ' + (!that.options.reset ? 'style="display: none;"' : '') + '" class="input-group-btn"> \
                    <button id="'+that.options.id+'-reset-button" class="btn btn-autocomplete" type="button" title="' + i18n.get('reset') + '"><i class="fa fa-times fa-fw"></i></button> \
                </span>';
        // }
        // if ( that.options.reverse ) {

           
        // }

        that.options.input += '</div>';
        if ( that.options.options ) that.options.input += optionsHtml.join('');

        // add the control to the map
        $(nameContainer).append(that.options.input);

        $(nameContainer).find('#' + that.options.id + '-reset').click(function(){ that.options.onReset(); });
        $(nameContainer).find('#' + that.options.id + '-reverse').click(function(){ that.options.onReverse(); });
        $(nameContainer).find('#' + that.options.id + '-options-button').click(
            function(){ 
                // slide in or out on the click of the options button
                $('#' + that.options.id + '-options').slideToggle();
            });

        $(nameContainer).find('.travel-type-button').click(function(){

            $(nameContainer).find('.travel-type-button').removeClass('active');
            $(this).addClass('active');

            if ( that.options.autoHide ) {

                setTimeout(function() {
                    $('#' + that.options.id + '-options').slideToggle();
                }, 300);
            }

            that.options.travelType = $(this).attr('travel-type');
            that.options.onTravelTypeChange();
        });

        // no click on the map, if click on container        
        L.DomEvent.disableClickPropagation(nameContainer);      

        if ( _.has(that.options, 'country' ) ) countrySelector += " AND country:" + that.options.country;

        $(nameContainer).find("#autocomplete-" + that.options.id).autocomplete({

            source: function( request, response ) {

                that.source = this;

                var requestElements = request.term.split(" ");
                var numbers = new Array();
                var requestString = "";
                var numberString = "";
                    
                for(var i = 0; i < requestElements.length; i++){
                    
                    if(requestElements[i].search(".*[0-9].*") != -1)
                        numbers.push(requestElements[i]);
                    else
                        requestString += requestElements[i] + " ";
                }

                if ( numbers.length > 0 ) {
                    numberString += " OR ";
                    
                    for(var j = 0; j < numbers.length; j++){
                        var n = "(postcode : " + numbers[j] + " OR housenumber : " + numbers[j] + " OR street : " + numbers[j] + ") ";
                        numberString +=  n;
                    }
                }

                // delay: 150,

                $.ajax({
                    url: that.options.serviceUrl, 
                    dataType: "jsonp",
                    jsonp: 'json.wrf',
                    async: false,
                    data: {
                      wt:'json',
                      indent : true,
                      rows: that.options.maxRows,
                      qt: 'en',
                      q:  "(" + requestString + numberString + ")" + countrySelector
                    }, 
                    success: function( data ) {

                        var places = new Array();
                        response( $.map( data.response.docs, function( item ) {

                            if ( item.osm_key == "boundary" ) return;

                            var latlng = item.coordinate.split(',');
                            var place           = {};
                            var firstRow        = [];
                            var secondRow       = [];
                            place.name          = item.name;
                            place.city          = item.city;
                            place.street        = item.street;
                            place.housenumber   = item.housenumber;
                            place.country       = item.country;
                            place.postalCode    = item.postcode;
                            if (place.name)       firstRow.push(place.name);
                            if (place.city)       firstRow.push(place.city);
                            if (place.street)     secondRow.push(place.street);
                            if (place.housenumber) secondRow.push(place.housenumber);
                            if (place.postalCode) secondRow.push(place.postalCode);
                            if (place.city)       secondRow.push(place.city);

                            // only show country if undefined
                            if ( !_.has(that.options, 'country') && place.country ) secondRow.push(place.country);

                            // if same looking object is in list already: return 
                            if ( _.contains(places, firstRow.join() + secondRow.join()) ) return; 
                            else places.push(firstRow.join() + secondRow.join());

                            return {
                                label       : firstRow.join(", "),
                                value       : firstRow.join(", "),
                                firstRow    : firstRow.join(", "),
                                secondRow   : secondRow.join(" "),
                                term        : request.term,
                                index       : that.options.index,
                                latlng      : new L.LatLng(latlng[0], latlng[1])
                            }
                        }));
                    }
                });
            },
            minLength: 2,
              
            select: function( event, ui ) {
                that.options.value = ui.item;
                that.options.onSelect(ui.item);
            }
        })
        .data("ui-autocomplete")._renderItem = function( ul, item ) {

            // this has been copied from here: https://github.com/angular-ui/bootstrap/blob/master/src/typeahead/typeahead.js
            // thank you angular bootstrap team
            function escapeRegexp(queryToEscape) {
                return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
            }

            var highlightedFirstRow = 
                item.term ? (item.firstRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.firstRow;

            var highlightedSecondRow = 
                item.term ? (item.secondRow).replace(new RegExp(escapeRegexp(item.term), 'gi'), '<strong>$&</strong>') : item.secondRow;

            var html = "<a><span class='address-row1'>"+ highlightedFirstRow + "</span><br/><span class='address-row2'>  " + highlightedSecondRow + "</span></a>";

            return $( "<li>" ).append(html).appendTo(ul);
        };
        
        this.onResize(); 

        return nameContainer;
    },

    onSelect: function(onSelect){

        this.options.onSelect = onSelect;
    },

    onReset: function(onReset){

        this.options.onReset = onReset;
    },

    onReverse: function(onReverse){
       
       this.options.onReverse = onReverse;
    },

    onTravelTypeChange: function(onTravelTypeChange){

        this.options.onTravelTypeChange = onTravelTypeChange;
    },

    updateI18n : function(source) {

        var that = this;
        $("#autocomplete-" + that.options.id).attr("placeholder", r360.config.i18n.get(source ? 'placeholderSrc' : 'placeholderTrg'));
        $('#' + that.options.id + '-reverse-button').attr('title', r360.config.i18n.get('reverse'));
        $('#' + that.options.id + '-reset-button').attr('title', r360.config.i18n.get('reset'));
        $('#' + that.options.id + '-options-btn').attr('title', r360.config.i18n.get('settings'));
        
    },

    reset : function(){

        this.options.value = {};
        this.setFieldValue("");
    },

    update : function(latLng, fieldValue) {

        this.setLatLng(latLng);
        this.setFieldValue(fieldValue);
    },

    setLatLng : function(latLng) {

        this.options.value.latlng = latLng
    },

    setFieldValue : function(value){

        var that = this;
        $("#autocomplete-" + that.options.id).val(value);
    },

    getFieldValue : function(){

        var that = this;
        return $("#autocomplete-" + that.options.id).val();
    },

    getTravelType : function(){

        return this.options.travelType;
    },

    setValue : function(value){
        this.options.value = value;
    },

    getValue : function(){
        return this.options.value;
    },

    getIndex : function(){
        return this.options.index;
    },

    onResize: function(){
        
        var that = this;
        if ( this.options.map.getSize().x < 550) $(that.options.input).css({'width':'45px'});
        else $(that.options.input).css({'width':''});
    }
})

/*
 *
 */
r360.TravelStartDateControl = L.Control.extend({
    
    options: {
        position: 'topright',
        dateFormat: "yy-mm-dd",
        minDate: 0
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onChange: function (func){
        this.options.onChange = func;
    },

    onAdd: function (map) {
        var that = this;
        that.options.map = map;
       
        var dateContainer = L.DomUtil.create('div', 'startDatePicker', this._container);

        that.datepicker = $('<div/>');

        $(dateContainer).append(that.datepicker);

        var options = {

            onSelect: function() { that.options.onChange(that.getValue()); },
            firstDay: 1
        }

        var i18n = r360.config.i18n;

        if ( i18n.language != 'en' ) {

            options.monthNames  = i18n.monthNames[i18n.language];
            options.dayNames    = i18n.dayNames[i18n.language];
            options.dayNamesMin = i18n.dayNamesMin[i18n.language];
        }

        $(that.datepicker).datepicker(options);    

        L.DomEvent.disableClickPropagation(dateContainer);         
       
        return dateContainer;
    },

    getValue : function() {   
        var that = this;
        var date = $(that.datepicker).datepicker({ dateFormat: 'dd-mm-yy' }).val()
        var splitDate = date.split('/');
        var yyyymmdd = splitDate[2] + '' + splitDate[0] + '' + splitDate[1];
        return yyyymmdd;
    }
});

r360.travelStartDateControl = function () {
    return new r360.TravelStartDateControl();
};

/*
 *
 */
r360.TravelStartTimeControl = L.Control.extend({
    options: {
        position    : 'topright',
        range       : false,
        min         : 0,
        max         : 1440 * 60, // start time is now in seconds
        step        : 10 * 60, // start time is now in seconds
        initValue   : 480 * 60, // start time is now in seconds
        value       : 0
    },

    /*
     *
     */
    initialize: function (options) {

        this.options.value = r360.Util.getHoursAndMinutesInSeconds();
        L.Util.setOptions(this, options);
    },

    /*
     *
     */
    onSlideStop: function (func){

        this.options.slideStop = func;
    },

    /*
     *
     */
    minToString: function(minutes){

        minutes = minutes / 60;
        var hours = Math.floor(minutes / 60);
        var min = minutes - (hours * 60);
        if ( hours > 24 ) hours -= 24;
        if ( hours < 10 ) hours = '0' + hours;
        if ( min < 10 ) min = '0' + min;
        if ( min == 0 ) min = '00';
        return ( hours + ':' + min);
    },

    /*
     *
     */
    onAdd: function (map) {

        var that = this;

        that.options.map = map;
        that.options.mapId = $(map._container).attr("id");

        map.on("resize", this.onResize.bind(this));
        // Create a control sliderContainer with a jquery ui slider
        var sliderContainer = L.DomUtil.create('div', 'startTimeSlider', this._container);

        that.miBox = $('<div/>', {"class" : "mi-box"});
        that.startTimeInfo = $('<div/>');
        that.label = $('<span/>');
        that.slider = $('<div/>');

        $(sliderContainer).append(that.miBox.append(that.startTimeInfo.append(that.label)).append(that.slider))

        $(that.label).text(r360.config.i18n.get('departure') + ': '+ 
            that.minToString(this.options.value) + ' ' + r360.Util.getTimeFormat(that.options.value));

        $(that.slider).slider({
            range:  that.options.range,
            value:  that.options.value,
            min:    that.options.min,
            max:    that.options.max,
            step:   that.options.step,
            
            slide: function (e, ui) {

                $(that.label).text(r360.config.i18n.get('departure') + ': ' +
                    that.minToString(ui.value) + ' ' + r360.Util.getTimeFormat(ui.value));
                
                that.options.value = ui.value;
            },
            stop: function(e, ui){

                that.options.slideStop(ui.value);
            }
        });
    
        this.onResize();
       /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(sliderContainer);  

        return sliderContainer;
    },

    /*
     *
     */
    onResize: function(){

        if ( this.options.map.getSize().x < 550 ) {

            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {
            this.removeAndAddClass(this.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.startTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.slider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
        }
    },

    /*
     *
     */
    removeAndAddClass: function(id,oldClass,newClass){

        $(id).addClass(newClass);
        $(id).removeClass(oldClass);
    },

    /*
     *
     */
    getValue : function() {    
        return this.options.value;
    }
});

r360.travelStartTimeControl = function () {
    return new r360.TravelStartTimeControl();
};

/*
 *
 */
r360.TravelTimeControl = L.Control.extend({
   
    /**
      * ...
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.position] 
      * @param {Number} [options.initValue] 
      * @param {Number} [options.label] 
      * @param {Array}  [options.travelTimes] Each element of this arrays has to contain a "time" and a "color" field.
      *     An example would be: { time : 600  , color : "#006837"}. The color needs to be specified in HEX notation.
      * @param {Number} [options.icon] 
      */
    initialize: function (travelTimeControlOptions) {
        
        // use the default options
        this.options = JSON.parse(JSON.stringify(r360.config.defaultTravelTimeControlOptions));

        // overwrite default options if possible
        if ( typeof travelTimeControlOptions !== "undefined" ) {
            
            if ( _.has(travelTimeControlOptions, "position") )    this.options.position     = travelTimeControlOptions.position;
            if ( _.has(travelTimeControlOptions, "unit") )        this.options.unit         = travelTimeControlOptions.unit;
            if ( _.has(travelTimeControlOptions, "initValue") )   this.options.initValue    = travelTimeControlOptions.initValue;
            if ( _.has(travelTimeControlOptions, "label") )       this.options.label        = travelTimeControlOptions.label;
            if ( _.has(travelTimeControlOptions, "travelTimes") ) this.options.travelTimes  = travelTimeControlOptions.travelTimes;
            if ( _.has(travelTimeControlOptions, "icon") )        this.options.icon         = travelTimeControlOptions.icon;
        }

        this.options.maxValue   = _.max(this.options.travelTimes, function(travelTime){ return travelTime.time; }).time / 60;
        this.options.step       = (this.options.travelTimes[1].time - this.options.travelTimes[0].time)/60;
    },

    /*
     *
     */
    onAdd: function (map) {
        var that = this;
        this.options.map = map;
        map.on("resize", this.onResize.bind(this));          

        var sliderColors = "";
        var percent = 100 / this.options.travelTimes.length;
        for(var i = 0; i < this.options.travelTimes.length; i++){
            if(i == 0)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-left-radius: 8px;-webkit-border-radius-topleft: 8px; border-top-left-radius: 8px; -moz-border-bottom-left-radius: 8px;-webkit-border-radius-bottomleft: 8px; border-bottom-left-radius: 8px;"></div>';
            else if(i < this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + ';"></div>';
            else if(i == this.options.travelTimes.length -1)
                sliderColors += '<div style="position: absolute; top: 0; bottom: 0; left: ' + i * percent + '%; right: ' + (100 - (i + 1)* percent )+ '%; background-color: ' + this.options.travelTimes[i].color + '; -moz-border-top-right-radius: 8px;-webkit-border-radius-topright: 8px; border-top-right-radius: 8px; -moz-border-bottom-right-radius: 8px;-webkit-border-radius-bottomright: 8px; border-bottom-right-radius: 8px;"></div>';
        }

        // started to remove jQuery dependency here
        // this.options.miBox = L.DomUtil.create("r360-box", "mi-box");
        // this.options.travelTimeInfo = L.DomUtil.create("travelTimeInfo");
        // this.options.travelTimeControl = L.DomUtil.create("travelTimeControl", "no-border");
        // this.options.travelTimeControlHandle = L.DomUtil.create("travelTimeControlHandle", "ui-slider-handle");

        // this.options.labelSpan = L.DomUtil.create("labelSpan");
        // this.options.labelSpan.innerHTML = this.options.label;

        // if ( this.options.icon != 'undefined' ) {

        //     this.options.iconHTML = new Image;
        //     this.options.iconHTML.src = "picture.gif";
        // }

        // this.options.travelTimeSpan = L.DomUtil.create("travelTimeSpan");
        // this.options.travelTimeSpan.innerHTML = this.options.initValue;
        // var unitSpan = L.DomUtil.create("unitSpan");
        // unitSpan.innerHTML = "min";


        // this.options.sliderContainer.innerHTML += this.options.miBox;
        // this.options.miBox.innerHTML += this.options.travelTimeInfo;
        // this.options.miBox.innerHTML += this.options.travelTimeControl;
        // this.options.travelTimeControl.innerHTML =+ travelTimeControlHandle;

        // Create a control sliderContainer with a jquery ui slider
        this.options.sliderContainer = L.DomUtil.create('div', this._container);

        this.options.miBox = $('<div/>', {"class" : "mi-box"});
        this.options.travelTimeInfo = $('<div/>');
        this.options.travelTimeSlider = $('<div/>', {"class" : "no-border"}).append(sliderColors);
        var travelTimeSliderHandle = $('<div/>', {"class" : "ui-slider-handle"});
        this.options.labelSpan = this.options.label;

        console.log(this.options);

        if ( _.has(this.options, 'icon') && this.options.icon !== 'undefined' ) this.options.iconHTML = $('<img/>', {"src" : this.options.icon})

        this.options.travelTimeSpan = $('<span/>', {"text" : this.options.initValue });
        var unitSpan = $('<span/>', {"text" : this.options.unit});

        $(this.options.sliderContainer).append(this.options.miBox);
        this.options.miBox.append(this.options.travelTimeInfo);
        this.options.miBox.append(this.options.travelTimeSlider);
        this.options.travelTimeSlider.append(travelTimeSliderHandle);
        this.options.travelTimeInfo.append(this.options.iconHTML).append(this.options.labelSpan).append(": ").append(this.options.travelTimeSpan).append(unitSpan);

        $(this.options.travelTimeSlider).slider({
            range:  false,
            value:  that.options.initValue,
            min:    0,
            max:    that.options.maxValue,
            step:   that.options.step,
            
            slide: function (e, ui) {
                if ( ui.value == 0) return false;
                $(that.options.travelTimeSpan).text(ui.value);
            },
            stop: function(e, ui){
                var travelTimes = new Array()
                for(var i = 0; i < ui.value; i+= that.options.step)
                    travelTimes.push(that.options.travelTimes[i/that.options.step]);
                that.options.onSlideStop(travelTimes);
            }
        });
        this.onResize();

        /*
        prevent map click when clicking on slider
        */
        L.DomEvent.disableClickPropagation(this.options.sliderContainer);  

        return this.options.sliderContainer;
    },

    /*
     *
     */
    onResize: function(){
        
        if ( this.options.map.getSize().x < 550 ){
            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-max', 'leaflet-traveltime-slider-container-min');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-max', 'travel-time-info-min');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-max', 'leaflet-traveltime-slider-min');
        }
        else {

            this.removeAndAddClass(this.options.miBox, 'leaflet-traveltime-slider-container-min', 'leaflet-traveltime-slider-container-max');
            this.removeAndAddClass(this.options.travelTimeInfo, 'travel-time-info-min', 'travel-time-info-max');
            this.removeAndAddClass(this.options.travelTimeSlider, 'leaflet-traveltime-slider-min', 'leaflet-traveltime-slider-max');
        }
    },

    /*
     *
     */
    removeAndAddClass: function(id,oldClass,newClass){
        $(id).addClass(newClass);
        $(id).removeClass(oldClass);
    },

    /*
     *
     */
    onSlideStop: function (onSlideStop) {
        var options = this.options;
        options.onSlideStop = onSlideStop;  
    },

    /**
     * [setValue description]
     * @param {[type]} value [description]
     */
    setValue: function(value) {

        $(this.options.travelTimeSlider).slider('value', value);
        $(this.options.travelTimeSpan).text(value);
    },

    /*
     *
     */
    getValues : function() {
        var options = this.options;
        var travelTimes = new Array()

        for(var i = 0; i < $(this.options.travelTimeSlider).slider("value"); i+= options.step) 
            travelTimes.push(options.travelTimes[i/options.step].time);
            
        return travelTimes;
    },

    /**
     * [getMaxValue Returns the maximum selected value in seconds, 
     *              internally it used the getValues method and returns the maximum.]
     *              
     * @return {[Number]}
     */ 
    getMaxValue : function() {

        return _.max(this.getValues());
    }
});

r360.travelTimeControl = function (options) {
    return new r360.TravelTimeControl(options);
};

r360.waitControl = function (options) {
    return new L.Control.WaitControl(options);
};

L.Control.WaitControl = L.Control.extend({
    
    options: {
        position : 'topleft'
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this.options.map = map;
        this.options.mapId = $(map._container).attr("id");
       
        var waitContainer = L.DomUtil.create('div', 'leaflet-control-wait');
        $(waitContainer).append(
            '<div id="wait-control-'+this.options.mapId+'" class="mi-box waitControl"> \
                <i class="fa fa-spinner fa-spin"></i> '+ (typeof this.options.text != 'undefined' ? this.options.text : r360.config.i18n.get('wait') ) +  '\
            </div>');

        return waitContainer;
    },

    updateText : function(html) {

        $('#wait-control-'+this.options.mapId).html('<i class="fa fa-spinner fa-spin"></i> ' + html);
        $("span[lang][lang!='"+r360.config.i18n.language+"']").hide();
    },

    show : function(){

        $('#wait-control-'+this.options.mapId).show();
    },

    hide : function(){
        
        $('#wait-control-'+this.options.mapId).hide();  
    }
});

r360.htmlControl = function (options) {
    return new L.Control.HtmlControl(options);
};

L.Control.HtmlControl = L.Control.extend({
    
    options: {
        position: 'topleft',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {

        // in case of multiple maps per page
        this.options.id  = $(map._container).attr("id") + r360.Util.generateId();
       
        var htmlContainer = L.DomUtil.create('div', 'leaflet-control-html');
        $(htmlContainer).append('<div id="html-control-'+this.options.id+'" class="html-control '+ this.options.classes +'"></div>');

        $(htmlContainer).on('mouseover', function(){ map.scrollWheelZoom.disable(); });
        $(htmlContainer).on('mouseout' , function(){ map.scrollWheelZoom.enable(); });      

        return htmlContainer;
    },

    setHtml : function(html) {
        $('#html-control-'+this.options.id).html(html);        
    },

    show : function(){

        $('#html-control-'+this.options.id).show();
    },

    hide : function(){
        
        $('#html-control-'+this.options.id).hide();  
    },

    toggle : function(){
        
        $('#html-control-'+this.options.id).toggle();  
    }
});

r360.RadioButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            if ( typeof options.onChange !== 'undefined' ) this.options.onChange = options.onChange;
        }
        else alert("No buttons supplied!");
    },

    onAdd: function (map) {

        var that = this;

        this.options.map    = map;
        var buttonContainer = L.DomUtil.create('div', this._container);
        this.options.input  = this.getRadioButtonHTML();
        $(buttonContainer).append(this.options.input);

        $(this.options.input).buttonset({}).change(function(){

            that.options.checked = $("input[name='r360_radiobuttongroup_" + that.options.buttonGroupId + "']:checked").attr("key");
            that.options.onChange(that.options.checked);
        });  

        $(this.options.input).each(function(index){

            $(this).tooltip({
                open: function( event, ui ) {
                    $("[lang='de'], [lang='en'], [lang='no']").hide();
                    $("[lang='"+r360.config.i18n.language+"']").show();
                },
                content: function () {
                      return $(this).attr('title');
                },
                position: {
                    my: "center top+10",
                    at: "center bottom",
                    using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" )
                        .addClass( "arrow top" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                    }
                }
            });
        }); 

        // prevent map click when clicking on slider
        L.DomEvent.addListener(buttonContainer, 'click', L.DomEvent.stopPropagation);

        return buttonContainer;
    },

    onChange: function (func){
        this.options.onChange = func;      
    },

    setValue: function(key) {

        $("input[name='r360_radiobuttongroup_" + this.options.buttonGroupId + "']:checked").next().removeClass("ui-state-active");
        var a = $("input[name='r360_radiobuttongroup_" + this.options.buttonGroupId + "'][key='"+key+"']");
        a.attr("checked", true);
        a.addClass('checked');
        a.next().addClass( "ui-state-active" );
        this.options.checked = key;
    },

    getValue: function(){

        return this.options.checked;
    },

    getRadioButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);

        var div = $('<div/>', { id : that.options.buttonGroupId });
        div.addClass('r360-box-shadow');

        // add each button to the group
        _.each(that.options.buttons, function(button){

            // generate a unique id for each button
            var id = r360.Util.generateId();

            var input = $('<input/>', { 
                "type" : 'radio', 
                "id"   : 'r360_' + id, 
                "value": button.key, 
                "key"  : button.key, 
                "name" : 'r360_radiobuttongroup_' + that.options.buttonGroupId
            });

            var label = $('<label/>', { 
                "for"  : 'r360_' + id, 
                "html" : button.label
            });

            // make the button selected (default buttin)
            if ( button.checked ) {

                that.options.checked = button.key;
                input.attr({"checked" : "checked"})
            };
            // add a tooltip if one was provided
            if ( typeof button.tooltip != 'undefined' ) 
                label.attr({"title" : button.tooltip});//
                //{

            //     label.tooltip({
            //         content: "asd",
            //         position: {
            //             my: "center top+10",
            //             at: "center bottom",
            //             using: function( position, feedback ) {
            //                 $( this ).css( position );
            //                 $( "<div>" )
            //                 .addClass( "arrow top" )
            //                 .addClass( feedback.vertical )
            //                 .addClass( feedback.horizontal )
            //                 .appendTo( this );
            //             }
            //         }
            //     });
            // }
                

            div.append(input);
            div.append(label);
        });

        return div;
    },
});

r360.radioButtonControl = function (options) {
    return new r360.RadioButtonControl(options);
};

r360.CheckboxButtonControl = L.Control.extend({

    initialize: function (options) {

        this.options = JSON.parse(JSON.stringify(r360.config.defaultRadioOptions));
        this.options.checked = {};

        if ( typeof options !== 'undefined') { 
            
            if ( typeof options.position !== 'undefined' ) this.options.position = options.position;
            if ( typeof options.buttons  !== 'undefined' ) this.options.buttons  = options.buttons;
            if ( typeof options.onChange !== 'undefined' ) this.options.onChange = options.onChange;
        }
        else alert("No buttons supplied!");
    },

    onAdd: function (map) {

        var that = this;

        this.options.map    = map;
        var buttonContainer = L.DomUtil.create('div', this._container);
        this.options.input  = this.getCheckboxButtonHTML();
        $(buttonContainer).append(this.options.input);

        $(this.options.input).buttonset({}).change(function(){

            $("input:checkbox[name='r360_checkboxbuttongroup_" + that.options.buttonGroupId + "']").each(function() {

                if ( $(this).is(':checked') ) that.options.checked[$(this).attr('key')] = true;
                else  that.options.checked[$(this).attr('key')] = false;
            });

            that.options.onChange(that.options.checked);
        });  

        $(this.options.input).each(function(){

            $(this).tooltip({
                open: function( event, ui ) {
                    $("[lang='de'], [lang='en'], [lang='no']").hide();
                    $("[lang='"+r360.config.i18n.language+"']").show();
                },
                content: function () {
                      return $(this).attr('title');
                },
                position: {
                    my: "center top+10",
                    at: "center bottom",
                    using: function( position, feedback ) {
                        $( this ).css( position );
                        $( "<div>" )
                        .addClass( "arrow top" )
                        .addClass( feedback.vertical )
                        .addClass( feedback.horizontal )
                        .appendTo( this );
                    }
                }
            });
        }); 

        // prevent map click when clicking on slider
        L.DomEvent.addListener(buttonContainer, 'click', L.DomEvent.stopPropagation);

        return buttonContainer;
    },

    onChange: function (func){

        this.options.onChange = func;      
    },

    getValue: function(){

        return this.options.checked;
    },

    getId: function(){

        return this.id;
    },

    getCheckboxButtonHTML: function(){

        var that = this; 

        // generate an ID for the complete button group
        that.options.buttonGroupId = r360.Util.generateId(5);
        that.id = that.options.buttonGroupId;

        var div = $('<div/>', { id : that.options.buttonGroupId });
        div.addClass('r360-box-shadow');

        // add each button to the group
        _.each(that.options.buttons, function(button){

            // generate a unique id for each button
            var id = r360.Util.generateId();

            var input = $('<input/>', { 
                "type" : 'checkbox', 
                "id"   : 'r360_' + id, 
                "value": button.key, 
                "key"  : button.key, 
                "name" : 'r360_checkboxbuttongroup_' + that.options.buttonGroupId
            });

            var label = $('<label/>', { 
                "for"  : 'r360_' + id, 
                "html" : !_.isUndefined(button.icon) ? button.icon + " " + button.label : "" + button.label
            });

            // make the button selected (default buttin)
            if ( button.checked ) {

                that.options.checked[button.key] = true;
                input.attr({"checked" : "checked"})
            };
            // add a tooltip if one was provided
            if ( typeof button.tooltip != 'undefined' ) label.attr({"title" : button.tooltip});

            div.append(input);
            div.append(label);
        });

        return div;
    },
});

r360.checkboxButtonControl = function (options) {
    return new r360.CheckboxButtonControl(options);
};

r360.polygon = function (traveltime, area, outerBoundary) { 
    return new r360.Polygon(traveltime, area, outerBoundary);
};

/*
 *
 */
r360.Polygon = function(traveltime, area, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);

    that.travelTime       = traveltime;
    that.area             = area;
    that.color;

    that.outerBoundary    = outerBoundary;
    
    that.innerBoundaries  = new Array();
    that.innerProjectedBoundaries = new Array();

    /**
     *
     */
    that.setOuterBoundary = function(outerBoundary){
        that.outerBoundary = outerBoundary;
    }

    that.projectOuterBoundary = function(){
        
        that.outerProjectedBoundary = new Array();
        
        for ( var i = 0 ; i < that.outerBoundary.length ; i++)     
            that.outerProjectedBoundary.push(r360.Util.webMercatorToLeaflet(that.outerBoundary[i]));
    }

    /**
     * [project description]
     * @return {[type]} [description]
     */
    that.project = function(){
        that.projectOuterBoundary();
    }

    /**
     *
     */  
    that.addInnerBoundary = function(innerBoundary){
        
        var innerProjectedBoundary = {};

        innerProjectedBoundary.projectedBottomLeft  = new L.Point(20026377, 20048967);
        innerProjectedBoundary.projectedTopRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box
        for ( var i = innerBoundary.length - 1 ; i >= 0 ; i--) {
            
            if ( innerBoundary[i].x > innerProjectedBoundary.projectedTopRight.x)   innerProjectedBoundary.projectedTopRight.x   = innerBoundary[i].x;
            if ( innerBoundary[i].y > innerProjectedBoundary.projectedTopRight.y)   innerProjectedBoundary.projectedTopRight.y   = innerBoundary[i].y;
            if ( innerBoundary[i].x < innerProjectedBoundary.projectedBottomLeft.x) innerProjectedBoundary.projectedBottomLeft.x = innerBoundary[i].x;
            if ( innerBoundary[i].y < innerProjectedBoundary.projectedBottomLeft.y) innerProjectedBoundary.projectedBottomLeft.y = innerBoundary[i].y;
        }

        innerProjectedBoundary.topRight   = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedTopRight.x, innerProjectedBoundary.projectedTopRight.y));
        innerProjectedBoundary.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(innerProjectedBoundary.projectedBottomLeft.x, innerProjectedBoundary.projectedBottomLeft.y));

        innerProjectedBoundary.projectedBottomLeft = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedBottomLeft);
        innerProjectedBoundary.projectedTopRight   = r360.Util.webMercatorToLeaflet(innerProjectedBoundary.projectedTopRight);

        innerProjectedBoundary.points = new Array();
        that.innerProjectedBoundaries.push(innerProjectedBoundary);
        
        for ( var j = 0; j < innerBoundary.length; j++)
            innerProjectedBoundary.points.push(r360.Util.webMercatorToLeaflet(innerBoundary[j]));

        innerProjectedBoundary.getProjectedBottomLeft = function() {
            return new L.Point(this.projectedBottomLeft.x, this.projectedBottomLeft.y);
        }

        innerProjectedBoundary.getProjectedTopRight = function(){
            return new L.Point(this.projectedTopRight.x, this.projectedTopRight.y);
        }
    }

    /**
     * @return {LatLngBounds} the leaflet bounding box
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getBoundingBox = function(){
        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    }

    that.getProjectedBottomLeft = function(){
        return new L.Point(that.projectedBottomLeft.x, that.projectedBottomLeft.y);
    }

    that.getProjectedTopRight = function(){
        return new L.Point(that.projectedTopRight.x, that.projectedTopRight.y);
    }

    /**
     *
     */
    that.setBoundingBox = function() { 

        this.projectedBottomLeft  = new L.Point(20026377, 20048967);
        this.projectedTopRight    = new L.Point(-20026377, -20048967);

        // calculate the bounding box
        for ( var i = this.outerBoundary.length - 1 ; i >= 0 ; i--) {
            
            if ( this.outerBoundary[i].x > this.projectedTopRight.x)    this.projectedTopRight.x   = this.outerBoundary[i].x;
            if ( this.outerBoundary[i].y > this.projectedTopRight.y)    this.projectedTopRight.y   = this.outerBoundary[i].y;
            if ( this.outerBoundary[i].x < this.projectedBottomLeft.x)  this.projectedBottomLeft.x = this.outerBoundary[i].x;
            if ( this.outerBoundary[i].y < this.projectedBottomLeft.y)  this.projectedBottomLeft.y = this.outerBoundary[i].y;
        }

        this.topRight   = r360.Util.webMercatorToLatLng(new L.Point(this.projectedTopRight.x, this.projectedTopRight.y));
        this.bottomLeft = r360.Util.webMercatorToLatLng(new L.Point(this.projectedBottomLeft.x, this.projectedBottomLeft.y));

        this.projectedTopRight   = r360.Util.webMercatorToLeaflet(this.projectedTopRight);
        this.projectedBottomLeft = r360.Util.webMercatorToLeaflet(this.projectedBottomLeft);
    }
    
    that.setBoundingBox();

    /**
     *
     */
    that.getColor = function(){
        return that.color;
    }

    /**
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /**
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }

    /**
     *
     */
    that.setColor = function(color){
        that.color = color;
    }

    /**
     * [setOpacity description]
     * @param {[type]} opacity [description]
     */
    that.setOpacity = function(opacity){
        that.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {[type]} [description]
     */
    that.getOpacity =function(){
        return that.opacity;
    }

    /**
     * [setArea description]
     * @param {[type]} area [description]
     */
    that.setArea = function(area){
        that.area = area;
    }

    /**
     * [getArea description]
     * @return {[type]} [description]
     */
    that.getArea = function(){
        return that.area;
    }
}

/*
 *
 */
r360.MultiPolygon = function() {
    
    var that = this;    

    that._topRight   = new L.latLng(-90,-180);
    that._bottomLeft = new L.latLng(90, 180);
    that.travelTime;
    that.color;
    that.polygons    = new Array();

    /*
     *
     */
    that.addPolygon = function(polygon){
        that.polygons.push(polygon);
    }


    that.setOpacity = function(opacity){
        that.opacity = opacity;
    }

    that.getOpacity = function(){
        return that.opacity;
    }

    /*
     *
     */
    that.setColor = function(color){
        that.color = color;
    }

    /*
     *
     */
    that.getColor = function(){
        return that.color;
    }

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }

    /*
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /*
     *
     */
    that.getBoundingBox = function(){
        return new L.LatLngBounds(that._bottomLeft, that._topRight)
    }

    /*
     *
     */
    that.setBoundingBox = function(){

        _.each(that.polygons, function(polygon){

            if (polygon._topRight.lat > that._topRight.lat)     that._topRight.lat   = polygon._topRight.lat;
            if (polygon._bottomLeft.lat < that._bottomLeft.lat) that._bottomLeft.lat = polygon._bottomLeft.lat;
            if (polygon._topRight.lng > that._topRight.lng)     that._topRight.lng   = polygon._topRight.lng;
            if (polygon._bottomLeft.lng < that._bottomLeft.lng) that._bottomLeft.lng = polygon._bottomLeft.lng;
        });
    }
};

r360.multiPolygon = function () { 
    return new r360.MultiPolygon();
};

/*
 *
 */
r360.RouteSegment = function(segment){      

    var that             = this;
    that.points          = [];
    that.type            = segment.type;
    that.travelTime      = segment.travelTime;

    /*
    * TODO don't call it length! in route length refers to the array length.
    * Call it distance instead
    */

    that.distance        = segment.length / 1000;    
    that.warning         = segment.warning;    
    that.elevationGain   = segment.elevationGain;
    that.errorMessage;   
    that.transitSegment  = false;
    that.startname      = segment.startname;
    that.endname        = segment.endname;

    // build the geometry
    _.each(segment.points, function(point){
        that.points.push(r360.Util.webMercatorToLatLng(new L.Point(point[1], point[0]), point[2]));
    });


    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        var colorObject     = _.findWhere(r360.config.routeTypes, {routeType : segment.routeType});
        that.color          = typeof colorObject != 'undefined' && _.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && _.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
        that.transitSegment = true;
        that.routeType      = segment.routeType;
        that.routeShortName = segment.routeShortName;
        that.startname      = segment.startname;
        that.endname        = segment.endname;
        that.departureTime  = segment.departureTime;
        that.arrivalTime    = segment.arrivalTime;
        that.tripHeadSign   = segment.tripHeadSign;
    }
    else {

        var colorObject     = _.findWhere(r360.config.routeTypes, {routeType : segment.type});
        that.color          = typeof colorObject != 'undefined' && _.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && _.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
    }

    that.getPoints = function(){
        return that.points;
    }

    that.getType = function(){
        return that.type;
    }

    that.getHaloColor = function(){
        return that.haloColor;
    }

    that.getColor = function(){
        return that.color;
    }

    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.getDistance = function(){
        return that.distance;
    }

    that.getRouteType = function(){
        return that.routeType;
    }

    that.getRouteShortName = function(){
        return that.routeShortName;
    }

    that.getStartName = function(){
        return that.startname;
    }

    that.getEndName = function(){
        return that.endname;
    }

    that.getDepartureTime = function(){
        return that.departureTime;
    }

    that.getArrivalTime = function(){
        return that.arrivalTime;
    }

    that.getTripHeadSign = function(){
        return that.tripHeadSign;
    }

    that.getWarning = function(){
        return that.warning;
    }

    that.getElevationGain = function(){
        return that.elevationGain;
    }

    that.isTransit = function(){
        return that.transitSegment;
    }
};

r360.routeSegment = function (segment) { 
    return new r360.RouteSegment(segment);
};

/*
 *
 */
r360.Route = function(travelTime, segments){

    var that             = this;
    that.travelTime      = travelTime;
    that.routeSegments   = [];
    that.points          = [];
    that.uphillMeter     = 0;
    that.downhillMeter   = 0;
    that.targetHeight    = undefined;
    that.sourceHeight    = undefined;

    // the server delivers the route from target to source
    _.each(segments.reverse(), function(segment){                

        var routeSegment = r360.routeSegment(segment);
        that.routeSegments.push(routeSegment);

        that.points = that.points.concat(routeSegment.getPoints().reverse());            
    });

    that.equals = function(route) {
        return that.getKey() === route.getKey();
    };

    that.getKey = function(){

        var key     = travelTime;
        var points  = "";

        _.each(that.getSegments(), function(segment){ 
            
            key += " " + segment.getRouteShortName() + " " + segment.getDepartureTime() + " " + segment.getArrivalTime();

            _.each(segment.getPoints(), function(point){ points += " " + point.lat + "" + point.lng; });
        });

        return key + points;
    }

    /*
     *
     */
    that.addRouteSegment = function(routeSegment){
        that.routeSegments.push(routeSegment);
    }

    /*
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /*
     *
     */

    that.getDistance = function(){
        var distance = 0;
        for(var i = 0; i < that.routeSegments.length; i++){
            distance += that.routeSegments[i].getDistance();
        }
        return distance;
    }

    /**
     * [getElevationGain description]
     * @return {[type]} [description]
     */
    that.getElevationGain = function(){
        var distance = 0;
        for(var i = 0; i < that.routeSegments.length; i++){
            distance += that.routeSegments[i].getElevationGain();
        }
        return distance;
    }

    /**
     * [getElevations description]
     * @return {[type]} [description]
     */
    that.getElevations = function() {

        var elevations = { x : [] , y : []};
        for ( var i = 0 ; i < that.getDistance() * 1000 ; i = i + 100 ) {
            elevations.x.push((i / 1000) + " km" );
            elevations.y.push(that.getElevationAt(i));
        }

        return elevations;
    }

    /**
     * [getElevationAt description]
     * @param  {[type]} meter [description]
     * @return {[type]}       [description]
     */
    that.getElevationAt = function(meter) {

        var currentLength = 0;

        for ( var i = 1 ; i < that.points.length ; i++ ){

            var previousPoint   =  that.points[i - 1];
            var currentPoint    =  that.points[i];
            var currentDistance =  previousPoint.distanceTo(currentPoint);

            currentLength += currentDistance;

            if ( currentLength > meter ) return currentPoint.alt;
        }
    }
  
    /*
     *
     */
    that.getSegments = function(){
        return that.routeSegments;
    }

    that.getUphillElevation = function() {
        return that.uphillMeter;
    }

    that.getDownhillElevation = function() {
        return that.downhillMeter;
    }

    that.getTotalElevationDifference = function(){
        return Math.abs(that.sourceHeight - that.targetHeight);
    }

    that.setElevationDifferences = function() {

        var previousHeight   = undefined; 
        var sourceHeight, targetHeight;

        for ( var i = that.points.length - 1; i >= 0 ; i-- ) {

            if ( i == 0 )                       that.targetHeight = that.points[i].alt;
            if ( i == that.points.length - 1 )  that.sourceHeight = that.points[i].alt;

            if ( typeof previousHeight != 'undefined' ) {

                // we go up
                if ( previousHeight > that.points[i].alt )  
                    that.uphillMeter += (previousHeight - that.points[i].alt);
                // and down
                else if ( previousHeight < that.points[i].alt )
                    that.downhillMeter += (that.points[i].alt - previousHeight);
            }

            previousHeight = that.points[i].alt;
        }
    }();

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.fadeIn = function(map, drawingTime, fadingType, options, onClick){

        if ( typeof drawingTime == 'undefined' ) drawingTime = 0;
        if ( typeof fadingType  == 'undefined')  fadingType  = 'travelTime';

        fadePathSegment(0);        

        function fadePathSegment(z){

            // calculate fading time for segment
            segment = that.routeSegments[z];
            percent = fadingType == "travelTime" ? segment.getTravelTime() / that.getTravelTime() : segment.getDistance() / that.getDistance();

            timeToDraw = percent * drawingTime;

            // transfer don't have a linestring, just a point
            if ( segment.getType() != "TRANSFER" ) {
                fader(segment, timeToDraw, options, z); 
            }
            else {
                
                if ( typeof options === 'undefined' || options.paintTransfer || (typeof options !== 'undefined' && !_.has(options, 'paintTransfer') )) 
                    addTransferSegment(segment, options); 

                if(++z < that.routeSegments.length)
                    fadePathSegment(z);
            }          
        }

        function addTransferSegment(segment, options){

            addCircularMarker(segment.points[0], segment, options);     

            // if inter station transfer -> involves two stops -> we need a second circle
            if( segment.points.length > 1 && segment.points[0].lat !=  segment.points[1].lat && segment.points[0].lng !=  segment.points[1].lng )
                 addCircularMarker(segment.points[1], segment, options);
        }

        function addCircularMarker(latLng, segment, options) {
            var marker = L.circleMarker(latLng, { 
                    color:          !_.isUndefined(options) && _.has(options, 'transferColor')      ? options.transferColor       : segment.getColor(), 
                    fillColor:      !_.isUndefined(options) && _.has(options, 'transferHaloColor')  ? options.transferHaloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D', 
                    fillOpacity:    !_.isUndefined(options) && _.has(options, 'transferFillOpacity')? options.transferFillOpacity : 1, 
                    opacity:        !_.isUndefined(options) && _.has(options, 'transferOpacity')    ? options.transferOpacity     : 1, 
                    stroke:         !_.isUndefined(options) && _.has(options, 'transferStroke')     ? options.transferStroke      : true, 
                    weight:         !_.isUndefined(options) && _.has(options, 'transferWeight')     ? options.transferWeight      : 4, 
                    radius:         !_.isUndefined(options) && _.has(options, 'transferRadius')     ? options.transferRadius      : 8 
                });         
    
            var popup = !_.isUndefined(options) && _.has(options, 'popup') ? options.popup : "INSERT_TEXT";

            if ( typeof segment !== 'undefined') {

                var variable = !_.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.startname) ? segment.startname : '';
                variable = variable == '' && !_.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.endname) ? segment.endname : variable;

                popup = popup.replace('INSERT_TEXT', variable);
            }

            if ( !_.isUndefined(options) && _.has(options, 'popup') ) {

                marker.bindPopup(popup)
                marker.on('mouseover', function(){ marker.openPopup(); })
            }

            marker.addTo(map);
            marker.bringToFront();
        }
        

        function fader(segment, millis, options, z){

            var polylineOptions         = {};
            polylineOptions.color       = !_.isUndefined(options) && _.has(options, 'color')    ? options.color   : segment.getColor();
            polylineOptions.opacity     = !_.isUndefined(options) && _.has(options, 'opacity' ) ? options.opacity : 0.8;
            polylineOptions.weight      = !_.isUndefined(options) && _.has(options, 'weight' )  ? options.weight  : 5;

            if ( segment.getType() != "TRANSIT" && (segment.getType() == "WALK") )  {
                
                polylineOptions.color     = !_.isUndefined(options) && _.has(options, 'walkColor' )     ? options.walkColor     : '#006F35';
                polylineOptions.weight    = !_.isUndefined(options) && _.has(options, 'walkWeight' )    ? options.walkWeight : 7;
                polylineOptions.dashArray = !_.isUndefined(options) && _.has(options, 'walkDashArray' ) ? options.walkDashArray : "1, 10";
            }

            var polylineHaloOptions     = {};
            polylineHaloOptions.weight  = !_.isUndefined(options) && _.has(options, 'haloWeight' )  ? options.haloWeight  : 10;
            polylineHaloOptions.opacity = !_.isUndefined(options) && _.has(options, 'haloOpacity' ) ? options.haloOpacity : 0.7;
            polylineHaloOptions.color   = !_.isUndefined(options) && _.has(options, 'haloColor')    ? options.haloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D';

            // 15ms for one peace. So if we want do draw the segment in 1 sec we need 66 pieces
            var pieces      = millis / 15;
            var choppedLine = chopLineString(segment.getPoints(), pieces);
            var haloLine    = L.polyline(choppedLine[0], polylineHaloOptions).addTo(map);
            var polyLine    = L.polyline(choppedLine[0], polylineOptions).addTo(map);

            // add event listener
            haloLine.on('click', onClick);
            polyLine.on('click', onClick);

            fadeLine(polyLine, haloLine, choppedLine, 1, z)
        };

        /*
        function is recalling itself every 25ms
        if you want the line to be drawn in one second you need to add a chopped line in (roughly) 40 pieces
        When line is drawn fadePathSegment is called in order to draw the next segment. 
        */

        function fadeLine(polyLine, haloLine, choppedLine, i, z){

            var latlngs = polyLine.getLatLngs();

            for ( var j = 0 ; j < choppedLine[i].length ; j++ ) 
                latlngs.push(choppedLine[i][j])
            
            
            if ( latlngs.length != 0 ) {
                haloLine.setLatLngs(latlngs);
                polyLine.setLatLngs(latlngs);
            } 

            if ( ++i < choppedLine.length ) {
                setTimeout(function(){ 
                    fadeLine(polyLine, haloLine, choppedLine, i, z); 
                }, 15);
            }else{               
                if(++z < that.routeSegments.length)
                   fadePathSegment(z);
            }
        }

        /*
        chops a linestring in a chosen number of equal pieces
        */

        function chopLineString(latlngs, pieces){

            var length          = 0;
            var steps           = 1 / pieces;        
            var percentSoFar    = 0;
            var segmentDistance;
            var segmentPercent;
            var newLatLngs  = new Array();
           
            for(var i = 1; i < latlngs.length; i++){
                length += latlngs[i-1].distanceTo(latlngs[i]);
            }

            var part        = new Array(); 

            for(var i = 0; i < latlngs.length -1; i++){

                
                part.push(latlngs[i]);
               
                segmentDistance  = latlngs[i].distanceTo(latlngs[i + 1]);
                segmentPercent   = segmentDistance / length;
                percentSoFar    += segmentPercent;

                if(percentSoFar >= steps){
                    while(percentSoFar >= steps){
                        percent = ((steps - (percentSoFar - segmentPercent))/segmentPercent);
                        part.push(interpolatePoint(latlngs[i],latlngs[i + 1],percent));
                        steps += 1 / pieces;

                        newLatLngs.push(part);
                        part        = new Array();
                    }
                }
            }

            newLatLngs.push(part);
            part    = new Array();
            part.push(latlngs[latlngs.length -1]);
            newLatLngs.push(part);
            return newLatLngs;
        };

        function interpolatePoint(latlng1, latlng2, percent){

            var project, unproject, tempmap;

            /*
                ugly hack. shall be redone when working with projected coordinates
            */
            if(typeof map.project != "undefined"){
                tempmap = map;
            }else{
                tempmap = map._map;
            }
            var p1 = tempmap.project(latlng1);
            var p2 = tempmap.project(latlng2);

            var xNew = (p2.x - p1.x) * percent + p1.x;
            var yNew = (p2.y - p1.y) * percent + p1.y;
            var newPoint = new L.point(xNew, yNew);

            var latlng = tempmap.unproject(newPoint);
        
            return latlng;          
        };
    };
};

r360.route = function (travelTime, segments) { 
    return new r360.Route(travelTime, segments);
};

/*
 *
 */
r360.Route360PolygonLayer = L.Class.extend({
   
    /**
      * This methods initializes the polygon layer's stroke width and polygon opacity.
      * It uses the default values, and in case the options contain other values, the
      * default values are overwritten. 
      *
      * @method send
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.opacity] Defines the opacity of the polygons. 
      *     Higher values mean that the polygon is less opaque.
      * @param {Number} [options.strokeWidth] Defines the strokewidth of the polygons boundaries.
      *     Since we have degenerated polygons (they can have no area), the stroke width defines the
      *     thickness of a polygon. Thicker polygons are not as informative as thinner ones.
      */
    initialize: function (options) {
        
        this.multiPolygons = []; 
        // set default parameters
        this.opacity           = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth       = r360.config.defaultPolygonLayerOptions.strokeWidth;
        this.tolerance         = r360.config.defaultPolygonLayerOptions.tolerance;
        this.extendWidthX      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.extendWidthY      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.backgroundColor   = r360.config.defaultPolygonLayerOptions.backgroundColor,
        this.backgroundOpacity = r360.config.defaultPolygonLayerOptions.backgroundOpacity,
        this.topRight          = { lat : -90, lng : -180 };
        this.bottomLeft        = { lat : -90, lng : +180 };
        
        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.opacity        != 'undefined') this.opacity      = options.opacity;
            if ( typeof options.strokeWidth    != 'undefined') this.strokeWidth  = options.strokeWidth;
            if ( typeof options.inverse        != 'undefined') this.inverse      = options.inverse;
            if ( typeof options.tolerance      != 'undefined') this.tolerance    = options.tolerance;
            if ( typeof options.extendWidthX   != 'undefined') this.extendWidthX = options.extendWidthX;
            if ( typeof options.extendWidthY   != 'undefined') this.extendWidthY = options.extendWidthY;
        }
    },

    /**
     * [setInverse Sets this layer to the inverse representation, meaning only reachable parts are displayed
     *     and the rest is greyed out.]
     * @param {[type]} inverse [true or false]
     */
    setInverse: function(inverse){
        this.inverse = inverse;
    },

    /**
     * @return {[type]} [returns the current state of this layer]
     */
    getInverse: function(){
        return this.inverse;
    },

    /**
     * [getBoundingBox returns a leaflet boundingbox from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox : function(){
        return new L.LatLngBounds(this.bottomLeft, this.topRight);
    },
    
    /*
     *
     */
    onAdd: function (map) {

        this.map = map;

        // create a DOM element with a unique ID to have multiple maps on one page
        this.element = L.DomUtil.create('div', 'r360-leaflet-polygon-layer-' + $(map._container).attr("id") + ' leaflet-zoom-hide');
        $(this.element).attr("id", "canvas" + $(this.map._container).attr("id"));
        
        // we append the layer to the overlay pane at the last position
        this.map.getPanes().overlayPane.appendChild(this.element);

        // add a view redraw event listener for updating layer's position
        // zoom in/out, panning
        this.map.on('moveend', this.draw, this);

        // repaint layer
        this.draw();
    },

    /**
     * [fitMap adjust the map to fit the complete polygon with maximum zoom level]
     * @return {[type]} [description]
     */
    fitMap: function(){
        this.map.fitBounds(this.getBoundingBox());
    },

    /**
     * [clearAndAddLayers clears the polygons from this layer and adds the new ones. If fitMap is not undefined we
     *     also adjust the map bounds/zoom to show the polygons as big as possible.]
     * @param  {[type]} multiPolygons [description]
     * @return {[type]}                  [description]
     */
    clearAndAddLayers : function(polygons, fitMap){

        this.clearLayers();
        this.addLayer(polygons);

        if ( typeof fitMap !== 'undefined' ) this.fitMap();

        return this;
    },
    
    /**
     * [addLayer description]
     * @param {[type]} multiPolygons [description]
     */
    addLayer : function(multiPolygons) {
        
        this.multiPolygons = r360.PolygonUtil.prepareMultipolygons(multiPolygons, this.topRight, this.bottomLeft);
        
        // paint them
        this.draw();
    },

    /**
     * [addTo Adds this layer to the given map]
     * @param {[type]} map [the leaflet map on which the layer should be drawn]
     */
    addTo: function (map) {

        map.addLayer(this);
        return this;
    },
    
    /**
     * [onRemove description]
     * @param  {[type]} map [description]
     * @return {[type]}     [description]
     */
    onRemove: function (map) {

        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this.element);
        map.off('viewreset', this.draw, this);
    },
    
    /**
     * [createSvgData Creates the SVG representation of a given polygon]
     * @param  {[type]} polygon [description]
     * @return {[type]}         [description]
     */
    createSvgData: function(polygon){

        var bounds = r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY);
        return r360.SvgUtil.createSvgData(polygon, { 
            bounds      : bounds, 
            scale       : Math.pow(2, this.map._zoom) * 256, 
            tolerance   : this.tolerance, 
            pixelOrigin : this.map.getPixelOrigin(),  
            offset      : this.offset
        });
    },

    /**
     * [getMapPixelBounds description]
     * @return {[type]} [description]
     */
    getMapPixelBounds : function(){

        var bounds = this.map.getPixelBounds();
        return { max : { x : bounds.max.x, y : bounds.max.y }, min : { x : bounds.min.x, y : bounds.min.y } }; 
    },

    /**
     * [clearLayers Remove all child nodes of this layer from the DOM and initializes the layer.]
     */
    clearLayers: function(){        
        
        $('#canvas'+ $(this.map._container).attr("id")).empty();
        this.initialize();
    },

    /*
     *
     */
    draw: function () {

        if ( this.multiPolygons.length > 0 ) {
             
            this.svgWidth  = this.map.getSize().x;
            this.svgHeight = this.map.getSize().y;

            // always place the layer in the top left corner. Later adjustments will be made by svg translate 
            r360.DomUtil.setPosition(this.element, { x : 0 , y : 0 });

            // calculate the offset in between map and svg in order to translate
            var svgPosition    = $('#svg_'+ $(this.map._container).attr("id")).offset();
            var mapPosition    = $(this.map._container).offset();

            if ( typeof this.offset == 'undefined' )
                this.offset = { x : 0 , y : 0 };

            // adjust the offset after map panning / zooming
            if ( typeof svgPosition != 'undefined' ) {
                this.offset.x += (mapPosition.left - svgPosition.left);
                this.offset.y += (mapPosition.top - svgPosition.top);
            }

            // clear layer from previous drawings
            $('#canvas'+ $(this.map._container).attr("id")).empty();

            var gElements = [];  
            
            // go through each multipolygon (represents each travel time)
            for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
                
                var multiPolygon = this.multiPolygons[i], svgData = [];

                // add each polygon for the given travel time
                for ( var j = 0; j < multiPolygon.polygons.length; j++) 
                    svgData.push(this.createSvgData(multiPolygon.polygons[j]));

                if ( svgData.length != 0 ) 
                    gElements.push(r360.SvgUtil.getGElement(svgData, {
                        color             : !this.inverse ? multiPolygon.getColor() : 'black',
                        opacity           : !this.inverse ? 1 : multiPolygon.getOpacity(),
                        strokeWidth       : r360.config.defaultPolygonLayerOptions.strokeWidth
                    })); 
            }

            var options = {
                id                : $(this.map._container).attr("id"),
                offset            : this.offset,
                svgHeight         : this.svgHeight,
                svgWidth          : this.svgWidth,
                backgroundColor   : this.backgroundColor,
                backgroundOpacity : this.backgroundOpacity,
                opacity           : this.opacity,
                strokeWidth       : this.strokeWidth
            }

            // add the svg string to the container
            $('#canvas'+ $(this.map._container).attr("id")).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options) 
                                                                                 : r360.SvgUtil.getInverseSvgElement(gElements, options));
        }
    }
});

r360.route360PolygonLayer = function (options) {
    return new r360.Route360PolygonLayer(options);
};


GoogleMapsPolygonLayer.prototype = new google.maps.OverlayView();

function GoogleMapsPolygonLayer(map, polygons, options) {

    // set default parameters
    this.map               = map;
    this.id                = this.map.getDiv().id
    this.inverse           = false;
    this.topRight          = { lat : -90, lng : -180 };
    this.bottomLeft        = { lat : -90, lng : +180 };
    this.multiPolygons     = r360.PolygonUtil.prepareMultipolygons(polygons, this.topRight, this.bottomLeft);
    this.opacity           = r360.config.defaultPolygonLayerOptions.opacity;
    this.strokeWidth       = r360.config.defaultPolygonLayerOptions.strokeWidth;
    this.backgroundColor   = r360.config.defaultPolygonLayerOptions.backgroundColor,
    this.backgroundOpacity = r360.config.defaultPolygonLayerOptions.backgroundOpacity,
    this.tolerance         = r360.config.defaultPolygonLayerOptions.tolerance;
    this.extendWidthX      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
    this.extendWidthY      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;

    // overwrite defaults with optional parameters
    if ( typeof options != 'undefined' ) {

        if ( typeof options.opacity        != 'undefined') this.opacity      = options.opacity;
        if ( typeof options.strokeWidth    != 'undefined') this.strokeWidth  = options.strokeWidth;
        if ( typeof options.inverse        != 'undefined') this.inverse      = options.inverse;
        if ( typeof options.tolerance      != 'undefined') this.tolerance    = options.tolerance;
        if ( typeof options.extendWidthX   != 'undefined') this.extendWidthX = options.extendWidthX;
        if ( typeof options.extendWidthY   != 'undefined') this.extendWidthY = options.extendWidthY;
    }

    // the div element containing all the data
    this.element  = null;
    // this triggers the draw method
    this.setMap(this.map);

    this.addListener();
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
GoogleMapsPolygonLayer.prototype.onAdd = function() {

    // create the dom elemenet which hols old the svgs
    this.element    = document.createElement('div');
    this.element.id = 'r360-googlemaps-polygon-layer-canvas-in-' + this.id;

    // Add the element to the "overlayLayer" pane.
    this.getPanes().overlayLayer.appendChild(this.element);  
};

GoogleMapsPolygonLayer.prototype.getMapPixelBounds = function(){

    var bottomLeft = r360.Util.googleLatlngToPoint(this.map, this.map.getBounds().getSouthWest(), this.map.getZoom());
    var topRight   = r360.Util.googleLatlngToPoint(this.map, this.map.getBounds().getNorthEast(), this.map.getZoom());

    return { max : { x : topRight.x, y : bottomLeft.y }, min : { x : bottomLeft.x, y : topRight.y } }; 
};

GoogleMapsPolygonLayer.prototype.getPixelOrigin = function(){

    var viewHalf = r360.PolygonUtil.divide({ x : this.map.getDiv().offsetWidth, y : this.map.getDiv().offsetHeight }, 2);
    var center = r360.Util.googleLatlngToPoint(this.map, this.map.getCenter(), this.map.getZoom());
    
    return r360.PolygonUtil.roundPoint(r360.PolygonUtil.subtract(center, viewHalf.x, viewHalf.y));
};

GoogleMapsPolygonLayer.prototype.setInverse = function(inverse){

    console.log('inverse');
    if ( this.inverse != inverse ) {

        this.inverse = inverse;
        this.draw();
    }
};

GoogleMapsPolygonLayer.prototype.createSvgData = function(polygon){

    var pixelBounds = r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY);

    var svg = r360.SvgUtil.createSvgData(polygon, { 
        bounds      : pixelBounds, 
        scale       : Math.pow(2, this.map.getZoom()) * 256, 
        tolerance   : this.tolerance, 
        pixelOrigin : this.getPixelOrigin(),  
        offset      : {x:0,y:0}
    });

    return svg;
};

GoogleMapsPolygonLayer.prototype.draw = function() {

    if ( this.multiPolygons.length > 0 ) {
             
        this.svgWidth  = this.map.getDiv().offsetWidth;
        this.svgHeight = this.map.getDiv().offsetHeight;

        // always place the layer in the top left corner. Later adjustments will be made by svg translate 
        r360.DomUtil.setPosition(this.element, { x : 0 , y : 0 });

        // calculate the offset in between map and svg in order to translate
        var svgPosition    = $('#svg_' + this.id).offset();
        var mapPosition    = $(this.map.getDiv()).offset();

        if ( typeof this.offset == 'undefined' )
            this.offset = { x : 0 , y : 0 };

        // adjust the offset after map panning / zooming
        if ( typeof svgPosition != 'undefined' ) {
            this.offset.x += (mapPosition.left - svgPosition.left);
            this.offset.y += (mapPosition.top  - svgPosition.top);
        }

        // clear layer from previous drawings
        $('#'+ this.element.id).empty();

        var gElements = [];  
        
        // go through each multipolygon (represents each travel time)
        for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
            
            var multiPolygon = this.multiPolygons[i], svgData = [];

            // add each polygon for the given travel time
            for ( var j = 0; j < multiPolygon.polygons.length; j++) 
                svgData.push(this.createSvgData(multiPolygon.polygons[j]));

            if ( svgData.length != 0 ) 
                gElements.push(r360.SvgUtil.getGElement(svgData, {
                    color             : !this.inverse ? multiPolygon.getColor() : 'black',
                    opacity           : !this.inverse ? 1                       : multiPolygon.getOpacity(),
                    strokeWidth       : this.strokeWidth
                })); 
        }

        var options = {
            id                : this.id,
            offset            : this.offset,
            svgHeight         : this.svgHeight,
            svgWidth          : this.svgWidth,
            backgroundColor   : this.backgroundColor,
            backgroundOpacity : this.backgroundOpacity,
            opacity           : this.opacity,
            strokeWidth       : this.strokeWidth
        }

        // add the svg string to the container
        $('#'+ this.element.id).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options) 
                                                     : r360.SvgUtil.getInverseSvgElement(gElements, options));
    }
};

GoogleMapsPolygonLayer.prototype.addListener = function() {

    var map = this.map;
    var that = this;

    google.maps.event.addListener(map, 'zoom_changed', function () {
        that.onRemove();
        google.maps.event.addListenerOnce(map, 'idle', function () {
            that.draw();
        });
    });

    google.maps.event.addListener(map, 'dragend', function () {
        google.maps.event.addListenerOnce(map, 'idle', function () {
            that.draw();
        });
    });
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
GoogleMapsPolygonLayer.prototype.onRemove = function() {
    $('#' + this.element.id).empty();
};

}(window, document));