r360.waitControl = function (options) {
    return new L.Control.WaitControl(options);
};

L.Control.WaitControl = L.Control.extend({
    
    options: {
        position : 'topleft'
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this.options.map = map;
        this.options.mapId = $(map._container).attr("id");
       
        var waitContainer = L.DomUtil.create('div', 'leaflet-control-wait');
        $(waitContainer).append(
            '<div id="wait-control-'+this.options.mapId+'" class="mi-box waitControl"> \
                <i class="fa fa-spinner fa-spin"></i> '+ (typeof this.options.text != 'undefined' ? this.options.text : r360.config.i18n.get('wait') ) +  '\
            </div>');

        return waitContainer;
    },

    updateText : function(html) {

        $('#wait-control-'+this.options.mapId).html('<i class="fa fa-spinner fa-spin"></i> ' + html);
        $("span[lang][lang!='"+r360.config.i18n.language+"']").hide();
    },

    show : function(){

        $('#wait-control-'+this.options.mapId).show();
    },

    hide : function(){
        
        $('#wait-control-'+this.options.mapId).hide();  
    }
});