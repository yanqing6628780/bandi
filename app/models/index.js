"use strict";

var fs = require("fs"),
    path = require("path"),
    configs = require('../../config/');

const mongoose = require('mongoose');
const DB_URL = `mongodb://${configs.db.host}/${configs.db.name}`;

mongoose.Promise = global.Promise;

var db = {};
//链接数据库
mongoose.connect(DB_URL, {
    useMongoClient: true
});

// 连接成功
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});
// 连接异常
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

fs
    .readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function (file) {
        var model = require(path.join(__dirname, file));
        db[model.modelName] = model;
    });

module.exports = db;
