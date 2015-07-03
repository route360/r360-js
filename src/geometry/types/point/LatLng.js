/*
 * r360.LatLng represents a geographical point with latitude and longitude coordinates.
 */

r360.LatLng = function (lat, lng, alt) {
    if (isNaN(lat) || isNaN(lng)) {
        throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
    }

    this.lat = +lat;
    this.lng = +lng;

    if (alt !== undefined) {
        this.alt = +alt;
    }
};

r360.LatLng.prototype = {
    equals: function (obj, maxMargin) {
        if (!obj) { return false; }

        obj = r360.latLng(obj);

        var margin = Math.max(
                Math.abs(this.lat - obj.lat),
                Math.abs(this.lng - obj.lng));

        return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
    },

    toString: function (precision) {
        return 'LatLng(' +
                r360.Util.formatNum(this.lat, precision) + ', ' +
                r360.Util.formatNum(this.lng, precision) + ')';
    },

    distanceTo: function (other) {
        return r360.CRS.Earth.distance(this, r360.latLng(other));
    },

    wrap: function () {
        return r360.CRS.Earth.wrapLatLng(this);
    },

    toBounds: function (sizeInMeters) {
        var latAccuracy = 180 * sizeInMeters / 40075017,
                lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

        return r360.latLngBounds(
                [this.lat - latAccuracy, this.lng - lngAccuracy],
                [this.lat + latAccuracy, this.lng + lngAccuracy]);
    },

    clone: function () {
        return new r360.LatLng(this.lat, this.lng, this.alt);
    }
};


// constructs LatLng with different signatures
// (LatLng) or ([Number, Number]) or (Number, Number) or (Object)

r360.latLng = function (a, b, c) {
    if (a instanceof r360.LatLng) {
        return a;
    }
    if (r360.Util.isArray(a) && typeof a[0] !== 'object') {
        if (a.length === 3) {
            return new r360.LatLng(a[0], a[1], a[2]);
        }
        if (a.length === 2) {
            return new r360.LatLng(a[0], a[1]);
        }
        return null;
    }
    if (a === undefined || a === null) {
        return a;
    }
    if (typeof a === 'object' && 'lat' in a) {
        return new r360.LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
    }
    if (b === undefined) {
        return null;
    }
    return new r360.LatLng(a, b, c);
};
