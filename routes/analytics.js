var express = require('express');
var router = express.Router();

var itc = require('itunesconnectanalytics');
var Itunes = itc.Itunes;
var AnalyticsQuery = itc.AnalyticsQuery;

var username = 'sgfinrep@gmail.com';
var password = 'SgFinRep@1';
var appId = '293875'; //Found in My Apps -> App -> Apple ID or read below on getting the app id.


/* GET users listing. */
router.get('/apps', function (req, res, next) {

    var instance = new Itunes(username, password, {
        errorCallback: function (e) {
            console.log('Error logging in: ' + e);
            return res.status(401).json({ status: false, message: "Error", data: e });
        },
        successCallback: function (d) {
            console.log('Logged in');

            instance.getApps(function (error, data) {
                if (error) return res.status(401).json({ status: false, message: "Error", data: error });
                return res.status(200).json({ status: true, message: "Success", data: data });
            });
        }
    });
});

// URL: http://IPADDRESS/analytics/apps/APPID?sdate=YYYY-MM-DD&edate=YYYY-MM-DD  
// EX: http://localhost:3000/analytics/apps/1288107282?sdate=2018-02-19&edate=2018-02-18
router.get('/apps/:id', function (req, res, next) {
    // Start date end date formate : Ex:  YYYY-MM-DD
    console.log('Request Id:', req.params.id);
    console.log('startdate', req.query.sdate);
    console.log('enddate', req.query.edate);  
    var instance = new Itunes(username, password, {
        errorCallback: function (e) {
            console.log('Error logging in: ' + e);
            return res.status(401).json({ status: false, message: "Error", data: e });
        },
        successCallback: function (d) {
            console.log('Logged in');
            let appId = req.params.id;
            var query = new AnalyticsQuery.metrics(appId, {
                measures: [itc.measures.sessions, itc.measures.sales]
            }).date(req.query.sdate, req.query.edate);
            //console.log("query", query);
            instance.request(query, function(error, result) {
            console.log(JSON.stringify(result, null, 2));
            if (error) return res.status(401).json({ status: false, message: "Error", data: error });
            return res.status(200).json({ status: true, message: "Success", data: result });
            });
        }
    });
});

module.exports = router;
