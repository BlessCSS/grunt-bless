/*
 * Provides bless.js as Grunt task
 *
 * Copyright (c) Aki Alexandra Nofftz
 * Licensed under the MIT license.
 */

'use strict';

export const EXTENSION = 'css';
export const SOURCEMAP_EXTENSION = 'css.map';

const EXTENSION_SEP = '.';

export function name(base, nth_file, suffix, extension) {
	if (nth_file < 0) {
		throw new Error('The file number should not be negative');
	}

	// if it isn't the main file add the suffix to the filename
	return base + (!nth_file ? '' : '.' + suffix + nth_file) + EXTENSION_SEP + extension;
}

export function strip_extension(filename) {
	let output_filename_parts = filename.split(EXTENSION_SEP);

	if (output_filename_parts[output_filename_parts.length - 1] === EXTENSION) {
		output_filename_parts.pop();
	}

	return output_filename_parts.join(EXTENSION_SEP);
}

export function imports(options) {
	let current = options.numFiles - 1,
		statements = '';

	while (current > 0) {
		let _name = name(options.output, current, options.suffix, EXTENSION),
			_splitted = _name.split('/');

		_name = _splitted[_splitted.length - 1];
		statements += '@import "' + options.root + _name + '";' + options.linefeed;

		current--;
	}

	return statements;
}

export function concat(grunt_file, input) {
	let data = '';

	// Read and concat files
	if (Array.isArray(input.src)) {
		for (let file of input.src) {
			data += grunt_file.read(file);
		}
	} else {
		console.log('it is not an array.');
		data += grunt_file.read(input);
	}

	return data;
}
