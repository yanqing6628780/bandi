//seeder入口
var configs = require('../../config'),
    db = require(configs.path.models);

//将需要运行的seeder加在下面
Promise.all([
    require('./user.js')(db).run(),
    require('./category.js')(db).run(),
    require('./web_config.js')(db).run()
]).then(process.exit, process.exit);
