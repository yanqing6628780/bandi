'use strict';

module.exports = function () {

    var pkj = require('../package.json');

    pkj.source      = __dirname + '/../';
    pkj.resource    = pkj.source + 'resources/';
    pkj.targetPaths = __dirname + '/../dist/';

    pkj.test      = __dirname + '/../test/';
    pkj.bowerPath = __dirname + '/../node_modules/';

    return pkj;
};
