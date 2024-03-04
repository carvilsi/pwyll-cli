/* eslint no-console: "off" */

import readline from 'node:readline';
import chalk from 'chalk';
import clipboardy from 'clipboardy';

import { searchSnippetPwyllCall } from './pwyllServerCalls.js';
import delSnippet from './deleteSnippet.js';
import updateSnippet from './updateSnippet.js';
import { configReader,
    lineDiv,
    cyaAndExit,
    checkVersion,
    errorHandler } from './util.js';

const log = console.log;
let SELECTED_SNIPPET = 0;
let snippetsLength = 0;

function callAndPrint(rl, query, config) {
    searchSnippetPwyllCall(query, config)
        .then((snippets) => {
            snippetsLength = snippets.length;
            console.clear();
            rl.write(null, { ctrl: true, name: 'u' });
            rl.prompt();
            rl.write(query);
            log('\n');

            if (snippets.length) {
                log(chalk.white(lineDiv()));
                for (let i = 0; i < snippets.length; i++) {
                    // we want the first little bit more bright since is the
                    // one that will be selected when enter key will be pressed
                    const snppt = i === SELECTED_SNIPPET ? chalk.whiteBright(snippets[i].snippet) :
                        chalk.white(snippets[i].snippet);
                    const dscrptn = chalk.grey(snippets[i].description);

                    if (i === SELECTED_SNIPPET) {
                        log(`|=> ${dscrptn}\n|=> ${snppt}`);
                    } else {
                        log(`${dscrptn}\n${snppt}`);
                    }
                    log(chalk.grey(lineDiv()));
                    // XXX: it is possible to add the user that created the snippet
                }
            } else {
                log(chalk.white('No results ') + chalk.grey(' -.-'));
            }
        });
}

function searchRender(snippetObj) {
    console.clear();
    clipboardy.writeSync(snippetObj.snippet);
    log(`${snippetObj.snippet}`);
    process.exit();
}

export async function search({
    searchAll = false,
    update = false,
    del = false
} = {}) {
    try {
        const config = await configReader();

        await checkVersion(config);

        let promptString = `${config.username}:search@${config.pwyllUrl}>_ `;

        // if all is true we do not want the userID,
        // the backend will search snippets for any user.
        if (searchAll) {
            config.userID = null;
            promptString = `anyone:search@${config.pwyllUrl}>_ `;
        }
        if (update) {
            promptString = `${config.username}:update@${config.pwyllUrl}>_ `;
        }
        if (del) {
            promptString = `${config.username}:delete@${config.pwyllUrl}>_ `;
        }

        let queryBuffer = [];

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: promptString,
            terminal: true,
        });

        rl.prompt();
        callAndPrint(rl, queryBuffer.join(''), config);

        const listener = (key, objk) => {
            switch (objk.name) {
            case 'backspace':
            case 'delete':
                queryBuffer.pop();
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'down':
                if (SELECTED_SNIPPET < snippetsLength - 1) {
                    SELECTED_SNIPPET++;
                }
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'up':
                if (SELECTED_SNIPPET - 1 >= 0) {
                    SELECTED_SNIPPET--;
                }
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'right':
                SELECTED_SNIPPET = snippetsLength - 1;
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'left':
                SELECTED_SNIPPET = 0;
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'return':
                break;
            default:
                SELECTED_SNIPPET = 0;
                queryBuffer.push(key);
                callAndPrint(rl, queryBuffer.join(''), config);
            }
        };

        process.stdin.on('keypress', listener);

        // XXX: check to refactor this
        rl.on('line', () => {
            searchSnippetPwyllCall(queryBuffer.join(''), config)
                .then((snippets) => {
                    // Once the enter key was pressed we just take care about the first
                    // search snippet result.
                    if (snippets.length) {
                        const snippetObj = snippets[SELECTED_SNIPPET];
                        if (del) {
                            process.stdin.removeListener('keypress', listener);
                            rl.close();
                            delSnippet(snippetObj, config);
                        } else if (update) {
                            process.stdin.removeListener('keypress', listener);
                            rl.close();
                            updateSnippet(snippetObj, config);
                        } else {
                            searchRender(snippetObj);
                        }
                    }
                });
        });

        rl.on('close', () => {
            if (update || del) {
                return;
            }
            cyaAndExit({ username: config.username });
        });
    } catch (error) {
        errorHandler(error.message);
        process.exit();
    }
}

