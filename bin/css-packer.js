'use strict';

var path = require('path');
var fs = require('fs');

function packCss($, config) {
  $('link[rel="stylesheet"]').each(function () {
    var href = this.attribs.href;

    if (!href || path.isAbsolute(href)) {
      return;
    }

    var stylePath = path.join(config.entryDir, href);
    var styleContent = fs.readFileSync(stylePath, 'utf8');

    var inlinedContent = inlineImports(styleContent, path.dirname(stylePath));
    var outputFileName = path.basename(href);
    fs.writeFileSync(path.join(config.outputDir, outputFileName), inlinedContent);

    this.attribs.href = outputFileName;
  });
}

function inlineImports(css, baseUrl) {
  var lines = css.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i].trim();

    if (ln.indexOf('@import ') === 0) {
      // Found an @import statement

      var importUrl = ln.slice(9, -2);
      var importContents = fs.readFileSync(path.join(baseUrl, importUrl), 'utf8');

      lines[i] = importContents;
    }
  }

  return lines.join('\n');
}

module.exports = {
  packCss: packCss
};
