/*
 Route360° JavaScript API 0.1-dev (4d2ee0b), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg and Daniel Gerber, (c) 2014 Motion Intelligence GmbH
*/
(function (window, document, undefined) {
var r360 = {
	version: '0.1-dev'
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
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = r360;

// define r360 as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(r360);

// define r360 as a global r360 variable, saving the original r360 to restore later if needed
} else {
	expose();
}


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
        elevation           : { en : 'Elevation',       de : 'Höhenunterschied' },
        noRouteFound        : { en : 'No route found!', de : 'Keine Route gefunden!' },
    }
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
     * @method getCurrentDate
     * 
     * @returns {Number} The current time in seconds
     */
    getTime : function() {

        var now = new Date();
        return (now.getHours() * 3600) + (now.getMinutes() * 60) + now.getSeconds();
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
     *
     */
    parseLatLonArray : function(latlngs) {

        var coordinates = new Array();

        _.each(latlngs, function (latlng) {
            coordinates.push(L.latLng(latlng[0], latlng[1]));
        });

        return coordinates;
    },

    /*
     *
     */
    routeToLeafletPolylines : function(route, options) {

        var polylines = [];

        _.each(route.getSegments(), function(segment, index){

            var polylineOptions       = {};
            polylineOptions.color     = segment.getColor();

            var polylineHaloOptions = {};
            polylineHaloOptions.weight = 7;
            polylineHaloOptions.color     = "white";
            
            // the first and the last segment is walking so we need to dotted lines
            if ( index == 0 || index == (route.getLength() - 1) ) polylineOptions.dashArray = "1, 8";

            var halo = L.polyline(segment.getPoints(), polylineHaloOptions);
            var line = L.polyline(segment.getPoints(), polylineOptions);

            var i18n = r360.config.i18n;
            var lang = i18n.language;

            var warningHtml = "";
            if ( typeof segment.getWarning() !== "undefined") 
                warningHtml = "<tr><td colspan='3'><b>" + segment.getWarning() + "</b></td></tr>";

            var popup = L.popup({autoPan : false});

            if ( !segment.isTransit() ) {
                
                popup.setContent(
                    "<table style='width:400px; color:#07456b'> \
                        <tr> \
                            <td>" + i18n.travelTime[lang] + ": <b>" + r360.Util.secondsToHoursAndMinutes(segment.getTravelTime()) + "</b></td> \
                            <td>" + i18n.distance[lang]   + ": <b>" + segment.getLength() + "km</b></td> \
                            <td>" + i18n.elevation[lang]  + ": <b>" + segment.getElevationGain() + "m</b></td></tr> \
                            <td>" + i18n.totalTime[lang]  + ": <b>" + r360.Util.secondsToHoursAndMinutes(route.getTravelTime()) + "</b></td> \
                        </tr> \
                        " + warningHtml  + " \
                    </table> \
                    <div id='chart' style='width:250px; height:100px'></div>");   
            }
            else {

                popup.setContent(
                    "<table style='width:400px; color:#07456b'> \
                        <tr> \
                            <td>" + i18n.line[lang]     + ": <b>" + segment.routeShortName + "</b></td> \
                            <td>" + i18n.from[lang]     + ": <b>" + segment.getStartName() + "</b></td> \
                            <td>" + i18n.departure[lang]+ ": <b>" + r360.Util.secondsToTimeOfDay(segment.getDepartureTime()) + "</b></td> \
                            <td>" + i18n.to[lang]       + ": <b>" + segment.getEndName() + "</b></td> \
                        </tr> \
                        <tr> \
                            <td>" + i18n.arrival[lang]    + ": <b>" + r360.Util.secondsToTimeOfDay(segment.getArrivalTime())      + "</b></td> \
                            <td>" + i18n.travelTime[lang] + ": <b>" + r360.Util.secondsToHoursAndMinutes(segment.getTravelTime()) + "</b></td> \
                            <td>" + i18n.totalTime[lang]  + ": <b>" + r360.Util.secondsToHoursAndMinutes(route.getTravelTime())   + "</b></td> \
                        </tr> \
                        <div id='chart' style='width:250px; height:100px'></div> \
                        " + warningHtml  + " \
                    </table>");  
            }
            
            line.bindPopup(popup);
            halo.bindPopup(popup);
            polylines.push([halo, line]);
        });

        return polylines;
    },

    /*
     *
     */
    parsePolygons : function(polygonsJson) {
               
        var polygons = new Array();

        if ( polygonsJson.error ) return errorMessage;

        _.each(polygonsJson["polygons"], function (polygonJson) {

            var polygon = r360.polygon();
            polygon.setTravelTime(polygonJson.travelTime);
            polygon.setColor(_.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() }).color);
            polygon.setOuterBoundary(r360.Util.parseLatLonArray(polygonJson.outerBoundary));
            polygon.setBoundingBox();

            _.each(polygonJson.innerBoundary, function (innerBoundary) {
                polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
            });
            
            polygons.push(polygon);
        });

        return polygons;
    },

    /*
     * This method parses the JSON returned from the Route360 Webservice and generates
     * java script objects representing the values.
     */
    parseRoutes : function(json){

        var routes = new Array();

        _.each(json.routes, function(jsonRoute){

            var route = r360.route(jsonRoute.travelTime);

            _.each(jsonRoute.segments, function(segment){                

                route.addRouteSegment(r360.routeSegment(segment));
            });

            routes.push(route);
        });

        return routes;
    }
};


r360.PolygonService = {

    /*
     *
     */
    getTravelTimePolygons : function(travelOptions, callback) {

        var sources;
        var travelTimes;
        var travelMode;
        var speed = 15;
        var uphill = 20;
        var downhill = -10;

        var time = 28800;
        var date = 20140331;

        /*
        *   TODO reading the parameter from either default values or travelOptions needs to be done properly
        */
        if(typeof callback == 'undefined')
            alert('callback needs to be defined');
        if(typeof travelOptions == 'undefined')
            alert('define travel options');
        else{
            if(typeof travelOptions.sources == 'undefined')
                alert("we need a source point");
            else
                sources = travelOptions.sources;
            if(typeof travelOptions.travelTimes != 'undefined')
                travelTimes = travelOptions.travelTimes;
            else
                travelTimes = r360.config.defaultTravelTimeControlOptions.travelTimes;
            if(typeof travelOptions.travelMode != 'undefined'){
                travelMode = travelOptions.travelMode;
            }               
            else
                travelMode = r360.config.defaultTravelMode;

            if(typeof travelOptions.speed != 'undefined'){
                if(travelOptions.speed < 1){
                    alert("invalid paramters. speed needs to be higher")
                    return;
                }
                speed = travelOptions.speed;
            }

            if(typeof travelOptions.uphill != 'undefined'){
                uphill = travelOptions.uphill;
            }

            if(typeof travelOptions.downhill != 'undefined'){
                downhill = travelOptions.downhill;
            }

            if(uphill < 0 || downhill > 0 || uphill < -(downhill)){
                alert("wrong parameters for uphill and downhill")
                return;
            }

            if(typeof travelOptions.time != 'undefined'){
                time = travelOptions.time;
            }

            if(typeof travelOptions.date != 'undefined'){
                date = travelOptions.date;
            }

        }      

        /*
        TODO handling here is not nice. There need to be a better way to deal with different travelMode. Complex issue
        */  

        // var times = new Array();

        // for(var i = 0; i < travelTimes.length; i++){
        //     if(travelTimes[i].time > 7200){
        //         alert("invalid parameter: do not use times higher 7200");
        //         return;
        //     }
        //     times[i] = travelTimes[i].time;
        // }
            
   
        var cfg = {};
        cfg.polygon = { values : travelTimes };
        cfg.sources = [];
        _.each(sources, function(source){
            var src = {};
            src.id =  _.has(source, "id") ? source.id : source.getLatLng().lat + ";" + source.getLatLng().lng;
            src.lat = source.getLatLng().lat;
            src.lon = source.getLatLng().lng;
            src.tm = {};   

                   
            src.tm[travelMode.type] = {};
            if(travelMode.type == "transit"){
               src.tm.transit.frame = {};
                src.tm.transit.frame.time = time;
                src.tm.transit.frame.date = date;
            }
            if(travelMode.type == "bike"){
                src.tm.bike.speed = speed;
                src.tm.bike.uphill = uphill;
                src.tm.bike.downhill = downhill;
            }
            if(travelMode.type == "walk"){
                src.tm.walk.speed = speed;
                src.tm.walk.uphill = uphill;
                src.tm.walk.downhill = downhill;
            }

            cfg.sources.push(src);
        });
        
        $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/polygon?cfg=' + encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", function(result){
            callback(r360.Util.parsePolygons(result));
        });
    }
}


r360.RouteService = {

    /*
     *
     */
    getRoutes : function(travelOptions, callback) {

        var sources;
        var targets;
        var speed       = 15;
        var uphill      = 20;
        var downhill    = -10;
        var time        = r360.Util.getTime();
        var date        = r360.Util.getCurrentDate();

        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "targets") ) targets = travelOptions.targets;
            else alert("No targets for routing given!");

            if ( _.has(travelOptions, "travelTimes") ) travelTimes = travelOptions.travelTimes;
            else travelTimes = r360.config.defaultTravelTimeControlOptions.travelTimes;
            
            if ( _.has(travelOptions, "travelMode") ) travelMode = travelOptions.travelMode;
            else travelMode = r360.config.defaultTravelMode;
 
            if ( _.has(travelOptions, "speed") ) { 
                
                if ( travelOptions.speed < 1) alert("Speed needs to larger then 0.");
                else speed = travelOptions.speed;
            }

            if ( _.has(travelOptions, "uphill") )   uphill   = travelOptions.uphill;
            if ( _.has(travelOptions, "downhill") ) downhill = travelOptions.downhill;
            if ( _.has(travelOptions, "time") )     time     = travelOptions.time;
            if ( _.has(travelOptions, "date") )     date     = travelOptions.date;

            if ( uphill < 0 || downhill > 0 || uphill < -(downhill) )  
                alert("Uphill speed has to be larger then 0. Downhill speed has to be smaller then 0. \
                    Absolute value of downhill speed needs to be smaller then uphill speed.");
        }
        else alert('Travel options not defined! Cannot call Route360° service!');   

        // if there are no target points available, no routing is possible! 
        if ( sources.length != 0 && targets.length != 0 ) {

            var cfg = { sources : [], targets : [] };
            
            _.each(sources, function(source){

                // set the basic information for this source
                var src = {
                    id  : source.id,
                    lat : source.getLatLng().lat,
                    lon : source.getLatLng().lng,
                    tm  : {}
                };
                src.tm[travelMode.type] = {};

                // set special routing parameters depending on the travel mode
                if ( travelMode.type == "transit" ) {
                    
                    src.tm.transit.frame = {
                        time : time,
                        date : date
                    };
                }
                if ( travelMode.type == "bike" ) {
                    
                    src.tm.bike = {
                        speed       : speed,
                        uphill      : uphill,
                        downhill    : downhill
                    };
                }
                if ( travelMode.type == "walk") {
                    
                    src.tm.walk = {
                        speed       : speed,
                        uphill      : uphill,
                        downhill    : downhill
                    };
                }

                // add it to the list of sources
                cfg.sources.push(src);
            });

            cfg.targets = [];
            _.each(targets, function(target){

                var trg = {};
                trg.id  = target.id;
                trg.lat = target.getLatLng().lat;
                trg.lon = target.getLatLng().lng;
                cfg.targets.push(trg);
            });

            $.getJSON(r360.config.serviceUrl + r360.config.serviceVersion + '/route?cfg=' +  encodeURIComponent(JSON.stringify(cfg)) + "&cb=?", function(result){
                callback(r360.Util.parseRoutes(result)); 
            });
        }
    }
};

r360.TimeService = {

    getRouteTime : function(travelOptions, callback) {

        var cfg = { 
            sources : [], 
            targets : [], 
            pathSerializer : _.has(travelOptions, 'pathSerializer') ? travelOptions.pathSerializer : r360.pathSerializer, 
            maxRoutingTime : _.has(travelOptions, 'maxRoutingTime') ? travelOptions.pathSerializer : r360.maxRoutingTime 
        };

        // validate travel options
        if ( typeof travelOptions !== 'undefined') {

            if ( _.has(travelOptions, "sources") ) sources = travelOptions.sources;
            else alert("No sources for routing given!");

            if ( _.has(travelOptions, "targets") ) targets = travelOptions.targets;
            else alert("No targets for routing given!");
        }
        else alert('Travel options not defined! Cannot call Route360° service!'); 

        // configure sources
        _.each(sources, function(source){

            // set the basic information for this source
            var src = {
                id  : _.has(source, 'id') ? source.id : source.lat + ";" + source.lon,
                lat : source.lat,
                lon : source.lon,
                tm  : {}
            };
            
            // set special routing parameters depending on the travel mode
            if ( travelMode.type == "transit" ) {
                
                src.tm.transit.frame = {
                    time : time,
                    date : date
                };
            }
            if ( travelMode.type == "bike" ) {
                
                src.tm.bike = {
                    speed       : speed,
                    uphill      : uphill,
                    downhill    : downhill
                };
            }
            if ( travelMode.type == "walk") {
                
                src.tm.walk = {
                    speed       : speed,
                    uphill      : uphill,
                    downhill    : downhill
                };
            }
            if ( travelMode.type == "car" ) src.tm.car = {};
            
            // add to list of sources
            cfg.sources.push(src);
        });
        
        // configure targets for routing
        _.each(targets, function(target){

            cfg.targets.push({
                id  : _.has(target, 'id') ? target.id : target.lat + ";" + target.lon,
                lat : target.getLatLng().lat,
                lon : target.getLatLng().lng
            });
        });

        // execute routing time service and call callback with results
        $.ajax({
            url:         r360.config.serviceUrl + r360.config.serviceVersion + '/time',
            type:        "POST",
            data:        JSON.stringify(cfg),
            contentType: "application/json",
            dataType:    "json",
            success: function (result) {

                callback(result);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
    }
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
        this.options = r360.config.defaultTravelTimeControlOptions;
        
        // overwrite default options if possible
        if ( typeof travelTimeControlOptions !== "undefined" ) {
            
            if ( _.has(travelTimeControlOptions, "position") )    this.options.position     = travelTimeControlOptions.position;
            if ( _.has(travelTimeControlOptions, "initValue") )   this.options.initValue    = travelTimeControlOptions.initValue;
            if ( _.has(travelTimeControlOptions, "label") )       this.options.label        = travelTimeControlOptions.label;
            if ( _.has(travelTimeControlOptions, "travelTimes") ) this.options.travelTimes  = travelTimeControlOptions.travelTimes;
            if ( _.has(travelTimeControlOptions, "icon") )        this.options.icon         = travelTimeControlOptions.icon;
        }

        this.options.maxValue   = _.max(this.options.travelTimes, function(travelTime){ return travelTime.time; }).time / 60;
        this.options.step       = (this.options.travelTimes[1].time - this.options.travelTimes[0].time)/60;

        // TODO Ich glaube das wird hier nicht richtig aufgerufen, in der Doc steht 
        // setOptions( <Object> obj, <Object> options )
        L.Util.setOptions(this);
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
        this.options.labelSpan = $('<span/>', {"text" : this.options.label + " "});

        if ( this.options.icon != 'undefined' ) this.options.iconHTML = $('<img/>', {"src" : this.options.icon})

        this.options.travelTimeSpan = $('<span/>', {"text" : this.options.initValue });
        var unitSpan = $('<span/>', {"text" : "min"});

        $(this.options.sliderContainer).append(this.options.miBox);
        this.options.miBox.append(this.options.travelTimeInfo);
        this.options.miBox.append(this.options.travelTimeSlider);
        this.options.travelTimeSlider.append(travelTimeSliderHandle);
        this.options.travelTimeInfo.append(this.options.iconHTML).append(this.options.labelSpan).append(this.options.travelTimeSpan).append(unitSpan);

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

    /*
     *
     */
    getValues : function() {
        var options = this.options;
        var travelTimes = new Array()

        // console.log($(this.options.travelTimeSlider).slider("value"));
        for(var i = 0; i < $(this.options.travelTimeSlider).slider("value"); i+= options.step) 
            travelTimes.push(options.travelTimes[i/options.step].time);
            
        return travelTimes;
    }
});

r360.travelTimeControl = function (options) {
    return new r360.TravelTimeControl(options);
};



/*
 *
 */
r360.Polygon = function(traveltime, outerBoundary) {

    var that = this;
    
    // default min/max values
    that.topRight         = new L.latLng(-90,-180);
    that.bottomLeft       = new L.latLng(90, 180);
    that.centerPoint      = new L.latLng(0,0);

    that.travelTime       = traveltime;
    that.color;
    that.outerBoundary    = outerBoundary;
    that.innerBoundaries  = new Array();

    /**
     *
     */
    that.setOuterBoundary = function(outerBoundary){
        that.outerBoundary = outerBoundary;
    }

    /**
     *
     */  
    that.addInnerBoundary = function(innerBoundary){
        that.innerBoundaries.push(innerBoundary);
    }

    /**
     * @return {LatLngBounds} the leaflet bounding box
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getBoundingBox = function(){

        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    }

    /**
     *
     */
    that.setBoundingBox = function() { 

        // calculate the bounding box
        _.each(this.outerBoundary, function(coordinate){

            if ( coordinate.lat > that.topRight.lat )   that.topRight.lat   = coordinate.lat;
            if ( coordinate.lat < that.bottomLeft.lat ) that.bottomLeft.lat = coordinate.lat;
            if ( coordinate.lng > that.topRight.lng )   that.topRight.lng   = coordinate.lng;
            if ( coordinate.lng < that.bottomLeft.lng ) that.bottomLeft.lng = coordinate.lng;
        });

        // precompute the polygons center
        that.centerPoint.lat = that.topRight.lat - that.bottomLeft.lat;
        that.centerPoint.lon = that.topRight.lon - that.bottomLeft.lon;
    }

    /**
     * Returns the center for this polygon. More precisly a gps coordinate
     * which is equal to the center of the polygons bounding box.
     * @return {latlng} gps coordinate of the center of the polygon
     * @author Daniel Gerber <daniel.gerber@icloud.com>
     * @author Henning Hollburg <henning.hollburg@gmail.com>
     */
    that.getCenterPoint = function(){
        return that.centerPoint;
    },

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
}

r360.polygon = function (traveltime, outerBoundary) { 
    return new r360.Polygon(traveltime, outerBoundary);
};

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
    that.polyLine        = L.polyline([]);
    that.color           = '#07456b';
    that.points          = segment.points;
    that.routeType       = segment.routeType;
    that.travelTime      = segment.travelTime;
    that.length          = segment.length;    
    that.warning         = segment.warning;    
    that.elevationGain   = segment.elevationGain;
    that.errorMessage;   
    that.transitSegment  = false;

    // build the geometry
    _.each(segment.points, function(point){
        that.polyLine.addLatLng(point);
    });

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        that.color          = _.findWhere(r360.config.routeTypes, {routeType : segment.routeType}).color;
        that.transitSegment = true;
        that.routeShortName = segment.routeShortName;
        that.startname      = segment.startname;
        that.endname        = segment.endname;
        that.departureTime  = segment.departureTime;
        that.arrivalTime    = segment.arrivalTime;
        that.tripHeadSign   = segment.tripHeadSign;
    }

    that.getPoints = function(){
        return that.points;
    }

    that.getColor = function(){
        return that.color;
    }

    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.getLength = function(){
        return that.length;
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
r360.Route = function(travelTime){

    var that = this;
    that.travelTime = travelTime;
    that.routeSegments = new Array();

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
    that.getLength = function(){
        return that.routeSegments.length;
    }

    /*
     *
     */
    that.getSegments = function(){
        return that.routeSegments;
    }

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    }
};

r360.route = function (travelTime) { 
    return new r360.Route(travelTime);
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
        
        // set default parameters
        this.opacity     = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth = r360.config.defaultPolygonLayerOptions.strokeWidth;
        
        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if(typeof options.opacity != 'undefined')     this.opacity      = options.opacity;
            if(typeof options.strokeWidth != 'undefined') this.strokeWidth  = options.strokeWidth;
        }

        this._multiPolygons = new Array(); 
    },

    /* 
     *
     */
    getBoundingBox : function(){
        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    },
    
    /*
     *
     */
    onAdd: function (map) {

        this._map = map;
        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer-'+$(map._container).attr("id")+' leaflet-zoom-hide');
        $(this._el).css({"opacity": this.opacity});
        $(this._el).attr("id","canvas" + $(this._map._container).attr("id"));
        this._map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        this._map.on('viewreset', this._reset, this);
        this._reset();
    },
    
    /*
     *
     */
    addLayer:function(polygons){        
        
        var that = this;
        that._resetBoundingBox();
        that._multiPolygons = new Array();
        
        _.each(polygons, function(polygon){

            that._updateBoundingBox(polygon.outerBoundary);
            that._addPolygonToMultiPolygon(polygon);
        });

        that._multiPolygons.sort(function(a,b) { return (b.getTravelTime() - a.getTravelTime()) });
        that._reset();
    },

    /*
     *
     */
    _addPolygonToMultiPolygon: function(polygon){

        _.each(this._multiPolygons, function(multiPolygon){

            if ( multiPolygon.getTravelTime() == polygon.travelTime ){
                multiPolygon.addPolygon(polygon);
                return;
            }
        });

        var mp = new r360.multiPolygon();
        mp.setTravelTime(polygon.travelTime);
        mp.addPolygon(polygon);
        mp.setColor(polygon.getColor());
        this._multiPolygons.push(mp);
    },

    /*
     *
     */
    _resetBoundingBox: function(){
        this._latlng = new L.LatLng(-180, 90);
        this._topRight = new L.latLng(-90,-180);
        this._bottomLeft = new L.latLng(90, 180);
    },
    
    /*
     *
     */
    _updateBoundingBox:function(coordinates){

        var that = this;

        _.each(coordinates, function(coordinate){

            if ( coordinate.lat > that._topRight.lat )          that._topRight.lat   = coordinate.lat;                
            else if( coordinate.lat < that._bottomLeft.lat )    that._bottomLeft.lat = coordinate.lat;
            
            if ( coordinate.lng > that._topRight.lng )          that._topRight.lng   = coordinate.lng;
            else if( coordinate.lng < that._bottomLeft.lng )    that._bottomLeft.lng = coordinate.lng;
        })
        
        if ( that._latlng.lat < that._topRight.lat)     that._latlng.lat = that._topRight.lat;
        if ( that._latlng.lng > that._bottomLeft.lng)   that._latlng.lng = that._bottomLeft.lng;
    },
  
    /*
     *
     */
    onRemove: function (map) {

        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },
    
    /*
     *
     */
    _buildString:function(path, point, suffix){
        
        path += suffix + point.x + ' ' + point.y;
        return path;
    },
    
    /*
     *
     */
    _createSVGData: function(polygon){

        var that    = this;
        pathData    = '';
        var point   = this._map.latLngToLayerPoint(polygon[0]);
        pathData    = this._buildString(pathData, point, 'M')
        
        _.each(polygon, function(point){

            point    = that._map.latLngToLayerPoint(point);
            pathData = that._buildString(pathData, point, 'L')
        });

        pathData += 'z ';
        return pathData;
    },

    /*
     *
     */
    clearLayers: function(){
        
        $('#canvas'+ $(this._map._container).attr("id")).empty();
        this.initialize();
    },

    /*
     *
     */
    _reset: function () {
        var that = this;

        if(this._multiPolygons.length > 0){
            var pos = this._map.latLngToLayerPoint(this._latlng);

            //internalSVGOffset is used to have a little space between geometries and svg frame. otherwise buffers won't be displayed at the edges...
            var internalSVGOffset = 100;
            pos.x -= internalSVGOffset;
            pos.y -= internalSVGOffset;
            L.DomUtil.setPosition(this._el, pos);

            //ie 8 and 9 
            if (navigator.appVersion.indexOf("MSIE 9.") != -1 )  {
                $('#canvas'+ $(this._map._container).attr("id")).css("transform", "translate(" + pos.x + "px, " + pos.y + "px)");
            }
            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('#canvas'+ $(this._map._container).attr("id")).css({"position" : "absolute"});
            }
            $('#canvas'+ $(this._map._container).attr("id")).empty();         

            var bottomLeft = this._map.latLngToLayerPoint(this._bottomLeft);
            var topRight = this._map.latLngToLayerPoint(this._topRight);
            var paper = Raphael('canvas'+ $(this._map._container).attr("id"), (topRight.x - bottomLeft.x) + internalSVGOffset * 2, (bottomLeft.y - topRight.y) + internalSVGOffset * 2);
            var st = paper.set();
            var svgData = "";
            var mp, poly;
            var svgDataArray = new Array();
            for(var i = 0; i < this._multiPolygons.length; i++){
                mp = this._multiPolygons[i];
                
                svgData = "";

                for(var j = 0; j < mp.polygons.length; j++){
                        poly = mp.polygons[j];
                        svgData += this._createSVGData(poly.outerBoundary);
                        for(var k = 0; k < poly.innerBoundaries.length; k++){
                            svgData += this._createSVGData(poly.innerBoundaries[k]);
                        }
                        var pointTopRight = this._map.latLngToLayerPoint(poly.topRight);
                        var pointBottomLeft = this._map.latLngToLayerPoint(poly.bottomLeft);
                    }
                    // ie8 (vml) gets the holes from smaller polygons
                    if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                        if(i < this._multiPolygons.length-1){
                            for(var l = 0; l < this._multiPolygons[i+1].polygons.length; l++){
                                var poly2 = this._multiPolygons[i+1].polygons[l];
                                svgData += this._createSVGData(poly2.outerBoundary);
                            }
                        
                    }
                }


                var color = mp.getColor();
                var path = paper.path(svgData).attr({fill: color, stroke: color, "stroke-width": that.strokeWidth, "stroke-linejoin":"round","stroke-linecap":"round","fill-rule":"evenodd"})
                            .attr({"opacity":"0"}).animate({ "opacity" : "1" }, poly.travelTime/3)
                            path.translate((bottomLeft.x - internalSVGOffset) *-1,((topRight.y - internalSVGOffset)*-1));
                st.push(path);
            }

            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('shape').each(function() {
                    $( this ).css( {"filter": "alpha(opacity=" + that.opacity * 100 + ")"} );
                });
            }
        }
    }
});

r360.route360PolygonLayer = function () {
    return new r360.Route360PolygonLayer();
};

}(window, document));