//seeder入口
var configs = require('../../config'),
    db = require(configs.path.models);

//将需要运行的seeder加在下面
require('./user.js')(db).run();
require('./category.js')(db).run();
