'use strict';

var gulp = require('gulp'),
    _ = require('lodash'),
    config = require('../config.js'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('lint', function(){
    var src = _.union(
        config.main.src,
        config.server.src
    );
    console.log(src);
});

