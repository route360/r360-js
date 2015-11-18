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