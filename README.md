# IOTA Lambda

### offload your POW to AWS lambda!

## Purpose

This is an example project of using AWS lambda to perform the `attachToTangle` command without having to run it locally *or* run a full node.

## Getting Started

### Prerequisites

Sorry, but this one needs a few disparate bits and pieces to get it working:
- *AWS* account, with credentials in `~/.aws/credentials`, or in your current env
- *serverless* (installed with docker below), but you need to have a basic understanding of how serverless and cloudformation works.

  >*sidebar:* We probably don't need Serverless for this project. My first iteration was to use ApiGateway and set up an IOTA proxy based on this: https://github.com/TimSamshuijzen/iotaproxy. However, ApiGateway has a hard timeout limit of 30s, which is fine for every iota command except for attachToTangle.

- *Docker* & *docker-compose* we use docker to build the native npm modules for the exact version of Amazon Linux that AWS Lambda runs internally.

- *node* and *yarn*


### Steps

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

3. Edit `config.js` to set your provider and trytes to send.

  I'm setting the trytes manually here because I'm lazy, and was getting errors when trying to generate them using the iota api.

4. Get the test script up and running.

  ```bash
  #make sure you log out of docker or use a different window first!
  $ yarn #or npm install I suppose

  #run my test script.
  $ node index.js
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
