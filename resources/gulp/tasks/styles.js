'use strict';

var gulp = require('gulp'),
    config = require('../config.js'),
    utils = require('../utils.js'),
    gulpif = require('gulp-if'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('styles', function () {

    /*
    var createSourcemap = !global.isProd || config.styles.prodSourcemap;

    return gulp.src(config.styles.src)
        .pipe(gulpif(createSourcemap, sourcemaps.init()))
        .pipe(sass({
            sourceComments: !global.isProd,
            outputStyle: global.isProd ? 'compressed' : 'nested'
        }))
        .on('error', utils.handleErrors)
        .pipe(autoprefixer('last 2 versions', '> 1%', 'ie 8'))
        .pipe(gulpif(
            createSourcemap,
            sourcemaps.write(global.isProd ? './' : null)
        ))
        .pipe(gulp.dest(config.styles.dest))

    */

    gulp.src(config.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.styles.dest.main))
        .pipe(gulp.dest(config.styles.dest.admin));


});