var config = require('../config'),
    changed = require('gulp-changed'),
    gulp = require('gulp'),
    gulpif = require('gulp-if'),
    imagemin = require('gulp-imagemin'),
    browserSync= require('browser-sync');

gulp.task('images', function() {

    return gulp.src(config.images.src)
        .pipe(changed(config.images.dest)) // Ignore unchanged files
        .pipe(gulpif(global.isProd, imagemin())) // Optimize
        .pipe(gulp.dest(config.images.dest))
        .pipe(browserSync.stream({ once: true }));

});