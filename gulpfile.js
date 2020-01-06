'use strict';

/********************************************************
  DEPENDENCIES AND DIRECTORY LOCATIONS
********************************************************/

// Require dependencies
const { dest, parallel, series, src, watch } = require('gulp');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const maps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

// Locations of src and dist directories
const options = {
  src: './src',
  dist: './dist',
};

/********************************************************
  BUILD FILES FOR DISTRIBUTION
********************************************************/

// 'gulp html': copy index.html to ./dist
function html() {
  return src(options.src + '/index.html')
    .pipe(replace('css/', 'styles/'))
    .pipe(replace('js/', 'scripts/'))
    .pipe(replace('images/', 'content/'))
    .pipe(replace('/global.', '/all.min.'))
    .pipe(dest('./dist'))
    .pipe(connect.reload());
};

// 'gulp scripts': concat & minify all JS files, copy to ./dist/scripts/all.min.js
function scripts() {
  return src(options.src + '/js/**/*.js')
    .pipe(maps.init())
      .pipe(concat('global.js'))
      .pipe(uglify())
      .pipe(rename('all.min.js'))
    .pipe(maps.write('./maps'))
    .pipe(dest(options.dist + '/scripts'));
};

// 'gulp styles': compile SCSS into CSS, concat & minify, then copy to ./dist/styles/all.min.css
function styles() {
  return src(options.src + '/sass/**/*.scss')
    .pipe(maps.init())
      .pipe(sass())
      .pipe(cleanCSS({ compatibility: 'ie8' }))
      .pipe(rename('all.min.css'))
    .pipe(maps.write('./maps'))
    .pipe(dest(options.dist + '/styles'));
};

// 'gulp images': optimize images and copy into ./dist/content
function images(cb) {
  return src(options.src + '/images/*')
    .pipe(imagemin())
    .pipe(dest(options.dist + '/content'));
};

// 'gulp clean': delete all files & folders in ./dist
function clean() {
  return del(options.dist + '/**');
};

/********************************************************
  SERVE FILES AND WATCH
********************************************************/

// 'gulp connect': start a local web server on port 3000
function dial(cb) {
  connect.server({
    root: './dist',
    livereload: true,
    port: 3000, });
  cb();
};

// 'gulp watch': on changes to Sass files, recompile and refresh page
function watcher(cb) {
  watch([options.src + '/sass/**/*.scss'])
    .on('change', styles);
  cb();
};

exports.build = series(clean, parallel(html, scripts, styles, images));
exports.default = series(exports.build, parallel(watcher, dial));
