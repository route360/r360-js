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

            if(typeof options.opacity != 'undefined')     this.opacity      = options.opacity;
            if(typeof options.strokeWidth != 'undefined') this.strokeWidth  = options.strokeWidth;
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
        this._map.on('viewreset', this._reset, this);
        this._reset();
    },
    
    /*
     *
     */
    addLayer:function(polygons){        
        
        var that = this;
        that._resetBoundingBox();
        that._multiPolygons = new Array();
        
        _.each(polygons, function(polygon){

            that._updateBoundingBox(polygon.outerBoundary);
            that._addPolygonToMultiPolygon(polygon);
        });

        that._multiPolygons.sort(function(a,b) { return (b.getTravelTime() - a.getTravelTime()) });
        that._reset();
    },

    /*
     *
     */
    _addPolygonToMultiPolygon: function(polygon){

        _.each(this._multiPolygons, function(multiPolygon){

            if ( multiPolygon.getTravelTime() == polygon.travelTime ){
                multiPolygon.addPolygon(polygon);
                return;
            }
        });

        var mp = new r360.multiPolygon();
        mp.setTravelTime(polygon.travelTime);
        mp.addPolygon(polygon);
        mp.setColor(polygon.getColor());
        this._multiPolygons.push(mp);
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
    _buildString:function(path, point, suffix){
        
        path += suffix + point.x + ' ' + point.y;
        return path;
    },
    
    /*
     *
     */
    _createSVGData: function(polygon){

        var that    = this;
        pathData    = '';
        var point   = this._map.latLngToLayerPoint(polygon[0]);
        pathData    = this._buildString(pathData, point, 'M')
        
        _.each(polygon, function(point){

            point    = that._map.latLngToLayerPoint(point);
            pathData = that._buildString(pathData, point, 'L')
        });

        pathData += 'z ';
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

        if(this._multiPolygons.length > 0){
            var pos = this._map.latLngToLayerPoint(this._latlng);

            //internalSVGOffset is used to have a little space between geometries and svg frame. otherwise buffers won't be displayed at the edges...
            var internalSVGOffset = 100;
            pos.x -= internalSVGOffset;
            pos.y -= internalSVGOffset;
            L.DomUtil.setPosition(this._el, pos);

            //ie 8 and 9 
            if (navigator.appVersion.indexOf("MSIE 9.") != -1 )  {
                $('#canvas'+ $(this._map._container).attr("id")).css("transform", "translate(" + pos.x + "px, " + pos.y + "px)");
            }
            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('#canvas'+ $(this._map._container).attr("id")).css({"position" : "absolute"});
            }
            $('#canvas'+ $(this._map._container).attr("id")).empty();         

            var bottomLeft = this._map.latLngToLayerPoint(this._bottomLeft);
            var topRight = this._map.latLngToLayerPoint(this._topRight);
            var paper = Raphael('canvas'+ $(this._map._container).attr("id"), (topRight.x - bottomLeft.x) + internalSVGOffset * 2, (bottomLeft.y - topRight.y) + internalSVGOffset * 2);
            var st = paper.set();
            var svgData = "";
            var mp, poly;
            var svgDataArray = new Array();
            for(var i = 0; i < this._multiPolygons.length; i++){
                mp = this._multiPolygons[i];
                
                svgData = "";

                for(var j = 0; j < mp.polygons.length; j++){
                        poly = mp.polygons[j];
                        svgData += this._createSVGData(poly.outerBoundary);
                        for(var k = 0; k < poly.innerBoundaries.length; k++){
                            svgData += this._createSVGData(poly.innerBoundaries[k]);
                        }
                        var pointTopRight = this._map.latLngToLayerPoint(poly.topRight);
                        var pointBottomLeft = this._map.latLngToLayerPoint(poly.bottomLeft);
                    }
                    // ie8 (vml) gets the holes from smaller polygons
                    if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                        if(i < this._multiPolygons.length-1){
                            for(var l = 0; l < this._multiPolygons[i+1].polygons.length; l++){
                                var poly2 = this._multiPolygons[i+1].polygons[l];
                                svgData += this._createSVGData(poly2.outerBoundary);
                            }
                        
                    }
                }


                var color = mp.getColor();
                var path = paper.path(svgData).attr({fill: color, stroke: color, "stroke-width": that.strokeWidth, "stroke-linejoin":"round","stroke-linecap":"round","fill-rule":"evenodd"})
                            .attr({"opacity":"0"}).animate({ "opacity" : "1" }, poly.travelTime/3)
                            path.translate((bottomLeft.x - internalSVGOffset) *-1,((topRight.y - internalSVGOffset)*-1));
                st.push(path);
            }

            if(navigator.appVersion.indexOf("MSIE 8.") != -1){
                $('shape').each(function() {
                    $( this ).css( {"filter": "alpha(opacity=" + that.opacity * 100 + ")"} );
                });
            }
        }
    }
});

r360.route360PolygonLayer = function () {
    return new r360.Route360PolygonLayer();
};