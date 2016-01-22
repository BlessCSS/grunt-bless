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
				'src/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		babel: {
			options: {
				'modules': 'commonStrict',
				'whitelist': [
					'es6.modules',
					'es6.arrowFunctions',
					//'minification.deadCodeElimination',
					//'minification.constantFolding',
					'strict'
				],
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
			tests: ['tmp', 'tasks', 'lib']
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

	grunt.registerTask('build', ['babel']);

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'build', 'mochaTest', 'bless:default_options', 'bless:custom_options', 'bless:check']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['clean', 'jshint', 'build']);

};
