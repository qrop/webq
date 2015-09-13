'use strict';

const path = require('path');
const fs = require('fs');
const cssImport = require('css-import');

function packCss($, config) {
  //let cssParser = null;

  $('link[rel="stylesheet"]').each(function () {
    const href = this.attribs.href;

    if (!href || path.isAbsolute(href)) {
      // Ignore <link>'s whose 'href' attribute is either empty/missing, or is an absolute path.
      return;
    }

    const filePath = path.join(config.entryDir, href);
    const outputFileName = path.basename(href);
    const outputFilePath = path.join(config.outputDir, outputFileName);
    cssImport(filePath, {dirs: []}, function (error, content) {
      fs.writeFileSync(outputFilePath, content);
    });

    // Rebase the 'href' of the <link> to reference the output css file.
    this.attribs.href = outputFileName;
  });
}

module.exports = {
  pack: packCss
};
