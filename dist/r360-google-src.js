/*
 Route360° JavaScript API v0.2.1 ("902dc64"), a JS library for leaflet maps. http://route360.net
 (c) 2014 Henning Hollburg and Daniel Gerber, (c) 2014 Motion Intelligence GmbH
*/
if ( window.google ) {

    GoogleMapsPolygonLayer.prototype = new google.maps.OverlayView();

    function GoogleMapsPolygonLayer(map, options) {

        // set default parameters
        this.map               = map;
        this.id                = this.map.getDiv().id;
        this.inverse           = false;
        this.topRight          = { lat : -90, lng : -180 };
        this.bottomLeft        = { lat : +90, lng : +180 };
        this.opacity           = r360.config.defaultPolygonLayerOptions.opacity;
        this.strokeWidth       = r360.config.defaultPolygonLayerOptions.strokeWidth;
        this.backgroundColor   = r360.config.defaultPolygonLayerOptions.backgroundColor,
        this.backgroundOpacity = r360.config.defaultPolygonLayerOptions.backgroundOpacity,
        this.tolerance         = r360.config.defaultPolygonLayerOptions.tolerance;
        this.extendWidthX      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;
        this.extendWidthY      = r360.config.defaultPolygonLayerOptions.strokeWidth / 2;

        // overwrite defaults with optional parameters
        if ( typeof options != 'undefined' ) {

            if ( typeof options.opacity        != 'undefined') this.opacity      = options.opacity;
            if ( typeof options.strokeWidth    != 'undefined') this.strokeWidth  = options.strokeWidth;
            if ( typeof options.inverse        != 'undefined') this.inverse      = options.inverse;
            if ( typeof options.tolerance      != 'undefined') this.tolerance    = options.tolerance;
            if ( typeof options.extendWidthX   != 'undefined') this.extendWidthX = options.extendWidthX;
            if ( typeof options.extendWidthY   != 'undefined') this.extendWidthY = options.extendWidthY;
        }

        // the div element containing all the data
        this.element  = null;
        // this triggers the draw method
        this.setMap(this.map);
        // add the listeners for drag end zoom events
        this.addListener();
    }

    /**
     * onAdd is called when the map's panes are ready and the overlay has been
     * added to the map.
     */
    GoogleMapsPolygonLayer.prototype.onAdd = function() {

        // create the dom elemenet which hols old the svgs
        this.element    = document.createElement('div');
        this.element.id = 'r360-googlemaps-polygon-layer-canvas-in-' + this.id;

        // Add the element to the "overlayLayer" pane.
        this.getPanes().overlayLayer.appendChild(this.element);  
    };

    GoogleMapsPolygonLayer.prototype.getMapPixelBounds = function(){

        var bottomLeft = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getBounds().getSouthWest(), this.map.getZoom());
        var topRight   = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getBounds().getNorthEast(), this.map.getZoom());

        return { max : { x : topRight.x, y : bottomLeft.y }, min : { x : bottomLeft.x, y : topRight.y } }; 
    };

    GoogleMapsPolygonLayer.prototype.getPixelOrigin = function(){

        var viewHalf = r360.PolygonUtil.divide({ x : this.map.getDiv().offsetWidth, y : this.map.getDiv().offsetHeight }, 2);
        var center = r360.GoogleMapsUtil.googleLatlngToPoint(this.map, this.map.getCenter(), this.map.getZoom());
        
        return r360.PolygonUtil.roundPoint(r360.PolygonUtil.subtract(center, viewHalf.x, viewHalf.y));
    };

    /**
     * [getBoundingBox3857 returns a boundingbox (in web mercator) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.getBoundingBox3857 = function(){

        return this.multiPolygons[0].getBoundingBox3857();
    },

    /**
     * [getBoundingBox4326 returns a boundingbox (in wgs84) from the left bottom to the top right of this layer]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.getBoundingBox4326 = function(){

        return this.multiPolygons[0].getBoundingBox4326();
    },


    GoogleMapsPolygonLayer.prototype.setInverse = function(inverse){

        if ( this.inverse != inverse ) {

            this.inverse = inverse;
            this.draw();
        }
    };

    GoogleMapsPolygonLayer.prototype.createSvgData = function(polygon){

        var svg = r360.SvgUtil.createSvgData(polygon, { 
            bounds      : r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY), 
            scale       : Math.pow(2, this.map.getZoom()) * 256, 
            tolerance   : this.tolerance, 
            pixelOrigin : this.getPixelOrigin(),  
            offset      : {x:0,y:0}
        });

        return svg;
    };

    /**
     * [fitMap adjust the map to fit the complete polygon with maximum zoom level]
     * @return {[type]} [description]
     */
    GoogleMapsPolygonLayer.prototype.fitMap = function(){

        // we have to transform the r360.latLngBounds to google maps bounds since the map object
        // only knows the leaflet version
        var bounds = this.getBoundingBox4326();
        var sw = bounds.getSouthWest(), ne = bounds.getNorthEast();

        var gmBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(sw.lat, sw.lng),
            new google.maps.LatLng(ne.lat, ne.lng));

        this.map.fitBounds(gmBounds);
    };

    GoogleMapsPolygonLayer.prototype.draw = function(test) {

        if ( typeof this.multiPolygons !== 'undefined' && this.element != null ) {
                 
            this.svgWidth  = this.map.getDiv().offsetWidth;
            this.svgHeight = this.map.getDiv().offsetHeight;

            // calculate the offset in between map and svg in order to translate
            var svgPosition    = $('#svg_' + this.id).offset();
            var mapPosition    = $(this.map.getDiv()).offset();

            if ( typeof this.offset == 'undefined' )
                this.offset = { x : 0 , y : 0 };

            // adjust the offset after map panning / zooming
            if ( typeof svgPosition != 'undefined' ) {
                this.offset.x += (mapPosition.left - svgPosition.left);
                this.offset.y += (mapPosition.top  - svgPosition.top);
            }

            // clear layer from previous drawings
            $('#'+ this.element.id).empty();

            var gElements = [];  
            
            // go through each multipolygon (represents each travel time)
            for ( var i = 0 ; i < this.multiPolygons.length ;  i++){
                
                var multiPolygon = this.multiPolygons[i], svgData = [];

                // add each polygon for the given travel time
                for ( var j = 0; j < multiPolygon.polygons.length; j++) 
                    svgData.push(this.createSvgData(multiPolygon.polygons[j]));

                if ( svgData.length != 0 ) 
                    gElements.push(r360.SvgUtil.getGElement(svgData, {
                        color             : !this.inverse ? multiPolygon.getColor() : 'black',
                        opacity           : !this.inverse ? 1                       : multiPolygon.getOpacity(),
                        strokeWidth       : this.strokeWidth
                    })); 
            }

            var options = {
                id                : this.id,
                offset            : this.offset,
                svgHeight         : this.svgHeight,
                svgWidth          : this.svgWidth,
                backgroundColor   : this.backgroundColor,
                backgroundOpacity : this.backgroundOpacity,
                opacity           : this.opacity,
                strokeWidth       : this.strokeWidth
            }

            // add the svg string to the container
            $('#'+ this.element.id).append(!this.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options) 
                                                         : r360.SvgUtil.getInverseSvgElement(gElements, options));
        }
    };

    GoogleMapsPolygonLayer.prototype.update = function(multiPolygons){

        this.multiPolygons = multiPolygons;
        this.draw();
    };

    GoogleMapsPolygonLayer.prototype.addListener = function() {

        var map = this.map;
        var that = this;

        google.maps.event.addListener(map, 'zoom_changed', function () {
            that.onRemove();
            google.maps.event.addListenerOnce(map, 'idle', function () {
                that.draw();
            });
        });

        google.maps.event.addListener(map, 'dragend', function () {
            google.maps.event.addListenerOnce(map, 'idle', function () {
                that.draw();
            });
        });

        google.maps.event.addDomListener(window, "resize", function() {
            google.maps.event.trigger(map, "resize");
            that.draw();
        });
    };

    // The onRemove() method will be called automatically from the API if
    // we ever set the overlay's map property to 'null'.
    GoogleMapsPolygonLayer.prototype.onRemove = function() {
        $('#' + this.element.id).empty();
    };
}

r360.GoogleMapsUtil = {

    /**
    * @param {google.maps.Map} map
    * @param {google.maps.LatLng} latlng
    * @param {int} z
    * @return {google.maps.Point}
    */
    googleLatlngToPoint : function(map, latlng, z){
        var normalizedPoint = map.getProjection().fromLatLngToPoint(latlng); // returns x,y normalized to 0~255
        var scale = Math.pow(2, z);
        return new google.maps.Point(normalizedPoint.x * scale, normalizedPoint.y * scale); 
    },

    /**
    * @param {google.maps.Map} map
    * @param {google.maps.Point} point
    * @param {int} z
    * @return {google.maps.LatLng}
    */
     googlePointToLatlng : function(map, point, z){
        var scale = Math.pow(2, z);
        var normalizedPoint = new google.maps.Point(point.x / scale, point.y / scale);
        var latlng = map.getProjection().fromPointToLatLng(normalizedPoint);
        return latlng; 
    }
};

