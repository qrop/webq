'use strict';

var path = require('path');
var fs = require('fs');

function packHtml($, config) {
  inlineIncludes($('html'), config.entryDir);
}

function inlineIncludes($, baseUrl) {
  console.log('wat');
  $.find('include').each(function () {
    var url = this.attribs.url;

    if (!url || path.isAbsolute(url)) {
      // Ignore <include> elements without (or empty) url attributes,
      // and includes whose url is an absolute path.
      return;
    }

    // Get the contents of the included file
    var includePath = path.join(baseUrl, url);
    var includeHtml = fs.readFileSync(includePath, 'utf8');

    //var $this = $(this);
    // Replace the <include> element with the loaded html
    $.replaceWith(includeHtml);

    inlineIncludes($, path.dirname(includePath));
  });
}

module.exports = {
  packHtml: packHtml
};
