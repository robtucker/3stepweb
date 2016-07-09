'use strict';

module.exports = {

    logPath: 'storage/logs/gulp/errors.txt',
    npm: 'node_modules/',
    bower: 'resources/bower/',
    root: './app',
    prodSourcemap: false,

    // ANGULAR APPLICATION
    scripts: {
        src: [
            './app/**.js'
        ],
        dest: 'public/js',
        targetName: 'app.js'
    },

    // TEMPLATES
    templates: {
        src: './views/**/*.html',
        dest:  'public/js',
        moduleName: '3stepweb.templates',
        fileName: 'templates.js'
    }
};
