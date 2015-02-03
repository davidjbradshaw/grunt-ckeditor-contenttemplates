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

  var 
      CR  = grunt.util.normalizelf('\n'),
      TAB = '  ';

  var options;  
  
  function processFiles(f) {
    function chkFile(filepath) {
      // Warn on and remove invalid source files (if nonull was set).
      if (!grunt.file.exists(filepath)) {
        grunt.log.warn('Source file "' + filepath + '" not found.');
        return false;
      } else {
        return true;
      }
    }

    function readFile(filepath) {
      return grunt.file.read(filepath);
    }

    function buildTemplate(templateContents){
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
    }

    function seporator(){
      return grunt.util.normalizelf(options.separator)+CR;
    }

    function buildTemplates(){
      return f.src.filter(chkFile).map(readFile).map(buildTemplate).join(seporator());
    }

    function createOutputFile(){
      return "CKEDITOR.addTemplates( 'default', {" + CR +
              TAB + "imagesPath: CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'templates' ) + 'templates/images/' )," + CR +
              TAB + "templates: [" + CR +
              S( buildTemplates() ).chompRight(',').s + //Remove last comma
              CR + TAB + ']' + CR + '} );';
    }

    // Write the destination file.
    grunt.file.write(f.dest, createOutputFile());

    // Print a success message.
    grunt.log.writeln('File "' + f.dest + '" created.');
  }


  grunt.registerMultiTask('ckeditor_contenttemplates', 'Create config file for CKEditor Content Templates plugin.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    options = this.options({
                punctuation: '.',
                separator: ', '
              });

    // Iterate over all specified file groups.
    this.files.forEach(processFiles);
  });

};
