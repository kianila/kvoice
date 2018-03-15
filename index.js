'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");

const restService = express();

restService.use(bodyParser.urlencoded({
    extended: true
}));

restService.use(bodyParser.json());

restService.post('/echo', function(req, res) {

var metal =req.body.result && req.body.result.parameters && req.body.result.parameters.metal ?req.body.result.parameters.metal: "NoMetal";
var weight =req.body.result && req.body.result.parameters && req.body.result.parameters.weight ? req.body.result.parameters.weight: "1";
var weightUnit =req.body.result && req.body.result.parameters && req.body.result.parameters.weightUnit ?req.body.result.parameters.weightUnit: "ounce";
var currency =req.body.result && req.body.result.parameters && req.body.result.parameters.currency ?req.body.result.parameters.currency: "USD";



const url="https://kds2-qa.kitco.com/getPm?symbol=AU,AG&apikey=9bnteWVi2kT13528d100c608fn0TlbC6&market=1&type=json";

    metal=metal.toUpperCase();
    var symbol="";
    var speech="";

    if (metal=="GOLD")  symbol="AU"
    else if (metal=="SILVER") symbol="AG"
    else if (metal=="PLATINUM") symbol="PT"
    else if (metal=="PALLADIUM") symbol="PD"
    else if (metal=="RHODIUM") symbol="RD";

    https.get(url, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);

        var arrFound = body.PreciousMetals.PM.filter(function(item) {
              return item.Symbol == "AU";
          });

          speech = arrFound ?"The price of  " + weight + " " + weightUnit+ " of " +metal +" in " + currency + " is "+ arrFound.Bid:  "Seems like some problem. Please specify the metal you are asking about."


        /*
          console.log(arrFound);
        console.log(
          `Symbol: ${body.PreciousMetals.PM[0].Symbol} -`,
          `Timestamp: ${body.PreciousMetals.PM[0].Timestamp} -`,
          `Bid: ${body.PreciousMetals.PM[0].Bid} -`,
          `Change: ${body.PreciousMetals.PM[0].Change} }`
        ); */
      });
    });

    return res.json({
        speech: speech,
        displayText: speech,
        source: 'kvoice'
    });
});

restService.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'webhook-echo-sample',
        data: {
            "slack": slack_message
        }
    });
});




restService.listen((process.env.PORT || 8000), function() {
    console.log("Server up and listening");
});
