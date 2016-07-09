var gulp = require('gulp');

var fs = require('fs');
var config = require('./config.js');
var utils = require('./utils.js');

require('./tasks/scripts.js');
require('./tasks/templates.js');

// Default Task
gulp.task('default', ['templates', 'scripts']);
