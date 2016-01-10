'use strict';
var gulp = require('gulp'); // Load Gulp!
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
gulp.task('scss', function () {
  gulp.src('./scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    gulp.watch('./scss/**/*.scss', ['scss']);
    gulp.watch(["index.html", "index2.html","index3.html","index4.html", "js/*.js", "css/*.css"]).on('change', browserSync.reload);
});