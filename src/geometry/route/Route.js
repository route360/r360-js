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

r360.route = function () { 
    return new r360.Route();
};