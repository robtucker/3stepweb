var gulp = require('gulp'),
    config = require('../config'),
    utils = require('../utils'),
    path = require('path'),
    colors = require('colors'),
    templateCache = require('gulp-angular-templatecache');

var src = config.templates.src;
var dest = config.templates.dest;
var moduleName = config.templates.moduleName;
var fileName = config.templates.fileName;


var compile = function() {
    var msg = 'compiling templates: ' + new Date().toLocaleTimeString();
    console.log(msg.green);

    gulp.src(src)
        .pipe(templateCache({
            standalone: true,
            filename: fileName,
            module: moduleName
        }))
        .pipe(gulp.dest(dest));
};

gulp.task('templates', function() {
    compile();
    gulp.watch(src, function() {
        compile();
    });
});


