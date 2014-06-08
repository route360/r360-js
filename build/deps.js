var deps = {
	api: {
		src: ['r360.js',
		      'api/polygons/PolygonService.js',
		      'api/routes/RouteService.js',
		      'api/time/TimeService.js'
		      ],
		desc: ''
	},

	control: {
		src: ['control/PlaceAutoCompleteControl.js',
              'control/TravelSpeedControl.js',
              'control/TravelStartDateControl.js',
              'control/TravelStartTimeControl.js',
              'control/TravelTimeControl.js',
              'control/TravelTypeControl.js'
             ],
		desc: '',
		heading: ''
	},

	polygon: {
		src: ['geometry/polygon/Polygon.js',
              'geometry/polygon/MultiPolygon.js',
              'geometry/polygon/PolygonParser.js'
             ],
		desc: '',
		heading: ''
	},

    route: {
        src: ['geometry/route/RouteSegment.js',
              'geometry/route/Route.js',
              'geometry/route/RouteParser.js'
             ],
        desc: '',
        heading: ''
    },

    layer: {
        src: ['layer/Route360PolygonLayer.js'],
        desc: '',
        heading: ''
    }
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}
