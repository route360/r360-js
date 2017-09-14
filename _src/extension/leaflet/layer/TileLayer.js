if (typeof L === 'object') {

    /*
     *
     */
    r360.Basemap = L.TileLayer.extend({

        options: {
            minZoom: 2,
            maxZoom: 18,
            style: 'bright',
            attribution: '<a href=\"https://route360.net/\" target=\"_blank\">&copy; Route360&deg;</a> <a href=\"http://openmaptiles.org/\" target=\"_blank\">&copy; OpenMapTiles</a> <a href=\"http://www.openstreetmap.org/about/\" target=\"_blank\">&copy; OpenStreetMap contributors</a>',
            apikey: null,
        },

        initialize: function initialize(options) {
            if (!options.apikey) {
                throw new Error('apikey required to access Route360 basemaps');
            }

            options.styleName = r360.basemapsLookup[options.style] ? r360.basemapsLookup[options.style] : 'osm-bright-gl-style'

            options = L.setOptions(this, options);

            var tileUrl = 'https://maps.route360.net/styles/{styleName}/rendered/{z}/{x}/{y}.png?key={apikey}';

            L.TileLayer.prototype.initialize.call(this, tileUrl, options);
        }

    });

    /**
     * [r360.basemap returns a tilelayer for one of the r360 basemap styles. ]
     * @param  {options} L.TileLayer.options [accepts standard L.TileLayer options, with the addition of 'style' and 'apikey' keys]
     * @return {r360.Basemap} L.TileLayer    [returns new L.TileLayer instance of Route360 basemap]
     */
    r360.basemap = function (options) {
        return new r360.Basemap(options);
    };

    /**
     * [r360.basemaps returns a object of tilelayers for the r360 basemap styles. ]
     * @param  {apikey} String                [accepts string of Route360 apikey]
     * @return {basemaps} Object              [returns object of Route360 basemaps, ready to be fed to L.control.layers]
     */
    r360.basemaps = function (apikey) {
        return Object.keys(r360.basemapsLookup).reduce(function (acc, cur, i) {
            acc[cur] = r360.basemap({ style: cur, apikey: apikey });
            return acc;
        }, {});
    };

}