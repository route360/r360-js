var deps = {
    core : {
        src: ['r360.js',
              'r360-defaults.js',
              'geometry/types/bounds/Bounds.js',
              'geometry/types/bounds/LatLngBounds.js',
              'geometry/types/point/Point.js',
              'geometry/types/point/LatLng.js',
              'util/Browser.js',
              'util/Class.js',
              'util/PolygonUtil.js',
              'util/SvgUtil.js',
              'util/Util.js',
              'util/DomUtil.js',
              'util/TravelOptions.js',
              'rest/polygons/PolygonService.js',
              'rest/population/PopulationService.js',
              'rest/routes/RouteService.js',
              'rest/time/TimeService.js',
              'rest/osm/OsmService.js',
              'geometry/projection/Projection.SphericalMercator.js',
              'geometry/transformation/Transformation.js',
              'geometry/crs/CRS.js',
              'geometry/crs/CRS.Earth.js',
              'geometry/crs/CRS.EPSG3857.js',
              'geometry/types/polygon/Polygon.js',
              'geometry/types/polygon/MultiPolygon.js',
              'geometry/types/linestring/LineString.js',
              'geometry/types/route/RouteSegment.js',
              'geometry/types/route/RouteSegment.js',
              'geometry/types/route/Route.js'
        ],
        desc: 'This package contains all classes which are not dependent on any online map library like leaflet or google maps. '
    }
    ,
    google : {
        src : [ 'extension/google/layer/GoogleMapsPolygonLayer.js',
                'extension/google/util/GoogleMapsUtil.js'  
         ],
        desc: 'Contains stuff which is needed to display polygons on a Google Map',
    }
    ,
    leaflet : {
        src: ['extension/leaflet/control/PhotonPlaceAutoCompleteControl.js',
              'extension/leaflet/control/PlaceAutoCompleteControl.js',
              'extension/leaflet/control/TravelStartDateControl.js',
              'extension/leaflet/control/TravelStartTimeControl.js',
              'extension/leaflet/control/TravelTimeControl.js',
              'extension/leaflet/control/WaitControl.js',
              'extension/leaflet/control/HtmlControl.js',
              'extension/leaflet/control/RadioButtonControl.js',
              'extension/leaflet/control/CheckboxButtonControl.js',
              'extension/leaflet/layer/LeafletPolygonLayer.js',
              'extension/leaflet/util/LeafletUtil.js'
             ],
        desc: 'Contains GUI elements ',
        heading: ''
    }
};

if (typeof exports !== 'undefined') {
    exports.deps = deps;
}
