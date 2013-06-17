grunt-bless
===========

A grunt module for [Blessing](http://blesscss.com/) your CSS files so they will work in Internet Explorer. This is based on a [pull request](https://github.com/paulyoung/bless.js/pull/11) by Aki Alexandra Nofftz (@akinofftz).

Getting Started
---------------

This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-bless --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

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

#### options.compress ####

Type: `Boolean`
Default value: `false`

Compress the css output.

#### options.cleanup ####

Type: `Boolean`
Default value: `true`

Clean up.

#### options.force ####

Type: `Boolean`
Default value: `false` if grunt `--force` flag is not set

Override the Grunt option for this task.

#### options.imports ####

Type: `Boolean`
Default value: `true`

Enable or disable the use of `@import` in generated CSS files.

#### options.cacheBuster ####

Type: `Boolean`
Default value: `true`

Add or remove a cache-buster parameter from the generated CSS files.

### Usage Examples ###

#### Default Options ####

The default options will split the files and add a cache-buster paramter. Just as the defaults for `blessc` are.

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

Contributing
------------

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

Release History
---------------

- **0.1.1** Fatal documentation flaw, no actual code changes, thanks @codecollision
- **0.1.0** Initial release, courtesy of Aki Alexandra Nofftz
