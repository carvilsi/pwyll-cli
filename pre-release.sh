#!/bin/bash

CHNGLG=CHANGELOG.md
NAME=$(node -e "console.log(require('./package.json').name)")
VERSION=$(node -e "console.log(require('./package.json').version)")
today=$(date +%Y-%m-%d)
line="# [v${VERSION}](https:\/\/github.com\/carvilsi\/${NAME}\/releases\/tag\/v${VERSION}) (${today})"
last_release_date=$(head -n 3 CHANGELOG.md | tail -1 | awk '{ print $3 }' | sed 's/(\|)//g')
commit_message=$(git log --after=${last_release_date} --format='- %s' | grep -v 'Merge' |  sed '{:q;N;s/\n//g;t q}')

TEST_DOCKER_COMPOSITION_FILE=tests/docker-compose.yml
# Requires jq
current_vers_develop_server=$(curl -s https://raw.githubusercontent.com/carvilsi/pwyll/develop/package.json | jq '.["version"]' | sed 's/\"//g')

echo $current_ver_develop_server
sed -i "s/pwyll:[0-9]*.[0-9]*.[0-9]*/pwyll:${current_vers_develop_server}/g" $TEST_DOCKER_COMPOSITION_FILE
# TODO: retrieve the current pwyll server and update the docker-compose for testing

#sed -i '2s/^/\nnewchangelogentry\n/' $CHNGLG
#sed -i "s/newchangelogentry/${line}\n\n- ${commit_message}/g" $CHNGLG

