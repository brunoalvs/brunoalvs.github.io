'use strict'

var browserSync = require('browser-sync');
var gulp        = require('gulp');
var pug         = require('gulp-pug');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
var sourcemaps  = require('gulp-sourcemaps');
var cp          = require('child_process');

var imagemin     = require('gulp-tinypng');
var htmlmin     = require('gulp-htmlmin');

var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    browserSync.notify(messages.jekyllBuild);
    return cp.spawn('jekyll.bat', ['build'])
        .on('close', done);
});

// Rebuild Jekyll & do page reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['sass', 'pug', 'pugjob', 'sassjobs', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// SASS/SCSS to CSS in _site
gulp.task('sass', function() {
  return gulp.src('assets/sass/**.{sass,scss}')
    .pipe(sourcemaps.init())
      .pipe(sass({ onError: browserSync.notify }))
      .pipe(sass({outputStyle: 'compressed'}))
    .pipe(prefix({ browsers: ['last 2 versions'], }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.reload({stream:true}))
});

// SASS/SCSS for Jobs pages
gulp.task('sassjobs', function() {
  return gulp.src('jobs/css/**.{sass,scss}')
    .pipe(sass({ onError: browserSync.notify }))
    .pipe(prefix({ browsers: ['last 2 versions'], }))
    .pipe(gulp.dest('jobs/css'))
    .pipe(browserSync.reload({stream:true}))
});

// Travis building a gulp task for pug
gulp.task('pug', function(){
  return gulp.src('_pugfiles/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('_includes'));
});

gulp.task('pugjob', function() {
  return gulp.src('jobs/_pugfiles/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('_includes/jobs'));
});

// Watch scss files for changes & recompile. Watch html/md files, run jekyll & reload BrowserSync
gulp.task('watch', function () {
    gulp.watch('assets/sass/**/*.{sass,scss}', ['sass']);
    gulp.watch('_pugfiles/*.pug', ['pug']);
    gulp.watch('jobs/_pugfiles/*.pug', ['pugjob']);
    gulp.watch('jobs/css/**/*.{sass,scss}', ['sassjobs']);
    gulp.watch(['index.html', '_layouts/*.html', '_includes/*', '_includes/jobs/*', 'assets/css/*.css', 'jobs/*.html', 'jobs/css/*.css'], ['jekyll-rebuild']);
});

// tiny-png
gulp.task('imagemin', function() {
  return gulp.src('assets/images/**/*.{png,jpg,jpeg}')
    .pipe(imagemin('XQVIk6EjMvJX0hY9uhoxgT-DXOxFAtPn'))
    .pipe(gulp.dest('assets/images/'));
});

// minify html
gulp.task('min-html', function() {
  return gulp.src('_includes/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest('_includes/'))
});

// compress css
gulp.task('min-css-jobs', function() {
  return gulp.src('jobs/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('jobs/css/'))
});

// Default task, running just `gulp` will compile the sass, pug, compile the jekyll site, launch BrowserSync & watch files.
gulp.task('default', ['browser-sync', 'watch']);

// Minify task
gulp.task('build', ['min-css', 'min-html', 'min-css-jobs', 'imagemin'])
