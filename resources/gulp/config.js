'use strict';

module.exports = {

    logPath: 'storage/logs/gulp/errors.txt',
    npm: 'node_modules/',
    bower: 'resources/bower/',
    root: './app',
    prodSourcemap: false,

    // ANGULAR APPLICATION
    scripts: {
        main: {
            src: [
                './app/main.js',
                './app/core.js',
                './app/core/**/*.js',
                './app/main/**/*.js',
                './app/templates/**/*.js'
            ],
            dest: 'public/js',
            targetName: 'pp-main.js'
        },
        admin: {
            src: [
                './app/admin.js',
                './app/core.js',
                './app/core/**/*.js',
                './app/admin/**/*.js',
                './app/templates/**/*.js'
            ],
            dest: 'public/admin/js',
            targetName: 'pp-admin.js'
        }
    },

    // LOCAL SERVER
    server: {
        index: './local.js'
    },

    // STYLES
    styles: {
        src: ['resources/sass/**/*.scss'],
        dest:{
            main: 'public/css',
            admin: 'public/admin/css'
        },
        targetName: 'app.css',
        prefix: 'last 2 version',
        prodSourcemap: false
    },

    // TEMPLATES
    templates: {
        root: './resources/views',
        dest: {
            main: 'public/js',
            admin: 'public/admin/js'
        },
        modulePrefix: 'templates.',
        filePrefix: 'templates-'
    },

    // TESTS
    test: {
        karma: 'test/karma.conf.js',
        protractor: 'test/protractor.conf.js'
    },

    // GZIP
    gzip: {
        src: 'public/**/*.{html,xml,json,css,js,js.map,css.map}',
        dest: 'public/',
        options: {}
    },

    //IMAGES
    images: {
        src: 'resources/img',
        dest: 'public/img'
    },

    // PROVIDERS
    vendors: {
        js: {
            src: [
                'angular-local-storage/dist/angular-local-storage.js',
                'angular-libphonenumber/dist/libphonenumber.full.js',
                'message-center/message-center.js',
                'ocLazyLoad/dist/ocLazyLoad.min.js',
                'angular-azure-blob-upload/azure-blob-upload.js',
                'angular-socket-io/socket.js',
                'moment/min/moment.min.js',
                'dot-object/dist/dot-object.min.js',
                'angular-bowser/src/angular-bowser.js',
                'stacktrace-js/dist/stacktrace.min.js'
            ],
            dest: {
                main: 'public/js/',
                admin: 'public/admin/js/'
            },
            targetName: 'vendors.js'
        },
        css: {
            src: [
                'node_modules/fontawesome/css/font-awesome.min.css'
            ],
            dest: {
                main: 'public/css/vendor/',
                admin: 'public/admin/css/vendor/'
            },
            targetName: 'vendors.css'
        }
    }
};
