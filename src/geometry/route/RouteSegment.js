/*
 *
 */
r360.RouteSegment = function(segment){      

    var that             = this;
    that.polyLine        = L.polyline([]);
    that.points          = segment.points;
    that.type            = segment.type;
    that.travelTime      = segment.travelTime;
    that.length          = segment.length;    
    that.warning         = segment.warning;    
    that.elevationGain   = segment.elevationGain;
    that.errorMessage;   
    that.transitSegment  = false;

    // build the geometry
    _.each(segment.points, function(point){

        var utm = true;

        if(utm){
            proj4.defs('EPSG:32633', '+proj=utm +zone=33 +ellps=GRS80 +datum=WGS84 +units=m +no_defs');
            crs = new L.Proj.CRS('urn:ogc:def:crs:EPSG::32633');
            var p = new L.Point(point[1], point[0]);
            that.polyLine.addLatLng(L.latLng(crs.projection.unproject(p)));

        }
        if(!utm){
            that.polyLine.addLatLng(point);
        }

        
    });

    // in case we have a transit route, we set a color depending
    //  on the route type (bus, subway, tram etc.)
    // and we set information which are only available 
    // for transit segments like depature station and route short sign
    if ( segment.isTransit ) {

        that.color          = _.findWhere(r360.config.routeTypes, {routeType : segment.routeType}).color;
        that.transitSegment = true;
        that.routeType      = segment.routeType;
        that.routeShortName = segment.routeShortName;
        that.startname      = segment.startname;
        that.endname        = segment.endname;
        that.departureTime  = segment.departureTime;
        that.arrivalTime    = segment.arrivalTime;
        that.tripHeadSign   = segment.tripHeadSign;
    }
    else that.color         = _.findWhere(r360.config.routeTypes, {routeType : segment.type }).color;

    that.getPoints = function(){
        return that.points;
    }

    that.getType = function(){
        return that.type;
    }

    that.getColor = function(){
        return that.color;
    }

    that.getTravelTime = function(){
        return that.travelTime;
    }

    that.getLength = function(){
        return that.length;
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