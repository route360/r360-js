if ( typeof L === 'object' ) {
    /*
     *
     */
    r360.LeafletPolygonLayer = L.Class.extend({

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
            this.opacity           = 0.4;
            this.strokeWidth       = 30;
            this.tolerance         = 15;
            this.extendWidthX      = this.strokeWidth / 2;
            this.extendWidthY      = this.strokeWidth / 2;
            this.backgroundColor   = "#000000";
            this.backgroundOpacity = 0.5;
            this.colors            = [
                { time : 300  , color : "#006837", opacity : 0.1 },
                { time : 600  , color : "#39B54A", opacity : 0.2 },
                { time : 900  , color : "#8CC63F", opacity : 0.3 },
                { time : 1200 , color : "#F7931E", opacity : 0.4 },
                { time : 1500 , color : "#F15A24", opacity : 0.5 },
                { time : 1800 , color : "#C1272D", opacity : 1.0 }
            ];

            // overwrite defaults with optional parameters
            if ( typeof options !== 'undefined' ) {

                if ( typeof options.colors         !== 'undefined') this.colors       = options.colors;
                if ( typeof options.opacity        !== 'undefined') this.opacity      = options.opacity;
                if ( typeof options.strokeWidth    !== 'undefined') this.strokeWidth  = options.strokeWidth;
                if ( typeof options.inverse        !== 'undefined') this.inverse      = options.inverse;
                if ( typeof options.tolerance      !== 'undefined') this.tolerance    = options.tolerance;
                if ( typeof options.extendWidthX   !== 'undefined') this.extendWidthX = options.extendWidthX;
                if ( typeof options.extendWidthY   !== 'undefined') this.extendWidthY = options.extendWidthY;
            }
        },

        /**
         * [setInverse Sets this layer to the inverse representation, meaning only reachable parts are displayed
         *     and the rest is greyed out.]
         * @param {type} inverse [true or false]
         */
        setInverse: function(inverse){
            this.inverse = inverse;
        },

        /**
         * @return {type} [returns the current state of this layer]
         */
        getInverse: function(){
            return this.inverse;
        },

        /**
         * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
         * @return {type} [description]
         */
        getBoundingBox3857 : function(){

            return this.multiPolygons[0] ? this.multiPolygons[0].getBoundingBox3857() : undefined;
        },

        /**
         * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
         * @return {type} [description]
         */
        getBoundingBox4326 : function(){

            return this.multiPolygons[0] ? this.multiPolygons[0].getBoundingBox4326() : undefined;
        },

        /*
         *
         */
        onAdd: function (map) {

            this.map = map;

            this.id = r360.Util.generateId();

            // create a DOM element with a unique ID to have multiple maps on one page
            this.element = L.DomUtil.create('div', 'r360-leaflet-polygon-layer-' + $(map._container).attr("id") + '-' + this.id + ' leaflet-zoom-hide');
            $(this.element).attr("id", "canvas" + $(this.map._container).attr("id") + '-' + this.id);
            $(this.element).css("position", "inherit");

            // we append the layer to the overlay pane at the last position
            this.map.getPanes().overlayPane.appendChild(this.element);

            // add a view redraw event listener for updating layer's position
            // zoom in/out, panning
            this.map.on('moveend', this.draw, this);

            // repaint layer
            this.draw();
        },

        /**
         * [fitMap adjust the map to fit the complete polygon with maximum zoom level]
         * @return {type} [description]
         */
        fitMap: function(options){

            // we have to transform the r360.latLngBounds to a L.latLngBounds since the map object
            // only knows the leaflet version
            var bounds = this.getBoundingBox4326();
            if (typeof bounds === 'undefined') return;

            var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

            this.map.fitBounds(L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})), options);
        },

        /**
         * [clearAndAddLayers clears the polygons from this layer and adds the new ones. If fitMap is not undefined wesvg
         *     also adjust the map bounds/zoom to show the polygons as big as possible.]
         * @param  {type} multiPolygons [description]
         * @return {type}                  [description]
         */
        clearAndAddLayers : function(multiPolygons, fitMap, options){

            this.clearLayers();
            this.addLayer(multiPolygons);

            if ( typeof fitMap !== 'undefined' && fitMap === true ) this.fitMap(options);

            if ( options && options.callback && typeof options.callback === "function" ) {

                this.map.addOneTimeEventListener('moveend', function(){

                    options.callback();
                });
            }

            return this;
        },

        /**
         * [addLayer description]
         * @param {type} multiPolygons [description]
         */
        addLayer : function(multiPolygons) {

            this.multiPolygons = multiPolygons;

            // paint them
            this.draw();
        },

        /**
         * [addTo Adds this layer to the given map]
         * @param {type} map [the leaflet map on which the layer should be drawn]
         */
        addTo: function (map) {

            map.addLayer(this);
            return this;
        },

        /**
         * [onRemove description]
         * @param  {type} map [description]
         * @return {type}     [description]
         */
        onRemove: function (map) {

            // remove layer's DOM elements and listeners
            map.getPanes().overlayPane.removeChild(this.element);
            map.off('viewreset', this.draw, this);
        },

        /**
         * [createSvgData Creates the SVG representation of a given polygon]
         * @param  {type} polygon [description]
         * @return {type}         [description]
         */
        createSvgData: function(polygon){

            var bounds = r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY);
            return r360.SvgUtil.createSvgData(polygon, {
                bounds      : bounds,
                scale       : Math.pow(2, this.map._zoom) * 256,
                tolerance   : this.tolerance,
                pixelOrigin : this.map.getPixelOrigin(),
                offset      : this.offset
            });
        },

        /**
         * [getMapPixelBounds description]
         * @return {type} [description]
         */
        getMapPixelBounds : function(){

            var bounds = this.map.getPixelBounds();
            return { max : { x : bounds.max.x, y : bounds.max.y }, min : { x : bounds.min.x, y : bounds.min.y } };
        },

        /**
         * [clearLayers Remove all child nodes of this layer from the DOM and initializes the layer.]
         */
        clearLayers: function(){

            this.multiPolygons = undefined;
            $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();
        },

        setStrokeWidth: function(strokeWidth){

            this.strokeWidth = strokeWidth;
        },

        setColors: function(colors) {

            this.colors = colors;

            if ( typeof this.multiPolygons == 'undefined' ) return;

            for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
                var multipolygon = this.multiPolygons[i];
                this.colors.forEach(function(colorSet) {
                    if (colorSet.time == multipolygon.getTravelTime()) {
                        multipolygon.setColor(colorSet.color);
                        multipolygon.setOpacity(colorSet.opacity);
                    }
                });
            }

            this.draw();
        },

        /*
         *
         */
        draw: function () {

            if ( typeof this.multiPolygons !== 'undefined' ) {

                this.extendWidthX = this.map.getSize().x * 1.8 - this.map.getSize().x ;
                this.extendWidthY = this.map.getSize().y * 1.8 - this.map.getSize().y ;

                this.svgWidth  = this.map.getSize().x + this.extendWidthX;
                this.svgHeight = this.map.getSize().y + this.extendWidthY;

                // calculate the offset in between map and svg in order to translate
                var svgPosition    = $('#svg_'+ $(this.map._container).attr("id") + '-' + this.id).offset();
                var mapPosition    = $(this.map._container).offset();

                if ( typeof this.offset == 'undefined' )
                    this.offset = { x : 0 , y : 0 };

                // adjust the offset after map panning / zooming
                if ( svgPosition ) {
                    this.offset.x += (mapPosition.left - svgPosition.left) - this.extendWidthX / 2;
                    this.offset.y += (mapPosition.top - svgPosition.top)   - this.extendWidthY / 2;
                }

                // clear layer from previous drawings
                $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).empty();

                var gElements = [];

                // go through each multipolygon (represents each travel time)
                for ( var i = 0 ; i < this.multiPolygons.length ;  i++){

                    var multiPolygon = this.multiPolygons[i], svgData = [];

                    // add each polygon for the given travel time
                    for ( var j = 0; j < multiPolygon.polygons.length; j++)
                        svgData.push(this.createSvgData(multiPolygon.polygons[j]));

                    if ( svgData.length !== 0 )
                        gElements.push(r360.SvgUtil.getGElement(svgData, {
                            color             : !this.inverse ? this.getColor(multiPolygon) : 'black',
                            opacity           : !this.inverse ? 1 : this.getOpacity(multiPolygon),
                            strokeWidth       : this.strokeWidth
                        }));
                }

                var options = {
                    id                : $(this.map._container).attr("id") + '-' + this.id,
                    offset            : this.offset,
                    svgHeight         : this.svgHeight,
                    svgWidth          : this.svgWidth,
                    backgroundColor   : this.backgroundColor,
                    backgroundOpacity : this.backgroundOpacity,
                    opacity           : this.opacity,
                    strokeWidth       : this.strokeWidth
                };

                // add the svg string to the container
                $('#canvas'+ $(this.map._container).attr("id") + '-' + this.id).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options)
                                                                                     : r360.SvgUtil.getInverseSvgElement(gElements, options));
            }
        },

        getColor: function(multiPolygon) {

            var color = "#000000";

            this.colors.forEach(function(colorSet) {
                if (colorSet.time == multiPolygon.getTravelTime() && r360.has(colorSet, 'color')) {
                    color = colorSet.color;
                }
            });

            return color;
        },

        getOpacity: function(multiPolygon) {

            var opacity = 1.0;

            this.colors.forEach(function(colorSet) {
                if (colorSet.time == multiPolygon.getTravelTime() && r360.has(colorSet, 'opacity')) {
                    opacity = colorSet.opacity;
                }
            });

            return opacity;
        },

        // fix for leaflet 1.0
        _layerAdd: function(options) {
            this.onAdd(options.target);
     	}
    });

    r360.leafletPolygonLayer = function (options) {
        return new r360.LeafletPolygonLayer(options);
    };
}