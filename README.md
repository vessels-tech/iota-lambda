# IOTA Lambda
## offload your POW to AWS lambda!

A guide for using this module is now available on [Medium](https://medium.com/@lewdaly/a-little-while-back-i-worked-on-little-demo-of-performing-iota-proof-of-work-on-aws-lambda-40195974ded7)!

## Purpose

This is an example project of using AWS lambda to perform the `attachToTangle` command without having to run it locally *or* run a full node.
Using AWS Lambda (or any FaaS) can allow for infinite scaling without having to manage underlying servers. Using this method, you could run a fleet of IOTA devices, pointing to a public full node that doesn't support `attachToTangle`, and handle the POW yourself! Magic!


## Getting Started

### Prerequisites

Sorry, but this one needs a few disparate bits and pieces to get it working:
- *AWS* account, with credentials in `~/.aws/credentials`, or in your current env
- *serverless* (installed with docker below), but you need to have a basic understanding of how serverless and cloudformation works.

  >*sidebar:* We probably don't need Serverless for this project. My first iteration was to use ApiGateway and set up an IOTA proxy based on this: https://github.com/TimSamshuijzen/iotaproxy. However, ApiGateway has a hard timeout limit of 30s, which is fine for every iota command except for attachToTangle.

- *Docker* & *docker-compose* we use docker to build the native npm modules for the exact version of Amazon Linux that AWS Lambda runs internally.

- *node* and *yarn*


### Deployment


1. build the containers and login to the docker container

  ```bash
  #build the docker container
  $ ./_enter_docker.sh build

  #run the container
  $ ./_enter_docker.sh
  ```

2. deploy the lambda function. You may want to change the region in `sls_iotaproxy/serverless.yml`

  ```bash
    docker$ ./_deploy.sh  
  ```

  Wait for serverless to deploy, make a cup of tea maybe. It's a known fact that deployments take longer if you sit there watching them.

### Installation
 
Once you have successfully deployed your function, you can use it to perform your PoW.

Install the `iota-lambda-shim` package:

```bash
yarn add iota-lambda-shim
```

Make a note of your `provider` (this can be a public full node that doesn't support AttachToTangle) the `functionName`. Put them in a config file like so:

`config.js`
```js
module.exports = {
  provider: 'http://5.9.149.169:14265',
  functionName: 'IotaProxy-dev-attHandler',
}

```

### Basic Usage:

```js
/*iota library */
const IOTA = require('iota.lib.js');
const { provider, functionName } = require('./config');

const iota = new IOTA({
  provider,
});

/* set up AWS config to refer to our lambda */
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda({
  region: 'ap-southeast-2' //I come from a land down under
});

const IotaLambdaShim = require('iota-lambda-shim');

// Patch the current IOTA instance
IotaLambdaShim({iota, lambda, functionName});

//Now do whatever you want with the IOTA js api.
```





Feel free to use this, or let it inspire you to build something else.
PRs welcome :)

Let me know if you want to build something together. Feel free to message me at my github email.

Tips are welcome 🙌🙌🙌
```
BJSLSJNPWSM9QLO9JYJAG9A9LLAUKZAQJGYZLNN9YMBNPCUUS9E9EYE9PIKIKNYHXAPNFAMDGXVIPVKIWGDUVDALPD
```


## Handy Snippets

```bash
#invoke local AttHandler:
serverless invoke local -f attHandler --path ./testAttachToTangle.json

```


```bash

#getTrytes
# curl http://localhost:14265 \
# use this to just get an example of valid trytes
curl http://node06.iotatoken.nl:14265 \
  -X POST \
  -H 'Content-Type: application/json' \
  -H 'X-IOTA-API-Version: 1' \
  -d '{"command": "getTrytes", "hashes": ["9EDOGCRGAHHYXHWMFYCBXMWUPWZCTBUYYJOBP9RESITGUZBGVWQBNFDN9WMQKSMYYSNROWBXGDUZZ9999"]}'
```
