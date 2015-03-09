/*
 *
 */
r360.RouteSegment = function(segment){      

    var that             = this;
    that.points          = [];
    that.type            = segment.type;
    that.travelTime      = segment.travelTime;

    /*
    * TODO don't call it length! in route length refers to the array length.
    * Call it distance instead
    */

    that.distance        = segment.length / 1000;    
    that.warning         = segment.warning;    
    that.elevationGain   = segment.elevationGain;
    that.errorMessage;   
    that.transitSegment  = false;

    // build the geometry
    _.each(segment.points, function(point){
        that.points.push(r360.Util.webMercatorToLatLng(new L.Point(point[1], point[0]), point[2]));
    });


    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        var colorObject     = _.findWhere(r360.config.routeTypes, {routeType : segment.routeType});
        that.color          = typeof colorObject != 'undefined' && _.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && _.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
        that.transitSegment = true;
        that.routeType      = segment.routeType;
        that.routeShortName = segment.routeShortName;
        that.startname      = segment.startname;
        that.endname        = segment.endname;
        that.departureTime  = segment.departureTime;
        that.arrivalTime    = segment.arrivalTime;
        that.tripHeadSign   = segment.tripHeadSign;
    }
    else {

        var colorObject     = _.findWhere(r360.config.routeTypes, {routeType : segment.type});
        that.color          = typeof colorObject != 'undefined' && _.has(colorObject, 'color')     ? colorObject.color : 'RED';
        that.haloColor      = typeof colorObject != 'undefined' && _.has(colorObject, 'haloColor') ? colorObject.haloColor : 'WHITE';
    }

    that.getPoints = function(){
        return that.points;
    }

    that.getType = function(){
        return that.type;
    }

    that.getHaloColor = function(){
        return that.haloColor;
    }

    that.getColor = function(){
        return that.color;
    }

    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.getDistance = function(){
        return that.distance;
    }

    that.getRouteType = function(){
        return that.routeType;
    }

    that.getRouteShortName = function(){
        return that.routeShortName;
    }

    that.getStartName = function(){
        return that.startname;
    }

    that.getEndName = function(){
        return that.endname;
    }

    that.getDepartureTime = function(){
        return that.departureTime;
    }

    that.getArrivalTime = function(){
        return that.arrivalTime;
    }

    that.getTripHeadSign = function(){
        return that.tripHeadSign;
    }

    that.getWarning = function(){
        return that.warning;
    }

    that.getElevationGain = function(){
        return that.elevationGain;
    }

    that.isTransit = function(){
        return that.transitSegment;
    }
};

r360.routeSegment = function (segment) { 
    return new r360.RouteSegment(segment);
};