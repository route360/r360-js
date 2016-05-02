/*
 Route360° JavaScript API v1.0.1 (36af649), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg, Daniel Gerber and Jan Silbersiepe, (c) 2014 Motion Intelligence GmbH
*/
(function (window, document, undefined) {
var r360 = {
	version : 'v1.0.1',

  // Is a given variable undefined?
  isUndefined : function(obj) {
      return obj === void 0;
  },
  
  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  has : function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
  },
  
  // is a given object a function
  isFunction : function(obj) {
    return typeof obj == 'function' || false;
  },

  findWhere : function(array, attr) {
    var result = undefined;
    array.some(function(elem,index,array){
      var match = false;
      for(var index in attr) {
        match = (r360.has(elem,index) && elem[index] === attr[index]) ? true : false;
      }
      if (match) {
        result = elem;
        return true;
      }
    });
    return result;
  },

  filter : function(array,predicate) {
    var results = [];
    array.forEach(function(elem,index,array){
      if (predicate(elem, index, array)) results.push(elem);
    });
    return results;
  }, 

  contains : function(array,item) {
    return array.indexOf(item) > -1;
  },

  each : function(array,cb) {
    array.forEach(function(elem,index,array){
      cb(elem,index,array);
    });
  },

  max : function(array, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof array[0] != 'arrayect') && array != null) {
      for (var i = 0, length = array.length; i < length; i++) {
        value = array[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      r360.each(array, function(elem, index, array) {
        computed = iteratee(elem, index, array);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = elem;
          lastComputed = computed;
        }
      });
    }
    return result;
  },

  keys : function(obj) {
    if (typeof obj !== 'Object') return [];
    if (Object.keys(obj)) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (r360.has(obj, key)) keys.push(key);
    return keys;
  }

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

/*
 * r360.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

r360.Bounds = function (a, b) { //(Point, Point) or Point[]
    if (!a) { return; }

    var points = b ? [a, b] : a;

    for (var i = 0, len = points.length; i < len; i++) {
        this.extend(points[i]);
    }
};

r360.Bounds.prototype = {
    // extend the bounds to contain the given point
    extend: function (point) { // (Point)
        point = r360.point(point);

        if (!this.min && !this.max) {
            this.min = point.clone();
            this.max = point.clone();
        } else {
            this.min.x = Math.min(point.x, this.min.x);
            this.max.x = Math.max(point.x, this.max.x);
            this.min.y = Math.min(point.y, this.min.y);
            this.max.y = Math.max(point.y, this.max.y);
        }
        return this;
    },

    getCenter: function (round) { // (Boolean) -> Point
        return new r360.Point(
                (this.min.x + this.max.x) / 2,
                (this.min.y + this.max.y) / 2, round);
    },

    getBottomLeft: function () { // -> Point
        return new r360.Point(this.min.x, this.max.y);
    },

    getTopRight: function () { // -> Point
        return new r360.Point(this.max.x, this.min.y);
    },

    getSize: function () {
        return this.max.subtract(this.min);
    },

    contains: function (obj) { // (Bounds) or (Point) -> Boolean
        var min, max;

        if (typeof obj[0] === 'number' || obj instanceof r360.Point) {
            obj = r360.point(obj);
        } else {
            obj = r360.bounds(obj);
        }

        if (obj instanceof r360.Bounds) {
            min = obj.min;
            max = obj.max;
        } else {
            min = max = obj;
        }

        return (min.x >= this.min.x) &&
               (max.x <= this.max.x) &&
               (min.y >= this.min.y) &&
               (max.y <= this.max.y);
    },

    intersects: function (bounds) { // (Bounds) -> Boolean
        bounds = r360.bounds(bounds);

        var min = this.min,
            max = this.max,
            min2 = bounds.min,
            max2 = bounds.max,
            xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
            yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

        return xIntersects && yIntersects;
    },

    overlaps: function (bounds) { // (Bounds) -> Boolean
        bounds = r360.bounds(bounds);

        var min = this.min,
            max = this.max,
            min2 = bounds.min,
            max2 = bounds.max,
            xOverlaps = (max2.x > min.x) && (min2.x < max.x),
            yOverlaps = (max2.y > min.y) && (min2.y < max.y);

        return xOverlaps && yOverlaps;
    },

    isValid: function () {
        return !!(this.min && this.max);
    }
};

r360.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
    if (!a || a instanceof r360.Bounds) {
        return a;
    }
    return new r360.Bounds(a, b);
};


/*
 * r360.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

r360.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
    if (!southWest) { return; }

    var latlngs = northEast ? [southWest, northEast] : southWest;

    for (var i = 0, len = latlngs.length; i < len; i++) {
        this.extend(latlngs[i]);
    }
};

r360.LatLngBounds.prototype = {

    // extend the bounds to contain the given point or bounds
    extend: function (obj) { // (LatLng) or (LatLngBounds)
        var sw = this._southWest,
            ne = this._northEast,
            sw2, ne2;

        if (obj instanceof r360.LatLng) {
            sw2 = obj;
            ne2 = obj;

        } else if (obj instanceof r360.LatLngBounds) {
            sw2 = obj._southWest;
            ne2 = obj._northEast;

            if (!sw2 || !ne2) { return this; }

        } else {
            return obj ? this.extend(r360.latLng(obj) || r360.latLngBounds(obj)) : this;
        }

        if (!sw && !ne) {
            this._southWest = new r360.LatLng(sw2.lat, sw2.lng);
            this._northEast = new r360.LatLng(ne2.lat, ne2.lng);
        } else {
            sw.lat = Math.min(sw2.lat, sw.lat);
            sw.lng = Math.min(sw2.lng, sw.lng);
            ne.lat = Math.max(ne2.lat, ne.lat);
            ne.lng = Math.max(ne2.lng, ne.lng);
        }

        return this;
    },

    // extend the bounds by a percentage
    pad: function (bufferRatio) { // (Number) -> LatLngBounds
        var sw = this._southWest,
            ne = this._northEast,
            heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
            widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

        return new r360.LatLngBounds(
                new r360.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
                new r360.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
    },

    getCenter: function () { // -> LatLng
        return new r360.LatLng(
                (this._southWest.lat + this._northEast.lat) / 2,
                (this._southWest.lng + this._northEast.lng) / 2);
    },

    getSouthWest: function () {
        return this._southWest;
    },

    getNorthEast: function () {
        return this._northEast;
    },

    getNorthWest: function () {
        return new r360.LatLng(this.getNorth(), this.getWest());
    },

    getSouthEast: function () {
        return new r360.LatLng(this.getSouth(), this.getEast());
    },

    getWest: function () {
        return this._southWest.lng;
    },

    getSouth: function () {
        return this._southWest.lat;
    },

    getEast: function () {
        return this._northEast.lng;
    },

    getNorth: function () {
        return this._northEast.lat;
    },

    contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
        if (typeof obj[0] === 'number' || obj instanceof r360.LatLng) {
            obj = r360.latLng(obj);
        } else {
            obj = r360.latLngBounds(obj);
        }

        var sw = this._southWest,
            ne = this._northEast,
            sw2, ne2;

        if (obj instanceof r360.LatLngBounds) {
            sw2 = obj.getSouthWest();
            ne2 = obj.getNorthEast();
        } else {
            sw2 = ne2 = obj;
        }

        return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
               (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
    },

    intersects: function (bounds) { // (LatLngBounds) -> Boolean
        bounds = r360.latLngBounds(bounds);

        var sw = this._southWest,
            ne = this._northEast,
            sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast(),

            latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
            lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

        return latIntersects && lngIntersects;
    },

    overlaps: function (bounds) { // (LatLngBounds) -> Boolean
        bounds = r360.latLngBounds(bounds);

        var sw = this._southWest,
            ne = this._northEast,
            sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast(),

            latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
            lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

        return latOverlaps && lngOverlaps;
    },

    toBBoxString: function () {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
    },

    equals: function (bounds) { // (LatLngBounds)
        if (!bounds) { return false; }

        bounds = r360.latLngBounds(bounds);

        return this._southWest.equals(bounds.getSouthWest()) &&
               this._northEast.equals(bounds.getNorthEast());
    },

    isValid: function () {
        return !!(this._southWest && this._northEast);
    }
};

//TODO International date line?

r360.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
    if (!a || a instanceof r360.LatLngBounds) {
        return a;
    }
    return new r360.LatLngBounds(a, b);
};


/*
 * r360.Point represents a point with x and y coordinates.
 */

r360.Point = function (x, y, round) {
    this.x = (round ? Math.round(x) : x);
    this.y = (round ? Math.round(y) : y);
};

r360.Point.prototype = {

    clone: function () {
        return new r360.Point(this.x, this.y);
    },

    // non-destructive, returns a new point
    add: function (point) {
        return this.clone()._add(r360.point(point));
    },

    // destructive, used directly for performance in situations where it's safe to modify existing point
    _add: function (point) {
        this.x += point.x;
        this.y += point.y;
        return this;
    },

    subtract: function (point) {
        return this.clone()._subtract(r360.point(point));
    },

    _subtract: function (point) {
        this.x -= point.x;
        this.y -= point.y;
        return this;
    },

    divideBy: function (num) {
        return this.clone()._divideBy(num);
    },

    _divideBy: function (num) {
        this.x /= num;
        this.y /= num;
        return this;
    },

    multiplyBy: function (num) {
        return this.clone()._multiplyBy(num);
    },

    _multiplyBy: function (num) {
        this.x *= num;
        this.y *= num;
        return this;
    },

    round: function () {
        return this.clone()._round();
    },

    _round: function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    },

    floor: function () {
        return this.clone()._floor();
    },

    _floor: function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    },

    ceil: function () {
        return this.clone()._ceil();
    },

    _ceil: function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    },

    distanceTo: function (point) {
        point = r360.point(point);

        var x = point.x - this.x,
            y = point.y - this.y;

        return Math.sqrt(x * x + y * y);
    },

    equals: function (point) {
        point = r360.point(point);

        return point.x === this.x &&
               point.y === this.y;
    },

    contains: function (point) {
        point = r360.point(point);

        return Math.abs(point.x) <= Math.abs(this.x) &&
               Math.abs(point.y) <= Math.abs(this.y);
    },

    toString: function () {
        return 'Point(' +
                r360.Util.formatNum(this.x) + ', ' +
                r360.Util.formatNum(this.y) + ')';
    }
};

r360.point = function (x, y, round) {
    if (x instanceof r360.Point) {
        return x;
    }
    if (r360.Util.isArray(x)) {
        return new r360.Point(x[0], x[1]);
    }
    if (x === undefined || x === null) {
        return x;
    }
    return new r360.Point(x, y, round);
};


/*
 * r360.LatLng represents a geographical point with latitude and longitude coordinates.
 */

r360.LatLng = function (lat, lng, alt) {
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    }

    this.lat = +lat;
    this.lng = +lng;

    if (alt !== undefined) {
        this.alt = +alt;
    }
};

r360.LatLng.prototype = {
    equals: function (obj, maxMargin) {
        if (!obj) { return false; }

        obj = r360.latLng(obj);

        var margin = Math.max(
                Math.abs(this.lat - obj.lat),
                Math.abs(this.lng - obj.lng));

        return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
    },

    toString: function (precision) {
        return 'LatLng(' +
                r360.Util.formatNum(this.lat, precision) + ', ' +
                r360.Util.formatNum(this.lng, precision) + ')';
    },

    distanceTo: function (other) {
        return r360.CRS.Earth.distance(this, r360.latLng(other));
    },

    wrap: function () {
        return r360.CRS.Earth.wrapLatLng(this);
    },

    toBounds: function (sizeInMeters) {
        var latAccuracy = 180 * sizeInMeters / 40075017,
                lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

        return r360.latLngBounds(
                [this.lat - latAccuracy, this.lng - lngAccuracy],
                [this.lat + latAccuracy, this.lng + lngAccuracy]);
    },

    clone: function () {
        return new r360.LatLng(this.lat, this.lng, this.alt);
    }
};


// constructs LatLng with different signatures
// (LatLng) or ([Number, Number]) or (Number, Number) or (Object)

r360.latLng = function (a, b, c) {
    if (a instanceof r360.LatLng) {
        return a;
    }
    if (r360.Util.isArray(a) && typeof a[0] !== 'object') {
        if (a.length === 3) {
            return new r360.LatLng(a[0], a[1], a[2]);
        }
        if (a.length === 2) {
            return new r360.LatLng(a[0], a[1]);
        }
        return null;
    }
    if (a === undefined || a === null) {
        return a;
    }
    if (typeof a === 'object' && 'lat' in a) {
        return new r360.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
    }
    if (b === undefined) {
        return null;
    }
    return new r360.LatLng(a, b, c);
};


/*
 * r360.Browser handles different browser and feature detections for internal Leaflet use.
 */

(function () {

    var ua = navigator.userAgent.toLowerCase(),
        doc = document.documentElement,

        ie = 'ActiveXObject' in window,

        webkit    = ua.indexOf('webkit') !== -1,
        phantomjs = ua.indexOf('phantom') !== -1,
        android23 = ua.search('android [23]') !== -1,
        chrome    = ua.indexOf('chrome') !== -1,
        gecko     = ua.indexOf('gecko') !== -1  && !webkit && !window.opera && !ie,

        mobile = typeof orientation !== 'undefined' || ua.indexOf('mobile') !== -1,
        msPointer = navigator.msPointerEnabled && navigator.msMaxTouchPoints && !window.PointerEvent,
        pointer = (window.PointerEvent && navigator.pointerEnabled && navigator.maxTouchPoints) || msPointer,

        ie3d = ie && ('transition' in doc.style),
        webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23,
        gecko3d = 'MozPerspective' in doc.style,
        opera12 = 'OTransition' in doc.style;

    var touch = !window.L_NO_TOUCH && !phantomjs && (pointer || 'ontouchstart' in window ||
            (window.DocumentTouch && document instanceof window.DocumentTouch));

    r360.Browser = {
        ie: ie,
        ielt9: ie && !document.addEventListener,
        webkit: webkit,
        gecko: gecko,
        android: ua.indexOf('android') !== -1,
        android23: android23,
        chrome: chrome,
        safari: !chrome && ua.indexOf('safari') !== -1,

        ie3d: ie3d,
        webkit3d: webkit3d,
        gecko3d: gecko3d,
        opera12: opera12,
        any3d: !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantomjs,

        mobile: mobile,
        mobileWebkit: mobile && webkit,
        mobileWebkit3d: mobile && webkit3d,
        mobileOpera: mobile && window.opera,
        mobileGecko: mobile && gecko,

        touch: !!touch,
        msPointer: !!msPointer,
        pointer: !!pointer,

        retina: (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1
    };

}());


/*
 * r360.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

r360.Class = function () {};

r360.Class.extend = function (props) {

    // extended class with the new prototype
    var NewClass = function () {

        // call the constructor
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }

        // call all constructor hooks
        this.callInitHooks();
    };

    var parentProto = NewClass.__super__ = this.prototype;

    var proto = r360.Util.create(parentProto);
    proto.constructor = NewClass;

    NewClass.prototype = proto;

    // inherit parent's statics
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'prototype') {
            NewClass[i] = this[i];
        }
    }

    // mix static properties into the class
    if (props.statics) {
        r360.extend(NewClass, props.statics);
        delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
        r360.Util.extend.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }

    // merge options
    if (proto.options) {
        props.options = r360.Util.extend(r360.Util.create(proto.options), props.options);
    }

    // mix given properties into the prototype
    r360.extend(proto, props);

    proto._initHooks = [];

    // add method for calling all hooks
    proto.callInitHooks = function () {

        if (this._initHooksCalled) { return; }

        if (parentProto.callInitHooks) {
            parentProto.callInitHooks.call(this);
        }

        this._initHooksCalled = true;

        for (var i = 0, len = proto._initHooks.length; i < len; i++) {
            proto._initHooks[i].call(this);
        }
    };

    return NewClass;
};


// method for adding properties to prototype
r360.Class.include = function (props) {
    r360.extend(this.prototype, props);
};

// merge new default options to the Class
r360.Class.mergeOptions = function (options) {
    r360.extend(this.prototype.options, options);
};

// add a constructor hook
r360.Class.addInitHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var init = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };

    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
};


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
        return r360.point(point.x * scale, point.y * scale);
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
        return r360.point(point.x - x, point.y - y);
    },

    divide: function(point, quotient){
        return r360.point(point.x / quotient, point.y / quotient);
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

    /*
     *
     */
    addPolygonToMultiPolygon: function(multiPolygons, polygon){

        var filteredMultiPolygons = r360.filter(multiPolygons, function(multiPolygon){ return multiPolygon.getTravelTime() == polygon.travelTime; });

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

    /**
     * [createSvgData description]
     * @param  {[type]} polygon [description]
     * @param  {[type]} options [description]
     * @return {[type]}         [description]
     */
    createSvgData : function(polygon, options) {

        var pathData = [];

        var topRight     = r360.PolygonUtil.scale(polygon.getTopRightDecimal(), options.scale);
        var bottomLeft   = r360.PolygonUtil.scale(polygon.getBottomLeftDecimal(), options.scale);

        // the outer boundary       
        if ( !(bottomLeft.x > options.bounds.max.x || topRight.x < options.bounds.min.x || 
               topRight.y > options.bounds.max.y   || bottomLeft.y < options.bounds.min.y ))
            r360.SvgUtil.buildSVGPolygon(pathData, polygon.getOuterBoundary().getCoordinates(), options);

        var innerBoundary = polygon.getInnerBoundary();

        // the inner boundaries
        for ( var i = 0 ; i < innerBoundary.length ; i++ ) {

            var topRightInner     = r360.PolygonUtil.scale(innerBoundary[i].getTopRightDecimal(), options.scale);
            var bottomLeftInner   = r360.PolygonUtil.scale(innerBoundary[i].getBottomLeftDecimal(), options.scale);

            if ( !(bottomLeftInner.x > options.bounds.max.x || topRightInner.x < options.bounds.min.x || 
                   topRightInner.y > options.bounds.max.y   || bottomLeftInner.y < options.bounds.min.y ))
                r360.SvgUtil.buildSVGPolygon(pathData, innerBoundary[i].getCoordinates(), options);
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

        var point, point1, point2, isCollinear, euclidianDistance, pointCount = 0;
        var boundArray = [[options.bounds.min.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.max.y], 
                          [options.bounds.min.x, options.bounds.max.y]];

        var pointsToClip = [];

        for ( var i = 0 ; i < coordinateArray.length ; i++ ) {
            
            point = r360.PolygonUtil.scale(r360.point(coordinateArray[i].x, coordinateArray[i].y), options.scale);

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
            
            point = r360.PolygonUtil.subtract(r360.point(clippedArray[i][0], clippedArray[i][1]), 
                                                options.pixelOrigin.x + options.offset.x, 
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
     *      -> (12 * 3600) + (11 * 60) = 43875w
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

        for (var i = 0; i < (length ? length : 10); i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return id;
    },

    /*
     *
     */
    parseLatLonArray : function(latlngs) {

        var coordinates = new Array();

        for ( var i = 0 ; i < latlngs.length ; i++ )
            coordinates.push(new r360.Point(latlngs[i][0], latlngs[i][1]))

        return coordinates;
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
        if ( r360.has(json.address, 'road') )          streetAdress.push(json.address.road);
        if ( r360.has(json.address, 'house_number') )  streetAdress.push(json.address.house_number);

        var city = [];
        if ( r360.has(json.address, 'postcode') )      city.push(json.address.postcode);
        if ( r360.has(json.address, 'city') )          city.push(json.address.city);

        var address = [];
        if ( streetAdress.length > 0 )  address.push(streetAdress.join(' '));
        if ( city.length > 0)           address.push(city.join(', '));

        if ( streetAdress.length == 0 && city.length == 0 ) address.push(json.display_name);

        return address.join(', ');
    },

    /**
     * [formatPhotonReverseGeocoding description]
     * @param  {[type]} place [description]
     * @return {[type]}       [description]
     */
    formatPhotonReverseGeocoding : function(place) {

        var streetAdress = [];
        if ( r360.has(place, 'name') )         streetAdress.push(place.name);
        if ( r360.has(place, 'street') )       streetAdress.push(place.street);
        if ( r360.has(place, 'housenumber') )  streetAdress.push(place.housenumber);

        var city = [];
        if ( r360.has(place, 'postcode') )     city.push(place.postcode);
        if ( r360.has(place, 'city') )         city.push(place.city);

        var address = [];
        if ( streetAdress.length > 0 )  address.push(streetAdress.join(' '));
        if ( city.length > 0)           address.push(city.join(', '));

        if ( streetAdress.length == 0 && city.length == 0 ) address.push("Reverse geocoding not possible.");

        return address.join(', ');
    },

    /*
     *
     */
    parsePolygons : function(polygonsJson) {

        var multiPolygon = [];

        // we get polygons for each source
        for ( var i = 0 ; i < polygonsJson.length ; i++ ) {

            var source          = polygonsJson[i];

            for ( var j = 0; j < source.polygons.length; j++ ) {

                // get the polygon infos
                var polygonJson   = source.polygons[j];
                // create a polygon with the outer boundary as the initial linestring
                var polygon       = r360.polygon(polygonJson.travelTime, polygonJson.area, r360.lineString(r360.Util.parseLatLonArray(polygonJson.outerBoundary)));
                // set color and default to black of not found
                var color       = r360.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() });
                polygon.setColor(!r360.isUndefined(color) ? color.color : '#000000');
                // set opacity and default to 1 if not found
                var opacity = r360.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() })
                polygon.setOpacity(!r360.isUndefined(opacity) ? opacity.opacity : 1);

                if ( typeof polygonJson.innerBoundary !== 'undefined' ) {

                    // add all inner linestrings to polygon
                    for ( var k = 0 ; k < polygonJson.innerBoundary.length ; k++ )
                        polygon.addInnerBoundary(r360.lineString(r360.Util.parseLatLonArray(polygonJson.innerBoundary[k])));
                }

                r360.PolygonUtil.addPolygonToMultiPolygon(multiPolygon, polygon);
            }
        }

        // make sure the multipolygons are sorted by the travel time ascendingly
        multiPolygon.sort(function(a,b) { return b.getTravelTime() - a.getTravelTime(); });

        return multiPolygon;
    },

    parseNetwork : function(networkJson) {

        return networkJson;
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
    // 3857 => pixel
    webMercatorToLeaflet : function(point){
        return r360.CRS.EPSG3857.transformation._transform(r360.point(point.x / 6378137, point.y / 6378137));
    },

    webMercatorToLatLng : function(point, elevation){

        var latlng = r360.CRS.EPSG3857.projection.unproject(new r360.Point(point.x, point.y));

        // x,y,z given so we have elevation data
        if ( typeof elevation !== 'undefined' )
            return r360.latLng([latlng.lat, latlng.lng, elevation]);
        // no elevation given, just unproject coordinates to lat/lng
        else
            return latlng;
    },

    latLngToWebMercator : function(latlng){

        var point = r360.Projection.SphericalMercator.project(latlng);
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

    // round a given number to a given precision
    formatNum: function (num, digits) {
        var pow = Math.pow(10, digits || 5);
        return Math.round(num * pow) / pow;
    },

    isArray : Array.isArray || function (obj) {
        return (Object.prototype.toString.call(obj) === '[object Array]');
    },

    // extend an object with properties of one or more other objects
    extend: function (dest) {
        var i, j, len, src;

        for (j = 1, len = arguments.length; j < len; j++) {
            src = arguments[j];
            for (i in src) {
                dest[i] = src[i];
            }
        }
        return dest;
    }
};

r360.extend = r360.Util.extend;


r360.DomUtil = {
    
    setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

        if (r360.Browser.any3d) {
            r360.DomUtil.setTransform(el, point);
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
        }
    },

    setTransform: function (el, offset, scale) {
        var pos = offset || new r360.Point(0, 0);

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

    this.x                  = undefined;
    this.y                  = undefined;
    this.z                  = undefined;

    this.intersectionMode   = undefined;
    this.pathSerializer     = r360.config.pathSerializer;
    this.polygonSerializer  = 'json';
    this.pointReduction     = true;
    this.maxRoutingTime     = undefined;
    this.serviceUrl         = undefined;
    this.serviceKey         = undefined;
    this.waitControl;

    this.isValidPolygonServiceOptions = function(isRouteRequest){

        // reset errors
        this.errors = [];

        // check if sources are of type array
        if ( Object.prototype.toString.call(this.getSources()) === '[object Array]' ) {

            if ( this.getSources().length == 0 ) this.getErrors().push('Sources do not contain any points!');
            else {

                // validate each source
                this.getSources().forEach(function(source){

                    if ( !r360.has(source, 'lat') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined latitude!');
                    if ( !r360.has(source, 'lon') && !r360.has(source, 'lng') && typeof source.getLatLng !== 'function' ) this.getErrors().push('Sources contains source with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Sources are not of type array!');

        // is the given travel type supported
        if ( !r360.contains(['bike', 'transit', 'walk', 'car', 'rentbike', 'rentandreturnbike', 'ebike'], this.getTravelType() ) )
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

                if ( r360.filter(this.getTravelTimes(), function(entry){ return typeof entry !== 'number'; }).length > 0 )
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
                this.getTargets().forEach(function(target){

                    if ( !r360.has(target, 'lat') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined latitude!');
                    if ( !r360.has(target, 'lon') && !r360.has(target, 'lng') && typeof target.getLatLng !== 'function' ) this.getErrors().push('Targets contains target with undefined longitude!');
                });
            }
        }
        else this.getErrors().push('Targets are not of type array!');

        // is the given path serializer supported
        if ( !r360.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
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
        if ( !r360.contains(['travelTime', 'compact', 'detailed'], this.getPathSerializer() ) )
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

    /**
     * [getPolygonSerializer description]
     * @return {[type]} [description]
     */
    this.getPolygonSerializer = function(){

        return this.polygonSerializer;
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
    this.getServiceUrl = function(){

        return this.serviceUrl;
    }

    /*
     *
     *
     *
     */
    this.getServiceKey = function(){

        return this.serviceKey;
    }

    /*
     *
     *
     *
     */
    this.setServiceKey = function(serviceKey){

        this.serviceKey = serviceKey;
    }

    /*
     *
     *
     *
     */
    this.setServiceUrl = function(serviceUrl){

        this.serviceUrl = serviceUrl;
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

    this.setPolygonSerializer = function(polygonSerializer){

        this.polygonSerializer = polygonSerializer;
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

    this.disablePointReduction = function(){
        this.pointReduction = false;
    }

    this.enablePointReduction = function(){
        this.pointReduction = true;
    }

    this.isPointReductionEnabled = function(){
        return this.pointReduction;
    }

    this.setX = function(x){
        this.x = x;
    }

    this.setY = function(y){
        this.y = y;
    }

    this.setZ = function(z){
        this.z = z;
    }

    this.getX = function(){
        return this.x;
    }

    this.getY = function(){
        return this.y;
    }

    this.getZ = function(){
        return this.z;
    }
};

r360.travelOptions = function () {
    return new r360.TravelOptions();
};



r360.MobieService = {

    cache : {},

    getCfg : function(travelOptions){

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];
        cfg.x = travelOptions.getX();
        cfg.y = travelOptions.getY();
        cfg.z = travelOptions.getZ();

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) )
            cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getMaxRoutingTime()) )
            cfg.maxRoutingTime = travelOptions.getMaxRoutingTime();

        // add each source point and it's travel configuration to the cfg
        travelOptions.getSources().forEach(function(source){

            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            cfg.sources.push(src);
        });

        return cfg;
    },

    /*
     *
     */
    getGraph : function(travelOptions, successCallback, errorCallback) {

        var cfg = r360.MobieService.getCfg(travelOptions);

        if ( !r360.has(r360.MobieService.cache, JSON.stringify(cfg)) ) {

            var options = r360.MobieService.getAjaxOptions(travelOptions, cfg, successCallback, errorCallback);

            // make the request to the Route360° backend
            // use GET as fallback, otherwise use the supplied option
            $.ajax(options);
        }
        else {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call successCallback with returned results
            successCallback(r360.Util.parseNetwork(r360.MobieService.cache[JSON.stringify(cfg)]));
        }
    },

    /**
     * [getAjaxOptions description]
     * @param  {[type]} travelOptions   [description]
     * @param  {[type]} successCallback [description]
     * @param  {[type]} errorCallback   [description]
     * @return {[type]}                 [description]
     */
    getAjaxOptions : function(travelOptions, cfg, successCallback, errorCallback) {

        var serviceUrl = typeof travelOptions.getServiceUrl() !== 'undefined' ? travelOptions.getServiceUrl() : r360.config.serviceUrl;

        var options = {
            url         : serviceUrl + r360.config.serviceVersion + '/mobie?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+travelOptions.getServiceKey(),
            timeout     : r360.config.requestTimeout,
            dataType    : "json",
            type        : "GET",
            success     : function(result) {

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                // the new version is an object, old one an array
                if ( r360.has(result, 'data')  ) {

                    if ( result.code == 'ok' ) {

                        // cache the result
                        r360.MobieService.cache[JSON.stringify(cfg)] = result.data;
                        // call successCallback with returned results
                        successCallback(r360.Util.parseNetwork(result.data));
                    }
                    else
                        // check if the error callback is defined
                        if ( r360.isFunction(errorCallback) )
                            errorCallback(result.code, result.message);
                }
                // fallback for old clients
                else {

                    // cache the result
                    r360.MobieService.cache[JSON.stringify(cfg)] = result;
                    // call successCallback with returned results
                    successCallback(r360.Util.parseNetwork(result));
                }
            },
            // this only happens if the service is not available, all other errors have to be transmitted in the response
            error: function(data){

                // hide the please wait control
                if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                // call error callback if defined
                if ( r360.isFunction(errorCallback) ) {

                    if ( data.status == 403 )
                        errorCallback("not-authorized", data.responseText);
                    else
                        errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later.");
                }
            }
        };

        return options;
    }
}



r360.PolygonService = {

    cache : {},

    getCfg : function(travelOptions){

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];
        cfg.x = travelOptions.getX();
        cfg.y = travelOptions.getY();
        cfg.z = travelOptions.getZ();

        debugger

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getTravelTimes()) || !r360.isUndefined(travelOptions.getIntersectionMode()) ||
             !r360.isUndefined(travelOptions.getRenderWatts()) || !r360.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !r360.isUndefined(travelOptions.getTravelTimes()) )           cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )      cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !r360.isUndefined(travelOptions.getPolygonSerializer()) )     cfg.polygon.serializer         = travelOptions.getPolygonSerializer();
            if ( !r360.isUndefined(travelOptions.isPointReductionEnabled()) )  cfg.polygon.pointReduction     = travelOptions.isPointReductionEnabled();
            if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) )    cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }

        // add each source point and it's travel configuration to the cfg
        travelOptions.getSources().forEach(function(source){

            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {

                src.tm.ebike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {

                src.tm.rentbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {

                src.tm.rentandreturnbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            cfg.sources.push(src);
        });

        return cfg;
    },

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, successCallback, errorCallback, method) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('polygonWait'));
        }

        var cfg = r360.PolygonService.getCfg(travelOptions);

        if ( !r360.has(r360.PolygonService.cache, JSON.stringify(cfg)) ) {

            var options = r360.PolygonService.getAjaxOptions(travelOptions, cfg, successCallback, errorCallback, typeof method == 'undefined' ? 'GET' : method);

            // make the request to the Route360° backend
            // use GET as fallback, otherwise use the supplied option
            $.ajax(options);
        }
        else {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call successCallback with returned results
            successCallback(r360.Util.parsePolygons(r360.PolygonService.cache[JSON.stringify(cfg)]));
        }
    },

    /**
     * [getAjaxOptions description]
     * @param  {[type]} travelOptions   [description]
     * @param  {[type]} successCallback [description]
     * @param  {[type]} errorCallback   [description]
     * @return {[type]}                 [description]
     */
    getAjaxOptions : function(travelOptions, cfg, successCallback, errorCallback, method) {

        var serviceUrl = typeof travelOptions.getServiceUrl() !== 'undefined' ? travelOptions.getServiceUrl() : r360.config.serviceUrl;

        var options = {
                url         : serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+travelOptions.getServiceKey(),
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                type        : method,
                success     : function(result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PolygonService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(r360.Util.parsePolygons(result.data));
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
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
                    if ( r360.isFunction(errorCallback) ) {

                        if ( data.status == 403 )
                            errorCallback("not-authorized", data.responseText);
                        else
                            errorCallback("service-not-available", "The travel time polygon service is currently not available, please try again later.");
                    }
                }
            };

        if ( method == 'POST' ) {

            options.url         = serviceUrl + r360.config.serviceVersion + '/polygon_post?key=' + travelOptions.getServiceKey();
            options.data        = JSON.stringify(cfg);
            options.contentType = 'application/json';
            options.async       = false;
        }

        return options;
    }
}



r360.PopulationService = {

    cache : {},

    /*
     *
     */
    getPopulationStatistics : function(travelOptions, populationStatistics, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('populationWait'));
        }

        // we only need the source points for the polygonizing and the polygon travel times
        var cfg = {};
        cfg.sources = [];

        if ( typeof travelOptions.isElevationEnabled() != 'undefined' ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( typeof travelOptions.getTravelTimes() != 'undefined' || typeof travelOptions.getIntersectionMode() != 'undefined' ||
             typeof travelOptions.getRenderWatts() != 'undefined' || typeof travelOptions.getSupportWatts()     != 'undefined' ) {

            cfg.polygon = {};

            if ( typeof travelOptions.getTravelTimes()      != 'undefined' ) cfg.polygon.values           = travelOptions.getTravelTimes();
            if ( typeof travelOptions.getIntersectionMode() != 'undefined' ) cfg.polygon.intersectionMode = travelOptions.getIntersectionMode();
            if ( typeof travelOptions.getRenderWatts()      != 'undefined' ) cfg.polygon.renderWatts      = travelOptions.getRenderWatts();
            if ( typeof travelOptions.getSupportWatts()     != 'undefined' ) cfg.polygon.supportWatts     = travelOptions.getSupportWatts();
        }

        // add each source point and it's travel configuration to the cfg
        travelOptions.getSources().forEach(function(source){

            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : source.lat + ';' + source.lng,
                tm  : {}
            };

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' ) {

                src.tm.transit.frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm.transit.frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm.transit.frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {

                src.tm.ebike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {

                src.tm.rentbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {

                src.tm.rentandreturnbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            cfg.sources.push(src);
        });

        var statistics = [];
        r360.each(populationStatistics, function(statistic) { statistics.push('statistics=' + statistic); })

        if ( !r360.has(r360.PopulationService.cache, JSON.stringify(cfg) + statistics.join("&")) ) {

            // make the request to the Route360° backend
            $.ajax({
                url         : travelOptions.getServiceUrl() + r360.config.serviceVersion + '/population?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + '&cb=?&key='+travelOptions.getServiceKey() + '&' + statistics.join("&"),
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")] = result.data;
                            // call successCallback with returned results
                            successCallback(result.data);
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
                                errorCallback(result.code, result.message);
                    }
                    // fallback for old clients
                    else {

                        // cache the result
                        r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")] = result;
                        // call successCallback with returned results
                        successCallback(result);
                    }
                },
                // this only happens if the service is not available, all other errors have to be transmitted in the response
                error: function(data){

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
                    // call error callback if defined
                    if ( r360.isFunction(errorCallback) )
                        errorCallback("service-not-available", "The population service is currently not available, please try again later.");
                }
            });
        }
        else {

            // hide the please wait control
            if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();
            // call callback with returned results
            successCallback(r360.PopulationService.cache[JSON.stringify(cfg) + statistics.join("&")]);
        }
    }
}


r360.RouteService = {

    cache : {},

    /*
     *
     */
    getCfg : function(travelOptions){

        var cfg = { sources : [], targets : [],
            pathSerializer : travelOptions.getPathSerializer(),
            elevation : travelOptions.isElevationEnabled() };

        travelOptions.getSources().forEach(function(source){

            // set the basic information for this source
            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
                if ( !r360.isUndefined(travelOptions.getRecommendations()) ) src.tm[travelType].recommendations = travelOptions.getRecommendations();
            }
            if ( travelType == 'ebike' ) {

                src.tm.ebike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {

                src.tm.rentbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {

                src.tm.rentandreturnbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            // add it to the list of sources
            cfg.sources.push(src);
        });

        cfg.targets = [];
        travelOptions.getTargets().forEach(function(target){

             cfg.targets.push({

                lat : r360.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                lng : r360.has(target, 'lon') ? target.lon : r360.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                id  : r360.has(target, 'id')  ? target.id  : '',
            });
        });

        return cfg;
    },

    /*
     *
     */
    getRoutes : function(travelOptions, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('routeWait'));
        }

        var cfg = r360.RouteService.getCfg(travelOptions);

        if ( !r360.has(r360.RouteService.cache, JSON.stringify(cfg)) ) {

            // make the request to the Route360° backend
            $.ajax({
                url         : travelOptions.getServiceUrl() + r360.config.serviceVersion + '/route?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + "&cb=?&key="+travelOptions.getServiceKey(),
                timeout     : r360.config.requestTimeout,
                dataType    : "json",
                success     : function(result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.RouteService.cache[JSON.stringify(cfg)] = JSON.parse(JSON.stringify(result.data));
                            // call successCallback with returned results
                            successCallback(r360.Util.parseRoutes(result.data));
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
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
                error: function(data){

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // call error callback if defined
                    if ( r360.isFunction(errorCallback) ) {

                        if ( data.status == 403 )
                            errorCallback("not-authorized", data.responseText);
                        else
                            errorCallback("service-not-available", "The routing service is currently not available, please try again later.");
                    }
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

    getCfg : function(travelOptions) {

        var cfg = {
            sources : [], targets : [],
            pathSerializer : travelOptions.getPathSerializer(),
            maxRoutingTime : travelOptions.getMaxRoutingTime()
        };

        if ( !r360.isUndefined(travelOptions.isElevationEnabled()) ) cfg.elevation = travelOptions.isElevationEnabled();
        if ( !r360.isUndefined(travelOptions.getTravelTimes()) || !r360.isUndefined(travelOptions.getIntersectionMode()) ||
             !r360.isUndefined(travelOptions.getRenderWatts()) || !r360.isUndefined(travelOptions.getSupportWatts()) ) {

            cfg.polygon = {};

            if ( !r360.isUndefined(travelOptions.getTravelTimes()) )        cfg.polygon.values             = travelOptions.getTravelTimes();
            if ( !r360.isUndefined(travelOptions.getIntersectionMode()) )   cfg.polygon.intersectionMode   = travelOptions.getIntersectionMode();
            if ( !r360.isUndefined(travelOptions.getRenderWatts()) )        cfg.polygon.renderWatts        = travelOptions.getRenderWatts();
            if ( !r360.isUndefined(travelOptions.getSupportWatts()) )       cfg.polygon.supportWatts       = travelOptions.getSupportWatts();
            if ( !r360.isUndefined(travelOptions.getMinPolygonHoleSize()) ) cfg.polygon.minPolygonHoleSize = travelOptions.getMinPolygonHoleSize();
        }

        // configure sources
        travelOptions.getSources().forEach(function(source){

            // set the basic information for this source
            var src = {
                lat : r360.has(source, 'lat') ? source.lat : source.getLatLng().lat,
                lng : r360.has(source, 'lon') ? source.lon : r360.has(source, 'lng') ? source.lng : source.getLatLng().lng,
                id  : r360.has(source, 'id')  ? source.id  : '',
                tm  : {}
            };

            if ( src.id == '' ) src.id = src.lat + ';' + src.lng;

            var travelType = r360.has(source, 'travelType') ? source.travelType : travelOptions.getTravelType();

            // this enables car routing
            src.tm[travelType] = {};

            // set special routing parameters depending on the travel type
            if ( travelType == 'transit' || travelType == 'biketransit' ) {

                src.tm[travelType].frame = {};
                if ( !r360.isUndefined(travelOptions.getTime()) ) src.tm[travelType].frame.time = travelOptions.getTime();
                if ( !r360.isUndefined(travelOptions.getDate()) ) src.tm[travelType].frame.date = travelOptions.getDate();
            }
            if ( travelType == 'ebike' ) {

                src.tm.ebike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.ebike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.ebike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.ebike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'rentbike' ) {

                src.tm.rentbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'rentandreturnbike' ) {

                src.tm.rentandreturnbike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.rentandreturnbike.bikespeed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.rentandreturnbike.bikeuphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.rentandreturnbike.bikedownhill = travelOptions.getBikeDownhill();
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.rentandreturnbike.walkspeed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.rentandreturnbike.walkuphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.rentandreturnbike.walkdownhill = travelOptions.getWalkDownhill();
            }
            if ( travelType == 'bike' ) {

                src.tm.bike = {};
                if ( !r360.isUndefined(travelOptions.getBikeSpeed()) )     src.tm.bike.speed    = travelOptions.getBikeSpeed();
                if ( !r360.isUndefined(travelOptions.getBikeUphill()) )    src.tm.bike.uphill   = travelOptions.getBikeUphill();
                if ( !r360.isUndefined(travelOptions.getBikeDownhill()) )  src.tm.bike.downhill = travelOptions.getBikeDownhill();
            }
            if ( travelType == 'walk') {

                src.tm.walk = {};
                if ( !r360.isUndefined(travelOptions.getWalkSpeed()) )     src.tm.walk.speed    = travelOptions.getWalkSpeed();
                if ( !r360.isUndefined(travelOptions.getWalkUphill()) )    src.tm.walk.uphill   = travelOptions.getWalkUphill();
                if ( !r360.isUndefined(travelOptions.getWalkDownhill()) )  src.tm.walk.downhill = travelOptions.getWalkDownhill();
            }

            // add to list of sources
            cfg.sources.push(src);
        });

        // configure targets for routing
        travelOptions.getTargets().forEach(function(target){

            var target = {

                lat : r360.has(target, 'lat') ? target.lat : target.getLatLng().lat,
                lng : r360.has(target, 'lon') ? target.lon : r360.has(target, 'lng') ? target.lng : target.getLatLng().lng,
                id  : r360.has(target, 'id')  ? target.id  : '',
            };

            if ( target.id == '' ) target.id = target.lat + ';' + target.lng;

            cfg.targets.push(target);
        });

        return cfg;
    },

    getRouteTime : function(travelOptions, successCallback, errorCallback) {

        // swho the please wait control
        if ( travelOptions.getWaitControl() ) {
            travelOptions.getWaitControl().show();
            travelOptions.getWaitControl().updateText(r360.config.i18n.getSpan('timeWait'));
        }

        var cfg = r360.TimeService.getCfg(travelOptions);

        if ( !r360.has(r360.TimeService.cache, JSON.stringify(cfg)) ) {

            // execute routing time service and call callback with results
            $.ajax({
                url:         travelOptions.getServiceUrl() + r360.config.serviceVersion + '/time?key=' +travelOptions.getServiceKey(),
                type:        "POST",
                data:        JSON.stringify(cfg) ,
                contentType: "application/json",
                timeout:     r360.config.requestTimeout,
                dataType:    "json",
                success: function (result) {

                    // hide the please wait control
                    if ( travelOptions.getWaitControl() ) travelOptions.getWaitControl().hide();

                    // the new version is an object, old one an array
                    if ( r360.has(result, 'data')  ) {

                        if ( result.code == 'ok' ) {

                            // cache the result
                            r360.TimeService.cache[JSON.stringify(cfg)] = result.data;
                            // call successCallback with returned results
                            successCallback(result.data);
                        }
                        else
                            // check if the error callback is defined
                            if ( r360.isFunction(errorCallback) )
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
                    if ( r360.isFunction(errorCallback) ) {

                        if ( data.status == 403 )
                            errorCallback("not-authorized", data.responseText);
                        else
                            errorCallback("service-not-available", "The time service is currently not available, please try again later.");
                    }
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

        if ( !r360.has(r360.OsmService.cache, data) ) {

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

                    if ( r360.isFunction(errorCallback) )
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

/*
 * Spherical Mercator is the most popular map projection, used by EPSG:3857 CRS used by default.
 */
r360.Projection = {};

r360.Projection.SphericalMercator = {

    R: 6378137,

    project: function (latlng) {
        var d = Math.PI / 180,
            max = 1 - 1E-15,
            sin = Math.max(Math.min(Math.sin(latlng.lat * d), max), -max);

        return new r360.Point(
                this.R * latlng.lng * d,
                this.R * Math.log((1 + sin) / (1 - sin)) / 2);
    },

    unproject: function (point) {
        var d = 180 / Math.PI;

        return new r360.LatLng(
            (2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
            point.x * d / this.R);
    },

    bounds: (function () {
        var d = 6378137 * Math.PI;
        return r360.bounds([-d, -d], [d, d]);
    })()
};


/*
 * r360.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

r360.Transformation = function (a, b, c, d) {
    this._a = a;
    this._b = b;
    this._c = c;
    this._d = d;
};

r360.Transformation.prototype = {
    transform: function (point, scale) { // (Point, Number) -> Point
        return this._transform(point.clone(), scale);
    },

    // destructive transform (faster)
    _transform: function (point, scale) {

        scale = scale || 1;
        point.x = scale * (this._a * point.x + this._b);
        point.y = scale * (this._c * point.y + this._d);
        return point;
    },

    untransform: function (point, scale) {
        scale = scale || 1;
        return new r360.Point(
                (point.x / scale - this._b) / this._a,
                (point.y / scale - this._d) / this._c);
    }
};


/*
 * r360.CRS is the base object for all defined CRS (Coordinate Reference Systems) in Leaflet.
 */

r360.CRS = {
    // converts geo coords to pixel ones
    latLngToPoint: function (latlng, zoom) {
        var projectedPoint = this.projection.project(latlng),
            scale = this.scale(zoom);

        return this.transformation._transform(projectedPoint, scale);
    },

    // converts pixel coords to geo coords
    pointToLatLng: function (point, zoom) {
        var scale = this.scale(zoom),
            untransformedPoint = this.transformation.untransform(point, scale);

        return this.projection.unproject(untransformedPoint);
    },

    // converts geo coords to projection-specific coords (e.g. in meters)
    project: function (latlng) {
        return this.projection.project(latlng);
    },

    // converts projected coords to geo coords
    unproject: function (point) {
        return this.projection.unproject(point);
    },

    // defines how the world scales with zoom
    scale: function (zoom) {
        return 256 * Math.pow(2, zoom);
    },

    // returns the bounds of the world in projected coords if applicable
    getProjectedBounds: function (zoom) {
        if (this.infinite) { return null; }

        var b = this.projection.bounds,
            s = this.scale(zoom),
            min = this.transformation.transform(b.min, s),
            max = this.transformation.transform(b.max, s);

        return r360.bounds(min, max);
    },

    // whether a coordinate axis wraps in a given range (e.g. longitude from -180 to 180); depends on CRS
    // wrapLng: [min, max],
    // wrapLat: [min, max],

    // if true, the coordinate space will be unbounded (infinite in all directions)
    // infinite: false,

    // wraps geo coords in certain ranges if applicable
    wrapLatLng: function (latlng) {
        var lng = this.wrapLng ? r360.Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
            lat = this.wrapLat ? r360.Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
            alt = latlng.alt;

        return r360.latLng(lat, lng, alt);
    }
};


/*
 * r360.CRS.Earth is the base class for all CRS representing Earth.
 */

r360.CRS.Earth = r360.extend({}, r360.CRS, {
    wrapLng: [-180, 180],

    R: 6378137,

    // distance between two geographical points using spherical law of cosines approximation
    distance: function (latlng1, latlng2) {
        var rad = Math.PI / 180,
            lat1 = latlng1.lat * rad,
            lat2 = latlng2.lat * rad,
            a = Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos((latlng2.lng - latlng1.lng) * rad);

        return this.R * Math.acos(Math.min(a, 1));
    }
});


/*
 * r360.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping and is used by Leaflet by default.
 */

r360.CRS.EPSG3857 = r360.extend({}, r360.CRS.Earth, {
    code: 'EPSG:3857',
    projection: r360.Projection.SphericalMercator,

    transformation: (function () {
        var scale = 0.5 / (Math.PI);
        return new r360.Transformation(scale, 0.5, -scale, 0.5);
    }())
});

r360.CRS.EPSG900913 = r360.extend({}, r360.CRS.EPSG3857, {
    code: 'EPSG:900913'
});


r360.polygon = function (traveltime, area, outerBoundary) { 
    return new r360.Polygon(traveltime, area, outerBoundary);
};

/*
 *
 */
r360.Polygon = function(traveltime, area, outerBoundary) {

    this.travelTime  = traveltime;
    this.area        = area;
    this.color       = 'black';
    this.opacity     = 0.5;
    this.lineStrings = [outerBoundary];
    this.bounds      = undefined;

    /**
     * [setTravelTime description]
     * @param {[type]} travelTime [description]
     */
    this.setTravelTime = function(travelTime){
        this.travelTime = travelTime;
    }

    /**
     * [getTravelTime description]
     * @return {[type]} [description]
     */
    this.getTravelTime = function(){
        return this.travelTime;
    }

        /**
     * [getColor description]
     * @return {[type]} [description]
     */
    this.getColor = function(){
        return this.color;
    }

    /**
     * [setColor description]
     * @param {[type]} color [description]
     */
    this.setColor = function(color){
        this.color = color;
    }

    /**
     * [setOpacity description]
     * @param {[type]} opacity [description]
     */
    this.setOpacity = function(opacity){
        this.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {[type]} [description]
     */
    this.getOpacity =function(){
        return this.opacity;
    }

    /**
     * [getArea description]
     * @return {[type]} [description]
     */
    this.getArea = function(){
        return this.area;
    }

    /**
     * [setArea description]
     * @param {[type]} area [description]
     */
    this.setArea = function(area){
        this.area = area;
    }

    /**
     * [getOuterBoundary description]
     * @return {[type]} [description]
     */
    this.getOuterBoundary = function() {
        return this.lineStrings[0];
    }

    /**
     * [getInnerBoundary description]
     * @return {[type]} [description]
     */
    this.getInnerBoundary = function() {
        return this.lineStrings.slice(1);
    }

    /**
     * [getTopRight4326 description]
     * @return {[type]} [description]
     */
    this.getTopRight4326 = function(){
        return this.getOuterBoundary().getTopRight4326();
    }

    /**
     * [getTopRight3857 description]
     * @return {[type]} [description]
     */
    this.getTopRight3857 = function(){
        return this.getOuterBoundary().getTopRight3857();   
    }

    /**
     * [getTopRightDecimal description]
     * @return {[type]} [description]
     */
    this.getTopRightDecimal = function(){
        return this.getOuterBoundary().getTopRightDecimal();
    }

    /**
     * [getBottomLeft4326 description]
     * @return {[type]} [description]
     */
    this.getBottomLeft4326 = function(){
        return this.getOuterBoundary().getBottomLeft4326();
    }

    /**
     * [getBottomLeft3857 description]
     * @return {[type]} [description]
     */
    this.getBottomLeft3857 = function(){
        return this.getOuterBoundary().getBottomLeft3857();
    }

    /**
     * [getBottomLeftDecimal description]
     * @return {[type]} [description]
     */
    this.getBottomLeftDecimal = function(){
        return this.getOuterBoundary().getBottomLeftDecimal();
    }

    /**
     * [addInnerBoundary description]
     * @param {[type]} innerBoundary [description]
     */
    this.addInnerBoundary = function(innerBoundary){
        this.lineStrings.push(innerBoundary);
    }
}

/*
 *
 */
r360.MultiPolygon = function() {
    
    this.travelTime;
    this.color;
    this.polygons      = new Array();

    // default min/max values
    this.topRight_3857          = new r360.Point(-20026377, -20048967);
    this.bottomLeft_3857        = new r360.Point(+20026377, +20048967);

    /**
     * [addPolygon description]
     * @param {[type]} polygon [description]
     */
    this.addPolygon = function(polygon){
        this.polygons.push(polygon);

        if ( polygon.getOuterBoundary().getTopRight3857().x > this.topRight_3857.x)     this.topRight_3857.x   = polygon.getOuterBoundary().getTopRight3857().x;
        if ( polygon.getOuterBoundary().getTopRight3857().y > this.topRight_3857.y)     this.topRight_3857.y   = polygon.getOuterBoundary().getTopRight3857().y;
        if ( polygon.getOuterBoundary().getBottomLeft3857().x < this.bottomLeft_3857.x) this.bottomLeft_3857.x = polygon.getOuterBoundary().getBottomLeft3857().x;
        if ( polygon.getOuterBoundary().getBottomLeft3857().y < this.bottomLeft_3857.y) this.bottomLeft_3857.y = polygon.getOuterBoundary().getBottomLeft3857().y;
    }

    /**
     * [getBoundingBox3857 description]
     * @return {[type]} [description]
     */
    this.getBoundingBox3857 = function() {

        return r360.bounds(this.bottomLeft_3857, this.topRight_3857);
    }

    /**
     * [getBoundingBox4326 description]
     * @return {[type]} [description]
     */
    this.getBoundingBox4326 = function() {

        return r360.latLngBounds(r360.Util.webMercatorToLatLng(this.bottomLeft_3857), r360.Util.webMercatorToLatLng(this.topRight_3857));
    }

    /**
     * [setOpacity description]
     * @param {[type]} opacity [description]
     */
    this.setOpacity = function(opacity){
        this.opacity = opacity;
    }

    /**
     * [getOpacity description]
     * @return {[type]} [description]
     */
    this.getOpacity = function(){
        return this.opacity;
    }

    /**
     * [getArea description]
     * @return {[type]} [description]
     */
    this.getArea = function(){

        var area = 0;
        this.polygons.forEach(function(polygon){ area += polygon.getArea(); });
        return area;
    }

    /**
     * [getPolygons description]
     * @return {[type]} [description]
     */
    this.getPolygons = function(){
        return this.polygons;
    }

    /**
     * [setColor description]
     * @param {[type]} color [description]
     */
    this.setColor = function(color){
        this.color = color;
    }

    /**
     * [getColor description]
     * @return {[type]} [description]
     */
    this.getColor = function(){
        return this.color;
    }

    /**
     * [getTravelTime description]
     * @return {[type]} [description]
     */
    this.getTravelTime = function(){
        return this.travelTime;
    }

    /**
     * [setTravelTime description]
     * @param {[type]} travelTime [description]
     */
    this.setTravelTime = function(travelTime){
        this.travelTime = travelTime;
    }
};

r360.multiPolygon = function () { 
    return new r360.MultiPolygon();
};

r360.lineString = function (coordinateArray) { 
    return new r360.LineString(coordinateArray);
};

r360.LineString = function(coordinateArray) {

    // default min/max values
    this.topRight_3857          = new r360.Point(-20026377, -20048967);
    this.bottomLeft_3857        = new r360.Point(+20026377, +20048967);

    // coordinates in leaflets own system
    this.coordinates = [];

    for ( var i = coordinateArray.length -1 ; i >= 0 ; i--) {
    	if ( coordinateArray[i].x > this.topRight_3857.x)   this.topRight_3857.x   = coordinateArray[i].x;
        if ( coordinateArray[i].y > this.topRight_3857.y)   this.topRight_3857.y   = coordinateArray[i].y;
        if ( coordinateArray[i].x < this.bottomLeft_3857.x) this.bottomLeft_3857.x = coordinateArray[i].x;
        if ( coordinateArray[i].y < this.bottomLeft_3857.y) this.bottomLeft_3857.y = coordinateArray[i].y;
    }

    // TODO refactore, this can be done in a single iteration of the array
    for ( var i = 0; i < coordinateArray.length; i++ ) {
    	this.coordinates.push(r360.Util.webMercatorToLeaflet(coordinateArray[i]));
    }

    /**
     * [getTopRight4326 description]
     * @return {[type]} [description]
     */
    this.getTopRight4326 = function(){
        return r360.Util.webMercatorToLatLng(new r360.Point(this.topRight_3857.x, this.topRight_3857.y));
    }

    /**
     * [getTopRight3857 description]
     * @return {[type]} [description]
     */
    this.getTopRight3857 = function(){
        return this.topRight_3857;   
    }

    /**
     * [getTopRightDecimal description]
     * @return {[type]} [description]
     */
    this.getTopRightDecimal = function(){
        return r360.Util.webMercatorToLeaflet(this.topRight_3857);   
    }

    /**
     * [getBottomLeft4326 description]
     * @return {[type]} [description]
     */
    this.getBottomLeft4326 = function(){
        return r360.Util.webMercatorToLatLng(new r360.Point(this.bottomLeft_3857.x, this.bottomLeft_3857.y));
    }

    /**
     * [getBottomLeft3857 description]
     * @return {[type]} [description]
     */
    this.getBottomLeft3857 = function(){
        return this.bottomLeft_3857;
    }

    /**
     * [getBottomLeftDecimal description]
     * @return {[type]} [description]
     */
    this.getBottomLeftDecimal = function(){
        return r360.Util.webMercatorToLeaflet(this.bottomLeft_3857);   
    }

    /**
     * [getCoordinates description]
     * @return {[type]} [description]
     */
    this.getCoordinates = function(){
    	return this.coordinates;
    }

    /**
     * [getCoordinate description]
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    this.getCoordinate = function(index){
    	return this.coordinate[index];
    }
}

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
    segment.points.forEach(function(point){
        that.points.push(r360.Util.webMercatorToLatLng(new r360.Point(point[1], point[0]), point[2]));
    });

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        var colorObject     = r360.findWhere(r360.config.routeTypes, {routeType : segment.routeType});
        that.color          = typeof colorObject != 'undefined' && r360.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && r360.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
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

        var colorObject     = r360.findWhere(r360.config.routeTypes, {routeType : segment.type});
        that.color          = typeof colorObject != 'undefined' && r360.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && r360.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
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
    segments.reverse().forEach(function(segment){                

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

        that.getSegments().forEach(function(segment){ 
            
            key += " " + segment.getRouteShortName() + " " + segment.getDepartureTime() + " " + segment.getArrivalTime();

            segment.getPoints().forEach(function(point){ points += " " + point.lat + "" + point.lng; });
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
    };
};

r360.route = function (travelTime, segments) { 
    return new r360.Route(travelTime, segments);
};

/*
 *
 */
r360.LeafletPolygonLayer = L.Class.extend({

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

        // set default parameters
        this.opacity           = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth       = r360.config.defaultPolygonLayerOptions.strokeWidth;
        this.tolerance         = r360.config.defaultPolygonLayerOptions.tolerance;
        this.extendWidthX      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.extendWidthY      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.backgroundColor   = r360.config.defaultPolygonLayerOptions.backgroundColor;
        this.backgroundOpacity = r360.config.defaultPolygonLayerOptions.backgroundOpacity;
        this.colors            = r360.config.defaultPolygonLayerOptions.travelTimes;

        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.colors         != 'undefined') this.colors       = options.colors;
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
     * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox3857 : function(){

        return this.multiPolygons[0].getBoundingBox3857();
    },

    /**
     * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox4326 : function(){

        return this.multiPolygons[0].getBoundingBox4326();
    },

    /*
     *
     */
    onAdd: function (map) {

        this.map = map;

        this.id = r360.Util.generateId();

        // create a DOM element with a unique ID to have multiple maps on one page
        this.element = L.DomUtil.create('div', 'r360-leaflet-polygon-layer-' + $(map._container).attr("id") + '-' + this.id + ' leaflet-zoom-hide');
        $(this.element).attr("id", "canvas" + $(this.map._container).attr("id") + '-' + this.id);

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
    fitMap: function(options){

        // we have to transform the r360.latLngBounds to a L.latLngBounds since the map object
        // only knows the leaflet version
        var bounds = this.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        this.map.fitBounds(
            L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})), options);
    },

    /**
     * [clearAndAddLayers clears the polygons from this layer and adds the new ones. If fitMap is not undefined wesvg
     *     also adjust the map bounds/zoom to show the polygons as big as possible.]
     * @param  {[type]} multiPolygons [description]
     * @return {[type]}                  [description]
     */
    clearAndAddLayers : function(multiPolygons, fitMap, options){

        this.clearLayers();
        this.addLayer(multiPolygons);

        if ( typeof fitMap !== 'undefined' && fitMap === true ) this.fitMap(options);

        return this;
    },

    /**
     * [addLayer description]
     * @param {[type]} multiPolygons [description]
     */
    addLayer : function(multiPolygons) {

        this.multiPolygons = multiPolygons;

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

        this.multiPolygons = undefined;
        $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();
    },

    setStrokeWidth: function(strokeWidth){

        this.strokeWidth = strokeWidth;
    },

    setColors: function(colors) {
        if ( typeof this.multiPolygons == 'undefined' ) return;
        this.colors = colors;
        for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
            var multipolygon = this.multiPolygons[i];
            this.colors.forEach(function(colorSet) {
                if (colorSet.time == multipolygon.getTravelTime()) multipolygon.setColor(colorSet.color);
            })
        }
        this.draw();
    },

    /*
     *
     */
    draw: function () {

        if ( typeof this.multiPolygons !== 'undefined' ) {

            this.extendWidthX = this.map.getSize().x * 1.8 - this.map.getSize().x ;
            this.extendWidthY = this.map.getSize().y * 1.8 - this.map.getSize().y ;

            this.svgWidth  = this.map.getSize().x + this.extendWidthX;
            this.svgHeight = this.map.getSize().y + this.extendWidthY;

            // calculate the offset in between map and svg in order to translate
            var svgPosition    = $('#svg_'+ $(this.map._container).attr("id") + '-' + this.id).offset();
            var mapPosition    = $(this.map._container).offset();

            if ( typeof this.offset == 'undefined' )
                this.offset = { x : 0 , y : 0 };

            // adjust the offset after map panning / zooming
            if ( svgPosition ) {
                this.offset.x += (mapPosition.left - svgPosition.left) - this.extendWidthX / 2;
                this.offset.y += (mapPosition.top - svgPosition.top)   - this.extendWidthY / 2;
            }

            // clear layer from previous drawings
            $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();

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
                        strokeWidth       : this.strokeWidth
                    }));
            }

            var options = {
                id                : $(this.map._container).attr("id") + '-' + this.id,
                offset            : this.offset,
                svgHeight         : this.svgHeight,
                svgWidth          : this.svgWidth,
                backgroundColor   : this.backgroundColor,
                backgroundOpacity : this.backgroundOpacity,
                opacity           : this.opacity,
                strokeWidth       : this.strokeWidth
            };

            // add the svg string to the container
            $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options)
                                                                                 : r360.SvgUtil.getInverseSvgElement(gElements, options));
        }
    }
});

r360.leafletPolygonLayer = function (options) {
    return new r360.LeafletPolygonLayer(options);
};


CanvasLayer = L.Class.extend({

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
        'use strict';
        this.items = new Array();
        var that = this;

        that.mapZoomPowerLookup = new Array();

        for(var i = 0; i < 25; i++){
            that.mapZoomPowerLookup[i] = Math.pow(2, i) * 256;
        }
    },


    getItemBelowCursor : function(items, event){
        var that = this;
        for(i = 0; i < items.length; i++){
            if(that.containedByCanvas(items[i].currentPixel)){

                // console.log("containedByCanvas")
                if(that.containedByIcon(items[i], event)){

                    return items[i];
                }
            }
        }
        return null;
    },

    containedByCanvas : function(pixel){

        if ( pixel.x >= 0 && pixel.x <= this.canvasWidth )
            if ( pixel.y >= 0 && pixel.y <= this.canvasHeight )
                return true;

        return false;
    },

    containedByIcon : function(item, event){

        var newPageX = event.pageX - this.mapPosition.left;
        var newPageY = event.pageY - this.mapPosition.top;

        var diffX = newPageX - item.currentPixel.x;
        var diffY = newPageY - item.currentPixel.y;

        var ringSizes = this.getRingSizesByZoom(item.icon, this.map._zoom);

        if ( diffX > -ringSizes.outerRing )
            if( diffY > -ringSizes.outerRing )
                if ( diffX < ringSizes.outerRing + 12 )
                    if( diffY < ringSizes.outerRing + 12)
                        return true;

        return false;
    },

    /**
     * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox3857 : function(){

    },

    /**
     * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    getBoundingBox4326 : function(){

    },

    /*
     *
     */
    onAdd: function (map) {

        var that = this;
        that.map = map;
        that.id  = $(that.map._container).attr("id") + "_" + r360.Util.generateId();
        that.elementId = 'r360-leaflet-canvas-poi-layer-' + that.id + ' leaflet-zoom-hide';
        that.poiCanvasId = "poi-canvas" + that.id;
        that.poiMarkerClickId = "poi_marker_click_" + that.id;
        that.poiMarkerHoverId = "poi_marker_hover_" + that.id;
        that.markerMainCanvasId = "canvas_"+ that.id;

        // create a DOM element with a unique ID to have multiple maps on one page
        that.element = L.DomUtil.create('div', that.elementId);
        $(that.element).attr("id",  that.poiCanvasId);

        // we append the layer to the overlay pane at the last position
        that.map.getPanes().overlayPane.appendChild(that.element);

        // add a view redraw event listener for updating layer's position
        // zoom in/out, panning
        that.map.on('moveend', that.redraw, that);

        $( "#" + $(that.map._container).attr("id") ).on( "mousemove", function( event ) {
            that.clearMarkerHover();
            $('#' + that.poiCanvasId).attr("style", "cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;");
            var item = that.getItemBelowCursor(that.items, event);
            if(item != null){
                item.onHover();
                $('#'+ that.poiCanvasId).css('cursor', 'pointer');
                that.drawMarkerHover(item);
            }
        });

        $( "#" + $(that.map._container).attr("id") ).on( "click", function( event ) {

            // console.log("click");
            that.clearMarkerHover();
            var item = that.getItemBelowCursor(that.items, event);
            if(item != null){
                item.onClick();
                that.drawMarkerClick(item);
            }
        });

        that.resetCanvas();
    },

    /**
     *Not sure we need this
     */
    fitMap: function(options){

        // we have to transform the r360.latLngBounds to a L.latLngBounds since the map object
        // only knows the leaflet version
        var bounds = this.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        this.map.fitBounds(
            L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})), options);
    },

    /**
     * here should be a method that clears the canvas
     maybe we dont evcen need this
     */
    clearAndAddLayers : function(multiPolygons, fitMap, options){

        this.clearLayers();
        return this;
    },

    /**
     * [addLayer description]
     * @param {[type]} multiPolygons [description]
     */


    addItem : function(item){
        this.items.push(item);

        item.coordinate  = r360.Util.webMercatorToLeaflet(item.point);

        this.draw(item);
    },

    addLatLngItem: function(item) {

        var p = r360.Util.latLngToWebMercator(item.point);
        p.x /= 6378137;
        p.y /= 6378137;

        this.items.push(item);
        item.coordinate = r360.Util.webMercatorToLeaflet(p);

        this.draw(item);

        return item;
    },


    addLayer : function(poiSet) {

        this.poiSet = poiSet;
        var that = this;

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
        this.multiPolygons = undefined;
        $('#poi-canvas'+ $(this.map._container).attr("id")).empty();
    },


    getRingSizesByZoom: function(icon, zoomLevel){

        var ringSizes = {};

        // console.log(icon);

        icon.sizes.forEach(function(size) {
            if ( zoomLevel <= size.toZoom && zoomLevel >= size.fromZoom ) {
                ringSizes.outerRing = size.outerRing;
                ringSizes.innerRing = size.innerRing;
            }
        });

        return ringSizes;
    },

    drawRingIcon: function(ctx, icon, pixel){

        var ringSizes = this.getRingSizesByZoom(icon, this.map._zoom);

        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, ringSizes.outerRing, 0, 2 * Math.PI, false);
        ctx.fillStyle = icon.strokeStyle;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pixel.x, pixel.y, ringSizes.innerRing, 0, 2 * Math.PI, false);
        ctx.fillStyle = icon.fillStyle;
        ctx.fill();
    },


    drawMarkerHover: function(item){
        var c = document.getElementById('#' + this.poiMarkerHoverId);
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawRingIcon(ctx, item.hoverIcon, item.currentPixel);
    },

    drawMarkerClick: function(item){
        var c = document.getElementById("#" + this.poiMarkerClickId);
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawRingIcon(ctx, item.clickIcon, item.currentPixel);
    },

    clearMarkerHover: function(){
        var c = document.getElementById('#' + this.poiMarkerHoverId);
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },

    clearMarkerClick: function(){
        var c = document.getElementById("#" + this.poiMarkerClickId);
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    },


    getCanvas: function(width, height, zIndex, id) {
      var canvas = '<canvas id="#' + id + '" width="' + width + '" height="' + height + '" style="position:absolute; top:0px; left:0px; z-index: ' + zIndex + ';"></canvas>';
      return canvas;
    },

    draw: function(item){

        var point       = r360.PolygonUtil.scale(item.coordinate, this.mapZoomPowerLookup[this.map._zoom]);
        var pixel       = {x: parseInt(point.x - this.origin.x - this.offset.x), y : parseInt(point.y - this.origin.y - this.offset.y)};

        item.currentPixel = pixel;

        if(this.containedByCanvas(pixel)){
             if(this.arr[pixel.x + ";" + pixel.y] != true){
                this.drawRingIcon(this.mainMarcerCanvasCtx, item.icon, pixel);
                this.arr[pixel.x + ";" + pixel.y] = true;
            }
        }
    },


    updateOffset: function(){

        // calculate the offset in between map and svg in order to translate
        var canvasPosition    = $('#canvas_div_' + this.id + '').offset();
        this.mapPosition      = $(this.map._container).offset();

        if ( typeof this.offset == 'undefined' )
            this.offset = { x : 0 , y : 0 };

        // adjust the offset after map panning / zooming
        if ( canvasPosition ) {
            this.offset.x += (this.mapPosition.left - canvasPosition.left);
            this.offset.y += (this.mapPosition.top - canvasPosition.top);
        }
    },


    resetCanvas: function(){

        var that = this;

        this.canvasWidth  = this.map.getSize().x;
        this.canvasHeight = this.map.getSize().y;

        this.updateOffset();

        // clear layer from previous drawings
        $('#' + this.poiCanvasId).empty();

        var translation = r360.Util.getTranslation(this.offset);

        var markerClickCanvas = this.getCanvas(this.canvasWidth, this.canvasHeight, 20, this.poiMarkerClickId);
        var markerHoverCanvas = this.getCanvas(this.canvasWidth, this.canvasHeight, 10, this.poiMarkerHoverId);
        var markerMainCanvas  = this.getCanvas(this.canvasWidth, this.canvasHeight, 0, this.markerMainCanvasId)

        var canvas_div_id = "canvas_div_" + that.id;

        // add the canvas string to the container
        $('#'+ this.poiCanvasId).append(
          '<div id='+ canvas_div_id + ' style="' + translation + '">'
            + markerClickCanvas + markerHoverCanvas + markerMainCanvas +
          '</div>');
        this.updateOffset();

        c = document.getElementById("#"+ this.markerMainCanvasId);
        this.mainMarcerCanvasCtx = c.getContext("2d");

        this.arr = new Array();

        this.origin = this.map.getPixelOrigin();
    },


    /*
     *
     */
    redraw: function(){

        that = this;
        that.resetCanvas();
        that.items.forEach(function(item){
            that.draw(item);
        })
    }
});


/*
 *
 */
r360.LeafletUtil = {

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

        var color = r360.has(options, 'color') ? '-' + options.color : '-blue';

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

    fadeIn : function(layer, route, drawingTime, fadingType, options, onClick){

        if ( typeof drawingTime == 'undefined' ) drawingTime = 0;
        if ( typeof fadingType  == 'undefined')  fadingType  = 'travelTime';

        fadePathSegment(0);        

        function fadePathSegment(z){

            // calculate fading time for segment
            segment = route.routeSegments[z];
            percent = fadingType == "travelTime" ? segment.getTravelTime() / route.getTravelTime() : segment.getDistance() / route.getDistance();

            timeToDraw = percent * drawingTime;

            // transfer don't have a linestring, just a point
            if ( segment.getType() != "TRANSFER" ) {
                fader(segment, timeToDraw, options, z); 
            }
            else {
                
                if ( typeof options === 'undefined' || options.paintTransfer || (typeof options !== 'undefined' && !r360.has(options, 'paintTransfer') )) 
                    addTransferSegment(segment, options); 

                if(++z < route.routeSegments.length)
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
                    color:          !r360.isUndefined(options) && r360.has(options, 'transferColor')      ? options.transferColor       : segment.getColor(), 
                    fillColor:      !r360.isUndefined(options) && r360.has(options, 'transferHaloColor')  ? options.transferHaloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D', 
                    fillOpacity:    !r360.isUndefined(options) && r360.has(options, 'transferFillOpacity')? options.transferFillOpacity : 1, 
                    opacity:        !r360.isUndefined(options) && r360.has(options, 'transferOpacity')    ? options.transferOpacity     : 1, 
                    stroke:         !r360.isUndefined(options) && r360.has(options, 'transferStroke')     ? options.transferStroke      : true, 
                    weight:         !r360.isUndefined(options) && r360.has(options, 'transferWeight')     ? options.transferWeight      : 4, 
                    radius:         !r360.isUndefined(options) && r360.has(options, 'transferRadius')     ? options.transferRadius      : 8 
                });         
    
            var popup = !r360.isUndefined(options) && r360.has(options, 'popup') ? options.popup : "INSERT_TEXT";

            if ( typeof segment !== 'undefined') {

                var variable = !r360.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.startname) ? segment.startname : '';
                variable = variable == '' && !r360.contains(['walk', 'transit', 'source', 'target', 'bike', 'car'], segment.endname) ? segment.endname : variable;

                popup = popup.replace('INSERT_TEXT', variable);
            }

            if ( !r360.isUndefined(options) && r360.has(options, 'popup') ) {

                marker.bindPopup(popup)
                marker.on('mouseover', function(){ marker.openPopup(); })
            }

            marker.addTo(layer);
            marker.bringToFront();
        }
        

        function fader(segment, millis, options, z){

            var polylineOptions         = {};
            polylineOptions.color       = !r360.isUndefined(options) && r360.has(options, 'color')    ? options.color   : segment.getColor();
            polylineOptions.opacity     = !r360.isUndefined(options) && r360.has(options, 'opacity' ) ? options.opacity : 0.8;
            polylineOptions.weight      = !r360.isUndefined(options) && r360.has(options, 'weight' )  ? options.weight  : 5;

            if ( segment.getType() != "TRANSIT" && (segment.getType() == "WALK") )  {
                
                polylineOptions.color     = !r360.isUndefined(options) && r360.has(options, 'walkColor' )     ? options.walkColor     : '#006F35';
                polylineOptions.weight    = !r360.isUndefined(options) && r360.has(options, 'walkWeight' )    ? options.walkWeight : 7;
                polylineOptions.dashArray = !r360.isUndefined(options) && r360.has(options, 'walkDashArray' ) ? options.walkDashArray : "1, 10";
            }

            var polylineHaloOptions     = {};
            polylineHaloOptions.weight  = !r360.isUndefined(options) && r360.has(options, 'haloWeight' )  ? options.haloWeight  : 10;
            polylineHaloOptions.opacity = !r360.isUndefined(options) && r360.has(options, 'haloOpacity' ) ? options.haloOpacity : 0.7;
            polylineHaloOptions.color   = !r360.isUndefined(options) && r360.has(options, 'haloColor')    ? options.haloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D';

            // 15ms for one peace. So if we want do draw the segment in 1 sec we need 66 pieces
            var pieces      = millis / 15;
            var choppedLine = chopLineString(segment.getPoints(), pieces);
            var haloLine    = L.polyline(choppedLine[0], polylineHaloOptions).addTo(layer);
            var polyLine    = L.polyline(choppedLine[0], polylineOptions).addTo(layer);

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
                if(++z < route.routeSegments.length)
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

            var tempmap;

            /*
                ugly hack. shall be redone when working with projected coordinates
            */
            if(typeof layer.project != "undefined"){
                tempmap = layer;
            }else{
                tempmap = layer._map;
            }
            var p1 = tempmap.project(latlng1);
            var p2 = tempmap.project(latlng2);

            var xNew = (p2.x - p1.x) * percent + p1.x;
            var yNew = (p2.y - p1.y) * percent + p1.y;
            var newPoint = new r360.point(xNew, yNew);

            var latlng = tempmap.unproject(L.point(newPoint.x, newPoint.y));

            return latlng;          
        };
    }
};

if ( window.google ) {

    GoogleMapsPolygonLayer.prototype = new google.maps.OverlayView();

    function GoogleMapsPolygonLayer(map, options) {

        // set default parameters
        this.map               = map;
        this.id                = this.map.getDiv().id;
        this.inverse           = false;
        this.topRight          = { lat : -90, lng : -180 };
        this.bottomLeft        = { lat : +90, lng : +180 };
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
        // add the listeners for drag end zoom events
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

        var bottomLeft = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getBounds().getSouthWest(), this.map.getZoom());
        var topRight   = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getBounds().getNorthEast(), this.map.getZoom());

        return { max : { x : topRight.x, y : bottomLeft.y }, min : { x : bottomLeft.x, y : topRight.y } };
    };

    GoogleMapsPolygonLayer.prototype.getPixelOrigin = function(){

        var viewHalf = r360.PolygonUtil.divide({ x : this.map.getDiv().offsetWidth, y : this.map.getDiv().offsetHeight }, 2);
        var center = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getCenter(), this.map.getZoom());

        return r360.PolygonUtil.roundPoint(r360.PolygonUtil.subtract(center, viewHalf.x, viewHalf.y));
    };

    /**
     * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.getBoundingBox3857 = function(){

        return this.multiPolygons[0].getBoundingBox3857();
    },

    /**
     * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.getBoundingBox4326 = function(){

        return this.multiPolygons[0].getBoundingBox4326();
    },


    GoogleMapsPolygonLayer.prototype.setInverse = function(inverse){

        if ( this.inverse != inverse ) {

            this.inverse = inverse;
            this.draw();
        }
    };

    GoogleMapsPolygonLayer.prototype.createSvgData = function(polygon){

        var svg = r360.SvgUtil.createSvgData(polygon, {
            bounds      : r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY),
            scale       : Math.pow(2, this.map.getZoom()) * 256,
            tolerance   : this.tolerance,
            pixelOrigin : this.getPixelOrigin(),
            offset      : {x:0,y:0}
        });

        return svg;
    };

    GoogleMapsPolygonLayer.prototype.setColors = function(colors) {
        if ( typeof this.multiPolygons == 'undefined' ) return;
        colors = colors;
        for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
            var multipolygon = this.multiPolygons[i];
            colors.forEach(function(colorSet) {
                if (colorSet.time == multipolygon.getTravelTime()) multipolygon.setColor(colorSet.color);
            })
        }
        this.draw();
    };

    /**
     * [fitMap adjust the map to fit the complete polygon with maximum zoom level]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.fitMap = function(){

        // we have to transform the r360.latLngBounds to google maps bounds since the map object
        // only knows the leaflet version
        var bounds = this.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        var gmBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(sw.lat, sw.lng),
            new google.maps.LatLng(ne.lat, ne.lng));

        this.map.fitBounds(gmBounds);
    };

    GoogleMapsPolygonLayer.prototype.draw = function(test) {

        if ( typeof this.multiPolygons !== 'undefined' && this.element != null ) {

            this.svgWidth  = this.map.getDiv().offsetWidth;
            this.svgHeight = this.map.getDiv().offsetHeight;

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

    GoogleMapsPolygonLayer.prototype.update = function(multiPolygons){

        this.multiPolygons = multiPolygons;
        this.draw();
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

        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(map, "resize");
            that.draw();
        });
    };

    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    GoogleMapsPolygonLayer.prototype.onRemove = function() {
        if (typeof this.element == 'undefined' || this.elemenet == null) return;
        $('#' + this.element.id).empty();
    };

    r360.googleMapsPolygonLayer = function(map) {
        if (typeof this.element == 'undefined' || this.elemenet == null) return;
        return new GoogleMapsPolygonLayer(map);
    }
}

r360.GoogleMapsUtil = {

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

}(window, document));

