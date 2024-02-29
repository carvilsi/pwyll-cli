#! /usr/bin/env node


import { Command } from 'commander';
import { signUpPrompt } from './../src/signUp.js';
import { add } from './../src/addSnippet.js';
import { search } from './../src/searchSnippet.js';
import { exports } from './../src/exportSnippets.js';
import { imports } from './../src/importSnippets.js';
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
    .alias('search')
    .description('searches snippets for the current signed up user and copies the ' +
               'selected one to the clipboard')
    .action(() => {
        search();
    });

program
    .command('sa')
    .alias('search-all')
    .description('searches snippets from any user and copies the ' +
               'selected one to the clipboard')
    .action(() => {
        search({ searchAll: true });
    });

program
    .command('n')
    .alias('new')
    .description('creates new snippet for the current signed up user')
    .action(() => {
        add();
    });

program
    .command('u')
    .alias('update')
    .description('updates a snippet for the current signed up user')
    .action(() => {
        search({ update: true });
    });

program
    .command('d')
    .alias('delete')
    .description('deletes a snippet for the current signed up user')
    .action(() => {
        search({ del: true });
    });

program
    .command('e')
    .alias('export')
    .description('exports all the signed in user snippets to json file')
    .argument('<file>', 'export file path')
    .action((file) => {
        exports(file);
    });

program
    .command('i')
    .alias('import')
    .description('imports the snippets from a json file for the signed in user')
    .argument('<file>', 'file path to import')
    .action((file) => {
        imports(file);
    });

program.parse();

