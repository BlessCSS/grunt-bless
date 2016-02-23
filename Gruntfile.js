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
				'src/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		babel: {
			options: {
				'modules': 'commonStrict',
				'optional': [
					'runtime'
				]
			},
			dist: {
				files: [
					{
						'cwd': 'src/lib/',
						'src': '**/*.js',
						'dest': 'lib/',
						'expand': true,
						'filter': 'isFile'
					}, {
						'cwd': 'src/tasks/',
						'src': '**/*.js',
						'dest': 'tasks/',
						'expand': true,
						'filter': 'isFile'
					}
				]
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['test/tmp', 'tasks', 'lib']
		},

		// Configuration for unit tests
		mochaTest: {
			test: {
				options: {
					reporter: 'spec'
				},
				src: [
					'test/**/*.js'
				]
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');
	grunt.loadNpmTasks('grunt-babel');

	grunt.registerTask('build', ['clean', 'jshint', 'babel']);

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['mochaTest']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['build']);

};
