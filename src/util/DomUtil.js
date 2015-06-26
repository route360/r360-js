r360.DomUtil = {
    
    setPosition: function (el, point) { // (HTMLElement, Point[, Boolean])

        /*eslint-disable */
        el._leaflet_pos = point;
        /*eslint-enable */

        if (L.Browser.any3d) {
            r360.DomUtil.setTransform(el, point);
        } else {
            el.style.left = point.x + 'px';
            el.style.top = point.y + 'px';
        }
    },

    setTransform: function (el, offset, scale) {
        var pos = offset || new L.Point(0, 0);

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


    // // webkitTransition comes first because some browser versions that drop vendor prefix don't do
    // // the same for the transitionend event, in particular the Android 4.1 stock browser

    // var transition = L.DomUtil.TRANSITION = L.DomUtil.testProp(
    //         ['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

    // L.DomUtil.TRANSITION_END =
    //         transition === 'webkitTransition' || transition === 'OTransition' ? transition + 'End' : 'transitionend';


    // if ('onselectstart' in document) {
    //     L.DomUtil.disableTextSelection = function () {
    //         L.DomEvent.on(window, 'selectstart', L.DomEvent.preventDefault);
    //     };
    //     L.DomUtil.enableTextSelection = function () {
    //         L.DomEvent.off(window, 'selectstart', L.DomEvent.preventDefault);
    //     };

    // } else {
    //     var userSelectProperty = L.DomUtil.testProp(
    //         ['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

    //     L.DomUtil.disableTextSelection = function () {
    //         if (userSelectProperty) {
    //             var style = document.documentElement.style;
    //             this._userSelect = style[userSelectProperty];
    //             style[userSelectProperty] = 'none';
    //         }
    //     };
    //     L.DomUtil.enableTextSelection = function () {
    //         if (userSelectProperty) {
    //             document.documentElement.style[userSelectProperty] = this._userSelect;
    //             delete this._userSelect;
    //         }
    //     };
    // }

    // L.DomUtil.disableImageDrag = function () {
    //     L.DomEvent.on(window, 'dragstart', L.DomEvent.preventDefault);
    // };
    // L.DomUtil.enableImageDrag = function () {
    //     L.DomEvent.off(window, 'dragstart', L.DomEvent.preventDefault);
    // };

    // L.DomUtil.preventOutline = function (element) {
    //     L.DomUtil.restoreOutline();
    //     this._outlineElement = element;
    //     this._outlineStyle = element.style.outline;
    //     element.style.outline = 'none';
    //     L.DomEvent.on(window, 'keydown', L.DomUtil.restoreOutline, this);
    // };
    // L.DomUtil.restoreOutline = function () {
    //     if (!this._outlineElement) { return; }
    //     this._outlineElement.style.outline = this._outlineStyle;
    //     delete this._outlineElement;
    //     delete this._outlineStyle;
    //     L.DomEvent.off(window, 'keydown', L.DomUtil.restoreOutline, this);
    // };
})();
