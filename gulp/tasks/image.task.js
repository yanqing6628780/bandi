'use strict';
module.exports = function (gulp, config, $, args) {
    gulp.task('image', ['image:build']);
    gulp.task('image:build', ['image:build:images', 'image:build:ico']);
    gulp.task('image:build:images', function () {
        return gulp.src([config.resource + "assets/img/**"]).pipe($.cached('image')).pipe($.imagemin({
                optimizationLevel: 3,
                progressive: true,
                interlaced: true
            }))
            .pipe($.remember('image'))
            .pipe(gulp.dest(config.target + "public/img/"));
    });
    gulp.task('image:build:ico', function () {
        return gulp.src([config.resource + "assets/images/favicon.ico"])
            .pipe(gulp.dest(config.target + "public/"));
    });
};
