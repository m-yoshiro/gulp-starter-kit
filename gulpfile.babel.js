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
// import hologram from 'node-hologram';

const $ = gulpLoadPlugins();
const brSync = browserSync.create();
const brSyncStyle = browserSync.create();
const reload = brSync.reload;
const reloadStyle = brSyncStyle.reload;

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


// =================================
// # tasks
// =================================


// --------------------------
//  core tasks
// --------------------------

gulp.task('init', () => {
  const distDir = PATHS.dist;

  // make 'dist/' when which isn't exitst.
  fs.mkdirSync(distDir.root, (err) => {
    if (err) {
      console.log(err);
      return 1;
    }
  });

  fs.mkdirSync(distDir.styleguide, (err) => {
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
  return gulp.src(`${PATHS.src.assets.templates}**/*.slim`)
    .pipe($.slim({
      pretty: true
    }))
    .pipe(gulp.dest(PATHS.dist.assets.html));
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
      baseDir:PATHS.dist.root
    },
    port: 3000,
    ui : {
      port: 3001,
      weinre: {
        port: 8080
      }
    }
  });
  gulp.watch(`${PATHS.src.assets.style}**/*.scss`, ['styles', 'styleguide', reload]);
  gulp.watch(`${PATHS.src.assets.templates}**/*.slim`, ['temp:slim']);
  gulp.watch(`${PATHS.dist.root}**/*.html`, [reload]);
});

gulp.task('serve:styleguide', ['styleguide'],  () => {
  brSyncStyle.init({
    server:{
      baseDir:PATHS.dist.styleguide
    },
    port: 3002,
    ui : {
      port: 3003,
      weinre: {
        port: 8080
      }
    }
  });
  gulp.watch(`${PATHS.dist.styleguide}**/*.css`, [reloadStyle]);
});

gulp.task('default', () =>
  runSequence('styles', 'temp:slim', 'styleguide')
);
