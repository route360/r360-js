r360.SvgUtil = {

    /**
     * [getGElement description]
     * @param  {type} svgData [description]
     * @param  {type} opacity [description]
     * @param  {type} color   [description]
     * @param  {type} animate [description]
     * @return {type}         [description]
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
     * @param  {type} gElements [description]
     * @return {type}           [description]
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
     * @param  {type} gElement [description]
     * @return {type}          [description]
     */
    getNormalSvgElement: function(gElements, options){

        var svgStart = "<div id=svg_"+ options.id + " style='" + r360.Util.getTranslation(options.offset) + ";''><svg "  +
                            " height=" + options.svgHeight +
                            " width="  + options.svgWidth  +
                            " style='fill:" + options.backgroundColor + " ; opacity: " + options.opacity + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        return svgStart + gElements.join('') + svgEnd;
    },

    /**
     * [createSvgData description]
     * @param  {type} polygon [description]
     * @param  {type} options [description]
     * @return {type}         [description]
     */
    createSvgData : function(polygon, options) {

        var pathData = [];

        var topRight     = r360.PolygonUtil.scale(polygon.getTopRightDecimal(), options.scale);
        var bottomLeft   = r360.PolygonUtil.scale(polygon.getBottomLeftDecimal(), options.scale);

        // the outer boundary
        if ( !(bottomLeft.x > options.bounds.max.x || topRight.x < options.bounds.min.x ||
               topRight.y > options.bounds.max.y   || bottomLeft.y < options.bounds.min.y ))
            r360.SvgUtil.buildSVGPolygon(pathData, polygon.getOuterBoundary().getCoordinates(), options);

        var innerBoundary = polygon.getInnerBoundary();

        // the inner boundaries
        for ( var i = 0 ; i < innerBoundary.length ; i++ ) {

            var topRightInner     = r360.PolygonUtil.scale(innerBoundary[i].getTopRightDecimal(), options.scale);
            var bottomLeftInner   = r360.PolygonUtil.scale(innerBoundary[i].getBottomLeftDecimal(), options.scale);

            if ( !(bottomLeftInner.x > options.bounds.max.x || topRightInner.x < options.bounds.min.x ||
                   topRightInner.y > options.bounds.max.y   || bottomLeftInner.y < options.bounds.min.y ))
                r360.SvgUtil.buildSVGPolygon(pathData, innerBoundary[i].getCoordinates(), options);
        }

        return pathData;
    },

    /**
     * [buildSVGPolygon description]
     * @param  {type} pathData        [description]
     * @param  {type} coordinateArray [description]
     * @param  {type} bounds          [description]
     * @param  {type} scale           [description]
     * @return {type}                 [description]
     */
    buildSVGPolygon: function(pathData, coordinateArray, options){

        var point, point1, point2, isCollinear, euclidianDistance, pointCount = 0;
        var boundArray = [[options.bounds.min.x, options.bounds.min.y],
                          [options.bounds.max.x, options.bounds.min.y],
                          [options.bounds.max.x, options.bounds.max.y],
                          [options.bounds.min.x, options.bounds.max.y]];

        var pointsToClip = [];

        for ( var i = 0 ; i < coordinateArray.length ; i++ ) {

            point = r360.PolygonUtil.scale(r360.point(coordinateArray[i].x, coordinateArray[i].y), options.scale);

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

            point = r360.PolygonUtil.subtract(r360.point(clippedArray[i][0], clippedArray[i][1]),
                                                options.pixelOrigin.x + options.offset.x,
                                                options.pixelOrigin.y + options.offset.y)

            pathData.push( i > 0 ? r360.PolygonUtil.buildPath(point, "L") : r360.PolygonUtil.buildPath(point, "M"));
            lastPoint = point;
        }

        if ( pathData.length > 0 )
            pathData.push(["z"]); // svgz

        return pathData;
    },
}