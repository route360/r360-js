/*
 * r360.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

r360.Bounds = function (a, b) { //(Point, Point) or Point[]
    if (!a) { return; }

    var points = b ? [a, b] : a;

    for (var i = 0, len = points.length; i < len; i++) {
        this.extend(points[i]);
    }
};

r360.Bounds.prototype = {
    // extend the bounds to contain the given point
    extend: function (point) { // (Point)
        point = r360.point(point);

        if (!this.min && !this.max) {
            this.min = point.clone();
            this.max = point.clone();
        } else {
            this.min.x = Math.min(point.x, this.min.x);
            this.max.x = Math.max(point.x, this.max.x);
            this.min.y = Math.min(point.y, this.min.y);
            this.max.y = Math.max(point.y, this.max.y);
        }
        return this;
    },

    getCenter: function (round) { // (Boolean) -> Point
        return new r360.Point(
                (this.min.x + this.max.x) / 2,
                (this.min.y + this.max.y) / 2, round);
    },

    getBottomLeft: function () { // -> Point
        return new r360.Point(this.min.x, this.max.y);
    },

    getTopRight: function () { // -> Point
        return new r360.Point(this.max.x, this.min.y);
    },

    getSize: function () {
        return this.max.subtract(this.min);
    },

    contains: function (obj) { // (Bounds) or (Point) -> Boolean
        var min, max;

        if (typeof obj[0] === 'number' || obj instanceof r360.Point) {
            obj = r360.point(obj);
        } else {
            obj = r360.bounds(obj);
        }

        if (obj instanceof r360.Bounds) {
            min = obj.min;
            max = obj.max;
        } else {
            min = max = obj;
        }

        return (min.x >= this.min.x) &&
               (max.x <= this.max.x) &&
               (min.y >= this.min.y) &&
               (max.y <= this.max.y);
    },

    intersects: function (bounds) { // (Bounds) -> Boolean
        bounds = r360.bounds(bounds);

        var min = this.min,
            max = this.max,
            min2 = bounds.min,
            max2 = bounds.max,
            xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
            yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

        return xIntersects && yIntersects;
    },

    overlaps: function (bounds) { // (Bounds) -> Boolean
        bounds = r360.bounds(bounds);

        var min = this.min,
            max = this.max,
            min2 = bounds.min,
            max2 = bounds.max,
            xOverlaps = (max2.x > min.x) && (min2.x < max.x),
            yOverlaps = (max2.y > min.y) && (min2.y < max.y);

        return xOverlaps && yOverlaps;
    },

    isValid: function () {
        return !!(this.min && this.max);
    }
};

r360.bounds = function (a, b) { // (Bounds) or (Point, Point) or (Point[])
    if (!a || a instanceof r360.Bounds) {
        return a;
    }
    return new r360.Bounds(a, b);
};
