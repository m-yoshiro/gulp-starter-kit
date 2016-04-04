'use strict';

/**
 * --------------------------------------------------------------------------
 * Setting
 * --------------------------------------------------------------------------
 */

import fs from 'fs';
import * as yaml  from 'js-yaml';

const PATHS = (() => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(`${process.cwd()}/setting.yml`, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

function pathsGenerator (dirName) {
  let dirMap = PATHS[dirName];
  const tempPath = `./${PATHS[dirName].root}`;

  for(let key in dirMap) {
    if (key === 'root') {
      dirMap[key] = tempPath;
    } else{
      dirMap[key] = `${tempPath}/${dirMap[key]}`;
    }
  }

  return dirMap;
};


export const APP_DIR = pathsGenerator('app');
export const DIST_DIR = pathsGenerator('dist');
export const STYLEGUIDE_DIR = pathsGenerator('styleguide');
