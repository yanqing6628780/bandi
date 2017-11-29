module.exports = function(db) {
    var Model = db.users;
    var modelName = Model.modelName;
    var exports = {};

    exports.run = function() {
        Model.remove(function(err) {
            if (err) console.log('remove error', err);
        });

        //admin Add
        var adminData = {
            nickname: "管理员",
            username: "admin",
            password: "12345678",
            email: "admin@admin.com"
        }

        return Model.create(adminData)
            .then(function(docs) {
                // console.log(modelName, docs);
                console.log(modelName + ' insert success.');
            })
            .catch(function(err) {
                console.log(modelName + ' insert failed.err:');
                console.log(err);
            });
    }


    return exports;
}
