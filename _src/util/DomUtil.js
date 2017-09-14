r360.DomUtil = {
    
    setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

        if (r360.Browser.any3d) {
            r360.DomUtil.setTransform(el, point);
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
        }
    },

    setTransform: function (el, offset, scale) {
        var pos = offset || new r360.Point(0, 0);

        el.style[r360.DomUtil.TRANSFORM] =
            'translate3d(' + pos.x + 'px,' + pos.y + 'px' + ',0)' + (scale ? ' scale(' + scale + ')' : '');
    },

    testProp: function (props) {

        var style = document.documentElement.style;

        for (var i = 0; i < props.length; i++) {
            if (props[i] in style) {
                return props[i];
            }
        }
        return false;
    }
};

(function () {
    // prefix style property names
    r360.DomUtil.TRANSFORM = r360.DomUtil.testProp(
            ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);
})();
