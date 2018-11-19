const gulp = require('gulp');
const sass = require('gulp-sass');

const del = require('del');

function clean() {
  return del(['assets']);
}

function styles() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('assets/css'));
}

// CommonJs `exports` module
exports.clean = clean;
exports.styles = styles;
