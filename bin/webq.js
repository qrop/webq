#!/usr/bin/env node

'use strict';

var path = require('path');
var fs = require('fs');

// Read configuration from configuration file
var config = require('./config.js');

var entryHtml = fs.readFileSync(config.entryFile);
var $ = require('cheerio').load(entryHtml, {
  decodeEntities: false
});

// Load packers
var htmlPacker = require('./html-packer.js');
var jsPacker = require('./js-packer.js');
var cssPacker = require('./css-packer.js');

// Pack stuff
htmlPacker.packHtml($, config);
jsPacker.packJS($, config);
cssPacker.packCss($, config);

fs.writeFileSync(config.outputFile, $.html());
