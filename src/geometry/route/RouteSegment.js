/*
 *
 */
r360.RouteSegment = function(segment){      

    this.polyLine = L.polyline([]);
    this.segment = segment;
    this.travelTime;
    this.length;
    this.elevationGain;  
    this.errorMessage;   

    this.transit;
};

r360.routeSegment = function (segment) { 
    return new r360.RouteSegment(segment);
};