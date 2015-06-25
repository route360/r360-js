r360.SvgUtil = {

    /**
     * [getGElement description]
     * @param  {[type]} svgData [description]
     * @param  {[type]} opacity [description]
     * @param  {[type]} color   [description]
     * @param  {[type]} animate [description]
     * @return {[type]}         [description]
     */
    getGElement : function(svgData, options){

        var randomId            = r360.Util.generateId();
        var initialOpacity      = options.opacity;

        return  "<g id=" + randomId + " style='opacity:" + initialOpacity + "'>"+
                    "<path style='stroke: " + options.color + "; fill: " + options.color + " ; stroke-opacity: 1; stroke-width: " + options.strokeWidth + "; fill-opacity:1'd='" + svgData.toString().replace(/\,/g, ' ') + "'/>"+
                "</g>";
    },

    /**
     * [getInverseSvgElement description]
     * @param  {[type]} gElements [description]
     * @return {[type]}           [description]
     */
    getInverseSvgElement: function(gElements, options){

        var svgFrame = r360.PolygonUtil.getSvgFrame(options.svgWidth, options.svgHeight);

        var svgStart = "<div id=svg_"+ options.id + " style='" + r360.Util.getTranslation(options.offset) + ";''><svg"  + 
                            " height=" + options.svgHeight + 
                            " width="  + options.svgWidth  + 
                            " style='fill:" + options.backgroundColor + " ; opacity: "+ options.backgroundOpacity + "; stroke-width: " + options.strokeWidth + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        var newSvg = "<defs>"+
                        "<mask id='mask_" + options.id + "'>"+
                            "<path style='fill-opacity:1;stroke: white; fill:white;' d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>"+
                                gElements.join('') + 
                        "</mask>"+
                    "</defs>";

        var frame = "<path style='mask: url(#mask_" + options.id + ")' d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>";

        return svgStart + frame + newSvg + svgEnd;
    },

    /**
     * [getNormalSvgElement description]
     * @param  {[type]} gElement [description]
     * @return {[type]}          [description]
     */
    getNormalSvgElement: function(gElements, options){

        var svgStart = "<div id=svg_"+ options.id + " style='" + r360.Util.getTranslation(options.offset) + ";''><svg "  + 
                            " height=" + options.svgHeight + 
                            " width="  + options.svgWidth  + 
                            " style='fill:" + options.backgroundColor + " ; opacity: " + options.opacity + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        return svgStart + gElements.join('') + svgEnd;
    },

    createSvgData : function(polygon, options) {

        var pathData = [];

        var polygonTopRight     = polygon.getProjectedTopRight();
        var polygonBottomLeft   = polygon.getProjectedBottomLeft();

        r360.PolygonUtil.scale(polygonTopRight, options.scale);
        r360.PolygonUtil.scale(polygonBottomLeft, options.scale);

        // the outer boundary       
        if ( !(polygonBottomLeft.x > options.bounds.max.x || polygonTopRight.x < options.bounds.min.x || 
               polygonTopRight.y > options.bounds.max.y   || polygonBottomLeft.y < options.bounds.min.y ))
            r360.SvgUtil.buildSVGPolygon(pathData, polygon.outerProjectedBoundary, options);

        // the inner boundaries
        for ( var i = 0 ; i < polygon.innerProjectedBoundaries.length ; i++ ) {

            var polygonTopRight     = polygon.innerProjectedBoundaries[i].getProjectedTopRight();
            var polygonBottomLeft   = polygon.innerProjectedBoundaries[i].getProjectedBottomLeft();

            r360.PolygonUtil.scale(polygonTopRight, scale);
            r360.PolygonUtil.scale(polygonBottomLeft, scale);

            if ( !(polygonBottomLeft.x > options.bounds.max.x || polygonTopRight.x < options.bounds.min.x || 
                   polygonTopRight.y > options.bounds.max.y   || polygonBottomLeft.y < options.bounds.min.y ))
                r360.SvgUtil.buildSVGPolygon(pathData, polygon.innerProjectedBoundaries[i].points, options);
        }

        return pathData;
    },

    /**
     * [buildSVGPolygon description]
     * @param  {[type]} pathData        [description]
     * @param  {[type]} coordinateArray [description]
     * @param  {[type]} bounds          [description]
     * @param  {[type]} scale           [description]
     * @return {[type]}                 [description]
     */
    buildSVGPolygon: function(pathData, coordinateArray, options){

        var projectedPoint, point, point1, point2, isCollinear, euclidianDistance, pointCount = 0;
        var boundArray = [[options.bounds.min.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.min.y], 
                          [options.bounds.max.x, options.bounds.max.y], 
                          [options.bounds.min.x, options.bounds.max.y]];

        var pointsToClip = [];

        for ( var i = 0 ; i < coordinateArray.length ; i++ ) {
            projectedPoint  = coordinateArray[i];
            point           = new L.Point(projectedPoint.x, projectedPoint.y);

            r360.PolygonUtil.scale(point, options.scale);
            r360.PolygonUtil.roundPoint(point);

            euclidianDistance = (i > 0) ? r360.PolygonUtil.getEuclidianDistance(point2, point) : options.tolerance; 

            if ( euclidianDistance >= options.tolerance ) {

                isCollinear = false;

                if ( pointCount > 2 ) 
                    isCollinear = r360.PolygonUtil.isCollinear(point1, point2, point);

                if ( isCollinear ) {
                    pointsToClip[pointsToClip.length-1][0] = point.x;
                    pointsToClip[pointsToClip.length-1][1] = point.y;
                }
                else {
                    
                    pointsToClip.push([point.x, point.y]);
                    point1 = point2;
                    point2 = point;
                    pointCount++;
                }
            }
        }

        var clippedArray = r360.PolygonUtil.clip(pointsToClip, boundArray);
        var lastPoint;

        for ( var i = 0 ; i < clippedArray.length ; i++ ){
            
            point = new L.Point(clippedArray[i][0], clippedArray[i][1]);

            r360.PolygonUtil.subtract(point, options.pixelOrigin.x + options.offset.x, 
                                             options.pixelOrigin.y + options.offset.y) 

            pathData.push( i > 0 ? r360.PolygonUtil.buildPath(point, "L") : r360.PolygonUtil.buildPath(point, "M"));
            lastPoint = point;
        }
        
        if ( pathData.length > 0 )
            pathData.push(["z"]); // svgz

        return pathData;
    },
}