const express = require('express');
const bodyParser = require('body-parser');

const ccurlProvider = require('./ccurlprovider.js');
const {
  performAttachToTangle,
  proxyRequest
} = require('./Api');
const { validIOTARequest } = require('./Util');

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
ccurlProvider.init();

const host = process.env.HOST;
const port = process.env.PORT;
const localPort = process.env.LOCAL_PORT;

router.all('/', function(req, res, next) {
  console.log("incoming req: ", req);
  console.log("incoming body: ", req.body);

  if (!validIOTARequest(req)) {
    return res.status(400).send({message: 'Command doesn\'t look very IOTA-like'});
  }

  //Check to see if command is attachToTangle, if so override.
  if (ccurlProvider.isOpen() && req.body.command === 'attachToTangle') {
    return performAttachToTangle(ccurlProvider, req.body)
      .then(data => res.status(200).send(data))
      .catch(err => res.status(500).send({message: 'Internal Server Error\n Error executing attachToTangle.'}))
  }

  console.log('Relaying command ' + req.body.command);

  const headersToCopy = [
    'content-type',
    'x-iota-api-version',
  ];
  const copiedHeaders = Object.keys(req.headers)
    .filter(key => headersToCopy.indexOf(key.toLowerCase()) > -1)
    .reduce((acc, key) => {
      const map = {};
      map[key] = req.headers[key];
      return Object.assign(acc, map)
    }, {});

  const options = {
    path: req.url,
    method: req.method,
    body: req.body,
    headers: Object.assign(copiedHeaders, {
      //any default headers here
    })
  }

  return proxyRequest(options)
    .then(body => res.status(200).send(body))
    .catch(err => {
      if (err.statusCode) {
        return res.status(err.statusCode).send({message:err.message});
      }

      return res.status(500).send({message: 'an unknown error occurred'});
    });
});


module.exports = router;
