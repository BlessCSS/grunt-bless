/*
 * grunt-bless
 * https://github.com/Ponginae/grunt-bless
 *
 * Copyright (c) 2013 Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    bless: {
      default_options: {
        options: {},
        files: {
          'tmp/above-limit.css': 'test/input/above-limit.css'
        }
      },
      custom_options: {
        options: {
          banner: '/* This file has been blessed by <%= pkg.name %> v<%= pkg.version %> */',
          cacheBuster: false,
          compress: true
        },
        files: {
          'tmp/below-limit.css': 'test/input/below-limit.css'
        }
      },

      // Just counting files with logging, without write
      check: {
        options: {
          logCount: true
        },
        src: [
          'test/input/*.css'
        ]
      },

      // This issue was discovered while investigating Issue #14, the force
      // option is not implemented by the bless parser. A custom force
      // implementation was added in version 0.2.0.
      //
      // This test should normally fail.
      issue_fourteen: {
        options: {
          compress: true,
          force: false,
          cacheBuster: true
        },
        files: {
          'test/input/above-limit.css': 'test/input/above-limit.css'
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'bless:default_options', 'bless:custom_options', 'bless:check']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
