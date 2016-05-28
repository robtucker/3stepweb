'use strict';

/*
Angular does not support CommonJS and cannot be assigned to a variable.
This will not work: var angular = require('angular');
It must be loaded globally, so it is available on the global Object.
*/

// vendors
require('angular');
require('angular-ui-router');

// top level modules
require('./templates');

// MANIFEST
var manifest = [
    'ui.router',
    'templates',
];

var appName = '3stepweb';

// mount on window for testing
window.app = angular.module(appName, manifest);

// Config
angular.module(appName).constant('AppGlobals', require('./config/globals'));
angular.module(appName).config(require('./config/config'));
angular.module(appName).config(require('./config/routes'));
angular.module(appName).run(require('./config/run'));

 // Bootstrap
 angular.bootstrap(document.body, [appName], {
     strictDi: true
 });



