#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

#set up envs
source $DIR/_env.sh

if [ "$1" == "build" ]
then
	docker-compose build || exit 1
	docker-compose pull || exit 1
  exit 0
fi

if [ "$1" == "clear" ]
then
	docker-compose rm -fv
	docker-compose build || exit 1
	docker-compose pull || exit 1
fi

docker-compose up -d
docker exec -it iota_lambda bash
