#! /usr/bin/env node

'use strict';

import { Command } from 'commander';
import { signUp } from './../src/signUp.js'; 
import { add } from './../src/addSnippet.js'; 
import { search } from './../src/searchSnippet.js';
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
  .description('searches snippets for the current signed up user and copies the ' + 
               'selected one to the clipboard')
  .action(() => {
    search({ all: false});
  });
   
program  
  .command('sa')
  .description('searches snippets from any user and copies the ' + 
               'selected one to the clipboard')
  .action(() => {
    search({ all: true });
  });
  
program  
  .command('n')
  .description('creates new snippet for the current signed up user')
  .action(() => {
    add();
  });

//TODO: implement update and delete snippets

program.parse();

