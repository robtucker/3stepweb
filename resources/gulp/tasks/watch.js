'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    path = require('path');

gulp.task('watch', function() {

    // Server scripts are automatically watched (for server restart) by Nodemon inside Server task
    // Client scripts are automatically watched (for rebundling) by Watchify inside Browserify task

    //gulp.watch(config.main.src, ['lint']);
    //gulp.watch(path.join(config.scripts.root, '/**/*.js'),  ['scripts']);
    gulp.watch(config.styles.src,  ['styles']);
    //gulp.watch(config.templates.src, ['templates']);

});