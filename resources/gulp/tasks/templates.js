var gulp = require('gulp'),
    config = require('../config'),
    utils = require('../utils'),
    path = require('path'),
    colors = require('colors'),
    templateCache = require('gulp-angular-templatecache');

var src = config.templates.root;
var modulePrefix = config.templates.modulePrefix;
var filePrefix = config.templates.filePrefix;
var folders = utils.getFolders(src);

function buildTemplates(folder) {

    var dest = 'app/templates';

    return gulp.src(path.join(src, folder, '/**/*.html'))
        .pipe(templateCache({
            root: folder,
            standalone: true,
            filename: filePrefix + folder + '.js',
            module: modulePrefix + folder
        }))
        .pipe(gulp.dest(dest));

}

gulp.task('templates', function() {
    folders.map(function(folder) {
        buildTemplates(folder);
    });

    gulp.watch(path.join(src, '/**/*.html'), function($event) {
        var folder = utils.getEventDir($event, src);
        var msg = "templates: " + folder;
        console.log(msg.magenta)
        return buildTemplates(folder);
    })
});


