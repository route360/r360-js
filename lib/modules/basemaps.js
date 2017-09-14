"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var basemapsLookup = {
    'bright': 'osm-bright-gl-style',
    'light': 'positron-gl-style',
    'dark': 'dark-matter-gl-style',
    'blues': 'fiord-color-gl-style',
    'basic': 'klokantech-basic-gl-style'
};
/**
 * [getBasemapList returns an array of basemap names. ]
 * @return {basemapList} Array [returns array of basemaps names]
 */
function getBasemapList() {
    return Object.keys(basemapsLookup);
}
exports.getBasemapList = getBasemapList;
;
/**
 * [getGLStyle returns style url for mapbox-gl style. ]
 * @param  {stylename} String [accepts string of valid style name]
 * @param  {apikey} String    [accepts string of apikey]
 * @return {styleUrl} String  [returns url for mapbox-gl style]
 */
function getGLStyle(stylename, apikey) {
    if (!stylename && !basemapsLookup[stylename]) {
        throw new Error('valid style name required to access basemaps');
    }
    if (!apikey) {
        throw new Error('apikey required to access Route360 basemaps');
    }
    return "" + config_1.serviceUrls.basemapStyleUrl + basemapsLookup[stylename] + ".json?key=" + apikey;
}
exports.getGLStyle = getGLStyle;
;
//# sourceMappingURL=basemaps.js.map