/**
@toc
2. load grunt plugins
3. init
4. setup variables
5. grunt.initConfig
6. register grunt tasks

*/

'use strict';

module.exports = function(grunt) {

  /**
  Load grunt plugins
  @toc 2.
  */
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /**
  Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
  @toc 3.
  @method init
  */
  function init(params) {
    /**
    Project configuration.
    @toc 5.
    */
    grunt.initConfig({
      jshint: {
        options: {
          //force:          true,
          globalstrict:   true,
          //sub:            true,
          node: true,
          loopfunc: true,
          browser:        true,
          devel:          true,
          globals: {
            angular : false,
            $       : false,
            moment  : false,
            Pikaday : false,
            module  : false,
            forge   : false,
            r360    : false,
            L       : false
          }
        },
        beforeconcat:   {
          options: {
            force:  false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        //quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ:   {
          options: {
            force:  true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['**.js']
          }
        }
      },
      concat: {
        // options: {
        //   // define a string to put between each file in the concatenated output
        //   separator: ';'
        // },
        dist: {
          // the files to concatenate
        	src: ['src/r360.js', 'src/util/Util.js', 'src/geometry/crs/CRS.js', 'src/geometry/types/bounds/Bounds.js', 'src/geometry/types/point/Point.js', 'src/geometry/transformation/Transformation.js', 'src/geometry/projection/Projection.SphericalMercator.js',  'src/**/*.js'],
          // the location of the resulting JS file
          dest: 'dist/r360-src.js'
        }
      },
      uglify: {
        options: {
          mangle: false
        },
        build: {
          files:  {},
          src:    'dist/r360-src.js',
          dest:   'dist/r360.js'
        }
      },
      watch: {
        scripts: {
          files: ['src/**/*.js'],
          tasks: ['jshint:beforeconcatQ','concat', 'uglify:build'],
          options: {
            spawn: false,
          },
        },
      },/*,
      karma: {
        unit: {
          configFile: publicPathRelativeRoot+'config/karma.conf.js',
          singleRun: true,
          browsers: ['PhantomJS']
        }
      }*/
    });


    /**
    register/define grunt tasks
    @toc 6.
    */
    // Default task(s).
    grunt.registerTask('default', ['jshint:beforeconcatQ','concat', 'uglify:build']);

  }
  init({});   //initialize here for defaults (init may be called again later within a task)

};