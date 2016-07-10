var gulp = require('gulp');

require('./tasks/scripts.js');
require('./tasks/templates.js');
require('./tasks/styles.js');
require('./tasks/vendors.js');

// Default Task
gulp.task('default', ['templates', 'scripts']);
