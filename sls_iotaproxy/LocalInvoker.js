/*
  LocalInvoker overrides the attachToTangle function in the js sdk,
  and forwards it to AWS lambda for processing.
*/
class LocalInvoker {

  constructor({lambda, functionName}) {
    this.lambda = lambda;
    this.functionName = functionName;

    return this;
  }

  /**
   * Overridden lambda function.
   * must match the signature in iota.api.js
   */
  attachToTangle(trunkTransaction, branchTransaction, minWeightMagnitude, trytes, callback) {
    console.log("ATTACHING TO TANGLE YAY!");

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
