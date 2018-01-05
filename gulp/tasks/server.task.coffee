'use strict'

browserSync = require('browser-sync').create()
configs = require '../../config'

module.exports = (gulp, config, $, args) ->

    gulp.task 'server', ->

        if not args.dev
            console.log "Please use development mode, e.g. `gulp server -d`."
            return

        $.runSequence 'default',
            'server:start'
            'browserSync:init'
            ['server:watch']

    gulp.task 'server:start', ['default'], () ->
        $.nodemon({
            script: "#{config.source}bin/www"
            watch: [
                "#{config.source}/src/app.js"
                "#{config.source}/app"
                "#{config.source}/config"
                "#{config.source}/bin"
            ]
            ignore: [ "#{config.source}/app/views" ]
            ext: 'js json'
            env:
                'NODE_ENV': 'development'
        })

    gulp.task 'browserSync:init', ->
        browserSync.init {
            ui:
                port: 8002
            port: 8001
            proxy: "http://localhost:#{configs.port}"
            files: [
                "#{config.source}/app/views/**"
                "public/**.*.*"
            ]
            middleware  : [
                require('http-proxy-middleware')('/*', {
                    'target': "http://localhost:#{configs.port}"
                    'changeOrigin': true
                })
            ]
        }

    gulp.task 'server:watch', () ->
        gulp.watch [
            "#{config.source}resources/assets/**/*.{js,coffee}"
        ], (event) ->
            console.log "File #{event.path} was #{event.type}"
            runTaskAndBrowserSync 'js'

        gulp.watch [
            "#{config.source}resources/assets/**/*.{css,styl}"
        ], (event) ->
            console.log "File #{event.path} was #{event.type}"
            runTaskAndBrowserSync 'css'

        gulp.watch [
            "#{config.source}resources/assets/**/*.{jpg,png,bmp,jpeg}"
        ], (event) ->
            console.log "File #{event.path} was #{event.type}"
            runTaskAndBrowserSync 'image:build'

        gulp.watch [
            "#{config.source}app/views/**"
        ], (event) ->
            console.log "File #{event.path} was #{event.type}"
            runTaskAndBrowserSync []

    gulp.task 'browser:reload', ->
        browserSync.reload()

    runTaskAndBrowserSync = (tasks) ->
        if typeof(tasks) is 'string'
            tasks = [tasks]
        tasks.push 'browser:reload'
        $.runSequence.apply null, tasks
