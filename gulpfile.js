(function () {
  'use strict';

  /********************************************************
    DEPENDENCIES AND DIRECTORY LOCATIONS
  ********************************************************/

  // Require dependencies
  const gulp     = require('gulp');
  const del      = require('del');
  const cleanCSS = require('gulp-clean-css');
  const concat   = require('gulp-concat');
  const connect  = require('gulp-connect');
  const imagemin = require('gulp-imagemin');
  const rename   = require("gulp-rename");
  const replace  = require('gulp-replace');
  const sass     = require('gulp-sass');
  const maps     = require('gulp-sourcemaps');
  const uglify   = require('gulp-uglify');

  // Locations of src and dist directories
  const options = {
    src: './src',
    dist: './dist'
  };

  /********************************************************
    BUILD FILES FOR DISTRIBUTION
  ********************************************************/

  // 'gulp html': copy index.html to ./dist
  gulp.task('html', function () {
    gulp.src(options.src + '/index.html')
      .pipe(replace('css/', 'styles/'))
      .pipe(replace('js/', 'scripts/'))
      .pipe(replace('images/', 'content/'))
      .pipe(replace('/global.', '/all.min.'))
      .pipe(gulp.dest('./dist'))
      .pipe(connect.reload()); });

  // 'gulp scripts': concat & minify all JS files, copy to ./dist/scripts/all.min.js
  gulp.task('scripts', function () {
    gulp.src(options.src + '/js/**/*.js')
      .pipe(maps.init())
        .pipe(concat('global.js'))
        .pipe(uglify())
      .pipe(maps.write())
      .pipe(rename("all.min.js"))
      .pipe(gulp.dest(options.dist + '/scripts')); });

  // 'gulp styles': compile SCSS into CSS, concat & minify, then copy to ./dist/styles/all.min.css
  gulp.task('styles', function () {
    return gulp.src(options.src + '/sass/**/*.scss')
      .pipe(maps.init())
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
      .pipe(maps.write())
      .pipe(rename("all.min.css"))
      .pipe(gulp.dest(options.dist + '/styles')); });

  // 'gulp images': optimize images and copy into ./dist/content
  gulp.task('images', function () {
    gulp.src(options.src + '/images/*')
      .pipe(imagemin())
      .pipe(gulp.dest(options.dist + '/content')); });

  // 'gulp clean': delete all files & folders in ./dist
  gulp.task('clean', function () {
    return del(options.dist + '/**'); });

  // 'gulp build': optimize scripts, styles, & images for distribution
  gulp.task('build', ['clean'], function () {
    return gulp.start(['html', 'scripts', 'styles', 'images']); });

  /********************************************************
    SERVE FILES AND WATCH
  ********************************************************/

  // 'gulp connect': start a local web server on port 3000
  gulp.task('connect', function() {
    connect.server({
      root: './dist',
      livereload: true,
      port: 3000 }); });

  // 'gulp loadNewStyles': call 'gulp styles'; once complete, refresh the browser
  gulp.task('loadNewStyles', ['styles'], function () {
    gulp.src(options.dist + '/index.html')
      .pipe(connect.reload()); });

  // 'gulp watch': on changes to Sass files, recompile and refresh page
  gulp.task('watch', function () {
    gulp.watch([options.src + '/sass/**/*.scss'], ['loadNewStyles']); });

  // 'gulp': build the page, then serve project on a local web server and watch for changes to Sass files
  gulp.task('default', ['build'], function () {
    gulp.start(['connect', 'watch']); });
})();
