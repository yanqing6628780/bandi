'use strict';

var os = require('os');
var ifaces = os.networkInterfaces();

//这个方法可能在liunx系统上无法通过
module.exports = function (configs) {
    var IPv4Address = [];
    for (var dev in ifaces) {
        var alias = 0;
        ifaces[dev].forEach(function(details) {
            if (details.family == 'IPv4') {
                IPv4Address.push(details.address);
                ++alias;
            }
        });
    }

    //定义domainUrl.用于拼接
    if(!configs.domain && configs.port) { //没有设置domain
        configs.domainUrl = 'http://' + IPv4Address[0] + ':' + configs.port;
    } else if (configs.domain && configs.port != 80) { //设置domain而且有port不等于80
        configs.domainUrl = configs.domain + ':' + configs.port;
    } else {
        configs.domainUrl = configs.domain;
    }
    configs.IPv4Address = IPv4Address;

    return configs;
}
