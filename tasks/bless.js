/*
 * Provides bless.js as Grunt task
 *
 * Copyright (c) Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

var _libFile = require('../lib/file');

var file_utils = _libFile;

var MAX_SELECTORS = 4095,
    WARN_PERCENT = 0.98,
    OVERWRITE_ERROR = 'The destination is the same as the source for file ',
    OVERWRITE_EXCEPTION = 'Cowardly refusing to overwrite the source file.',
    DEFAULT_SUFFIX = '';

module.exports = function (grunt) {
	var path = require('path'),
	    async = require('async'),
	    bless = require('bless'),
	    util = require('util'),
	    chalk = require('chalk');

	grunt.registerMultiTask('bless', 'Split CSS files suitable for IE', function () {

		// Taking list of files with write destination or list without dest
		var files = this.files,
		    fileList = files.length === 1 && !files[0].dest ? files[0].src : files,
		    options = this.options({
			compress: false,
			logCount: false,
			force: grunt.option('force') || false,
			warnLimit: Math.floor(MAX_SELECTORS * WARN_PERCENT),
			imports: true,
			failOnLimit: false,
			suffix: DEFAULT_SUFFIX
		});

		grunt.log.writeflags(options, 'options');

		async.each(fileList, function (inputFile, next) {
			var writeFiles = !!inputFile.dest,
			    output_filename_orig = inputFile.dest || inputFile,
			    outPutfileName = file_utils.strip_extension(output_filename_orig),
			    limit = MAX_SELECTORS,
			    suffix = options.suffix,
			    data = '',
			    parse_result;

			// If we are not forcing the build refuse to overwrite the
			// source file.
			if (writeFiles) {
				if (!options.force && inputFile.src.indexOf(inputFile.dest) >= 0) {
					grunt.log.error(OVERWRITE_ERROR + inputFile.dest);
					throw grunt.util.error(OVERWRITE_EXCEPTION);
				}
			}

			data = file_utils.concat(grunt.file, inputFile);

			parse_result = bless.chunk(data);

			var numSelectors = parse_result.totalSelectorCount;

			if (options.logCount) {
				var overLimit = numSelectors > limit,
				    _numSelectors = chalk.green(numSelectors);

				if (overLimit) {
					_numSelectors = chalk.red(numSelectors);
				} else if (numSelectors > options.warnLimit) {
					_numSelectors = chalk.yellow(numSelectors);
				}

				var countMsg = path.basename(outPutfileName) + ' has ' + _numSelectors + ' CSS selectors.';

				if (overLimit) {
					var overLimitErrorMessage = countMsg + ' IE8-9 will read only first ' + limit + '!';

					grunt.log.errorlns(overLimitErrorMessage);

					if (options.failOnLimit) {
						throw grunt.util.error(chalk.stripColor(overLimitErrorMessage));
					}
				} else if (options.logCount !== 'warn') {
					grunt.log.oklns(countMsg);
				}
			}

			// write processed file(s)
			var filesLength = parse_result.data.length;
			var is_modified = filesLength > 1;

			// print log message
			var msg = 'Found ' + numSelectors + ' selector';

			if (numSelectors !== 1) {
				msg += 's';
			}

			msg += ', ';

			if (is_modified) {
				msg += 'splitting into ' + filesLength + ' files.';
			} else {
				msg += 'not splitting.';
			}

			grunt.log.verbose.writeln(msg);

			if (writeFiles) {
				(function () {
					// This header will only be shown on the main file
					var header = '',
					    main_file = filesLength - 1,
					    writeCount = 0;

					if (options.banner) {
						header += options.banner + grunt.util.linefeed;
					}

					header += file_utils.imports({
						numFiles: filesLength,
						output: outPutfileName,
						suffix: suffix,
						linefeed: options.compress ? '' : grunt.util.linefeed
					});

					header += grunt.util.linefeed;

					// The main file is always the last one in the array.
					// So add the header here before we iterate.
					parse_result.data[main_file] = header + parse_result.data[main_file];

					// Iterate the files and write them out.
					parse_result.data.forEach(function (file, index) {
						// the files are listed with the main file being the
						// last do some calculations to get the proper index.
						var nth_file = main_file - index,
						   

						// build the filename
						filename = file_utils.name(outPutfileName, nth_file, suffix, file_utils.EXTENSION);

						grunt.file.write(filename, file);

						writeCount++;

						if (is_modified) {
							var lastSentence = filesLength === writeCount ? 'modified' : 'created';

							grunt.log.writeln('File ' + chalk.cyan(filename) + ' ' + lastSentence + '.');
						}
					});
				})();
			}

			next();
		});
	});
};
