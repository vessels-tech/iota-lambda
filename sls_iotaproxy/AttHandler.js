/**
 * A lambda function for invoking attachToTangle directly (no need for ApiGateway)
 */

const ccurlProvider = require('./lib/ccurlprovider.js');

const {
  performAttachToTangle,
} = require('./lib/Api');


ccurlProvider.init();

module.exports.handler = (event, context, callback) => {
  if (!ccurlProvider.isOpen()) {
    return callback(new Error("Error with ccurl provider"));
  }

  //TODO parse event?

  return performAttachToTangle(ccurlProvider, event)
    .then(data => callback(null, {statusCode:200, body:data}))
    .catch(err => callback(err, {statusCode:500, body:JSON.stringify({message:err})}))
}
