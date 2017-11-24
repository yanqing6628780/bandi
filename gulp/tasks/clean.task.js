'use strict'

module.exports = function(gulp, config, $, args) {

    gulp.task('clean', function() {
        return gulp.src([
            config.target + 'public/{js,css,images}/',
            config.source + 'public/{js,css,images}/'
        ])
            .pipe($.clean());
    });
};
