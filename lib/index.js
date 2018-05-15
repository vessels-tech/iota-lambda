

const iotaLambdaShim = ({iota, lambda, functionName}) => {

  iota.api.oldAttachToTangle = iota.api.attachToTangle

  /**
   * Override the iota api attachToTangle function
   */
  iota.api.attachToTangle = (trunk, branch, mwm, trytes, callback) => {
    validate(iota, trunk, branch, mwm, trytes, callback)

    // console.log("running attachToTangle on AWS lambda");

    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({
        trunkTransaction: trunk,
        branchTransaction: branch,
        minWeightMagnitude: mwm,
        trytes 
      }),
    };

    //Invoke the lambda function to do the PoW for us.
    lambda.invoke(params, (err, data) => {
      //only catches errors with the lambda function
      if (err) {
        console.log(err, err.stack);
        return callback(err);
      }

      console.log("payload: ", data.Payload);
      
      const trytes = JSON.parse(data.Payload).body.trytes;

      return callback(null, trytes);
    });
  }
}


/**
 * Validate the transaction
 * From: https://github.com/iotaledger/curl-remote/blob/master/index.js
 */
const validate = (iota, trunk, branch, mwm, trytes, callback) => {
  // inputValidator: Check if correct hash
  if (!iota.valid.isHash(trunk))
    return callback(
      new Error(
        'You have provided an invalid hash as a trunk/branch: ' + trunk
      ),
      null
    )

  // inputValidator: Check if correct hash
  if (!iota.valid.isHash(branch))
    return callback(
      new Error(
        'You have provided an invalid hash as a trunk/branch: ' + branch
      ),
      null
    )

  // inputValidator: Check if int
  if (!iota.valid.isValue(mwm)) {
    return callback(new Error('One of your inputs is not an integer'), null)
  }

  // inputValidator: Check if array of trytes
  if (!iota.valid.isArrayOfTrytes(trytes)) {
    return callback(new Error('Invalid Trytes provided'), null)
  }
}

module.exports = iotaLambdaShim;