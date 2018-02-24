const IOTA = require('iota.lib.js');

/* set up AWS config to refer to our lambda */
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({
  region: 'ap-southeast-2' //change to whatever region you need
});

const LocalInvoker = require('./sls_iotaproxy/LocalInvoker');

const { provider, trytes } = require('./config');

//Please don't ever use this seed for anything
const seed = "UFLKWXVHYTPDBAOJS9CQMGNRZEI";
const iota = new IOTA({
  provider,
});

//Set up the local invoker by passing through lambdaAPI, and function to call
//refer to the serverless deploy output to get your function's name
const localInvoker = new LocalInvoker({lambda, functionName:'IotaProxy-dev-attHandler'});

//Override the attachToTangle function
iota.api.attachToTangle = (trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) => {
  localInvoker.attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback);
}

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
