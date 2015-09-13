'use strict';

const path = require('path');
const fs = require('fs');

function packHtml($, config) {
  const includeCache = {};
  const includeStack = {};
  inlineIncludes($, $('html'), config.entryDir, includeCache, includeStack);
}

/**
 * Recursively parse <include> elements, inserting their contents.
 */
function inlineIncludes($, element, baseUrl, includeCache, includeStack) {
  element.find('include').addBack('include').each(function () {
    var url = this.attribs.url;

    if (!url || path.isAbsolute(url)) {
      // Ignore <include> elements without (or empty) url attributes,
      // and includes whose url is an absolute path.
      return;
    }

    // ========================================================================
    // 1. Get the contents of the <include> file
    // ========================================================================
    const includePath = path.join(baseUrl, url);

    // 1.1 - Avoid circular includes, otherwise they would cause an error;
    // or even worse - an indefinite holdup.
    if (includeStack.hasOwnProperty(includePath)) {
      throw new Error('Circular <include> encountered.');
    }

    // 1.2 - Check if the file has been read and cached before, if not read it
    // and cache it.
    let includeHtml = includeCache.hasOwnProperty(includePath)
        ? includeCache[includePath]
        : includeCache[includePath] = fs.readFileSync(includePath, 'utf8');

    // ========================================================================
    // 2. Replace the <include> element with the loaded html.
    // ========================================================================
    const replacement = $(includeHtml);
    $(this).replaceWith(replacement);

    // ========================================================================
    // 3. Continue to any inner <include> tags that were present in the loaded
    //    html.
    // ========================================================================
    includeStack[includePath] = true;
    inlineIncludes($, replacement, baseUrl, includeCache, includeStack);
    delete includeStack[includePath];
  });
}

module.exports = {
  pack: packHtml
};
