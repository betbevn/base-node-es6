// Import `src` and `dest` from gulp for use in the task.
const gulp = require("gulp");

// Import Gulp plugins.
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");

function bundleJs() {
  return (
    gulp
      .src("./server/**/*.js")
      // Stop the process if an error is thrown.
      .pipe(plumber())
      // Transpile the JS code using Babel's preset-env.
      .pipe(babel())
      // Save each component as a separate file in dist.
      .pipe(gulp.dest("./build"))
  );
}

function bundlePem() {
  return gulp.src("./server/**/*.pem").pipe(gulp.dest("./build"));
}

exports.default = gulp.series(bundleJs, bundlePem);
