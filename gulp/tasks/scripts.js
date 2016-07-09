var fs = require('fs'),
    path = require('path'),
    merge = require('merge-stream'),
    gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    config = require('../config.js'),
    utils = require('../utils.js'),
    wrap = require("gulp-wrap-js"),
    sourcemaps = require('gulp-sourcemaps');

var wrapper = "(function(){" +
    "'use strict'; " +
    "%= body %" +
    "}());";


function buildScripts(src, dest, targetName) {
    var date = new Date().toTimeString().slice(0, 8);
    var msg = "Compiling " + targetName + ": " + date;
    console.log(msg.green);

    return gulp.src(src)
        .pipe(sourcemaps.init())
            .pipe(concat(targetName))
            .pipe(wrap(wrapper))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest));
}


gulp.task('scripts', function(){
        var conf = config.scripts;
        buildScripts(conf.src, conf.dest, conf.targetName);

        gulp.watch(conf.src, function() {
            return buildScripts(conf.src, conf.dest, conf.targetName);
        });
});


/*
 goodbye super awesome script mapping function

 var folders = utils.getFolders(src);

 gulp.task('scripts', function() {
 folders.map(function(folder) {
 buildScripts(folder);
 });

 gulp.watch(path.join(src, '/**\/*.js'), function($event) {
 var folder = utils.getEventDir($event, src);
 var msg = "scripts: " + folder;
 console.log(msg.green)
 return buildScripts(folder);
 })
 });
 */