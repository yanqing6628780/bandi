let moment = require('moment');
let lodash = require('lodash');
module.exports = function (app) {
    var exports = {},
        articleM = app.models.articles;
    exports.home = function (req, res) {
        let nextMonths = [];
        for (let i = 1; i < 4; i++) {
            nextMonths.push(moment().add(i, 'months'));
        }
        let eventCate = lodash.find(res.locals.categorys, {
            name: 'EVENT'
        });
        let campaignCate = lodash.find(res.locals.categorys, {
            name: 'CAMPAIGN'
        });
        Promise.all([
            articleM.find().limit(9).exec(),
            articleM.find().where('cids').in([eventCate.id]).limit(6).exec(),
            articleM.find().where('cids').in([campaignCate.id]).limit(6).exec()
        ]).then((data) => {
            let articles = data[0];
            res.render('index', {
                title: '首页',
                news: articles,
                nextMonth: moment().add(1, 'months').format('YYYYMM'),
                nextMonths: nextMonths,
                eventArticles: data[1],
                campaignArticles: data[2]
            });
        });
    };

    exports.schedule = (req, res) => {
        let now = moment();
        let date = req.params.date ? moment(req.params.date,"YYYYMM") : now;
        let subtitles = ['Already released','NEW ITEMS', 'NEW ITEMS in LATER MONTHS'];
        let cnSubTitles = ['在售商品', '本月新品', '将售商品'];
        let subIndex = now.diff(date, 'months') == 0 ? (now.month() == date.month() ? 1 : 2) : (now.diff(date, 'months') > 0 ? 0 : 2);
        let otherMonths = [];
        for (let i = 2; i > 0; i--) {
            otherMonths.push(moment().subtract(i,'M'));
        }
        for (let i = 0; i <= 3; i++) {
            otherMonths.push(moment().add(i,'M'));
        }

        let where = {
            is_product: true,
            is_online_shop: false,
            release_date: {
                $lt: date.endOf('months').toDate(),
                $gt: date.startOf('months').toDate()
            }
        };
        let pb_where = lodash.cloneDeep(where);
        pb_where.is_online_shop = true;

        Promise.all([
            articleM.find(where).exec(),
            articleM.find(pb_where).exec()
        ]).then((data) => {
            let products = lodash.groupBy(data[0], function (o) {
                return moment(o.release_date).format('YYYY年MM月DD日');
            });
            res.render('schedule', {
                title: '发售计划',
                now: now,
                years: [now.format('YYYY'), moment(now).add(1,'y').format('YYYY')],
                date: date,
                bclist: [cnSubTitles[subIndex]],
                subtitle: subtitles[subIndex],
                otherMonths: otherMonths,
                products: products,
                pb_products: data[1]
            });
        });
    };

    return exports;
};
