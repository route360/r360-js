/*!
 * 
 *     Route360° JavaScript API "1.0.0", a JS library for leaflet & google maps. http://route360.net
 *     (c) 2017 Henning Hollburg, Daniel Gerber, Jan Silbersiepe, Manuel Tomis, Adam Roberts
 *     (c) 2017 Motion Intelligence GmbH
 *     
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("r360", [], factory);
	else if(typeof exports === 'object')
		exports["r360"] = factory();
	else
		root["r360"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaults = {
    serviceVersion: 'v1',
    pathSerializer: 'compact',
    requestTimeout: 10000,
    maxRoutingTime: 3600,
    maxRoutingLength: 100000,
    bikeSpeed: 15,
    bikeUphill: 20,
    bikeDownhill: -10,
    walkSpeed: 5,
    walkUphill: 10,
    walkDownhill: 0,
    travelTimes: [300, 600, 900, 1200, 1500, 1800],
    travelType: "walk",
    logging: false,
    rushHour: false,
    // options for the travel time slider; colors and lengths etc.
    defaultTravelTimeControlOptions: {
        travelTimes: [
            { time: 300, color: "#006837", opacity: 0.1 },
            { time: 600, color: "#39B54A", opacity: 0.2 },
            { time: 900, color: "#8CC63F", opacity: 0.3 },
            { time: 1200, color: "#F7931E", opacity: 0.4 },
            { time: 1500, color: "#F15A24", opacity: 0.5 },
            { time: 1800, color: "#C1272D", opacity: 1.0 }
        ],
        position: 'topright',
        label: 'travel time',
        initValue: 30
    },
    routeTypes: [
        // non transit
        { routeType: 'WALK', color: "red", haloColor: "white" },
        { routeType: 'BIKE', color: "#558D54", haloColor: "white" },
        { routeType: 'CAR', color: "#558D54", haloColor: "white" },
        { routeType: 'TRANSFER', color: "#C1272D", haloColor: "white" },
        // berlin
        { routeType: 102, color: "#006837", haloColor: "white" },
        { routeType: 400, color: "#156ab8", haloColor: "white" },
        { routeType: 900, color: "red", haloColor: "white" },
        { routeType: 700, color: "#A3007C", haloColor: "white" },
        { routeType: 1000, color: "blue", haloColor: "white" },
        { routeType: 109, color: "#006F35", haloColor: "white" },
        { routeType: 100, color: "red", haloColor: "white" },
        // new york      
        { routeType: 1, color: "red", haloColor: "red" },
        { routeType: 2, color: "blue", haloColor: "blue" },
        { routeType: 3, color: "yellow", haloColor: "yellow" },
        { routeType: 0, color: "green", haloColor: "green" },
        { routeType: 4, color: "orange", haloColor: "orange" },
        { routeType: 5, color: "red", haloColor: "red" },
        { routeType: 6, color: "blue", haloColor: "blue" },
        { routeType: 7, color: "yellow", haloColor: "yellow" }
    ],
    photonPlaceAutoCompleteOptions: {
        serviceUrl: "https://service.route360.net/geocode/",
        position: 'topleft',
        reset: false,
        reverse: false,
        placeholder: 'Select source',
        maxRows: 5,
        width: 300
    },
    defaultRadioOptions: {
        position: 'topright',
    },
    // configuration for the Route360PolygonLayer
    defaultPolygonLayerOptions: {
        opacity: 0.4,
        strokeWidth: 30,
        tolerance: 15,
        // background values only matter if inverse = true
        backgroundColor: 'black',
        backgroundOpacity: 0.5,
        inverse: false,
        animate: false,
        animationDuration: 1
    }
};
exports.serviceUrls = {
    basemapStyleUrl: "https://maps.route360.net/styles/"
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(0);
var basemapUtils = __webpack_require__(2);
exports.version = 'v1.0.0';
exports.config = config_1.defaults;
exports.getbasemapList = basemapUtils.getBasemapList;
exports.getGLStyle = basemapUtils.getGLStyle;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __webpack_require__(0);
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=r360.js.map