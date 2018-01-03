let moment = require('moment');
let lodash = require('lodash');
module.exports = function (app) {
    const NULLOBJECTID = '000000000000';
    var exports = {},
        ArticleM = app.models.articles,
        SliderM = app.models.index_slider,
        LinkM = app.models.friend_link;
    exports.home = function (req, res) {
        let nextMonths = [];
        for (let i = 1; i < 4; i++) {
            nextMonths.push(moment().add(i, 'months'));
        }
        let now = moment();
        let now_product_where = {
            is_product: true,
            release_date: {
                $lte: now.endOf('months').toDate(),
                $gte: now.startOf('months').toDate()
            }
        };
        let next_month_product_where = lodash.cloneDeep(now_product_where);
        next_month_product_where.release_date.$lte = moment().add(1, 'months').endOf('months').toDate();
        next_month_product_where.release_date.$gte = moment().add(1, 'months').startOf('months').toDate();
        let newsCid = res.locals.newsCate ? res.locals.newsCate.id : NULLOBJECTID;
        let eventCid = res.locals.newsCate ? res.locals.eventCate.id : NULLOBJECTID;
        let campaignCid = res.locals.newsCate ? res.locals.campaignCate.id : NULLOBJECTID;
        let GBWCCid = res.locals.newsCate ? res.locals.GBWCCate.id : NULLOBJECTID;
        Promise.all([
            ArticleM.find({
                cids: newsCid
            }).sort({
                release_date: 'desc'
            }).limit(9),
            ArticleM.find({
                cids: eventCid
            }).sort({
                release_date: 'desc'
            }).limit(6),
            ArticleM.find({
                cids: campaignCid
            }).sort({
                release_date: 'desc'
            }).limit(6),
            ArticleM.find(now_product_where).sort({
                release_date: 'desc'
            }).limit(4),
            ArticleM.find(next_month_product_where).sort({
                release_date: 'desc'
            }).limit(4),
            ArticleM.find({
                is_product: true,
                is_online_shop: true
            }).sort({
                release_date: 'desc'
            }).limit(4),
            SliderM.find(),
            ArticleM.find({
                cids: GBWCCid
            }).sort({
                release_date: 'desc'
            }),
            LinkM.find()
        ]).then((data) => {
            let articles = data[0];
            res.render('index', {
                title: '首页',
                news: articles,
                now: now,
                nextMonth: moment().add(1, 'months').format('YYYYMM'),
                nextMonths: nextMonths,
                eventArticles: data[1],
                campaignArticles: data[2],
                nowProducts: data[3],
                nextMonthProducts: data[4],
                onlineProducts: data[5],
                sliderImgs: data[6],
                GBWCArticles: data[7],
                links: data[8]
            });
        });
    };

    exports.schedule = (req, res) => {
        let start_year = 2017;
        let now = moment();
        let years = [];
        let end_year = moment(now).add(1, 'y').format('YYYY');
        console.log(now.year())
        for (let i = 0; i <= (now.year() - start_year); i++) {
            years.push(
                moment().set('year', start_year).add(i, 'y').format('YYYY')
            );
        }
        years.push(end_year);
        let date = req.params.date ? moment(req.params.date, "YYYYMM") : now;
        let subtitles = ['Already released', 'NEW ITEMS', 'NEW ITEMS in LATER MONTHS'];
        let cnSubTitles = ['在售商品', '本月新品', '将售商品'];
        let subIndex = now.diff(date, 'months') == 0 ? (now.month() == date.month() ? 1 : 2) : (now.diff(date, 'months') > 0 ? 0 : 2);
        let otherMonths = [];
        for (let i = 2; i > 0; i--) {
            otherMonths.push(moment().subtract(i, 'M'));
        }
        for (let i = 0; i <= 3; i++) {
            otherMonths.push(moment().add(i, 'M'));
        }

        let where = {
            is_product: true,
            is_online_shop: false,
            is_undetermined: false,
            release_date: {
                $lte: date.endOf('months').toDate(),
                $gte: date.startOf('months').toDate()
            }
        };
        let pb_where = lodash.cloneDeep(where);
        let undetermined_where = lodash.cloneDeep(where);
        pb_where.is_online_shop = true;
        undetermined_where.is_undetermined = true;

        Promise.all([
            ArticleM.find(where).exec(),
            ArticleM.find(pb_where).exec(),
            ArticleM.find(undetermined_where).exec()
        ]).then((data) => {
            let products = lodash.groupBy(data[0], function (o) {
                return moment(o.release_date).format('YYYY年MM月DD日');
            });
            res.render('schedule', {
                title: '发售计划',
                now: now,
                years: years,
                date: date,
                bclist: [cnSubTitles[subIndex]],
                subtitle: subtitles[subIndex],
                otherMonths: otherMonths,
                products: products,
                pb_products: data[1],
                undetermined_productss: data[2]
            });
        });
    };

    return exports;
};
