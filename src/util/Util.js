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

            if ( segment.getType() == "TRANSFER" ) return;

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
            
            if ( options.addPopup ) {

                var newPopup = _.has(options, 'popup') ? options.popup : popup;

                line.bindPopup(newPopup);
                halo.bindPopup(newPopup);
            }

            polylines.push([halo, line]);
        });

        return polylines;
    },

    /*
     *
     */
    parsePolygons : function(polygonsJson) {
               
        if ( polygonsJson.error ) return errorMessage;

        var polygonList = Array();

        _.each(polygonsJson, function(source){

            var sourcePolygons = { id : source.id , polygons : [] };

            _.each(source.polygons, function (polygonJson) {

                var polygon = r360.polygon();
                polygon.setTravelTime(polygonJson.travelTime);
                polygon.setColor(_.findWhere(r360.config.defaultTravelTimeControlOptions.travelTimes, { time : polygon.getTravelTime() }).color);
                polygon.setOuterBoundary(r360.Util.parseLatLonArray(polygonJson.outerBoundary));
                polygon.setBoundingBox();

                _.each(polygonJson.innerBoundary, function (innerBoundary) {
                    polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
                });
            
                sourcePolygons.polygons.push(polygon);
            });

            polygonList.push(sourcePolygons);
        });

        return polygonList;
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