/*
 *
 */
r360.Route = function(travelTime, segments, meta){

    var that             = this;
    that.travelTime      = travelTime;
    that.routeSegments   = [];
    that.points          = [];
    that.uphillMeter     = 0;
    that.downhillMeter   = 0;
    that.targetHeight    = undefined;
    that.sourceHeight    = undefined;
    that.sourceId        = undefined;
    that.targetId        = undefined;
    that.length          = undefined;
    that.transfers       = 0;

    // the server delivers the route from target to source
    segments.reverse().forEach(function(segment){

        var routeSegment = r360.routeSegment(segment);
        that.routeSegments.push(routeSegment);

        if (routeSegment.type === 'TRANSFER') that.transfers++;

        that.points = that.points.concat(routeSegment.getPoints().reverse());
    });


    if(typeof meta !== 'undefined') {
        that.sourceId = meta.source_id;
        that.targetId = meta.target_id;
        that.length   = meta.length;
    }

    that.equals = function(route) {
        return that.getKey() === route.getKey();
    };

    that.getKey = function(){

        var key     = travelTime;
        var points  = "";

        that.getSegments().forEach(function(segment){

            key += " " + segment.getRouteShortName() + " " + segment.getDepartureTime() + " " + segment.getArrivalTime();

            segment.getPoints().forEach(function(point){ points += " " + point.lat + "" + point.lng; });
        });

        return key + points;
    }

    /*
     *
     */
    that.addRouteSegment = function(routeSegment){
        that.routeSegments.push(routeSegment);
    }

    /*
     *
     */
    that.setTravelTime = function(travelTime){
        that.travelTime = travelTime;
    }

    /*
     *
     */

    that.getDistance = function(){
        var distance = 0;
        for(var i = 0; i < that.routeSegments.length; i++){
            distance += that.routeSegments[i].getDistance();
        }
        return distance;
    }

    /**
     * [getElevationGain description]
     * @return {type} [description]
     */
    that.getElevationGain = function(){
        var distance = 0;
        for(var i = 0; i < that.routeSegments.length; i++){
            distance += that.routeSegments[i].getElevationGain();
        }
        return distance;
    }

    /**
     * [getElevations description]
     * @return {type} [description]
     */
    that.getElevations = function() {

        var elevations = { x : [] , y : []};
        for ( var i = 0 ; i < that.getDistance() * 1000 ; i = i + 100 ) {
            elevations.x.push((i / 1000) + " km" );
            elevations.y.push(that.getElevationAt(i));
        }

        return elevations;
    }

    /**
     * [getElevationAt description]
     * @param  {type} meter [description]
     * @return {type}       [description]
     */
    that.getElevationAt = function(meter) {

        var currentLength = 0;

        for ( var i = 1 ; i < that.points.length ; i++ ){

            var previousPoint   =  that.points[i - 1];
            var currentPoint    =  that.points[i];
            var currentDistance =  previousPoint.distanceTo(currentPoint);

            currentLength += currentDistance;

            if ( currentLength > meter ) return currentPoint.alt;
        }
    }

    /*
     *
     */
    that.getSegments = function(){
        return that.routeSegments;
    }

    that.getUphillElevation = function() {
        return that.uphillMeter;
    }

    that.getDownhillElevation = function() {
        return that.downhillMeter;
    }

    that.getTotalElevationDifference = function(){
        return Math.abs(that.sourceHeight - that.targetHeight);
    }

    that.setElevationDifferences = function() {

        var previousHeight   = undefined;

        for ( var i = that.points.length - 1; i >= 0 ; i-- ) {

            if ( i == 0 )                       that.targetHeight = that.points[i].alt;
            if ( i == that.points.length - 1 )  that.sourceHeight = that.points[i].alt;

            if ( typeof previousHeight != 'undefined' ) {

                // we go up
                if ( previousHeight > that.points[i].alt )
                    that.uphillMeter += (previousHeight - that.points[i].alt);
                // and down
                else if ( previousHeight < that.points[i].alt )
                    that.downhillMeter += (that.points[i].alt - previousHeight);
            }

            previousHeight = that.points[i].alt;
        }
    }();

    /*
     *
     */
    that.getTravelTime = function(){
        return that.travelTime;
    };
};

r360.route = function (travelTime, segments, meta) {
    return new r360.Route(travelTime, segments, meta);
};