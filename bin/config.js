'use strict';

const path = require('path');
const fs = require('fs');

// ============================================================================
// 1. Ensure the config file exists.
// ============================================================================

const configUrl = path.join(process.cwd(), 'webq.config.js');
if (!fs.existsSync(configUrl)) {
  throw new Error('webq.config.js configuration file not found.');
}
// Get user config
const userFileConfig = require(configUrl);

// ============================================================================
// 2. Ensure the user specified all of the required options.
// ============================================================================

// List of options that must be specified in the config file.
const requiredOptions = ['entry', 'output'];

// Ensure all required options were specified by the user.
// This collects all the missing options in an array so that all of them can be
// displayed later, instead of only the first missing option being displayed.
const missingOptions = requiredOptions.filter(prop => !userFileConfig.hasOwnProperty(prop));

// If any required options are missing, throw an error informing the user about
// all the missing options.
if (missingOptions.length > 0) {
  const errorMessage = 'The following required options are missing from the webq.config.js file: '
      + missingOptions.map(s => '\"' + s + '\"').join(', ') + '.';
  throw new Error(errorMessage);
}

// ============================================================================
// 3. Construct and export config object.
// ============================================================================

const config = {};
config.entryFile = path.join(process.cwd(), userFileConfig.entry);
config.entryDir = path.dirname(config.entryFile);
config.outputFile = path.join(process.cwd(), userFileConfig.output);
config.outputDir = path.dirname(config.outputFile);
config.packers = Array.isArray(config.packers) ? config.packers : [];

module.exports = config;
