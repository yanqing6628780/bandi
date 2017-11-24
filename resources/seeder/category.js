module.exports = function(db) {
    var Model = db.categorys;
    var modelName = Model.modelName;
    var exports = {};

    exports.run = function() {
        Model.remove(function(err) {
            if (err) console.log('remove error', err);
        });

        //admin Add
        var data = [
            {
                display_name: "高达模型",
                name: "GUNPLA",
                parent_id: null
            },
            {
                display_name: "角色模型",
                name: "CHARACTER",
                parent_id: null
            }
        ]

        Model.create(data)
            .then(function(mongooseDocuments) {
                // console.log(modelName, mongooseDocuments);
                console.log(modelName + ' insert success.');
                process.exit();
            })
            .catch(function(err) {
                console.log(modelName + ' insert failed.err:');
                console.log(err);
                process.exit();
            });
    }


    return exports;
}
