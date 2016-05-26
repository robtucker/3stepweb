var gulp = require('gulp');

var fs = require('fs');
var config = require('./config.js');
var utils = require('./utils.js');

var tasks = fs.readdirSync('./resources/gulp/tasks').filter(utils.filterScripts);

tasks.forEach(function(task) {
    require('./tasks/' + task);
});



// Default Task
// gulp.task('default', ['templates', 'scripts', 'watch']);

gulp.task('default', ['templates', 'scripts', 'watch']);
