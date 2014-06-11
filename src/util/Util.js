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

            var polygon = r360.polygon();
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
     * This method parses the JSON returned from the Route360 Webservice and generates
     * java script objects representing the values.
     */
    parseRoutes : function(json){

        var routes = new Array();

        _.each(json.routes, function(jsonRoute){

            var route = r360.route(jsonRoute.traveltime);

            _.each(jsonRoute.segments, function(segment){                

                route.addRouteSegment(r360.routeSegment(segment));
            });

            routes.push(route);
        });

        return routes;
    }
};