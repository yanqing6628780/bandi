'use strict'

module.exports = (gulp, config, $, args) ->

    gulp.task 'css', ['css:build', 'css:copy']

    gulp.task 'css:build', ['css:build:root']

    gulp.task 'css:build:root', () ->
        gulp.src ["#{config.resource}assets/css/**/*.styl"]
            .pipe $.if '*.styl', $.stylus()
            .pipe $.autoprefixer '> 1% in CN', 'last 2 versions'
            .pipe $.concat 'style.css'
            .pipe $.if not args.dev, $.csso()
            .pipe gulp.dest "#{config.target}public/css/"

    gulp.task 'css:bower.copy', () ->
        gulp.src [
            "#{config.bowerPath}/bootstrap/dist/css/bootstrap*.css{,.map}"
        ]
            .pipe gulp.dest "#{config.target}public/css/lib/"

        gulp.src [
            "#{config.bowerPath}/bootstrap/dist/fonts/**"
        ]
            .pipe gulp.dest "#{config.target}public/css/fonts/"

    gulp.task 'css:copy', ['css:bower.copy'], () ->
       gulp.src [
           "#{config.resource}assets/css/*/**/*.*"
           "#{config.resource}assets/css/**.css"
       ]
            .pipe gulp.dest "#{config.target}public/css/"
