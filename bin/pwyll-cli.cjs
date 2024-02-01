#! /usr/bin/env node

'use strict';

const  { program } = require('commander');
//const snoopm  = require('./../index.js');
const info = require('./../package.json');

program
.name(info.name)
.description(info.description)
.version(info.version)
.usage('[options] \n\t if no options provided the default mode is query for snippets from user')
.option('-c, --config','configuration mode, for user and pwyll server URL')
.option('-u, --update','update a snippet')
.option('-s, --sign-up','sign up')
.option('-a, --add','add a new snippet')
.option('-f, --find-all','query for snippets from any user')
.option('-d, --delete', 'delete snippet');

program.parse();
const options = program.opts();
console.dir(options);
//snoopm(program.args, options);
