/*global describe, it */

'use strict';

var file_utils = require('../../lib/file');
var assert = require('assert');

describe('A library of file utilities', function () {
	describe('A function that builds the filename of a split CSS file', function () {
		var FILE_BASE = 'base',
			FILE_SUFFIX = 'suffix-',
			FILE_EXTENSION = 'ext';

		it('should return a file name with no suffix when its the first file', function () {
			var filename = file_utils.name(FILE_BASE, 0, FILE_SUFFIX, FILE_EXTENSION);

			assert.equal('base.ext', filename);
		});

		it('should return a file name with a suffix when its not the first file', function () {
			var filename = file_utils.name(FILE_BASE, 1, FILE_SUFFIX, FILE_EXTENSION);

			assert.equal('base.suffix-1.ext', filename);
		});

		it('should throw an error if file number is negative', function () {
			assert.throws(function () {
				file_utils.name(FILE_BASE, -1, FILE_SUFFIX, FILE_EXTENSION);
			}, Error);
		});
	});

	describe('A function that strips a file extension', function () {
		var FILE_NAME_CSS = 'base.css',
			FILE_NAME_CSS_MULTI = 'base.ext.css',
			FILE_NAME_OTHER = 'base.ext',
			FILE_NAME_OTHER_MULTI = 'base.css.ext';

		it('should return a file name with out an extension when its a CSS file', function () {
			var base = file_utils.strip_extension(FILE_NAME_CSS);

			assert.equal('base', base);
		});

		it('should return a file name with out an extension when its a CSS file with multiple extensions', function () {
			var base = file_utils.strip_extension(FILE_NAME_CSS_MULTI);

			assert.equal('base.ext', base);
		});

		it('should return a file name unchanged if its another file type', function () {
			var base = file_utils.strip_extension(FILE_NAME_OTHER);

			assert.equal('base.ext', base);
		});

		it('should return a file name with out an extension when its another file type with multiple extensions', function () {
			var base = file_utils.strip_extension(FILE_NAME_OTHER_MULTI);

			assert.equal('base.css.ext', base);
		});
	});

	describe('A function that generate a list of imports', function () {
		var FILE_BASE = 'base',
			FILE_SUFFIX = 'suffix-';

		it('should return no imports if the file is not split', function () {
			var filename = file_utils.imports({
				'numFiles': 1,
				'output': FILE_BASE,
				'suffix': FILE_SUFFIX,
				'root': '',
				'linefeed': '\n'
			});

			assert.equal('', filename);
		});

		it('should return imports that are relative to the stylesheet not the root', function () {
			var filename = file_utils.imports({
				'numFiles': 2,
				'output': 'tmp/' + FILE_BASE,
				'suffix': FILE_SUFFIX,
				'root': '',
				'linefeed': '\n'
			});

			assert.equal('@import "base.suffix-1.css";\n', filename);
		});

		it('should return imports with a domain and path if a root is specified', function () {
			var filename = file_utils.imports({
				'numFiles': 2,
				'output': FILE_BASE,
				'suffix': FILE_SUFFIX,
				'root': '//example.com/example/path/',
				'linefeed': '\n'
			});

			assert.equal('@import "//example.com/example/path/base.suffix-1.css";\n', filename);
		});
	});
});
