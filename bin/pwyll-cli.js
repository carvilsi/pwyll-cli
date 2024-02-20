#! /usr/bin/env node

'use strict';

import { Command } from 'commander';
import { signUpPrompt } from './../src/signUp.js'; 
import { add } from './../src/addSnippet.js'; 
import { search } from './../src/searchSnippet.js';
import fs from 'fs';
import * as url from 'url';
import path from 'node:path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

const pckg = JSON.parse(fs.readFileSync(path.join(__dirname, './../package.json')));

const program = new Command();

program
  .name(pckg.name)
  .description(`${pckg.description}
                  ┓┓  ┓•
           ┏┓┓┏┏┓┏┃┃ ┏┃┓
           ┣┛┗┻┛┗┫┗┗━┗┗┗
           ┛     ┛      
          <3 by carvilsi`)
  .version(pckg.version)
  .usage('[options] command')
  .command('signup')
  .description('do the sign up, creating a new user and dealing with configuration')
  .action(() => {
    signUpPrompt();
  });
  
program  
  .command('s')
  .description('searches snippets for the current signed up user and copies the ' + 
               'selected one to the clipboard')
  .action(() => {
    search();
  });
   
program  
  .command('sa')
  .description('searches snippets from any user and copies the ' + 
               'selected one to the clipboard')
  .action(() => {
    search({ searchAll: true });
  });
  
program  
  .command('n')
  .description('creates new snippet for the current signed up user')
  .action(() => {
    add();
  });
  
program  
  .command('u')
  .description('updates a snippet for the current signed up user')
  .action(() => {
    search({ update: true });
  });
  
program  
  .command('d')
  .description('deletes a snippet for the current signed up user')
  .action(() => {
    search({ del: true });
  });

program.parse();

