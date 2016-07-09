var path = require('path'),
    notify = require('gulp-notify'),
    fs = require('fs');

exports.getEventDir = function($event, src) {
    var rootDir = src ? path.join(global.rootDir, src) : global.rootDir;
    rootDir = rootDir.replace(/\/$/, "");

    var realDir = $event.path.slice(rootDir.length + 1);
    var exploded = realDir.split('/');
    return exploded[0];
};

exports.getFolders = function(dir) {
    return fs.readdirSync(dir)
        .filter(function(file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
};

exports.handleErrors = function(error) {
    if (!global.isProd) {

        var args = Array.prototype.slice.call(arguments);

        // Send error to notification center with gulp-notify
        notify.onError({
            title: 'Compile Error',
            message: '<%= error.message %>'
        }).apply(this, args);

        // Keep gulp from hanging on this task
        this.emit('end');

    } else {
        // Log the error and stop the process
        // to prevent broken code from building
        console.log(error);
        process.exit(1);
    }
};

exports.filterScripts = exports = function(name) {
    return /(\.(js)$)/i.test(path.extname(name));
};