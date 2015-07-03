/*
 * r360.Transformation is an utility class to perform simple point transformations through a 2d-matrix.
 */

r360.Transformation = function (a, b, c, d) {
    this._a = a;
    this._b = b;
    this._c = c;
    this._d = d;
};

r360.Transformation.prototype = {
    transform: function (point, scale) { // (Point, Number) -> Point
        return this._transform(point.clone(), scale);
    },

    // destructive transform (faster)
    _transform: function (point, scale) {

        scale = scale || 1;
        point.x = scale * (this._a * point.x + this._b);
        point.y = scale * (this._c * point.y + this._d);
        return point;
    },

    untransform: function (point, scale) {
        scale = scale || 1;
        return new r360.Point(
                (point.x / scale - this._b) / this._a,
                (point.y / scale - this._d) / this._c);
    }
};
