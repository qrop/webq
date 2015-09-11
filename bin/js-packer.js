'use strict';

var path = require('path');
var fs = require('fs');
var browserify = null;

function packJS($, config) {
  $('script').each(function () {
    var src = this.attribs.src;

    if (!src || path.isAbsolute(src)) {
      // Ignore scripts without (or empty) src attributes,
      // and scripts whose src is an absolute path.
      return;
    }

    if (!browserify) {
      // Load browserify
      browserify = require('browserify');
    }

    // Let browserify pack the javascript modules
    var b = browserify();
    b.add(path.join(config.entryDir, src));

    // Output the packed javascript file to the output file
    var outputFileName = path.basename(src);
    var outputFilePath = path.join(config.outputDir, outputFileName);
    var writeStream = fs.createWriteStream(outputFilePath);
    b.bundle().pipe(writeStream);

    // Update the src attribute to reference the new, packed file
    this.attribs.src = outputFileName;
  });
}

module.exports = {
  packJS: packJS
};
