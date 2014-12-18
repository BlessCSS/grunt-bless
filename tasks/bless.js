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
		util = require('util'),
		chalk = require('chalk'),
		OVERWRITE_ERROR = 'The destination is the same as the source for file ',
		OVERWRITE_EXCEPTION = 'Cowardly refusing to overwrite the source file.';

	grunt.registerMultiTask('bless', 'Split CSS files suitable for IE', function() {

		var options = this.options({
			cacheBuster: true,
			cleanup: true,
			compress: false,
			logCount: false,
			force: grunt.option('force') || false,
			warnLimit: 4000,
			imports: true
		});
		grunt.log.writeflags(options, 'options');

		// Taking list of files with write destination or list without dest
		var files = this.files;
		var fileList = files.length === 1 && !files[0].dest ? files[0].src : files;

		grunt.util.async.forEach(fileList, function (inputFile, next) {
			var writeFiles = inputFile.dest ? true : false;
			var outPutfileName = inputFile.dest || inputFile;
			var limit = 4095;
			var data = '';

			// If we are not forcing the build refuse to overwrite the
			// source file.
			if (writeFiles) {
				if (!options.force && inputFile.src.indexOf(inputFile.dest) >= 0) {
					grunt.log.error(OVERWRITE_ERROR + inputFile.dest);
					throw grunt.util.error(OVERWRITE_EXCEPTION);
				}
			}

			// Read and concat files
			if (util.isArray(inputFile.src)) {
				inputFile.src.forEach(function (file) {
					data += grunt.file.read(file);
				});
			} else {
				data += grunt.file.read(inputFile);
			}


			new (bless.Parser)({
				output: outPutfileName,
				options: options
			}).parse(data, function (err, files, numSelectors) {
				if (err) {
					grunt.log.error(err);
					throw grunt.util.error(err);
				}

				if (options.logCount) {
					var overLimit = numSelectors > limit;
					var _numSelectors = chalk.green(numSelectors);

					if (overLimit) {
						_numSelectors = chalk.red(numSelectors);
					} else if (numSelectors > options.warnLimit ) {
						_numSelectors = chalk.yellow(numSelectors);
					}

					var coungMsg = path.basename(outPutfileName) + ' has ' + _numSelectors + ' CSS selectors.';

					if (overLimit) {
						grunt.log.errorlns(coungMsg + ' IE8-9 will read only first ' + limit + '!');
					} else if (options.logCount !== 'warn') {
						grunt.log.oklns(coungMsg);
					}
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
				var filesLength = files.length;
				var logModified = (filesLength > 1);
				var writeCount = 0;

				if (writeFiles) {
					files.forEach(function (file) {

						// Because files is an array there is no way of finding the
						// first file to add the banner without looping through them.
						//
						// Since we are already doing that...

						if (options.banner && file.filename === file.dest) {
							file.content = options.banner + grunt.util.linefeed + file.content;
						}

						grunt.file.write(file.filename, file.content);

						writeCount++;

						if (logModified) {
							var lastSentence = filesLength === writeCount ? 'modified' : 'created';

							grunt.log.writeln('File ' + chalk.cyan(file.filename) + ' ' + lastSentence + '.');
						}
					});
				}
			});
			next();
		});
	});
};