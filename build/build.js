var fs = require('fs'),
    jshint = require('jshint'),
    UglifyJS = require('uglify-js'),
    zlib = require('zlib'),

    deps = require('./deps.js').deps;

function getFiles(module) {
	var memo = {},
	    comps;

    var moduleDeps = [];
    if (module == 'core')    moduleDeps = deps.core.src;
    if (module == 'leaflet') moduleDeps = deps.leaflet.src;
    if (module == 'google')  moduleDeps = deps.google.src;

    for (var i = 0 ; i < moduleDeps.length ; i++ ) {
        memo[moduleDeps[i]] = true;
    }

	var files = [];

	for (var src in memo) {
		files.push('src/' + src);
	}

	return files;
}

exports.getFiles = getFiles;

function getSizeDelta(newContent, oldContent, fixCRLF) {
	if (!oldContent) {
		return ' (new)';
	}
	if (newContent === oldContent) {
		return ' (unchanged)';
	}
	if (fixCRLF) {
		newContent = newContent.replace(/\r\n?/g, '\n');
		oldContent = oldContent.replace(/\r\n?/g, '\n');
	}
	var delta = newContent.length - oldContent.length;

	return delta === 0 ? '' : ' (' + (delta > 0 ? '+' : '') + delta + ' bytes)';
}

function loadSilently(path) {
	try {
		return fs.readFileSync(path, 'utf8');
	} catch (e) {
		return null;
	}
}

function combineFiles(files) {
	var content = '';
	for (var i = 0, len = files.length; i < len; i++) {
	    content += fs.readFileSync(files[i], 'utf8') + '\n\n';
	}

	return content;
}

function bytesToKB(bytes) {
    return (bytes / 1024).toFixed(2) + ' KB';
};

function build(callback, version, buildName, module){

    var files = getFiles(module);
    var combinedFiles = combineFiles(files);
    console.log('Concatenating and compressing ' + files.length + ' files for module ' + module + ' ... ');

    var oldSrc, srcDelta, pathPart, srcPath, newSrc;

    if ( module == 'core' ) {

        var copy = fs.readFileSync('src/copyright.js', 'utf8').replace('{VERSION}', version),
        intro = '(function (window, document, undefined) {',
        outro = '}(window, document));\n\n',
        newSrc = copy + intro + combinedFiles + outro,

        pathPart = 'dist/r360' + (buildName ? '-' + buildName : ''),
        srcPath = pathPart + '-src.js',

        oldSrc = loadSilently(srcPath),
        srcDelta = getSizeDelta(newSrc, oldSrc, true);
    }

    console.log('\tUncompressed: ' + bytesToKB(newSrc.length) + srcDelta);

    // if (newSrc !== oldSrc) {
        fs.writeFileSync(srcPath, newSrc);
        console.log('\tSaved to ' + srcPath);
    // }

    var path = pathPart + '.js',
        oldCompressed = loadSilently(path),
        newCompressed = copy + UglifyJS.minify(newSrc, {
            warnings: true,
            fromString: true
        }).code,
        delta = getSizeDelta(newCompressed, oldCompressed);

    console.log('\tCompressed: ' + bytesToKB(newCompressed.length) + delta);

    var newGzipped,
        gzippedDelta = '';

    function done() {
        // if (newCompressed !== oldCompressed) {
            fs.writeFileSync(path, newCompressed);
            console.log('\tSaved to ' + path);
        // }
        console.log('\tGzipped: ' + bytesToKB(newGzipped.length) + gzippedDelta);
        callback();
    }

    // compress the new version
    zlib.gzip(newCompressed, function (err, gzipped) {
        if (err) { return; }
        newGzipped = gzipped;
        // if (oldCompressed && (oldCompressed !== newCompressed)) {
            // compress the old version
            zlib.gzip(oldCompressed, function (err, oldGzipped) {
                if (err) { return; }
                gzippedDelta = getSizeDelta(gzipped, oldGzipped);

                fs.writeFileSync(path, newCompressed);
                console.log('\tSaved to ' + path);
                console.log('\tGzipped: ' + bytesToKB(newGzipped.length) + gzippedDelta);
                // done();
            });
        // } else {
        //     done();
        // }
    });
}

exports.build = function (callback, version, buildName) {

    // fs.unlink('dist/r360-core.js');
    // fs.unlink('dist/r360-core-src.js');
    // fs.unlink('dist/r360-leaflet.js');
    // fs.unlink('dist/r360-leaflet-src.js');
    // fs.unlink('dist/r360-google.js');
    // fs.unlink('dist/r360-google-src.js');

    build(callback, version, buildName, 'core');
    console.log('---------------------------------------------------------');
    // build(callback, version, buildName, 'google');
    // console.log('---------------------------------------------------------');
    // build(callback, version, buildName, 'leaflet');
};

exports.test = function(complete, fail) {
	var karma = require('karma'),
	    testConfig = {configFile : __dirname + '/../spec/karma.conf.js'};

	testConfig.browsers = ['PhantomJS'];

	function isArgv(optName) {
		return process.argv.indexOf(optName) !== -1;
	}

	if (isArgv('--chrome')) {
		testConfig.browsers.push('Chrome');
	}
	if (isArgv('--safari')) {
		testConfig.browsers.push('Safari');
	}
	if (isArgv('--ff')) {
		testConfig.browsers.push('Firefox');
	}
	if (isArgv('--ie')) {
		testConfig.browsers.push('IE');
	}

	if (isArgv('--cov')) {
		testConfig.preprocessors = {
			'src/**/*.js': 'coverage'
		};
		testConfig.coverageReporter = {
			type : 'html',
			dir : 'coverage/'
		};
		testConfig.reporters = ['coverage'];
	}

	console.log('Running tests...');

	karma.server.start(testConfig, function(exitCode) {
		if (!exitCode) {
			console.log('\tTests ran successfully.\n');
			complete();
		} else {
			process.exit(exitCode);
		}
	});
};
