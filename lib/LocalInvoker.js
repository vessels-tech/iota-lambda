/*
  LocalInvoker overrides the attachToTangle function in the iota.js sdk,
  and forwards it to AWS lambda for processing.
*/
class LocalInvoker {

  constructor({lambda, functionName}) {
    this.lambda = lambda;
    this.functionName = functionName;
  }

  /**
   * Overridden lambda function.
   * must match the signature in iota.api.js
   */
  attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
    console.log("running attachToTangle on AWS lambda");

    const params = {
      FunctionName: this.functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify({trunkTransaction, branchTransaction, minWeightMagnitude, trytes}),
    };

    //Invoke the lambda function to do the PoW for us.
    this.lambda.invoke(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        return callback(err);
      }
      console.log('lambda successful response:', data.Payload);
      //TODO: validate
      const trytes = JSON.parse(data.Payload).body.trytes;

      return callback(null, trytes);
    });
  }
}

module.exports = LocalInvoker;
