let _ = require('lodash');

module.exports = function () {

    let def = require("./app.json"),
        rs = _.cloneDeep(def),
        env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
    if (env !== 'development') {
        if (def[env]) {
            rs.db = def[env].db;
        }
    }
    rs['production'] && delete rs['production'];
    rs['test'] && delete rs['test'];
    rs.path = {
        views: `${__dirname}/../${rs.views}/`,
        models: `${__dirname}/../${rs.models}/`,
        logs: `${__dirname}/../${rs.logs}/`,
        public: `${__dirname}/../${rs.public}/`,
        resource: `${__dirname}/../${rs.resource}`
    };
    return rs;
}();
