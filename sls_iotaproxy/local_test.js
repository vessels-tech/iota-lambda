'use strict';

const express = require('express');

const iotaProxyExpress = require('./lib/iotaproxy_express.js');
const app = express();

app.use(iotaProxyExpress);

console.log("App is initialized!");
const port = process.env.LOCAL_PORT;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
