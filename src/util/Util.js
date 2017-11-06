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
     * This method returns the current time in seconds, rounded down to the nearest minute,
     * at the time this method is executed. This means that the current hours and minutes of the
     * current time are converted to seconds and added up, e.g.: 12:11 pm: 
     *
     *      -> (12 * 3600) + (11 * 60) = 43860
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
     * @param the length of the returned pseudo random string
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
     * @param  {type} place [description]
     * @return {type}       [description]
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

    /*
     * This method parses the JSON returned from the Route360 Webservice and generates
     * java script objects representing the values.
     */
    parseRoutes : function(json){

        var routes = new Array();

        for(var i = 0; i < json.routes.length; i++){
            var meta = json.routes[i];
            routes.push(r360.route(json.routes[i].travelTime, json.routes[i].segments, meta));
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
     * @param  {type} offset [description]
     * @return {type}        [description]
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
    },

    // return the length of 1 degree in meters, for both latitude and longitude, based on a given latitude
    //http://pordlabs.ucsd.edu/matlab/coord.htm
    degreeInMeters: function(lat) {
      var rlat = lat * (Math.PI / 180)

      var latlen =  111132.92 - 559.82 * Math.cos(2 * rlat) + 1.175 * Math.cos(4 * rlat);

      var lnglen = 111415.13 * Math.cos(rlat) - 94.55 * Math.cos(3 * rlat);

      return {
        lat: latlen,
        lng: lnglen
      }

    },

    // return the degrees of a set distance in meters, for both latitude and longitude
    metersInDegrees: function(m, lat) {
      var degreeLengths = this.degreeInMeters(lat);

      return {
        lat: m / degreeLengths.lat,
        lng: m / degreeLengths.lng
      }
    }
};

r360.extend = r360.Util.extend;