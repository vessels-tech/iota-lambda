/*iota library */
const IOTA = require('iota.lib.js');
const { 
  provider, 
  functionName,
  trytes //todo: remove
} = require('./config');

//Please don't ever use this seed for anything
const seed = "UFLKWXVHYTPDBAOJS9CQMGNRZEI";
const iota = new IOTA({
  provider,
});

/* set up AWS config to refer to our lambda */
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({
  region: 'ap-southeast-2' //I come from a land down under
});

// const IotaLambdaShim = require('iota-lambda-shim');
const IotaLambdaShim = require('../lib/index');

// Patch the current IOTA instance
IotaLambdaShim({ iota, lambda, functionName });



//Do whatever you want with the IOTA js api now.
iota.api.getNewAddress(seed, {}, (error, address) => {
    console.log("ADDRESS:", address)
    if (error) throw error;
    let transfers = [{
        'address': address,
        // 'message': iota.utils.toTrytes("testing"),
        'message': trytes,
        'value': 0,
        'tag': 'SURJIKAL'
    }]
    iota.api.sendTransfer(seed, 5, 14, transfers, (error, results) => {
        if (error) throw error;
        console.log("RESULTS:", results)
    });
});
