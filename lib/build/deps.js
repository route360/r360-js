var deps = {
    api: {
        src: ['r360.js',
              'r360-defaults.js',
              'util/PolygonUtil.js',
              'util/SvgUtil.js',
              'util/Util.js',
              'util/DomUtil.js',
              'util/TravelOptions.js',
              'api/polygons/PolygonService.js',
              'api/routes/RouteService.js',
              'api/time/TimeService.js',
              'api/osm/OsmService.js'
              ],
        desc: ''
    },

    control: {
        src: ['control/PhotonPlaceAutoCompleteControl.js',
              'control/PlaceAutoCompleteControl.js',
              'control/TravelStartDateControl.js',
              'control/TravelStartTimeControl.js',
              'control/TravelTimeControl.js',
              'control/WaitControl.js',
              'control/HtmlControl.js',
              'control/RadioButtonControl.js',
              'control/CheckboxButtonControl.js'
             ],
        desc: '',
        heading: ''
    },

    polygon: {
        src: ['geometry/polygon/Polygon.js',
              'geometry/polygon/MultiPolygon.js'
             ],
        desc: '',
        heading: ''
    },

    route: {
        src: ['geometry/route/RouteSegment.js',
              'geometry/route/Route.js'
             ],
        desc: '',
        heading: ''
    },

    layer: {
        src: ['layer/Route360PolygonLayer.js',
              'layer/GoogleMapsPolygonLayer.js'],
        desc: '',
        heading: ''
    }
};

if (typeof exports !== 'undefined') {
    exports.deps = deps;
}
