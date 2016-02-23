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
		pkg: grunt.file.readJSON( "../package.json" ),
		// Configuration to be run (and then tested).
		bless: {
			default_options: {
				options: {},
				files: {
					'tmp/above-limit.css': 'input/above-limit.css'
				}
			},

			custom_options: {
				options: {
					banner: '/* This file has been blessed by <%= pkg.name %> v<%= pkg.version %> */',
					compress: true
				},
				files: {
					'tmp/below-limit.css': 'input/below-limit.css'
				}
			},

			sourcemaps: {
				options: {
					sourceMaps: true
				},
				files: {
					'tmp/above-limit.css': 'input/above-limit.css'
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
					force: false
				},
				files: {
					'test/input/above-limit.css': 'test/input/above-limit.css'
				}
			}
		},
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('../tasks');

	grunt.registerTask('all', ['bless']);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['bless:default_options', 'bless:custom_options', 'bless:check', 'bless:sourcemaps']);

};
