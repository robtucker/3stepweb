'use strict';

var gulp = require('gulp'),
    config = require('../config'),
    gulpProtractor = require('gulp-protractor'),
    protractor = gulpProtractor.protractor;

function runTests () {

    gulp.src('test/e2e/**/*.js')
        .pipe(protractor({
            configFile: config.test.protractor
        }))
        .on('error', function(err) {
            // Make sure failed tests cause gulp to exit non-zero
            throw err;
        })
        .on('end', function() {
            process.exit();
        });
}

gulp.task('webdriver-update', gulpProtractor.webdriver_update);
gulp.task('webdriver', gulpProtractor.webdriver);

gulp.task('protractor', ['webdriver-update', 'webdriver'], runTests);