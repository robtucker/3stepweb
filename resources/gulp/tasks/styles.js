'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    utils = require('../utils.js'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');

var conf = config.styles;

var compile = function() {
    gulp.src(conf.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(conf.dest));
};

gulp.task('styles', function () {
    compile();
});