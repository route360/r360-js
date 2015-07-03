/*
 *
 */
r360.LeafletUtil = {

    /*
     * Convenients method to generate a Leaflet marker with the 
     * specified marker color. For available colors look at 'dist/images'
     * 
     * @method getMarker
     * @param {Object} [latlon] The coordinate
     * @param {Number} [latlon.lat] The latitude of the coordinate.
     * @param {Number} [latlon.lng] The longitude of the coordinate.
     * @param {Object} [options] The options for the marker
     * @param {Number} [options.color] The color for the marker icon.
     */
    getMarker : function(latlng, options){

        var color = _.has(options, 'color') ? '-' + options.color : '-blue';

        options.icon = L.icon({
            iconSize     : [25, 41], // size of the icon
            iconUrl      : options.iconPath + 'marker-icon' + color + '.png',
            iconAnchor   : [12, 41], // point of the icon which will correspond to marker's location
            
            shadowSize   : [41, 41], // size of the shadow
            shadowUrl    : options.iconPath + 'marker-shadow.png',
            shadowAnchor : [41 / 3, 41], // point of the shadow which will correspond to marker's location
            
            popupAnchor  : [0, -35]  // point from which the popup should open relative to the iconAnchor
        });

        return L.marker(latlng, options);
    },
};