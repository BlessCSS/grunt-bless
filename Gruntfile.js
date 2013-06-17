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
          cacheBuster: false,
          compress: true
        },
        files: {
          'tmp/below-limit.css': 'test/input/below-limit.css'
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
  grunt.registerTask('test', ['clean', 'bless']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
