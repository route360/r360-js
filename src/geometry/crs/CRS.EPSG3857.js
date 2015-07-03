/*
 * r360.CRS.EPSG3857 (Spherical Mercator) is the most common CRS for web mapping and is used by Leaflet by default.
 */

r360.CRS.EPSG3857 = r360.extend({}, r360.CRS.Earth, {
    code: 'EPSG:3857',
    projection: r360.Projection.SphericalMercator,

    transformation: (function () {
        var scale = 0.5 / (Math.PI);
        return new r360.Transformation(scale, 0.5, -scale, 0.5);
    }())
});

r360.CRS.EPSG900913 = r360.extend({}, r360.CRS.EPSG3857, {
    code: 'EPSG:900913'
});
