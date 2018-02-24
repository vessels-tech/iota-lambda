'use strict';

const serverless = require('serverless-http');
const iotaProxyExpress = require('./lib/iotaproxy_express.js');

const express = require('express');
const app = express();

app.use(iotaProxyExpress);

console.log("App is initialized!");

module.exports.handler = serverless(app);
