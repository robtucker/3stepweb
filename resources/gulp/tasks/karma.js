'use strict';

var gulp = require('gulp'),
    config = require('../config'),
    karma = require('karma'),
    path = require('path');

gulp.task('karma', function() {

    new karma.server({
        configFile: path.resolve(__dirname, '../..', config.test.karma),
        singleRun: true
    }).start();

});