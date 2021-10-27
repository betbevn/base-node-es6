// Import `src` and `dest` from gulp for use in the task.
const { src, dest } = require("gulp");

// Import Gulp plugins.
const babel = require("gulp-babel");
const plumber = require("gulp-plumber");

exports.default = function () {
  return (
    // src("./src/components/**/*.js")
    src("./server/**/*.js")
      // Stop the process if an error is thrown.
      .pipe(plumber())
      // Transpile the JS code using Babel's preset-env.
      .pipe(babel())
      // Save each component as a separate file in dist.
      .pipe(dest("./build"))
  );
};
