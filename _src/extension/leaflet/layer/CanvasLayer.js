if ( typeof L === 'object' ) {

    CanvasLayer = L.Class.extend({

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
            'use strict';
            this.items = [];
            var that = this;

            that.mapZoomPowerLookup = [];

            for(var i = 0; i < 25; i++){
                that.mapZoomPowerLookup[i] = Math.pow(2, i) * 256;
            }
        },


        getItemBelowCursor : function(items, event){
            var that = this;
            for(i = 0; i < items.length; i++){
                if(that.containedByCanvas(items[i].currentPixel)){

                    // console.log("containedByCanvas")
                    if(that.containedByIcon(items[i], event)){

                        return items[i];
                    }
                }
            }
            return null;
        },

        containedByCanvas : function(pixel){

            if ( pixel.x >= 0 && pixel.x <= this.canvasWidth )
                if ( pixel.y >= 0 && pixel.y <= this.canvasHeight )
                    return true;

            return false;
        },

        containedByIcon : function(item, event){

            var newPageX = event.pageX - this.mapPosition.left;
            var newPageY = event.pageY - this.mapPosition.top;

            var diffX = newPageX - item.currentPixel.x;
            var diffY = newPageY - item.currentPixel.y;

            var ringSizes = this.getRingSizesByZoom(item.icon, this.map._zoom);

            if ( diffX > -ringSizes.outerRing )
                if( diffY > -ringSizes.outerRing )
                    if ( diffX < ringSizes.outerRing + 12 )
                        if( diffY < ringSizes.outerRing + 12)
                            return true;

            return false;
        },

        /**
         * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
         * @return {type} [description]
         */
        getBoundingBox3857 : function(){

        },

        /**
         * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
         * @return {type} [description]
         */
        getBoundingBox4326 : function(){

        },

        /*
         *
         */
        onAdd: function (map) {

            var that = this;
            that.map = map;
            that.id  = $(that.map._container).attr("id") + "_" + r360.Util.generateId();
            that.elementId = 'r360-leaflet-canvas-poi-layer-' + that.id + ' leaflet-zoom-hide';
            that.poiCanvasId = "poi-canvas" + that.id;
            that.poiMarkerClickId = "poi_marker_click_" + that.id;
            that.poiMarkerHoverId = "poi_marker_hover_" + that.id;
            that.markerMainCanvasId = "canvas_"+ that.id;

            // create a DOM element with a unique ID to have multiple maps on one page
            that.element = L.DomUtil.create('div', that.elementId);
            $(that.element).attr("id",  that.poiCanvasId);

            // we append the layer to the overlay pane at the last position
            that.map.getPanes().overlayPane.appendChild(that.element);

            // add a view redraw event listener for updating layer's position
            // zoom in/out, panning
            that.map.on('moveend', that.redraw, that);

            $( "#" + $(that.map._container).attr("id") ).on( "mousemove", function( event ) {
                that.clearMarkerHover();
                $('.leaflet-overlay-pane').attr("style", "cursor: move; cursor: grab; cursor:-moz-grab; cursor:-webkit-grab;");
                var item = that.getItemBelowCursor(that.items, event);
                if(item !== null){
                    item.onHover();
                    $('.leaflet-overlay-pane').css('cursor', 'pointer');
                    that.drawMarkerHover(item);
                }
            });

            $( "#" + $(that.map._container).attr("id") ).on( "click", function( event ) {

                // console.log("click");
                that.clearMarkerHover();
                var item = that.getItemBelowCursor(that.items, event);
                if(item !== null){
                    item.onClick();
                    that.drawMarkerClick(item);
                }
            });

            that.resetCanvas();
        },

        /**
         *Not sure we need this
         */
        fitMap: function(options){

            // we have to transform the r360.latLngBounds to a L.latLngBounds since the map object
            // only knows the leaflet version
            var bounds = this.getBoundingBox4326();
            var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

            this.map.fitBounds(
                L.latLngBounds(L.latLng({ lat : sw.lat, lng : sw.lng}), L.latLng({ lat : ne.lat, lng : ne.lng})), options);
        },

        /**
         * here should be a method that clears the canvas
         maybe we dont evcen need this
         */
        clearAndAddLayers : function(multiPolygons, fitMap, options){

            this.clearLayers();
            return this;
        },

        /**
         * [addLayer description]
         * @param {type} multiPolygons [description]
         */


        addItem : function(item){
            this.items.push(item);

            item.coordinate  = r360.Util.webMercatorToLeaflet(item.point);

            this.draw(item);
        },

        addLatLngItem: function(item) {

            var p = r360.Util.latLngToWebMercator(item.point);
            p.x /= 6378137;
            p.y /= 6378137;

            this.items.push(item);
            item.coordinate = r360.Util.webMercatorToLeaflet(p);

            this.draw(item);

            return item;
        },


        addLayer : function(poiSet) {

            this.poiSet = poiSet;
            var that = this;

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
            $('#poi-canvas'+ $(this.map._container).attr("id")).empty();
        },


        getRingSizesByZoom: function(icon, zoomLevel){

            var ringSizes = {};

            // console.log(icon);

            icon.sizes.forEach(function(size) {
                if ( zoomLevel <= size.toZoom && zoomLevel >= size.fromZoom ) {
                    ringSizes.outerRing = size.outerRing;
                    ringSizes.innerRing = size.innerRing;
                }
            });

            return ringSizes;
        },

        drawRingIcon: function(ctx, icon, pixel){

            var ringSizes = this.getRingSizesByZoom(icon, this.map._zoom);

            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, ringSizes.outerRing, 0, 2 * Math.PI, false);
            ctx.fillStyle = icon.strokeStyle;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(pixel.x, pixel.y, ringSizes.innerRing, 0, 2 * Math.PI, false);
            ctx.fillStyle = icon.fillStyle;
            ctx.fill();
        },


        drawMarkerHover: function(item){
            var c = document.getElementById(this.poiMarkerHoverId);
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.drawRingIcon(ctx, item.hoverIcon, item.currentPixel);
        },

        drawMarkerClick: function(item){
            var c = document.getElementById(this.poiMarkerClickId);
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.drawRingIcon(ctx, item.clickIcon, item.currentPixel);
        },

        clearMarkerHover: function(){
            var c = document.getElementById(this.poiMarkerHoverId);
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        },

        clearMarkerClick: function(){
            var c = document.getElementById(this.poiMarkerClickId);
            var ctx = c.getContext("2d");
            ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        },


        getCanvas: function(width, height, zIndex, id) {
          var canvas = '<canvas id="' + id + '" width="' + width + '" height="' + height + '" style="position:absolute; top:0px; left:0px; z-index: ' + zIndex + ';"></canvas>';
          return canvas;
        },

        draw: function(item){

            var point       = r360.PolygonUtil.scale(item.coordinate, this.mapZoomPowerLookup[this.map._zoom]);
            var pixel       = {x: parseInt(point.x - this.origin.x - this.offset.x), y : parseInt(point.y - this.origin.y - this.offset.y)};

            item.currentPixel = pixel;

            if(this.containedByCanvas(pixel)){
                 if(this.arr[pixel.x + ";" + pixel.y] !== true){
                    this.drawRingIcon(this.mainMarcerCanvasCtx, item.icon, pixel);
                    this.arr[pixel.x + ";" + pixel.y] = true;
                }
            }
        },


        updateOffset: function(){

            // calculate the offset in between map and svg in order to translate
            var canvasPosition    = $('#canvas_div_' + this.id + '').offset();
            this.mapPosition      = $(this.map._container).offset();

            if ( typeof this.offset == 'undefined' )
                this.offset = { x : 0 , y : 0 };

            // adjust the offset after map panning / zooming
            if ( canvasPosition ) {
                this.offset.x += (this.mapPosition.left - canvasPosition.left);
                this.offset.y += (this.mapPosition.top - canvasPosition.top);
            }
        },


        resetCanvas: function(){

            var that = this;

            this.canvasWidth  = this.map.getSize().x;
            this.canvasHeight = this.map.getSize().y;

            this.updateOffset();

            // clear layer from previous drawings
            $('#' + this.poiCanvasId).empty();

            var translation = r360.Util.getTranslation(this.offset);

            var markerClickCanvas = this.getCanvas(this.canvasWidth, this.canvasHeight, 20, this.poiMarkerClickId);
            var markerHoverCanvas = this.getCanvas(this.canvasWidth, this.canvasHeight, 10, this.poiMarkerHoverId);
            var markerMainCanvas  = this.getCanvas(this.canvasWidth, this.canvasHeight, 0, this.markerMainCanvasId);

            var canvas_div_id = "canvas_div_" + that.id;

            // add the canvas string to the container
            $('#'+ this.poiCanvasId).append(
              '<div id='+ canvas_div_id + ' style="' + translation + '">' +
                markerClickCanvas + markerHoverCanvas + markerMainCanvas +
              '</div>');
            this.updateOffset();

            c = document.getElementById(this.markerMainCanvasId);
             if (c !== null)
                this.mainMarcerCanvasCtx = c.getContext("2d");

            this.arr = [];

            this.origin = this.map.getPixelOrigin();
        },


        /*
         *
         */
        redraw: function(){

            that = this;
            that.resetCanvas();
            that.items.forEach(function(item){
                that.draw(item);
            });
        }
    });
}