var gulp   = require( 'gulp' ),
    nodemon = require('gulp-nodemon'),
    config = require('../config.js'),
    gulpif = require('gulp-if'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish');

gulp.task('express-lint', function()
{
    gulp.src(config.main.src)
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});;

gulp.task('serve', function () {
    nodemon({ script: config.server.index,
        ext: 'html js' })
        .on('restart', function () {
            console.log('restarted server!')
        })
});

//gulp.task('express', ['express-watch']);



