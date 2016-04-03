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

    console.log(doc['app']);
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

function pathsGenerator (dirName) {
  let dirMap = PATHS[dirName];
    console.log(dirMap);
  const tempPath = `${process.cwd()}/${PATHS[dirName].root}`;



  for(let key in dirMap) {
    if (key === 'root') {
      dirMap[key] = tempPath;
    } else{
      dirMap[key] = `${tempPath}/assets/${dirMap[key]}`;
    }
  }

  return dirMap;
};


export const APP_DIR = pathsGenerator('app');
export const DIST_DIR = pathsGenerator('dist');
export const STYLEGUIDE_DIR = pathsGenerator('styleguide');
