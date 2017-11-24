'use strict'

module.exports = (gulp, config, $, args) ->

    gulp.task 'js', ['js:build', 'js:copy']

    gulp.task 'js:build', ['js:build:root']

    gulp.task 'js:build:root', () ->
        gulp.src [
            "#{config.resource}assets/js/*.{js,coffee}"
        ]
            .pipe $.if '*.coffee', $.coffee()
            .pipe $.concat 'script.js'
            .pipe $.if not args.dev, $.uglify()
            .pipe gulp.dest "#{config.target}public/js/"

    gulp.task 'js:copy', ['js:bower'], () ->
        gulp.src [
            "#{config.resource}assets/js/lib/**"
        ]
        .pipe gulp.dest "#{config.target}public/js/lib"

    gulp.task 'js:bower', ['js:bower:copy']

    gulp.task 'js:bower:copy', () ->
        gulp.src [
            "#{config.bowerPath}bootstrap/dist/js/bootstrap.min.js{,.map}"
            "#{config.bowerPath}jquery/dist/jquery.min.js{,.map}"
        ]
            .pipe gulp.dest "#{config.target}public/js/lib/"
