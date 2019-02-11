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

  var metal = req.body.result && req.body.result.parameters && req.body.result.parameters.metal ? req.body.result.parameters.metal : "NoMetal";
  var weight = req.body.result && req.body.result.parameters && req.body.result.parameters.weight ? req.body.result.parameters.weight : "1";
  var weightUnit = req.body.result && req.body.result.parameters && req.body.result.parameters.weightUnit ? req.body.result.parameters.weightUnit : "ounce";
  var currency = req.body.result && req.body.result.parameters && req.body.result.parameters.currency ? req.body.result.parameters.currency : "USD";


// test 
  const url = "https://kds2-qa.kitco.com/getPm?symbol=AU,AG,PT,PD,RD&apikey=9bnteWVi2kT13528d100c608fn0TlbC6&market=1&type=json";

  metal = metal.toUpperCase();
  console.log(metal);
  
  var inquiryType="";
  //var inquiry=metal;  // to be changed; i've used metal in the begining, I should change 
                        // the name to cover other questions as well; for example basemetals, indexes, stocks, etc
                        // so  from this point on; metal means what client is asking about
  var symbol = "";
  var speech = "";
  
  if (metal == "GOLD") {
    symbol = "AU";
    inquiryType="Precious Metal";
  }
  else if (metal == "SILVER") {
    symbol = "AG";
     inquiryType="Precious Metal";
  }
  else if (metal == "PLATINUM") {
    symbol = "PT";
     inquiryType="Precious Metal";
  }
  else if (metal == "PALLADIUM") {
    symbol = "PD";
     inquiryType="Precious Metal";
  }
  else if (metal == "RHODIUM") {
    symbol = "RD";
     inquiryType="Precious Metal";
  }
  //start of Base metals
  if (metal == "COPPER") {
    symbol = "CU";  
     inquiryType="Base Metal";
  }
  else if (metal == "NICKEL") {
    symbol = "NI";  
     inquiryType="Base Metal";
  }
  else if (metal == "ALUMINUM") {
    symbol = "AL";  
     inquiryType="Base Metal";
  }
  else if (metal == "ZINC") {
    symbol = "ZN";  
     inquiryType="Base Metal";
  }
  else if (metal == "LEAD") {
    symbol = "PB";  
     inquiryType="Base Metal";
  }
  else if (metal == "URANIUM"){
    symbol = "UR";  
     inquiryType="Base Metal";
  }
  
  if (metal == "DOW JONES") symbol = "DJI"    // start of indices
  else if (metal == "IXIC") symbol = "IXIC"
  else if (metal == "S&P 500") symbol = "SPX"
  else if (metal == "USD Index") symbol = "USDX"
  else if (metal == "NYA") symbol = "NYA"
  else if (metal == "GSPTSE") symbol = "GSPTSE"
  else if (metal == "N225") symbol = "N225"
  else if (metal == "XAU") symbol = "XAU"
  else if (metal == "HUI") symbol = "HUI"
  else if (metal == "GOX") symbol = "GOX"
  else if (metal == "JGLDX") symbol = "JGLDX"
  else if (metal == "SPTTGD") symbol = "SPTTGD"
  else if (metal == "GFMS") symbol = "GFMS"
  else if (metal == "CRUDE OIL") symbol = "CL"
  
  if (metal == "CANADIAN DOLLAR") symbol = "CAD"    //start of the exchange rate
  else if (metal == "INDIAN RUPEE") symbol = "INR"
  else if (metal == "AUSTRALIAN DOLLAR") symbol = "AUD"
  else if (metal == "EURO") symbol = "EUR"
  else if (metal == "BRITISH POUND") symbol = "GBP"
  else if (metal == "HONG KONG DOLLAR") symbol = "HKD"
  else if (metal == "JAPANESE YEN") symbol = "JPY"
  else if (metal == "EURO") symbol = "EUR"
  else if (metal == "SWISS FRANK") symbol = "CHF"
  else if (metal == "SOUTH AFRICAN RAND") symbol = "ZAR"
  else if (metal == "CHINESE YUAN") symbol = "CNY"
  else if (metal == "BRAZILIAN REAL") symbol = "BRL"
  else if (metal == "MEXICAN PESO") symbol = "MXN"
  else if (metal == "RUSSIAN RUBLE") symbol = "RUB"
  else if (metal == "BITCOIN") symbol = "BTC"
  
  // base metals  
  // indices DJI,IXIC,SPX,USDX,NYA,GSPTSE,N225,XAU,HUI,GOX,JGLDX,SPTTGD,GFMS,CL
  // exchange rate  USD, CAD, INR, AUD, EUR, GBP, HKD, JPY, CHF, ZAR, CNY, BRL, MXN, RUS,BTC

  
  
  console.log(symbol);

  https.get(url, resKDS => {
    resKDS.setEncoding("utf8");
    let body = "";
    resKDS.on("data", data => {
      body += data;
    });
    resKDS.on("end", () => {
      body = JSON.parse(body);
      //body={"PreciousMetals":{"PM":[{"ChangePercentage":-0.14,"High":1327.3,"Low":1319,"Symbol":"AU","Currency":"USD","Ask":1323.8,"Mid":1323.3,"Change":-1.8,"Unit":"OUNCE","Bid":1322.8,"Timestamp":"2018-03-14 17:00:00"},{"ChangePercentage":0,"High":16.52,"Low":16.42,"Symbol":"AG","Currency":"USD","Ask":16.52,"Mid":16.47,"Change":0,"Unit":"OUNCE","Bid":16.42,"Timestamp":"2018-03-14 17:00:00"}]}};


      var arrFound = body.PreciousMetals.PM.filter(function(item) {
        return item.Symbol == symbol;
      });

      //speech = arrFound ?"As of  " +arrFound[0].Timestamp +", " +weight + " " + weightUnit+ " of " +metal +" in " + currency + " is "+ arrFound[0].Bid:  "Seems like some problem. Please specify the metal you are asking about."
      if (arrFound[0]) {
        var ts = arrFound[0].Timestamp;
        console.log(ts);
        var ts = ts.substr(0, 18);
        console.log(ts);
        //speech = arrFound[0] ? "According to Kitco, As of " + ts + ", " + weight + " " + weightUnit + " of " + metal + " is " + currency + "" + arrFound[0].Bid : "Seems like some problem. Please specify the metal you are asking about."
        speech = arrFound[0] ? "The current spot " + metal + " price updated at "+ ts + " is " + currency + "" + arrFound[0].Bid + " per ounce": "Seems like some problem. Please specify the metal you are asking about."
        //The current spot <Gold> price updated [time gap] is 1344.50 US$ per ounce [up,down] % on the day
        //The current spot <Gold> price updated at <4:00 pm EST> is <1344.50> <US$> <per ounce>


        console.log(arrFound);
      } else {
        speech = "Seems like some problem. Please specify the metal you are asking about.";
      }
      console.log(speech);
      return res.json({
        speech: speech,
        displayText: speech,
        source: 'kvoice'
      });
      /*console.log(
        `Symbol: ${body.PreciousMetals.PM[0].Symbol} -`,
        `Timestamp: ${body.PreciousMetals.PM[0].Timestamp} -`,
        `Bid: ${body.PreciousMetals.PM[0].Bid} -`,
        `Change: ${body.PreciousMetals.PM[0].Change} }`
      ); */
    });
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
