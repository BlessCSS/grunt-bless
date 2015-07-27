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
		OVERWRITE_EXCEPTION = 'Cowardly refusing to overwrite the source file.',
		STUBBED_SUFFIX = 'blessed';

	function build_name(base, nth_file, suffix) {
		return base + '-' + suffix + nth_file;
	}

	function importer(options) {
		var current = options.numFiles - 1,
			imports = '';

		while (current > 0) {
			imports += '@import "' + build_name(options.output, current, options.suffix) + '.css";' + options.linefeed;

			current--;
		}

		return imports;
	}

	grunt.registerMultiTask('bless', 'Split CSS files suitable for IE', function() {

		var options = this.options({
			cacheBuster: true,
			cleanup: true,
			compress: false,
			logCount: false,
			force: grunt.option('force') || false,
			warnLimit: 4000,
			imports: true,
			failOnLimit: false
		});
		grunt.log.writeflags(options, 'options');

		// Taking list of files with write destination or list without dest
		var files = this.files;
		var fileList = files.length === 1 && !files[0].dest ? files[0].src : files;

		grunt.util.async.forEach(fileList, function (inputFile, next) {
			var writeFiles = inputFile.dest ? true : false;
			var output_filename_orig = inputFile.dest || inputFile;
			var output_filename_parts = (output_filename_orig).split('.');
			var outPutfileName;
			var limit = 4095;
			var data = '';
			var parse_result;
			var suffix = STUBBED_SUFFIX;

			// prep the output file by stripping the .css from the end.
			if (output_filename_parts[output_filename_parts.length - 1] === 'css') {
				output_filename_parts.pop();
			}

			outPutfileName = output_filename_parts.join('.');

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


			parse_result = bless.chunk(data);

			var numSelectors = parse_result.totalSelectorCount;

			if (options.logCount) {
				var overLimit = numSelectors > limit;
				var _numSelectors = chalk.green(numSelectors);

				if (overLimit) {
					_numSelectors = chalk.red(numSelectors);
				} else if (numSelectors > options.warnLimit ) {
					_numSelectors = chalk.yellow(numSelectors);
				}

				var coungMsg = path.basename(outPutfileName) + ' has ' + _numSelectors + ' CSS selectors.';
				var overLimitErrorMessage = coungMsg + ' IE8-9 will read only first ' + limit + '!';

				if (overLimit) {
					grunt.log.errorlns(overLimitErrorMessage);

					if (options.failOnLimit) {
						throw grunt.util.error(chalk.stripColor(overLimitErrorMessage));
					}
				} else if (options.logCount !== 'warn') {
					grunt.log.oklns(coungMsg);
				}
			}

			// write processed file(s)
			var filesLength = parse_result.data.length;
			var logModified = (filesLength > 1);
			var writeCount = 0;

			// This header will only be shown on the main file
			var header = '';

			if (options.banner) {
				header += options.banner + grunt.util.linefeed;
			}

			header += importer({
				numFiles: filesLength,
				output: outPutfileName,
				suffix: suffix,
				linefeed: (options.compress ? '' : grunt.util.linefeed)
			});

			header += grunt.util.linefeed;

			// print log message
			var msg = 'Found ' + numSelectors + ' selector';
			if (numSelectors !== 1) {
				msg += 's';
			}
			msg += ', ';
			if (filesLength > 1) {
				msg += 'splitting into ' + filesLength + ' files.';
			} else {
				msg += 'not splitting.';
			}
			grunt.log.verbose.writeln(msg);

			if (writeFiles) {
				parse_result.data.forEach(function (file, index) {
					var filename = outPutfileName,
						// the files are listed with the main file being the
						// last do some calculations to get the proper index.
						nth_file = (filesLength - 1) - index,

						// because of the reverse order nth_file will be 0 if
						// its the main file.
						is_main_file = !nth_file;

					// if it isn't the main file add the suffix to the filename
					if (!is_main_file) {
						filename = build_name(filename, nth_file, suffix);
					}

					filename += '.css';

					// Because files is an array there is no way of finding the
					// first file to add the banner without looping through them.
					//
					// Since we are already doing that...

					if (is_main_file) {
						file = header + file;
					}

					grunt.file.write(filename, file);

					writeCount++;

					if (logModified) {
						var lastSentence = filesLength === writeCount ? 'modified' : 'created';

						grunt.log.writeln('File ' + chalk.cyan(filename) + ' ' + lastSentence + '.');
					}

				});

			}

			next();
		});
	});
};
