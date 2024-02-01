#! /usr/bin/env node

'use strict';

import { Command } from 'commander';
import { pwyllCli } from './../src/index.js';
import { signUp } from './../src/signUp.js'; 
import { add } from './../src/addSnippet.js'; 
import fs from 'fs';

const info = JSON.parse(fs.readFileSync('./package.json'));

const program = new Command();

program
  .name(info.name)
  .description(info.description)
  .version(info.version)
  .usage('[options] \n\t if no options provided the default mode is query for snippets from user')
  .command('signup')
  .argument('<url>', 'the URL of pwyll server, e.g. http://localhost:46520')
  .argument('<username>', 'the user name for usage')
  .description('do the sign up, creating a new user and dealing with configuration')
  .action((url, username) => {
    signUp(url, username);
  });
  
program  
  .command('s')
  .description('searches snippets for the current signed up user')
  .action(() => {
    pwyllCli({hi: "there"});
  });
  
program  
  .command('a')
  .description('creates new snippet for the current signed up user')
  .action(() => {
    add();
  });
//.option('-c, --config','configuration mode, for user and pwyll server URL')
//.option('-u, --update','update a snippet')
//.option('-s, --sign-up','sign up')
//.option('-a, --add','add a new snippet')
//.option('-f, --find-all','query for snippets from any user')
//.option('-d, --delete', 'delete snippet');

program.parse();

