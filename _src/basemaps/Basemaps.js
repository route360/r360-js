/*
*
*/
r360.basemapsLookup = {
    'bright': 'osm-bright-gl-style',
    'light': 'positron-gl-style',
    'dark': 'dark-matter-gl-style',
    'blues': 'fiord-color-gl-style',
    'basic': 'klokantech-basic-gl-style'
};

/**
 * [r360.getBasemapList returns an array of Route360 basemap names. ]
 * @return {basemapList} Array [returns array of basemaps names]
 */
r360.getBasemapList = function () {
    return Object.keys(r360.basemapsLookup);
};

/**
 * [r360.getGLStyle returns style url for mapbox-gl style. ]
 * @param  {stylename} String [accepts string of valid Route360 style name]
 * @param  {apikey} String    [accepts string of Route360 apikey]
 * @return {styleUrl} String  [returns url for mapbox-gl style]
 */
r360.getGLStyle = function (stylename, apikey) {
    if (!stylename && !r360.basemapsLookup[stylename]) {
        throw new Error('valid style name required to access Route360 basemap');
    }
    if (!apikey) {
        throw new Error('apikey required to access Route360 basemaps');
    }

    return 'https://maps.route360.net/styles/' + r360.basemapsLookup[stylename] + '.json?key=' + apikey
};