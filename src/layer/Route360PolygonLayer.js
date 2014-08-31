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
        $(this._el).css({"opacity": this.opacity});
        $(this._el).attr("id","canvas" + $(this._map._container).attr("id"));
        this._map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        this._map.on('moveend', this._reset, this);
        this._reset(true);
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
        

        _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){
                polygon.project(that._map);                
            });
        })

        if(r360.config.logging) var end_projecting   = new Date().getTime();
        

         _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){             
                that._updateBoundingBox(polygon.outerBoundary);         
            });
        })

         _.each(sourceToPolygons, function(source){
            _.each(source.polygons, function(polygon){               
                that._addPolygonToMultiPolygon(polygon);
            });
            that._multiPolygons.sort(function(a,b) { return (b.getTravelTime() - a.getTravelTime()) });
        })

        if(r360.config.logging){
            var end = new Date().getTime();
            console.log("adding layers took " + (end - start) + "ms; Projecting took: " + (end_projecting - start_projecting) + "ms");
        }
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
    
    /*
     *
     */
    _updateBoundingBox:function(coordinates){

        var that = this;

        _.each(coordinates, function(coordinate){

            if ( coordinate.lat > that._topRight.lat )          that._topRight.lat   = coordinate.lat;                
            else if( coordinate.lat < that._bottomLeft.lat )    that._bottomLeft.lat = coordinate.lat;
            
            if ( coordinate.lng > that._topRight.lng )          that._topRight.lng   = coordinate.lng;
            else if( coordinate.lng < that._bottomLeft.lng )    that._bottomLeft.lng = coordinate.lng;
        })
        
        if ( that._latlng.lat < that._topRight.lat)     that._latlng.lat = that._topRight.lat;
        if ( that._latlng.lng > that._bottomLeft.lng)   that._latlng.lng = that._bottomLeft.lng;
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
        if(point.y > bounds.max.y)
            point.y = bounds.max.y;
        if(point.x < bounds.min.x)
            point.x = bounds.min.x;
        if(point.y < bounds.min.y)
            point.y = bounds.min.y;
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

    _getMaxDiff: function(svgArray, point){
        var diffX = Math.abs(svgArray[1] - point.x);
        var diffY = Math.abs(svgArray[2] - point.y);
        if(diffX >= diffY)
            return diffX;
        else
            return diffY;

    },

    _splicePath: function(pathData){
        if(pathData.length >= 3){
            if(pathData[pathData.length-1][1] == pathData[pathData.length-2][1] && pathData[pathData.length-2][1] == pathData[pathData.length-3][1]){
                pathData.splice(pathData.length-2,1)
            } else if(pathData[pathData.length-1][2] == pathData[pathData.length-2][2] && pathData[pathData.length-2][2] == pathData[pathData.length-3][2]){
                pathData.splice(pathData.length-2,1)
            }
        }
    },

    /*
    TODO possible imrovement. Check weather polygons are in bounds or not. Especially inner polygons. Best: define bounds in polygon.js
    */

    _buildSVGPolygon: function(pathData, coordinateArray){

        var that = this;
        var svgM    = "M";
        var svgL    = "L";  
        var svgz    = "z";  
        var maxDiff;
        var scale   = Math.pow(2,that._map._zoom);
        var bounds  = that._map.getPixelBounds();
        var mapSize = that._map.getSize();
        var extendX = mapSize.x /3;
        var extendY = mapSize.y /3;
        var projectedPoint;
       

        bounds.max.x += extendX;
        bounds.min.x -= extendX;

        bounds.max.y += extendY;
        bounds.min.y -= extendY;

         // the min amount of pixels for a new point
        var minDiff = 5;

        for(var i = 0; i < coordinateArray.length; i++){

            projectedPoint = coordinateArray[i];
            point = new L.Point(projectedPoint.x, projectedPoint.y);

            // scale coordinates depending on zoom level
            that._scale(point, scale);

            // level all points outside defined area
            that._clipToBounds(point,bounds);

            // adjust coordinates to map origin
            that._subtract(point, that._map.getPixelOrigin().x, that._map.getPixelOrigin().y) 
            
            // getting the max difference of the latest to points in eiter x or y direction
            if(i > 0) maxDiff = that._getMaxDiff(pathData[pathData.length-1], point); else maxDiff = minDiff;

            /*
            we are only drawing the point if it is different to the last one
            hence, depending on zoom, we can reduce the number of points (SVG size) dramatically
            */           
            if(maxDiff >= minDiff){
                if(i > 0)   pathData.push(that._buildPath(point, svgL));
                else        pathData.push(that._buildPath(point, svgM));
            }
            // checking weather last three points are building one (even x or y) line. If so remove the middle one
            that._splicePath(pathData);
        }
        pathData.push([svgz]);
        return pathData;
    },
    
    /*
     *
     */
    _createSVGData: function(polygon){

        var pathData = new Array();
        var that    = this;        
        // the outer boundary       
        that._buildSVGPolygon(pathData, polygon.outerProjectedBoundary);
        // the inner boundaries
        for(var i = 0; i < polygon.innerProjectedBoundaries.length; i++)
           that._buildSVGPolygon(pathData, polygon.innerProjectedBoundaries[i]);
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

        // count the drawings in order to animate only the initial one
        that.redrawCount++;
 
        //internalSVGOffset is used to have a little space between geometries and svg frame. otherwise buffers won't be displayed at the edges.
        var internalSVGOffset = 100;

                                    if(r360.config.logging) var start   = new Date().getTime();

        if(this._multiPolygons.length > 0){
            var pos         = this._map.latLngToLayerPoint(this._latlng); 
            var bounds      = that._map.getPixelBounds();
            var bottomLeft  = this._map.latLngToLayerPoint(this._bottomLeft);
            var topRight    = this._map.latLngToLayerPoint(this._topRight); 
            var svgData, mp, poly;  

            pos.x       -= internalSVGOffset;
            pos.y       -= internalSVGOffset;
            L.DomUtil.setPosition(this._el, pos);
           
            // do some fixing for various ie versions
            that._ieFixes(pos);

            $('#canvas'+ $(this._map._container).attr("id")).empty();             
            var paper = Raphael('canvas'+ $(this._map._container).attr("id"), (topRight.x - bottomLeft.x) + internalSVGOffset * 2, (bottomLeft.y - topRight.y) + internalSVGOffset * 2);
            var st = paper.set();
            

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
                
                // ie8 (vml) gets the holes from smaller polygons. Dirty IE8 hack
                if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                    if (i < this._multiPolygons.length-1 ) {
                        for ( var l = 0; l < this._multiPolygons[i+1].polygons.length; l++ ) {
                            var poly2 = this._multiPolygons[i+1].polygons[l];
                            svgData.push(this._createSVGData(poly2.outerBoundary));
                        }
                    }
                }

                //'fill-opacity': 0

                if(svgData.length != 0){
                    var color = mp.getColor();
                                            if(r360.config.logging) var start_raphael  = new Date().getTime();

                if(that.redrawCount <= 1){
                    var path = paper.path(svgData).attr({fill: color, stroke: color, "stroke-width": that.strokeWidth, "stroke-linejoin":"round","stroke-linecap":"round","fill-rule":"evenodd"})
                            .attr({ "opacity":"0"}).animate({ "opacity" : "1" }, mp.polygons[0].travelTime/3);
                }else{
                    var path = paper.path(svgData).attr({fill: color, stroke: color, "stroke-width": that.strokeWidth, "stroke-linejoin":"round","stroke-linecap":"round","fill-rule":"evenodd"})
                            .attr({ "opacity":"1"});//.animate({ "opacity" : "1" }, mp.polygons[0].travelTime/3)     
                }
                path.translate((bottomLeft.x - internalSVGOffset) *-1,((topRight.y - internalSVGOffset)*-1));                
                st.push(path);
                                            if(r360.config.logging)     console.log("raphael creation took: " + (new Date().getTime() - start_raphael) + "  svg path length: " + svgData.length);                    
                }
            }

            // Another shabby IE8 hack
            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('shape').each(function() {
                    $( this ).css( {"filter": "alpha(opacity=" + that.opacity * 100 + ")"} );
                });
            }
        }

                                            if(r360.config.logging){
                                                var end   = new Date().getTime();
                                                console.log("layer resetting tool: " +  (end - start) + "ms");
                                            } 
    },

    _ieFixes: function(pos){
         //ie 8 and 9 
        if (navigator.appVersion.indexOf("MSIE 9.") != -1 )  {
            $('#canvas'+ $(this._map._container).attr("id")).css("transform", "translate(" + pos.x + "px, " + pos.y + "px)");
        }
        if(navigator.appVersion.indexOf("MSIE 8.") != -1){
            $('#canvas'+ $(this._map._container).attr("id")).css({"position" : "absolute"});
        }
    }


});

r360.route360PolygonLayer = function () {
    return new r360.Route360PolygonLayer();
};