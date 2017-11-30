var lodash = require('lodash');
module.exports = function (app) {
    let exports = {},
        categoryM = app.models.categorys;
    exports.getCommonData = function (req, res, next) {
        app.locals.moment = require('moment');
        Promise.all([
            categoryM.getTree()
        ]).then((data) => {
            let categorys = data[0];
            res.locals.categoryTree = categorys;
            let gunplaCate, characterCate;
            res.locals.gunplaCate = gunplaCate = lodash.find(categorys, {
                name: "GUNPLA"
            });
            res.locals.characterCate = characterCate = lodash.find(categorys, {
                name: "CHARACTER"
            });
            res.locals.eventCate = lodash.find(categorys, {
                name: "EVENT"
            });
            res.locals.campaignCate = lodash.find(categorys, {
                name: "CAMPAIGN"
            });
            res.locals.gunplaBrandCate = {};
            res.locals.gunplaSeriesCate = {};
            res.locals.characterBrandCate = {};
            res.locals.characterSeriesCate = {};
            try {
                res.locals.gunplaBrandCate = lodash.find(gunplaCate.son, {
                    name: "brand"
                });
                res.locals.gunplaSeriesCate = lodash.find(gunplaCate.son, {
                    name: "series"
                });
                res.locals.characterBrandCate = lodash.find(characterCate.son, {
                    name: "brand"
                });
                res.locals.characterSeriesCate = lodash.find(characterCate.son, {
                    name: "series"
                });
            } catch (error) {
                console.log(error);
            }
            res.locals.category = {
                "GUNPLA": {
                    "brand": res.locals.gunplaBrandCate,
                    "series": res.locals.gunplaSeriesCate
                },
                "CHARACTER": {
                    "brand": res.locals.characterBrandCate,
                    "series": res.locals.characterSeriesCate
                }
            }
            return next();
        })
    };

    return exports;
}
