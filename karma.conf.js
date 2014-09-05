// Karma configuration
// Generated on Thu Sep 04 2014 17:37:31 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'jasmine-matchers'],


    // list of files / patterns to load in the browser
    files: [
        'debug/demo/lib/jquery/jquery-1.10.2.js',
        'debug/demo/lib/leaflet/leaflet.js',
        'debug/demo/js/underscore.js',
        'debug/demo/lib/proj4/proj4-compressed.js',
        'debug/demo/lib/proj4/proj4leaflet.js',
        'src/r360.js',
        'src/r360-defaults.js',
        'src/util/Util.js',
        'src/util/TravelOptions.js',
        'src/api/polygons/PolygonService.js',
        'src/api/routes/RouteService.js',
        'src/api/time/TimeService.js',
        'src/control/PlaceAutoCompleteControl.js',
        'src/control/TravelStartDateControl.js',
        'src/control/TravelStartTimeControl.js',
        'src/control/TravelTimeControl.js',
        'src/control/WaitControl.js',
        'src/control/HtmlControl.js',
        'src/control/RadioButtonControl.js',
        'src/control/CheckboxButtonControl.js',
        'src/geometry/polygon/Polygon.js',
        'src/geometry/polygon/MultiPolygon.js',
        'src/geometry/route/RouteSegment.js',
        'src/geometry/route/Route.js',
        'src/layer/Route360PolygonLayer.js',
        'spec/**/*.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,



    reportSlowerThan : 500
  });
};
