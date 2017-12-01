let moment = require('moment');
let lodash = require('lodash');
module.exports = function (app) {
    var exports = {},
        articleM = app.models.articles,
        sliderM = app.models.index_slider;
    exports.home = function (req, res) {
        let nextMonths = [];
        for (let i = 1; i < 4; i++) {
            nextMonths.push(moment().add(i, 'months'));
        }
        let now = moment();
        let now_product_where = {
            is_product: true,
            release_date: {
                $lt: now.endOf('months').toDate(),
                $gt: now.startOf('months').toDate()
            }
        };
        let next_month_product_where = lodash.cloneDeep(now_product_where);
        next_month_product_where.release_date.$lt = moment().add(1, 'months').endOf('months').toDate();
        next_month_product_where.release_date.$gt = moment().add(1, 'months').startOf('months').toDate();
        Promise.all([
            articleM.find().limit(9),
            articleM.find().where('cids').in([res.locals.eventCate.id]).limit(6),
            articleM.find().where('cids').in([res.locals.campaignCate.id]).limit(6),
            articleM.find(now_product_where).sort({release_date: 'desc'}).limit(4),
            articleM.find(next_month_product_where).sort({ release_date: 'desc' }).limit(4),
            articleM.find({is_product: true, is_online_shop: true}).sort({ release_date: 'desc' }).limit(4),
            sliderM.find()
        ]).then((data) => {
            let articles = data[0];
            res.render('index', {
                title: '首页',
                news: articles,
                nextMonth: moment().add(1,'months').format('YYYYMM'),
                nextMonths: nextMonths,
                eventArticles: data[1],
                campaignArticles: data[2],
                nowProducts: data[3],
                nextMonthProducts: data[4],
                onlineProducts: data[5],
                sliderImgs: data[6]
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
