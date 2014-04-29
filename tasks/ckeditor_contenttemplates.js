/*
 * grunt-ckeditor-contenttemplates
 * https://github.com/davidjbradshaw/grunt-ckeditor-contenttemplates
 *
 * Copyright (c) 2014 David J. Bradshaw
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var 
      _ = require('lodash'),
      S = require('string');


  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('ckeditor_contenttemplates', 'Create config file for CKEditor Content Templates plugin.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      punctuation: '.',
      separator: ', '
    });

    var 
        CR  = grunt.util.normalizelf('\n'),
        TAB = '  ';

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).map(function(templateContents){

        function wrapQuotes(line){
          var INDENT = first ? '' : TAB + TAB + TAB + TAB;
          first = false;
          return INDENT + "'" + line + "' +";
        }

        function makeProperty(line){
          function process(name,val){
            val = S(val.trim()).chompLeft("'").chompRight("'").s.replace(/\\\'/,'\'').replace(/'/,'\\\'');
            return TAB + TAB + TAB + name + ": '" + val + "',"; 
          }

          return process.apply(null,line.split(':'));
        }

        function splitLines (lines){
          return _.without(lines.split(CR),''); // Get rid of empty lines
        }

        var
            first      = true,
            parts      = templateContents.split('--'),
            attribs    = splitLines(parts[0]).map(makeProperty).join(CR),
            HTMLString = TAB + TAB + TAB + 'html: ' + splitLines(parts[1]).map(wrapQuotes).join(CR);

        return  TAB + TAB + '{' + CR +
                attribs + CR +
                S(HTMLString).chompRight(' +').s + CR +
                TAB + TAB + '}';

      }).join(grunt.util.normalizelf(options.separator)+CR);

      var prefix =
          "CKEDITOR.addTemplates( 'default', {" + CR +
          TAB + "imagesPath: CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'templates' ) + 'templates/images/' )," + CR +
          TAB + "templates: [" + CR;

      src = prefix +
            S(src).chompRight(',').s +
            CR + TAB + ']' + CR + '} );';

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
