var _ = require('lodash');

module.exports = function () {

    var def = require("./app.json"),
        rs = def;
    if (process.env.NODE_ENV === 'production') {
        rs = _.defaultsDeep(def['production'], def);
    }
    delete rs['production'];
    rs.path = {
        views: `${__dirname}/../${rs.views}/`,
        models: `${__dirname}/../${rs.models}/`,
        logs: `${__dirname}/../${rs.logs}/`,
        public: `${__dirname}/../${rs.public}/`,
        resource: `${__dirname}/../${rs.resource}`
    };
    return rs;
}();
