# grunt-ckeditor-contenttemplates

> Create config file for CKEditor Content Templates plugin.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ckeditor-contenttemplates --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ckeditor-contenttemplates');
```

## The "ckeditor_contenttemplates" task

### Overview
This plugin creates the configuration JavaScript file for the [CKEditor custom templates](http://ckeditor.com/addon/templates) plugin. 

### Example template file

```html
title: Image and Title
image: template1.gif
description: One main image with a title and text that surround the image.
--
<h3>
  // Use src=" " so image is not filtered out by the editor as incorrect (src is required).
  <img src=" " alt="" style="margin-right: 10px" height="100" width="100" align="left" />
  Type the title here
</h3>
<p>
  Type the text here
</p>
```

### Example Grunt Config

```js
grunt.initConfig({
  ckeditor_contenttemplates: {
    options: {},
    files: {
      'dest/default.js': ['templates/**'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* V0.1.0 First Release
