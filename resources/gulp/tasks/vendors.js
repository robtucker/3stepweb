'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    gutil = require('gulp-util'),
    path = require('path'),
    concat = require('gulp-concat');

gulp.task('vendors', function ()
{
    var js = config.vendors.js;
    var css = config.vendors.css;

    var paths = [];
    for (var i = 0; i < js.src.length; i++) {
        paths.push(path.join(config.bower, js.src[i]));
    }

    gulp.src(paths)
        .pipe(concat(js.targetName))
        .pipe(gulp.dest(js.dest.main))
        .pipe(gulp.dest(js.dest.admin));
});

