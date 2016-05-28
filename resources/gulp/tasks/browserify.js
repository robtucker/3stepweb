'use strict';

var gulp = require('gulp'),
    color = require('colors'),
    config = require('../config'),
    handleErrors = require('../utils').handleErrors,
    watchify = require('watchify'),
    streamify = require('gulp-streamify'),
    browserify = require('browserify'),
    debowerify = require('debowerify'),
    babelify = require('babelify'),
    ngAnnotate = require('browserify-ngannotate'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if');

function buildScript () {

    var bundler = browserify({
        entries: [config.browserify.entryPoint],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: !global.isProd
    });

    if ( !global.isProd ) {
        bundler = watchify(bundler);

        bundler.on('update', function() {
            rebundle();
            gutil.log('Rebundling...'.cyan);
        });
    }
    var transforms = [
        { 'name':babelify, 'options': {}},
        { 'name':debowerify, 'options': {}},
        { 'name':ngAnnotate, 'options': {}},
        // brfs is required for using node fs functionality with browserify
        { 'name':'brfs', 'options': {}}
    ];

    transforms.forEach(function(transform) {
        bundler.transform(transform.name, transform.options);
    });

    function rebundle() {
        var stream = bundler.bundle();
        var createSourcemap = global.isProd && config.browserify.prodSourcemap;

        return stream.on('error', handleErrors)
            .pipe(source(config.browserify.targetName))
            .pipe(gulpif(createSourcemap, buffer()))
            .pipe(gulpif(createSourcemap, sourcemaps.init()))
            .pipe(gulpif(global.isProd, streamify(uglify({
                compress: { drop_console: true }
            }))))
            .pipe(gulpif(createSourcemap, sourcemaps.write('./')))
            .pipe(gulp.dest(config.browserify.dest));
    }

    return rebundle();
}

gulp.task('browserify', function(){
    return buildScript();
});
