'use strict';

// =================================
// # node-modules
// =================================

import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import requireDir from 'require-dir';
import * as yaml  from 'js-yaml';
import gulpLoadPlugins from 'gulp-load-plugins';
import hologram from 'node-hologram';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// =================================
// # setup
// =================================

// load directories map

const PATHS = (() => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/setting.yml`, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

// styleguide setting
const hologramOpt = (() => {
  try {
    const doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/styleguide.yml`, 'utf8'));
    return doc;
  } catch (e) {
    console.log(e);
  }
})();

// =================================
// # tasks
// =================================


gulp.task('check', () => {
  console.log('check!');
});

// https://blog.raananweber.com/2015/12/15/check-if-a-directory-exists-in-node-js/
function isExist (path, func, cb) {
  fs.stat(path, (err, stats) => {
    // Check path
    if (err && err.errno === 34) {
      func();
    } else {
      cb(err);
    }
  })
};

// --------------------------
//  core tasks
// --------------------------

gulp.task('init', () => {
  const distDir = PATHS.dist;

  // make 'dist/' when which isn't exitst.
  fs.mkdirSync(distDir.root, (err) => {
    // const directories = PATHS.dist;
    if (err) {
      console.log(err);
      return 1;
    }
  });

  // make assets directories
  for(const path in distDir.assets) {
    fs.mkdirSync(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});


// --------------------------
//  stylesheets
// --------------------------
gulp.task('styles', () => {
  return gulp.src(`${PATHS.src.assets.style}**/*.scss`)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(PATHS.dist.assets.style))
});

// --------------------------
//  js
// --------------------------
gulp.task('js', () => {

});

// --------------------------
//  templates
// --------------------------

// jade
gulp.task('temp:jade', () => {

});

// slime
gulp.task('temp:slim', () => {
  return gulp.src(`${PATHS.src.assets.templates}**/*.slim`)
    .pipe($.slim({
      pretty: true
    }))
    .pipe(gulp.dest(PATHS.dist.assets.html));
});


// --------------------------
//  utility for preprocessor
// --------------------------
gulp.task('source-map', () => {

});

// --------------------------
//  styleguide node-hologram
// --------------------------

gulp.task('styleguide', () => {
  hologram(hologramOpt).init();
});

// --------------------------
//  Server
// --------------------------

gulp.task('serve', ['styles', 'temp:slim'],  () => {
  browserSync.init({
    server:{
      baseDir:PATHS.dist.root
    }
  });

  gulp.watch(`${PATHS.src.assets.style}**/*.scss`, ['styles', 'styleguide', reload]);
  gulp.watch(`${PATHS.src.assets.templates}**/*.slim`, ['temp:slim']);
  gulp.watch(`${PATHS.dist.root}**/*.html`, [reload]);
});

gulp.task('default', () =>
  runSequence('styles', 'temp:slim', 'styleguide')
);
