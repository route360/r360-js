/*
 *
 */
r360.Route = function(travelTime){

    var that = this;
    that.travelTime = travelTime;
    that.routeSegments = new Array();

    that.addRouteSegment = function(routeSegment){
        that.routeSegments.push(routeSegment);
    }

    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }
};

r360.route = function (travelTime) { 
    return new r360.Route(travelTime);
};