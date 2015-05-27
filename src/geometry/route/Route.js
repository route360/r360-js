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
                    addTransferSegment(segment); 

                if(++z < that.routeSegments.length)
                    fadePathSegment(z);
            }          
        }

        function addTransferSegment(segment){

            addCircularMarker(segment.points[0]);     

            // if inter station transfer -> involves two stops -> we need a second circle
            if( segment.points.length > 1 && segment.points[0].lat !=  segment.points[1].lat && segment.points[0].lng !=  segment.points[1].lng )
                 addCircularMarker(segment.points[1]);
        }

        function addCircularMarker(latLng) {
            var marker = L.circleMarker(latLng, { 
                    color:          !_.isUndefined(options) && _.has(options, 'transferColor')      ? options.transferColor       : segment.getColor(), 
                    fillColor:      !_.isUndefined(options) && _.has(options, 'transferHaloColor')  ? options.transferHaloColor   : typeof segment.getHaloColor() !== 'undefined' ? segment.getHaloColor() : '#9D9D9D', 
                    fillOpacity:    !_.isUndefined(options) && _.has(options, 'transferFillOpacity')? options.transferFillOpacity : 1, 
                    opacity:        !_.isUndefined(options) && _.has(options, 'transferOpacity')    ? options.transferOpacity     : 1, 
                    stroke:         !_.isUndefined(options) && _.has(options, 'transferStroke')     ? options.transferStroke      : true, 
                    weight:         !_.isUndefined(options) && _.has(options, 'transferWeight')     ? options.transferWeight      : 4, 
                    radius:         !_.isUndefined(options) && _.has(options, 'transferRadius')     ? options.transferRadius      : 8 
                });         

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