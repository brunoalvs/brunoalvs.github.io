const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const concat = require('gulp-concat');
const size = require('gulp-size');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const browsersync = require('browser-sync');
const del = require('del');

const server = browsersync.create();

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

function js() {
  return gulp.src('src/scripts/*.js')
    .pipe(concat('app.js'))
    .pipe(size({ title: 'js:' }))
    .pipe(gulp.dest('dist/assets/js'));
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

// BrowserSync
function reload(done) {
  server.reload();
  done();
}
function serve(done) {
  server.init({
    server: {
      baseDir: './dist/',
    },
  });

  done();
}
// Who watch the Watchers?
function watch() {
  gulp.watch('src/sass/**/*.scss', gulp.series(sass, reload));
  gulp.watch('src/scripts/**/*.js', gulp.series(js, reload));
  gulp.watch('src/**/*.pug', gulp.series(pugToHtml, reload));
  gulp.watch('src/images/**/*.{svg,png,gif,jpg,jpeg}', gulp.series(image, reload));
}

// CommonJs `exports` module
exports.clean = clean;
exports.styles = styles;
exports.image = image;
exports.pugToHtml = pugToHtml;
exports.js = js;
exports.watch = watch;
exports.serve = serve;

gulp.task('build', gulp.series(clean, gulp.parallel(pugToHtml, styles, js, image)));
gulp.task('dev', gulp.series('build', gulp.parallel(serve, watch)));
