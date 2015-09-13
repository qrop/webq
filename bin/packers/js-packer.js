'use strict';

const path = require('path');
const fs = require('fs');

function packJS($, config) {
  let browserify = null;

  $('script').each(function () {
    const src = this.attribs.src;

    if (!src || path.isAbsolute(src)) {
      // Ignore <script>'s whose 'src' attribute is either empty/missing, or is an absolute path.
      return;
    }

    if (!browserify) {
      // Only load browserify if it's really needed.
      browserify = require('browserify');
    }

    // Let browserify pack the JavaScript modules.
    const b = browserify();
    b.add(path.join(config.entryDir, src));

    // Write the packed JavaScript to the output file.
    const outputFileName = path.basename(src);
    const outputFilePath = path.join(config.outputDir, outputFileName);
    const writeStream = fs.createWriteStream(outputFilePath);
    b.bundle().pipe(writeStream);

    // Update the src attribute to reference the new, packed file
    this.attribs.src = outputFileName;
  });
}

module.exports = {
  pack: packJS
};
