/*
 *
 */
r360.Route = function(){

    var that = this;
    that.routeSegments = new Array();

    that.addRouteSegment = function(routeSegment){
        that.routeSegments.push(routeSegment);
    }
};