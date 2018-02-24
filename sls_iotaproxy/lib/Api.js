const request = require('request-promise-native');




const host = process.env.HOST;
const port = process.env.PORT;



/**
 * Perform the attachToTangle command locally
 */
const performAttachToTangle = (ccurlProvider, {
  trunkTransaction,
  branchTransaction,
  minWeightMagnitude,
  trytes
}) => {

  return new Promise((resolve, reject) => {
    ccurlProvider.attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes,
      (error, trytesArray) => {
        if (error) {
          console.error("error attachingToTangle", error);
          return reject(error);
        }

        return resolve({trytes: trytesArray});
      }
    );
  });
};

/**
 * Send the request to the actual iota server
 */
const proxyRequest = ({path, method, headers, body}) => {
  const options = {
    uri: `${host}:${port}${path}`,
    method,
    headers,
    body,
    json: true
  };

  return request(options)
    .catch(err => {
      console.log(err.message);
      return Promise.reject(err);
    });
}


module.exports = {
  performAttachToTangle,
  proxyRequest,
}
