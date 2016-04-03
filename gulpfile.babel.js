'use strict';

/**
 * --------------------------------------------------------------------------
 * Gulp-starter-kit
 * --------------------------------------------------------------------------
 */

// node-modules
import "babel-polyfill";
import fs from 'fs';
import path from 'path';
import gulp from 'gulp';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import requireDir from 'require-dir';
import * as yaml  from 'js-yaml';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();
const brSync = browserSync.create();
const brSyncStyle = browserSync.create();
const reload = brSync.reload;
const reloadStyle = brSyncStyle.reload;

import {APP_DIR, DIST_DIR, STYLEGUIDE_DIR} from './gulp/setting';

/**
 * --------------------------------------------------------------------------
 * Setup
 * --------------------------------------------------------------------------
 */

// gulp.task('test', () => {
//   console.log(APP_DIR);
//   console.log(DIST_DIR);
//
// });

// load directories map

// const PATHS = ( () => {
//   try {
//     const doc = yaml.safeLoad(fs.readFileSync(`${__dirname}/setting.yml`, 'utf8'));
//     return doc;
//   } catch (e) {
//     console.log(e);
//   }
// })();


/**
 * --------------------------------------------------------------------------
 * Tasks
 * --------------------------------------------------------------------------
 */

//  core tasks

gulp.task('init', () => {

  // make 'dist/' when which isn't exitst.
  fs.mkdirSync(DIST_DIR.root, (err) => {
    if (err) {
      console.log(err);
      return 1;
    }
  });

  fs.mkdirSync(STYLEGUIDE_DIR.root, (err) => {
    if (err) {
      console.log(err);
      return 1;
    }
  });

  // make assets directories
  for(const path in DIST_DIR) {
    if (path !== 'root')
    fs.mkdirSync(path, (err) => {
      if (err) {
        console.log(err);
      }
    });
  }
});


// --------------------------
//  stylesheets
gulp.task('styles', () => {
  return gulp.src(`${APP_DIR.style}**/*.scss`)
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(DIST_DIR.style))
});

// --------------------------
//  js
// --------------------------
// gulp.task('js', () => {
//
// });

// --------------------------
//  templates
// --------------------------

// jade
// gulp.task('temp:jade', () => {
//
// });

// slime
gulp.task('temp:slim', () => {
  return gulp.src(`${APP_DIR.templates}**/*.slim`)
    .pipe($.slim({
      pretty: true
    }))
    .pipe(gulp.dest(DIST_DIR.html));
});


// --------------------------
//  utility for preprocessor
// --------------------------
// gulp.task('source-map', () => {
//
// });

// --------------------------
//  styleguide node-hologram
// --------------------------

gulp.task('styleguide', () => {
  return gulp.src('./hologram_config.yml')
    .pipe($.hologram({logging:true}));
});

// --------------------------
//  Server
// --------------------------

gulp.task('serve', () => {
  runSequence('serve:dist', 'serve:styleguide');
});

gulp.task('serve:dist', ['styles', 'temp:slim', 'styleguide'],  () => {
  brSync.init({
    server:{
      baseDir:DIST_DIR.root
    },
    port: 3000,
    ui : {
      port: 3001,
      weinre: {
        port: 8080
      }
    }
  });
  gulp.watch([`${APP_DIR.style}/**/*.scss`], ['styles', 'styleguide', reload]);
  gulp.watch([`${APP_DIR.templates}/**/*.slim`], ['temp:slim']);
  gulp.watch([`${DIST_DIR.root}/**/*.html`], [reload]);
});

gulp.task('serve:styleguide', ['styleguide'],  () => {
  brSyncStyle.init({
    server:{
      baseDir:STYLEGUIDE_DIR.root
    },
    port: 3002,
    ui : {
      port: 3003,
      weinre: {
        port: 8080
      }
    }
  });
  gulp.watch([`${DIST_DIR.style}/**/*.css`], [reloadStyle]);
});

gulp.task('default', () =>
  runSequence('styles', 'temp:slim', 'styleguide')
);
