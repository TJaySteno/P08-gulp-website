// https://github.com/gulpjs/gulp/tree/v3.9.1/docs
// https://github.com/robrich/orchestrator



'use strict'

const gulp = require('gulp');

// gulp scripts command:
  // concatenate, minify, copy all js files into all.min.js file
    // Then copied to the dist/scripts folder
  // Generate source maps
gulp.task('scripts', function () {
  console.log('scripts');
});

// gulp styles command
  // compile SCSS files into CSS
    // Then concatenate and minify into all.min.css file
      // Then copied to the dist/styles folder
  // source maps are generated
gulp.task('styles', function () {
  console.log('styles');
});

// gulp images command:
  // optimize size of JPEG and PNG files
    // Then copy optimized images to the dist/content folder
gulp.task('images', function () {
  console.log('images');
});

// gulp clean command
  // delete all of the files and folders in the dist folder
gulp.task('clean', function () {
  return console.log('clean');
});

// gulp build command
  // run the clean, scripts, styles, and images tasks
    // clean task completes before the rest
gulp.task('build', ['clean'], function () {
  console.log('build');
  return gulp.start('scripts', 'styles', 'images');
});

// gulp command:
  // run the build task and serve my project using a local web server.
  // continuously watch for changes to any .scss file
    // on change, run gulp styles command
      // reload project in the browser
gulp.task('default', ['build'], function () {
  console.log('default');
});
