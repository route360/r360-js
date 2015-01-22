/*
 *
 */
r360.Route360PolygonLayer = L.Class.extend({
   
    /**
      * This methods initializes the polygon layer's stroke width and polygon opacity.
      * It uses the default values, and in case the options contain other values, the
      * default values are overwritten. 
      *
      * @method send
      * 
      * @param {Object} [options] The typical JS options array.
      * @param {Number} [options.opacity] Defines the opacity of the polygons. 
      *     Higher values mean that the polygon is less opaque.
      * @param {Number} [options.strokeWidth] Defines the strokewidth of the polygons boundaries.
      *     Since we have degenerated polygons (they can have no area), the stroke width defines the
      *     thickness of a polygon. Thicker polygons are not as informative as thinner ones.
      */
    initialize: function (options) {
        
        // set default parameters
        this.opacity     = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth = r360.config.defaultPolygonLayerOptions.strokeWidth;
        
        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.opacity     != 'undefined') this.opacity      = options.opacity;
            if ( typeof options.strokeWidth != 'undefined') this.strokeWidth  = options.strokeWidth;
        }

        this._multiPolygons = new Array(); 

        navigator.sayswho= (function(){
            var ua= navigator.userAgent, tem, 
            M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if(/trident/i.test(M[1])){
                tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'IE '+(tem[1] || '');
            }
            if(M[1]=== 'Chrome'){
                tem= ua.match(/\bOPR\/(\d+)/)
                if(tem!= null) return 'Opera '+tem[1];
            }
            M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
            if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
            return M.join(' ');
        })();
    },

    /* 
     *
     */
    getBoundingBox : function(){
        return new L.LatLngBounds(this._bottomLeft, this._topRight)
    },
    
    /*
     *
     */
    onAdd: function (map) {

        this._map = map;
        // create a DOM element and put it into one of the map panes
        this._el = L.DomUtil.create('div', 'my-custom-layer-'+$(map._container).attr("id")+' leaflet-zoom-hide');
       // $(this._el).css({"opacity": this.opacity});
        $(this._el).attr("id","canvas" + $(this._map._container).attr("id"));
        this._map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        this._map.on('moveend', this._reset, this);
        this._reset(true);

    },

    /**
     * [clearAndAddLayers description]
     * @param  {[type]} sourceToPolygons [description]
     * @return {[type]}                  [description]
     */
    clearAndAddLayers : function(sourceToPolygons){

        this.clearLayers();
        this.addLayer(sourceToPolygons);
    },
    
    /*
     *
     */
    addLayer:function(sourceToPolygons){        
        


        var that    = this;
        that.redrawCount = 0;

        if(r360.config.logging) var start   = new Date().getTime();

        that._resetBoundingBox();
        that._multiPolygons = new Array();

        if(r360.config.logging) var start_projecting   = new Date().getTime();

        for(var i = 0; i < sourceToPolygons.length; i++){
            for(var j = 0; j < sourceToPolygons[i].polygons.length; j++){
                //if(sourceToPolygons[i].polygons[j].travelTime == 3600){

                    sourceToPolygons[i].polygons[j].project(); 
                 that._updateBoundingBox(sourceToPolygons[i].polygons[j]);
                 that._addPolygonToMultiPolygon(sourceToPolygons[i].polygons[j]); 
                //}
                 
            }
        }
        
        that._multiPolygons.sort(function(a,b) { return (b.getTravelTime() - a.getTravelTime()) });

        if(r360.config.logging){
            var end = new Date().getTime();
            console.log("adding layers took " + (end - start));
        }

        that._reset();
    },

    /*
     *
     */
    _addPolygonToMultiPolygon: function(polygon){

        var multiPolygons = _.filter(this._multiPolygons, function(multiPolygon){ return multiPolygon.getTravelTime() == polygon.travelTime; });

        // multipolygon with polygon's travetime already there
        if ( multiPolygons.length > 0 ) multiPolygons[0].addPolygon(polygon);
        else {

            var mp = new r360.multiPolygon();
            mp.setTravelTime(polygon.travelTime);
            mp.addPolygon(polygon);
            mp.setColor(polygon.getColor());
            mp.setOpacity(polygon.getOpacity());
            this._multiPolygons.push(mp);
        }
    },

    /*
     *
     */
    _resetBoundingBox: function(){
        this._latlng = new L.LatLng(-180, 90);
        this._topRight = new L.latLng(-90,-180);
        this._bottomLeft = new L.latLng(90, 180);
    },

    addTo: function (map) {
        map.addLayer(this);
        return this;
    },
    
    /*
     *
     */
    _updateBoundingBox:function(polygon){

        var that = this;        

        if (polygon.topRight.lat    > that._topRight.lat)       that._topRight.lat   = polygon.topRight.lat;                
        if (polygon.bottomLeft.lat  < that._bottomLeft.lat)     that._bottomLeft.lat = polygon.bottomLeft.lat;
            
        if ( polygon.topRight.lng   > that._topRight.lng )      that._topRight.lng   = polygon.topRight.lng;
        if ( polygon.bottomLeft.lng < that._bottomLeft.lng )    that._bottomLeft.lng = polygon.bottomLeft.lng;
    
        if ( that._latlng.lat < that._topRight.lat)             that._latlng.lat = that._topRight.lat;
        if ( that._latlng.lng > that._bottomLeft.lng)           that._latlng.lng = that._bottomLeft.lng;
    },
  
    /*
     *
     */
    onRemove: function (map) {

        // remove layer's DOM elements and listeners
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },
    
    /*
     *
     */
    _buildPath:function(point, suffix){
        
        var a = new Array();

        a.push(suffix);
        a.push(Math.round(point.x));
        a.push(Math.round(point.y));
        
        return a;
    },

    _clipToBounds: function(point, bounds){

        if(point.x > bounds.max.x)
            point.x = bounds.max.x;
        else if(point.x < bounds.min.x)
            point.x = bounds.min.x;
        if(point.y > bounds.max.y)
            point.y = bounds.max.y;        
        else if(point.y < bounds.min.y)
            point.y = bounds.min.y;
    },

    /*
    clipping like sutherland
    http://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
    */

    _clip: function(subjectPolygon, clipPolygon) {
       var cp1, cp2, s, e;
            var inside = function (p) {
                return (cp2[0]-cp1[0])*(p[1]-cp1[1]) > (cp2[1]-cp1[1])*(p[0]-cp1[0]);
            };
            var intersection = function () {
                var dc = [ cp1[0] - cp2[0], cp1[1] - cp2[1] ],
                    dp = [ s[0] - e[0], s[1] - e[1] ],
                    n1 = cp1[0] * cp2[1] - cp1[1] * cp2[0],
                    n2 = s[0] * e[1] - s[1] * e[0], 
                    n3 = 1.0 / (dc[0] * dp[1] - dc[1] * dp[0]);
                return [(n1*dp[0] - n2*dc[0]) * n3, (n1*dp[1] - n2*dc[1]) * n3];
            };
            var outputList = subjectPolygon;
            var cp1 = clipPolygon[clipPolygon.length-1];
            for (j in clipPolygon) {
                var cp2 = clipPolygon[j];
                var inputList = outputList;
                outputList = [];
                s = inputList[inputList.length - 1]; //last on the input list
                for (i in inputList) {
                    var e = inputList[i];
                    if (inside(e)) {
                        if (!inside(s)) {
                            outputList.push(intersection());
                        }
                        outputList.push(e);
                    }
                    else if (inside(s)) {
                        outputList.push(intersection());
                    }
                    s = e;
                }
                cp1 = cp2;
            }
            return outputList
    },

    _scale: function(point, scale){
        point.x *= scale;
        point.y *= scale;
        return point;
    },

    _subtract: function(point, x, y){
        point.x -= x;
        point.y -= y;
        return y;
    },

    _getMaxDiff: function(point1, point2){
        return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2));
    },

    _splicePath: function(pathData){
        if(this._isCollinear())
        console.log

        if(pathData.length >= 3){
            if(pathData[pathData.length-1][1] == pathData[pathData.length-2][1] && pathData[pathData.length-2][1] == pathData[pathData.length-3][1]){
                pathData.splice(pathData.length-2,1)
            } 
            else if(pathData[pathData.length-1][2] == pathData[pathData.length-2][2] && pathData[pathData.length-2][2] == pathData[pathData.length-3][2]){
                pathData.splice(pathData.length-2,1)
            }
        }
    },

    _isCollinear: function(p1, p2, p3){

        if(p1.x == p3.x && p1.y == p3.y)
            return false;
        if(p1.x == p2.x && p2.x == p3.x)
            return true;
        if(p1.y == p2.y && p2.y == p3.y)
            return true;
        
        var val = (p1.x * (p2.y -p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));

        if(val < r360.config.defaultPolygonLayerOptions.tolerance && val > -r360.config.defaultPolygonLayerOptions.tolerance
         && p1.x != p3.x && p1.y != p3.y)
            return true;
        return false;
    },

    _roundPoint: function(p){
        p.x = Math.round(p.x);
        p.y = Math.round(p.y);
        return p;
    },

    _buildSVGPolygon: function(pathData, coordinateArray, bounds, scale){

        var that = this;
        var svgM    = "M";
        var svgL    = "L";  
        var svgz    = "z";  
        var maxDiff;
      
        var projectedPoint, point, point1, point2, isCollinear, pointCount = 0;
       
        var boundArray = [[bounds.min.x, bounds.min.y], [bounds.max.x, bounds.min.y], [bounds.max.x, bounds.max.y], [bounds.min.x, bounds.max.y]];

        var arrayToClip = new Array();

        for(var i = 0; i < coordinateArray.length; i++){
            projectedPoint  = coordinateArray[i];
            point           = new L.Point(projectedPoint.x, projectedPoint.y);
            that._scale(point, scale);
            that._roundPoint(point);

            if(i > 0) 
                maxDiff = that._getMaxDiff(point2, point); 
            else 
                maxDiff = r360.config.defaultPolygonLayerOptions.tolerance;

            if(maxDiff >= r360.config.defaultPolygonLayerOptions.tolerance){

                isCollinear = false;

                if(pointCount > 2){
                    isCollinear = that._isCollinear(point1, point2, point);
                }

                if(isCollinear){
                    arrayToClip[arrayToClip.length-1][0] = point.x;
                    arrayToClip[arrayToClip.length-1][1] = point.y;
                }else{
                    
                    arrayToClip.push([point.x, point.y]);
                    point1 = point2;
                    point2 = point;
                    pointCount++;
                }
            }
        }

        var clippedArray = this._clip(arrayToClip, boundArray);
        var lastPoint;

        for(var i = 0; i < clippedArray.length; i++){
            projectedPoint = clippedArray[i];
            point = new L.Point(projectedPoint[0], projectedPoint[1]);
            that._subtract(point, that._map.getPixelOrigin().x + that._offset.x, that._map.getPixelOrigin().y + that._offset.y) 
            if(i > 0)   
                pathData.push(that._buildPath(point, svgL));
            else        
                pathData.push(that._buildPath(point, svgM));
            lastPoint = point;
        }
        if(pathData.length > 0)
            pathData.push([svgz]);
        return pathData;
    },
    
    /*
     *
     */
    _createSVGData: function(polygon){

        var that = this;

        var bounds  = that._map.getPixelBounds();
        var mapSize = that._map.getSize();

        var extendX = Math.ceil(r360.config.defaultPolygonLayerOptions.strokeWidth/2);
        var extendY = Math.ceil(r360.config.defaultPolygonLayerOptions.strokeWidth/2);

        bounds.max.x += extendX;
        bounds.min.x -= extendX;

        bounds.max.y += extendY;
        bounds.min.y -= extendY;


        var scale   = Math.pow(2,that._map._zoom) * 256;

        var pathData = new Array();

        var polygonTopRight     = polygon.getProjectedTopRight();
        var polygonBottomLeft   = polygon.getProjectedBottomLeft();

        that._scale(polygonTopRight, scale);
        that._scale(polygonBottomLeft, scale);

        // the outer boundary       
        if(!(polygonBottomLeft.x > bounds.max.x || polygonTopRight.x < bounds.min.x || polygonTopRight.y > bounds.max.y || polygonBottomLeft.y < bounds.min.y))
            that._buildSVGPolygon(pathData, polygon.outerProjectedBoundary, bounds, scale);

     
        // the inner boundaries
        for(var i = 0; i < polygon.innerProjectedBoundaries.length; i++){

            that.runs ++;
            var polygonTopRight     = polygon.innerProjectedBoundaries[i].getProjectedTopRight();
            var polygonBottomLeft   = polygon.innerProjectedBoundaries[i].getProjectedBottomLeft();

            that._scale(polygonTopRight, scale);
            that._scale(polygonBottomLeft, scale);

            if(!(polygonBottomLeft.x > bounds.max.x || polygonTopRight.x < bounds.min.x || polygonTopRight.y > bounds.max.y || polygonBottomLeft.y < bounds.min.y))
                that._buildSVGPolygon(pathData, polygon.innerProjectedBoundaries[i].points, bounds, scale);
            //    continue;

            that.counter++;
            //
        }

       
           
        return pathData;
    },

    /*
     *
     */
    clearLayers: function(){        
        $('#canvas'+ $(this._map._container).attr("id")).empty();
        this.initialize();
    },

    /*
     *
     */
    _reset: function () {

        var that = this;

        var g = new Array();   

        // count the drawings in order to animate only the initial one
        that.redrawCount++;
 
                                    if(r360.config.logging) var start   = new Date().getTime();

        if(this._multiPolygons.length > 0){           
             
            var svgData, mp; 
            var pos         = new L.Point(0,0);    
            that._svgWidth    = that._map.getSize().x;
            that._svgHeight   = that._map.getSize().y;

            /*
            always place the layer in the corner top left. Later adjustments will be made by svg translate 
            */
            L.DomUtil.setPosition(this._el, pos);

         
            // calculate the offset in between map and svg in order to translate
            var svgHTML        = $('#svg_'+ $(this._map._container).attr("id"));
            var svgPosition    = svgHTML.offset();
            var mapPosition    = $(this._map._container).offset();

            

            if(typeof that._offset == 'undefined')
                that._offset = new L.Point(0,0)

            if(typeof svgPosition != 'undefined'){
                that._offset.x += (mapPosition.left - svgPosition.left);
                that._offset.y += (mapPosition.top - svgPosition.top);
            }


            // clear layer from previous drawings
            $('#canvas'+ $(this._map._container).attr("id")).empty();                      
            
            for(var i = 0; i < this._multiPolygons.length; i++){
                mp      = this._multiPolygons[i];                
                svgData = new Array();

                                            if(r360.config.logging) var start_svg   = new Date().getTime();
                for ( var j = 0; j < mp.polygons.length; j++) {
                    var svg = this._createSVGData(mp.polygons[j]);
                    // TODO a few too many tiny polygons are created. Needs to be investigated
                    //if(svg.length > 2)
                    svgData.push(svg);
                }
                                            if(r360.config.logging) console.log("svg creation took: " + (new Date().getTime() - start_svg));                                    

                if(svgData.length != 0){
                    var color   = mp.getColor();
                    var opacity = mp.getOpacity();
                                            if(r360.config.logging) var start_raphael  = new Date().getTime();

                    var animate = false;     
                    if(that.redrawCount <= 2 && r360.config.defaultPolygonLayerOptions.animate)
                        if(that._isAnimated())
                            animate = true;


                    if(!r360.config.defaultPolygonLayerOptions.inverse)
                        g.push(that._getGElement(svgData, 1, color, animate));
                    else
                        g.push(that._getGElement(svgData, opacity, 'black', animate));
              
                                            if(r360.config.logging)     console.log("raphael creation took: " + (new Date().getTime() - start_raphael) + "  svg path length: " + svgData.length);                    
                }
            }

            var svgString;
            if(!r360.config.defaultPolygonLayerOptions.inverse)
                svgString = that._getNormalSvgElement(g);
            else
                svgString = that._getInverseSvgElement(g);

            $('#canvas'+ $(this._map._container).attr("id")).append(svgString);
               


           
        }

                                            if(r360.config.logging){
                                                var end   = new Date().getTime();
                                                console.log("layer resetting tool: " +  (end - start) + "ms");
                                            } 

    },

    _isAnimated: function(){
        if (navigator.sayswho.indexOf("IE") != -1 )
            return false;
        if (navigator.sayswho.indexOf("Safari") != -1 )
            return false;
        if (navigator.sayswho.indexOf("Firefox") != -1 )
            return false;
        if(r360.config.defaultPolygonLayerOptions.animate)
            return true;
        return false;
    },

    _getFrame: function(width, height){
        var svgFrame = new Array();
        svgFrame.push(['M',0, 0]);
        svgFrame.push(['L',width, 0]);
        svgFrame.push(['L',width, height]);
        svgFrame.push(['L',0, height]);
        svgFrame.push(['z']);
        return svgFrame;
    },

    _getTranslation: function(){
        var that = this;
        if (navigator.sayswho.indexOf("IE 9") != -1 )
            return "transform:translate("+that._offset.x+"px,"+that._offset.y+"px)";
        if  (navigator.sayswho.indexOf("Safari") != -1 ) 
            return "-webkit-transform:translate3d("+that._offset.x+"px,"+that._offset.y+"px,0px)";
        if  (navigator.sayswho.indexOf("Firefox") != -1 ) 
            return "-moz-transform:translate3d("+that._offset.x+"px,"+that._offset.y+"px,0px)";
        else
            return "transform:translate3d("+that._offset.x+"px,"+that._offset.y+"px,0px)";
    },

    _getInverseSvgElement: function(gElement){
        var that     = this;
        var svgFrame = this._getFrame(that._svgWidth, that._svgHeight);

        var svgStart = "<div id=svg_"+ $(this._map._container).attr("id") + " style='" + that._getTranslation() + ";''><svg"  + 
                            " height=" + that._svgHeight + 
                            " width="  + that._svgWidth  + 
                            " style='fill:" + r360.config.defaultPolygonLayerOptions.backgroundColor + " ; opacity: "+ r360.config.defaultPolygonLayerOptions.backgroundOpacity + "; stroke-width: " + r360.config.defaultPolygonLayerOptions.strokeWidth + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        var gees = "";

        for(var i = 0; i < gElement.length; i++)
            gees += gElement[i];

        var newSvg = "<defs>"+
                        "<mask id='mask_"+ $(this._map._container).attr("id")+"'>"+
                            "<path style='fill-opacity:1;stroke: white; fill:white;' d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>"+
                            gees + 
                        "</mask>"+
                    "</defs>";
        var frame = "<path style='mask: url(#mask_"+ $(this._map._container).attr("id")+")'d='" + svgFrame.toString().replace(/\,/g, ' ') + "'/>";

        return svgStart + frame +  newSvg  +  svgEnd;
    },

    _getGElement: function(svgData, opacity, color, animate){

        var randomId = r360.Util.generateId();
        var initialOpacity = opacity;
        var animationDuration = r360.config.defaultPolygonLayerOptions.animationDuration;

        if(animate){
            initialOpacity = 0;
        }

        return  "<g id=" + randomId + " style='opacity:" + initialOpacity + "'>"+
                    "<path style='stroke: " + color + "; fill: " + color + " ; stroke-opacity: 1; stroke-width: " + r360.config.defaultPolygonLayerOptions.strokeWidth + "; fill-opacity:1'd='" + svgData.toString().replace(/\,/g, ' ') + "'/>"+
                "</g><animate xlink:href='#" + randomId + "' attributeName='opacity' begin='0s' dur='" + animationDuration + "s' from=" + initialOpacity + " to=" + opacity + " fill='freeze' />";
    },

    _getNormalSvgElement: function(gElement){
        var that = this;
        var svgStart = "<div id=svg_"+ $(this._map._container).attr("id") + " style='" + that._getTranslation() + ";''><svg"  + 
                            " height=" + that._svgHeight + 
                            " width="  + that._svgWidth  + 
                            " style='fill:" + r360.config.defaultPolygonLayerOptions.backgroundColor + " ; opacity: "+ r360.config.defaultPolygonLayerOptions.opacity + "; stroke-linejoin:round; stroke-linecap:round; fill-rule: evenodd' xmlns='http://www.w3.org/2000/svg'>"
        var svgEnd   = "</svg></div>";

        var gees = "";

        for(var i = 0; i < gElement.length; i++)
            gees += gElement[i];

        return svgStart + gees + svgEnd;

    }


});

r360.route360PolygonLayer = function () {
    return new r360.Route360PolygonLayer();
};


/*
not in use anymore:   

// ie8 (vml) gets the holes from smaller polygons. Dirty IE8 hack
                if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                    if (i < this._multiPolygons.length-1 ) {
                        for ( var l = 0; l < this._multiPolygons[i+1].polygons.length; l++ ) {
                            var poly2 = this._multiPolygons[i+1].polygons[l];
                            svgData.push(this._createSVGData(poly2.outerBoundary));
                        }
                    }
                }


                 // Another shabby IE8 hack
            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('shape').each(function() {
                    $( this ).css( {"filter": "alpha(opacity=" + that.opacity * 100 + ")"} );
                });
            }

*/