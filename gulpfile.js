const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const del = require('del');

function clean() {
  return del(['dist']);
}

function styles() {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/assets/css'));
}

function pugToHtml() {
  return gulp.src('src/*.pug')
    .pipe(pug())
    .pipe(size({ title: 'pug:' }))
    .pipe(gulp.dest('dist/'));
}

function image() {
  return gulp.src('src/images/**/*.{png,gif,jpg,jpeg}')
    .pipe(newer('dist'))
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5,
      svgoPlugin: [
        { removeViewBox: true },
      ],
    }))
    .pipe(size({ title: 'image minify:' }))
    .pipe(gulp.dest('dist'));
}

// CommonJs `exports` module
exports.clean = clean;
exports.styles = styles;
exports.image = image;
exports.pugToHtml = pugToHtml;
