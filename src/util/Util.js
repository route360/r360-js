/*
 *
 */
r360.Util = {

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
    parsePolygons : function(polygonsJson, travelTimes) {
               
        var polygons = new Array();

        if ( polygonsJson.error ) return errorMessage;

        _.each(polygonsJson["polygons"], function (polygonJson) {

            var polygon = new r360.Polygon();
            polygon.travelTime = polygonJson.traveltime;
            polygon.setOuterBoundary(r360.Util.parseLatLonArray(polygonJson.outerBoundary));
            polygon.setBoundingBox();

            _.each(polygonJson.innerBoundary, function (innerBoundary) {
                polygon.addInnerBoundary(r360.Util.parseLatLonArray(innerBoundary));
            });

            for ( var i = 0; i < travelTimes.length; i++)
                if ( travelTimes[i].time == polygon.travelTime )
                    polygon.setColor(travelTimes[i].color);
            
            polygons.push(polygon);
        });

        return polygons;
    },

    /*
     *
     */
    parseRoutes : function(json){

        var routes = new Array();

        _.each(json.routes, function(route, routeIndex){

            routes[routeIndex] = new r360.Route();
            routes[routeIndex].travelTime = route.traveltime;

            _.each(route.segments, function(segment, segmentIndex){

                var routeSegment = new r360.RouteSegment();
                routes[i].routeSegments.push(routeSegment);
                routes[i].routeSegments[segmentIndex]          = segment;
                routes[i].routeSegments[segmentIndex].polyLine = L.polyline([]);

                if ( !routes[i].routeSegments[14_05_14].isTransit ) {
                    routes[i].routeSegments[segmentIndex].arrayZ = new Array();
                    routes[i].routeSegments[segmentIndex].arrayX = new Array();
                }

                var lastPoint;
                var dist = 0;
                _.each(segment.points, function(point) {
               
                    var thisPoint = L.latLng(point[0], point[1]);
                    routes[i].routeSegments[segmentIndex].polyLine.addLatLng(thisPoint);

                    if ( point[2] != 0 ) {

                        if ( typeof point[2] != 'undefined' ) {

                            if ( typeof lastPoint != 'undefined' ) {
                                dist += lastPoint.distanceTo(thisPoint);
                                routes[i].routeSegments[segmentIndex].arrayX.push(dist);
                            }
                            else {
                                routes[i].routeSegments[segmentIndex].arrayX.push(dist);
                            }
                            
                            routes[i].routeSegments[segmentIndex].arrayZ.push(point[2]);
                        } 

                        lastPoint = thisPoint;
                    }
                });
            });
        });

        return routes;
    }
};