
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const https = require("https");


const url="https://kds2-qa.kitco.com/getPm?symbol=AU,AG&apikey=9bnteWVi2kT13528d100c608fn0TlbC6&market=1&type=json";


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
