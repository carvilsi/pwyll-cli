#!/bin/bash

CHNGLG=CHANGELOG.md
NAME=$(node -e "console.log(require('./package.json').name)")
VERSION=$(node -e "console.log(require('./package.json').version)")
today=$(date +%Y-%m-%d)
line="# [v${VERSION}](https:\/\/github.com\/carvilsi\/${NAME}\/releases\/tag\/v${VERSION}) (${today})"
last_release_date=$(head -n 3 CHANGELOG.md | tail -1 | awk '{ print $3 }' | sed 's/(\|)//g')
commit_message=$(git log --after=${last_release_date} --format='- %s' | grep -v 'Merge' |  sed '{:q;N;s/\n//g;t q}')

#echo $last_release_date;
#echo $commit_message;

# TODO: retrieve the current pwyll server and update the docker-compose for testing

sed -i '2s/^/\nnewchangelogentry\n/' $CHNGLG
# FIXME: this is failing
sed -i "s/newchangelogentry/${line}\n\n- ${commit_message}/g" $CHNGLG

