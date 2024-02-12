#!/bin/bash

CHNGLG=CHANGELOG.md
BNRY=bin/pwyll-cli.js
NAME=$(node -e "console.log(require('./package.json').name)")
VERSION=$(node -e "console.log(require('./package.json').version)")
today=$(date +%Y-%m-%d)
line="# [v${VERSION}](https:\/\/github.com\/carvilsi\/${NAME}\/releases\/tag\/v${VERSION}) (${today})"
last_release_date=$(head -n 3 CHANGELOG.md | tail -1 | awk '{ print $3 }' | sed 's/(\|)//g')
commit_message=$(git log --after=${last_release_date} --format='- %s' | grep -v 'Merge')

sed -i '2s/^/\nnewchangelogentry\n/' $CHNGLG
sed -i "s/newchangelogentry/${line}\n\n- ${commit_message}/g" $CHNGLG
sed -i "s/version('[0-9]*.[0-9]*.[0-9]*')/version('${VERSION}')/g" $BNRY

