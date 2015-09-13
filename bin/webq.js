#!/usr/bin/env node

'use strict';

const path = require('path');
const fs = require('fs');
const config = require('./config.js');

// ============================================================================
// 1. Parse entry html
// ============================================================================

const entryHtml = fs.readFileSync(config.entryFile);
const $ = require('cheerio').load(entryHtml, {decodeEntities: false});

// ============================================================================
// 2. Pack everything.
// ============================================================================

const htmlPacker = require('./packers/html-packer.js');
const jsPacker = require('./packers/js-packer.js');
const cssPacker = require('./packers/css-packer.js');

htmlPacker.pack($, config);
jsPacker.pack($, config);
cssPacker.pack($, config);

// ============================================================================
// 3. Write output files.
// ============================================================================

fs.writeFileSync(config.outputFile, $.html());
