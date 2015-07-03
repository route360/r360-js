/*
 * r360.Class powers the OOP facilities of the library.
 * Thanks to John Resig and Dean Edwards for inspiration!
 */

r360.Class = function () {};

r360.Class.extend = function (props) {

    // extended class with the new prototype
    var NewClass = function () {

        // call the constructor
        if (this.initialize) {
            this.initialize.apply(this, arguments);
        }

        // call all constructor hooks
        this.callInitHooks();
    };

    var parentProto = NewClass.__super__ = this.prototype;

    var proto = r360.Util.create(parentProto);
    proto.constructor = NewClass;

    NewClass.prototype = proto;

    // inherit parent's statics
    for (var i in this) {
        if (this.hasOwnProperty(i) && i !== 'prototype') {
            NewClass[i] = this[i];
        }
    }

    // mix static properties into the class
    if (props.statics) {
        r360.extend(NewClass, props.statics);
        delete props.statics;
    }

    // mix includes into the prototype
    if (props.includes) {
        r360.Util.extend.apply(null, [proto].concat(props.includes));
        delete props.includes;
    }

    // merge options
    if (proto.options) {
        props.options = r360.Util.extend(r360.Util.create(proto.options), props.options);
    }

    // mix given properties into the prototype
    r360.extend(proto, props);

    proto._initHooks = [];

    // add method for calling all hooks
    proto.callInitHooks = function () {

        if (this._initHooksCalled) { return; }

        if (parentProto.callInitHooks) {
            parentProto.callInitHooks.call(this);
        }

        this._initHooksCalled = true;

        for (var i = 0, len = proto._initHooks.length; i < len; i++) {
            proto._initHooks[i].call(this);
        }
    };

    return NewClass;
};


// method for adding properties to prototype
r360.Class.include = function (props) {
    r360.extend(this.prototype, props);
};

// merge new default options to the Class
r360.Class.mergeOptions = function (options) {
    r360.extend(this.prototype.options, options);
};

// add a constructor hook
r360.Class.addInitHook = function (fn) { // (Function) || (String, args...)
    var args = Array.prototype.slice.call(arguments, 1);

    var init = typeof fn === 'function' ? fn : function () {
        this[fn].apply(this, args);
    };

    this.prototype._initHooks = this.prototype._initHooks || [];
    this.prototype._initHooks.push(init);
};
