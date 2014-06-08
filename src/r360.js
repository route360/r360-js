
var r360 = {
	version: '0.1-dev'
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
if (typeof module === 'object' && typeof module.exports === 'object') {
	module.exports = r360;

// define r360 as an AMD module
} else if (typeof define === 'function' && define.amd) {
	define(r360);

// define r360 as a global r360 variable, saving the original r360 to restore later if needed
} else {
	expose();
}
