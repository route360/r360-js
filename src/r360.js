
var r360 = {
	version : 'v0.2.1',

  // Is a given variable undefined?
  isUndefined : function(obj) {
      return obj === void 0;
  },
  
  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  has : function(obj, key) {
      return obj != null && hasOwnProperty.call(obj, key);
  },
  
  // is a given object a function
  isFunction : function(obj) {
    return typeof obj == 'function' || false;
  },

  findWhere : function(array, attr) {
    var result = undefined;
    array.some(function(elem,index,array){
      var match = false;
      for(var index in attr) {
        match = (r360.has(elem,index) && elem[index] === attr[index]) ? true : false;
      }
      if (match) {
        result = elem;
        return true;
      }
    });
    return result;
  },

  filter : function(array,predicate) {
    var results = [];
    array.forEach(function(elem,index,array){
      if (predicate(elem, index, array)) results.push(elem);
    });
    return results;
  }, 

  contains : function(array,item) {
    return array.indexOf(item) > -1;
  },

  each : function(array,cb) {
    array.forEach(function(elem,index,array){
      cb(elem,index,array);
    });
  },

  max : function(array, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof array[0] != 'arrayect') && array != null) {
      for (var i = 0, length = array.length; i < length; i++) {
        value = array[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      r360.each(array, function(elem, index, array) {
        computed = iteratee(elem, index, array);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = elem;
          lastComputed = computed;
        }
      });
    }
    return result;
  },

  keys : function(obj) {
    if (typeof obj !== 'Object') return [];
    if (Object.keys(obj)) return Object.keys(obj);
    var keys = [];
    for (var key in obj) if (r360.has(obj, key)) keys.push(key);
    return keys;
  }

};

function expose() {
	var oldr360 = window.r360;

	r360.noConflict = function () {
		window.r360 = oldr360;
		return this;
	};

	window.r360 = r360;
}

// define r360 for Node module pattern loaders, including Browserify
if (typeof module === 'object' && typeof module.exports === 'object') 
	module.exports = r360;

// define r360 as an AMD module
else if (typeof define === 'function' && define.amd) define(r360);

// define r360 as a global r360 variable, saving the original r360 to restore later if needed
else expose();


/*
* IE 8 does not get the bind function. This is a workaround...
*/
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}