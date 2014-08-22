/*
 * Provides bless.js as Grunt task
 *
 * Copyright (c) Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
	var path = require('path'),
		bless = require('bless'),
		OVERWRITE_ERROR = 'The destination is the same as the source for file ',
		OVERWRITE_EXCEPTION = 'Cowardly refusing to overwrite the source file.';

	grunt.registerMultiTask('bless', 'Split CSS files suitable for IE', function() {

		var options = this.options({
			cacheBuster: true,
			cleanup: true,
			compress: false,
			force: grunt.option('force') || false,
			imports: true
		});
		grunt.log.writeflags(options, 'options');

		grunt.util.async.forEach(this.files, function (input_files, next) {
			var data = '';

			// If we are not forcing the build refuse to overwrite the
			// source file.
			if (!options.force && input_files.src.indexOf(input_files.dest) >= 0) {
				grunt.log.error(OVERWRITE_ERROR + input_files.dest);
				throw grunt.util.error(OVERWRITE_EXCEPTION);
			}

			// read and concat files
			input_files.src.forEach(function (file) {
				data += grunt.file.read(file);
			});


			new (bless.Parser)({
				output: input_files.dest,
				options: options
			}).parse(data, function (err, files, numSelectors) {
				if (err) {
					grunt.log.error(err);
					throw grunt.util.error(err);
				}

				// print log message
				var msg = 'Found ' + numSelectors + ' selector';
				if (numSelectors !== 1) {
					msg += 's';
				}
				msg += ', ';
				if (files.length > 1) {
					msg += 'splitting into ' + files.length + ' files.';
				} else {
					msg += 'not splitting.';
				}
				grunt.log.verbose.writeln(msg);

				// write processed file(s)
				files.forEach(function (file) {

					// Because files is an array there is no way of finding the
					// first file to add the banner without looping through them.
					// 
					// Since we are already doing that...

					if (options.banner && file.filename === input_files.dest) {
						file.content = options.banner + grunt.util.linefeed + file.content;
					}

					grunt.file.write(file.filename, file.content);
				});
			});
			next();
		});
	});
};