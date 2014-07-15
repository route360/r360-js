r360.htmlControl = function (options) {
    return new L.Control.HtmlControl(options);
};

L.Control.HtmlControl = L.Control.extend({
    
    options: {
        position: 'topleft',
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {

        // in case of multiple maps per page
        this.options.id  = $(map._container).attr("id") + r360.Util.generateId();
       
        var htmlContainer = L.DomUtil.create('div', 'leaflet-control-html');
        $(htmlContainer).append('<div id="html-control-'+this.options.id+'" class="html-control '+ this.options.classes +'"></div>');

        $(htmlContainer).on('mouseover', function(){ map.scrollWheelZoom.disable(); });
        $(htmlContainer).on('mouseout' , function(){ map.scrollWheelZoom.enable(); });      

        return htmlContainer;
    },

    setHtml : function(html) {
        $('#html-control-'+this.options.id).html(html);        
    },

    show : function(){

        $('#html-control-'+this.options.id).show();
    },

    hide : function(){
        
        $('#html-control-'+this.options.id).hide();  
    }
});