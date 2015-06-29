
GoogleMapsPolygonLayer.prototype = new google.maps.OverlayView();

function GoogleMapsPolygonLayer(map, polygons, options) {

    // set default parameters
    this.map               = map;
    this.id                = this.map.getDiv().id
    this.inverse           = false;
    this.topRight          = { lat : -90, lng : -180 };
    this.bottomLeft        = { lat : -90, lng : +180 };
    this.multiPolygons     = r360.PolygonUtil.prepareMultipolygons(polygons, this.topRight, this.bottomLeft);
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

    var bottomLeft = r360.Util.googleLatlngToPoint(this.map, this.map.getBounds().getSouthWest(), this.map.getZoom());
    var topRight   = r360.Util.googleLatlngToPoint(this.map, this.map.getBounds().getNorthEast(), this.map.getZoom());

    return { max : { x : topRight.x, y : bottomLeft.y }, min : { x : bottomLeft.x, y : topRight.y } }; 
};

GoogleMapsPolygonLayer.prototype.getPixelOrigin = function(){

    var viewHalf = r360.PolygonUtil.divide({ x : this.map.getDiv().offsetWidth, y : this.map.getDiv().offsetHeight }, 2);
    var center = r360.Util.googleLatlngToPoint(this.map, this.map.getCenter(), this.map.getZoom());
    
    return r360.PolygonUtil.roundPoint(r360.PolygonUtil.subtract(center, viewHalf.x, viewHalf.y));
};

GoogleMapsPolygonLayer.prototype.setInverse = function(inverse){

    console.log('inverse');
    if ( this.inverse != inverse ) {

        this.inverse = inverse;
        this.draw();
    }
};

GoogleMapsPolygonLayer.prototype.createSvgData = function(polygon){

    var pixelBounds = r360.PolygonUtil.extendBounds(this.getMapPixelBounds(), this.extendWidthX, this.extendWidthY);

    var svg = r360.SvgUtil.createSvgData(polygon, { 
        bounds      : pixelBounds, 
        scale       : Math.pow(2, this.map.getZoom()) * 256, 
        tolerance   : this.tolerance, 
        pixelOrigin : this.getPixelOrigin(),  
        offset      : this.offset
    });

    return svg;
};

GoogleMapsPolygonLayer.prototype.draw = function() {

    var that = this;

    setTimeout(function(){
        
   

    if ( that.multiPolygons.length > 0 ) {
             
        that.svgWidth  = that.map.getDiv().offsetWidth;
        that.svgHeight = that.map.getDiv().offsetHeight;

        // always place the layer in the top left corner. Later adjustments will be made by svg translate 
        r360.DomUtil.setPosition(that.element, { x : 0 , y : 0 });

        // calculate the offset in between map and svg in order to translate
        var svgPosition    = $('#svg_' + that.id).offset();
        var mapPosition    = $(that.map.getDiv()).offset();

        if ( typeof that.offset == 'undefined' )
            that.offset = { x : 0 , y : 0 };

        // adjust the offset after map panning / zooming
        if ( typeof svgPosition != 'undefined' ) {
            that.offset.x += (mapPosition.left - svgPosition.left);
            that.offset.y += (mapPosition.top  - svgPosition.top);
        }

        // $('#'+ this.element.id).attr("style", r360.Util.getTranslation(this.offset));

        console.log("google svg position: ", svgPosition);
        console.log("google map position: ", mapPosition);
        console.log("google off position: ", that.offset);
        console.log()

        // clear layer from previous drawings
        $('#'+ that.element.id).empty();

        var gElements = [];  
        
        // go through each multipolygon (represents each travel time)
        for ( var i = 0 ; i < that.multiPolygons.length ;  i++){
            
            var multiPolygon = that.multiPolygons[i], svgData = [];

            // add each polygon for the given travel time
            for ( var j = 0; j < multiPolygon.polygons.length; j++) 
                svgData.push(that.createSvgData(multiPolygon.polygons[j]));

            if ( svgData.length != 0 ) 
                gElements.push(r360.SvgUtil.getGElement(svgData, {
                    color             : !that.inverse ? multiPolygon.getColor() : 'black',
                    opacity           : !that.inverse ? 1                       : multiPolygon.getOpacity(),
                    strokeWidth       : that.strokeWidth
                })); 
        }

        var options = {
            id                : that.id,
            offset            : that.offset,
            svgHeight         : that.svgHeight,
            svgWidth          : that.svgWidth,
            backgroundColor   : that.backgroundColor,
            backgroundOpacity : that.backgroundOpacity,
            opacity           : that.opacity,
            strokeWidth       : that.strokeWidth
        }

        // add the svg string to the container
        $('#'+ that.element.id).append(!that.inverse ? r360.SvgUtil.getNormalSvgElement(gElements, options) 
                                                     : r360.SvgUtil.getInverseSvgElement(gElements, options));
    }

     }, 300);
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
GoogleMapsPolygonLayer.prototype.onRemove = function() {
    $('#' + this.element.id).empty();
};
