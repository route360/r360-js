if ( typeof L === 'object' ) {
    /*
     *
     */
    r360.Basemap = L.TileLayer.extend({
        options: {
            minZoom: 2,
            maxZoom: 18,
            style: 'bright',
            attribution: '<a href=\"https://route360.net/\" target=\"_blank\">&copy; Route360&deg;</a> <a href=\"http://openmaptiles.org/\" target=\"_blank\">&copy; OpenMapTiles</a> <a href=\"http://www.openstreetmap.org/about/\" target=\"_blank\">&copy; OpenStreetMap contributors</a>',
            apikey: 'your-r360-apikey',
        },


        initialize: function initialize(options) {
            if (r360.basemapsLookup[options.style]){
                options.styleName = r360.basemapsLookup[options.style]
            } else {
                options.styleName = 'osm-bright-gl-style'
            }

            options = L.setOptions(this, options);

            var tileUrl = 'https://maps.route360.net/styles/{styleName}/rendered/{z}/{x}/{y}.png?key={apikey}';

            L.TileLayer.prototype.initialize.call(this, tileUrl, options);
        },

        onAdd: function onAdd(map) {
            L.TileLayer.prototype.onAdd.call(this, map);
        },

        onRemove: function onRemove(map) {
            L.TileLayer.prototype.onRemove.call(this, map);
        }
    });

    r360.basemapsLookup = {
        'bright': 'osm-bright-gl-style',
        'light': 'positron-gl-style',
        'dark': 'dark-matter-gl-style',
        'blues': 'fiord-color-gl-style',
        'basic': 'klokantech-basic-gl-style'
    }

    r360.getBasemaps = function() {
        return Object.keys(r360.basemapsLookup);
    }

    r360.basemap = function(opts){
        return new r360.Basemap(opts);
    }
}