/*
 * r360.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

r360.LatLngBounds = function (southWest, northEast) { // (LatLng, LatLng) or (LatLng[])
    if (!southWest) { return; }

    var latlngs = northEast ? [southWest, northEast] : southWest;

    for (var i = 0, len = latlngs.length; i < len; i++) {
        this.extend(latlngs[i]);
    }
};

r360.LatLngBounds.prototype = {

    // extend the bounds to contain the given point or bounds
    extend: function (obj) { // (LatLng) or (LatLngBounds)
        var sw = this._southWest,
            ne = this._northEast,
            sw2, ne2;

        if (obj instanceof r360.LatLng) {
            sw2 = obj;
            ne2 = obj;

        } else if (obj instanceof r360.LatLngBounds) {
            sw2 = obj._southWest;
            ne2 = obj._northEast;

            if (!sw2 || !ne2) { return this; }

        } else {
            return obj ? this.extend(r360.latLng(obj) || r360.latLngBounds(obj)) : this;
        }

        if (!sw && !ne) {
            this._southWest = new r360.LatLng(sw2.lat, sw2.lng);
            this._northEast = new r360.LatLng(ne2.lat, ne2.lng);
        } else {
            sw.lat = Math.min(sw2.lat, sw.lat);
            sw.lng = Math.min(sw2.lng, sw.lng);
            ne.lat = Math.max(ne2.lat, ne.lat);
            ne.lng = Math.max(ne2.lng, ne.lng);
        }

        return this;
    },

    // extend the bounds by a percentage
    pad: function (bufferRatio) { // (Number) -> LatLngBounds
        var sw = this._southWest,
            ne = this._northEast,
            heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
            widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

        return new r360.LatLngBounds(
                new r360.LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
                new r360.LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
    },

    getCenter: function () { // -> LatLng
        return new r360.LatLng(
                (this._southWest.lat + this._northEast.lat) / 2,
                (this._southWest.lng + this._northEast.lng) / 2);
    },

    getSouthWest: function () {
        return this._southWest;
    },

    getNorthEast: function () {
        return this._northEast;
    },

    getNorthWest: function () {
        return new r360.LatLng(this.getNorth(), this.getWest());
    },

    getSouthEast: function () {
        return new r360.LatLng(this.getSouth(), this.getEast());
    },

    getWest: function () {
        return this._southWest.lng;
    },

    getSouth: function () {
        return this._southWest.lat;
    },

    getEast: function () {
        return this._northEast.lng;
    },

    getNorth: function () {
        return this._northEast.lat;
    },

    contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
        if (typeof obj[0] === 'number' || obj instanceof r360.LatLng) {
            obj = r360.latLng(obj);
        } else {
            obj = r360.latLngBounds(obj);
        }

        var sw = this._southWest,
            ne = this._northEast,
            sw2, ne2;

        if (obj instanceof r360.LatLngBounds) {
            sw2 = obj.getSouthWest();
            ne2 = obj.getNorthEast();
        } else {
            sw2 = ne2 = obj;
        }

        return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
               (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
    },

    intersects: function (bounds) { // (LatLngBounds) -> Boolean
        bounds = r360.latLngBounds(bounds);

        var sw = this._southWest,
            ne = this._northEast,
            sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast(),

            latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
            lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

        return latIntersects && lngIntersects;
    },

    overlaps: function (bounds) { // (LatLngBounds) -> Boolean
        bounds = r360.latLngBounds(bounds);

        var sw = this._southWest,
            ne = this._northEast,
            sw2 = bounds.getSouthWest(),
            ne2 = bounds.getNorthEast(),

            latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
            lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

        return latOverlaps && lngOverlaps;
    },

    toBBoxString: function () {
        return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
    },

    equals: function (bounds) { // (LatLngBounds)
        if (!bounds) { return false; }

        bounds = r360.latLngBounds(bounds);

        return this._southWest.equals(bounds.getSouthWest()) &&
               this._northEast.equals(bounds.getNorthEast());
    },

    isValid: function () {
        return !!(this._southWest && this._northEast);
    }
};

//TODO International date line?

r360.latLngBounds = function (a, b) { // (LatLngBounds) or (LatLng, LatLng)
    if (!a || a instanceof r360.LatLngBounds) {
        return a;
    }
    return new r360.LatLngBounds(a, b);
};
