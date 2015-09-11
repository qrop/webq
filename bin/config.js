'use strict';

var path = require('path');
var fs = require('fs');

// ============================================================================
// 1. Ensure a config file exists.
// ============================================================================

var configUrl = path.join(process.cwd(), 'webq.config.js');
if (!fs.existsSync(configUrl)) {
  throw new Error('webq.config.js configuration file not found.');
}
// Get user config
var userFileConfig = require(configUrl);

// ============================================================================
// 2. Ensure the user specified all of the required options.
// ============================================================================

// List of options that must be specified in the config file.
var requiredOptions = ['entry', 'output'];

// Ensure all required options were specified by the user.
// This collects all the missing options in an array so that all of them can be
// displayed later, instead of only the first missing option being displayed.
var missingOptions = requiredOptions.filter(function (prop) {
  return !userFileConfig.hasOwnProperty(prop);
});

// Throw an error showing all of the missing options.
if (missingOptions.length > 0) {
  var errorMessage = 'The following required options are missing from the webq.config.js file: '
      + missingOptions.map(function (s) {
        return '"' + s + '"';
      }).join(', ') + '.';
  throw new Error(errorMessage);
}

// ============================================================================
// 3. Construct and export config object.
// ============================================================================

var config = {};

config.entryFile = path.join(process.cwd(), userFileConfig.entry);
config.outputFile = path.join(process.cwd(), userFileConfig.output);
config.entryDir = path.dirname(userFileConfig.entry);
config.outputDir = path.dirname(userFileConfig.output);

module.exports = config;
