#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/sls_iotaproxy

rm -rf node_modules #just for good measure. docker-compose might mount our local ones, which we don't want
npm install

serverless deploy
