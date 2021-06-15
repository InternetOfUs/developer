#!/bin/bash
if [ -f /.dockerenv ]; then
   echo "You can not start the development environment inside a docker container"
else
	DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
	pushd $DIR >/dev/null
	DOCKER_BUILDKIT=1 docker build -f docker/dev/Dockerfile -t internetofus/developer:dev .
	docker run --name wenet_developer_doc -it --rm -p 3000:3000 -v ${PWD}:/docusaurus internetofus/developer:dev
	popd >/dev/null
fi
