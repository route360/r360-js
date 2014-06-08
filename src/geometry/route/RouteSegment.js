/*
 *
 */
r360.RouteSegment = function(){      

    this.polyLine = L.polyline([]);

    this.travelTime;
    this.length;
    this.elevationGain;  
    this.errorMessage;   

    this.transit;
};

r360.routeSegment = function () { 
    return new r360.RouteSegment();
};