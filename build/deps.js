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
              'rest/mobie/MobieService.js',
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
              'geometry/types/route/Route.js',
              'extension/leaflet/layer/LeafletPolygonLayer.js',
              'extension/leaflet/layer/CanvasLayer.js',
              'extension/leaflet/util/LeafletUtil.js',
              'extension/google/layer/GoogleMapsPolygonLayer.js',
              'extension/google/util/GoogleMapsUtil.js'
        ],
        desc: 'This package contains all classes which are not dependent on any online map library like leaflet or google maps. '
    }
};

if (typeof exports !== 'undefined') {
    exports.deps = deps;
}
