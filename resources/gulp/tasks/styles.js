'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps');

gulp.task('styles', function () {

    gulp.src(config.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.styles.dest.main))
        .pipe(gulp.dest(config.styles.dest.admin));

});