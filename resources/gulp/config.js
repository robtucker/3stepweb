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

    //STYLES
    styles: {
        src: './sass/app.scss',
        dest: 'public/css',
        targetName: 'app.css'
    },

    // TEMPLATES
    templates: {
        src: './views/**/*.html',
        dest:  'public/js',
        moduleName: '3stepweb.templates',
        fileName: 'templates.js'
    },

    //VENDORS
    vendors : {
        src: [
            'node_modules/core-js/client/shim.min.js',
            'node_modules/zone.js/dist/zone.js',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/systemjs/dist/system.src.js'
        ],
        dest: 'public/js/vendor'
    }

};
