'use strict';

// * Load settings from setting.yml

// =================================
// # node-modules
// =================================

import fs from 'fs';
import * as yaml  from 'js-yaml';

// =================================
// # node-modules
// =================================

const PATHS = (() => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/setting.yml`, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

export const srcDir = PATHS;
