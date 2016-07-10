'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    changed = require('gulp-changed');

var conf = config.vendors;

gulp.task('vendors', function ()
{
    gulp.src(conf.src)
        .pipe(changed(conf.dest))
        .pipe(gulp.dest(conf.dest));

});

