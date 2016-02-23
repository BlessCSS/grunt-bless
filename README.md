grunt-bless
===========

A grunt module for [Blessing](http://blesscss.com/) your CSS files so they will work in Internet Explorer. This is based on a [pull request](https://github.com/paulyoung/bless.js/pull/11) by Aki Alexandra Nofftz (@akinofftz).

Getting Started
---------------

This plugin requires Grunt `>=0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bless --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-bless');
```

The "bless" task
----------------

### Overview ###

In your project's Gruntfile, add a section named `bless` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
	bless: {
		css: {
			options: {
				// Task-specific options go here.
			},
			your_target: {
				// Target-specific file lists and/or options go here.
			}
		}
	}
})
```

### Options ###

#### options.banner ####

Type: `String`
Default value: undefined

Add a banner followed by a new line to the top of the main file, the one that
you will include in your source.

```js
	options: {
		banner: '/* this is a banner */'
	}
```

#### options.compress ####

Type: `Boolean`
Default value: `false`

Compress the css output added by bless. This _does not_ compress the CSS you
wrote. For that you should try [the cssmin plugin](https://github.com/gruntjs/grunt-contrib-cssmin).

#### options.force ####

Type: `Boolean`
Default value: `false` if grunt `--force` flag is not set

Override the Grunt option for this task. This will allow bless to overwrite the
input file.

**Changed in v0.2.0**, grunt-bless will refuse to overwrite the input file. To
return to the old behavior, set this option to true.

#### options.imports ####

Type: `Boolean`
Default value: `true`

Enable or disable the use of `@import` in generated CSS files. This feature was
added in bless.js 3.0.3.

#### options.logCount ####

Type: `Boolean | String`
Default value: `false`

If set to `true`, you'll get output with all file selectors count. If set to `warn`, you'll get only log messages only on files that reached CSS selectors limit.

#### options.failOnLimit ####

Type: `Boolean`
Default value: `false`

Requires `logCount`. If set to `true,` the process will exit with an error if the selector limit is exceeded.

#### options.suffix ####

Type: `String`
Default value: `''`
Added: v1.0.0

Add a suffix to the filename. The suffix will be added before the number and
only if it is not the main file.

#### options.sourceMaps ####

Type: `Boolean`
Default value: `false`
Added: v1.0.0

Generate sourcemaps for the provided files.

### Removed options ###

These options have been **removed** from grunt-bless and no longer function.

#### options.cacheBuster ####

Type: `Boolean`
Default value: `true`
Reason for removal:

- Removed in bless 4.0.0.
- Other plugins may provide better support.
- [See this issue](https://github.com/BlessCSS/bless/issues/57)

#### options.cleanup ####

Type: `Boolean`
Default value: `true`

Clean up files generated by bless before proceeding.

Add or remove a cache-buster parameter from the generated CSS files.

Reason for removal:

- Removed in bless 4.0.0.
- Other plugins may provide better support.


### Usage Examples ###

#### Default Options ####

The default options will split the files and add a cache-buster parameter. Just as the defaults for `blessc` are.

```js
grunt.initConfig({
	bless: {
		css: {
			options: {},
			files: {
				'tmp/above-limit.css': 'test/input/above-limit.css'
			}
		}
	}
})
```

#### Custom Options ####

You can set any option allowed by bless.

```js
grunt.initConfig({
	bless: {
		css: {
			options: {
				cacheBuster: false,
				compress: true
			},
			files: {
				'tmp/below-limit.css': 'test/input/below-limit.css'
			}
		}
	}
})
```

#### Without writing ####

If you don't want to write blessed files, you can just set input files, without destination and add logging.

```js
grunt.initConfig({
	bless: {
		css: {
			options: {
				logCount: true
			},
			src: [
				'test/input/below-limit.css'
			]
		}
	}
})
```

Contributing
------------

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

Release History
---------------

- **1.0.0**
	- Update to bless 4.0.0
	- Clean up the NPM package, thanks @mimiflynn
	- Remove use of deprecated APIs.
	- Move to ES6.
	- Other assorted clean up and formatting.
- **0.2.0**
	- Updated documentation to note the newness of the not yet released to npm `imports` option, thanks @spoike
	- Added a banner option to avoid banners getting misplaced in the blessing process, thanks @jelmerdemaat
	- Added implementation for the `force` option.
	- Added logCount option, thanks @operatino
	- Added logging on file modification and creation, thanks (again) @operatino
- **0.1.1** Fatal documentation flaw, no actual code changes, thanks @codecollision
- **0.1.0** Initial release, courtesy of Aki Alexandra Nofftz
