/* eslint no-console: "off" */

import readline from 'node:readline';

import { searchSnippetPwyllCall } from '../pwyllServerCalls.js';
import delSnippet from './deleteSnippet.js';
import updateSnippet from './updateSnippet.js';
import { configReader } from '../../handlers/configHandler.js';
import { cyaAndExit } from '../../clui/index.js';
import { checkVersion } from '../..//utils/index.js';
import { errorHandler } from '../../handlers/errorHandler.js';
import { 
    searchRender,
    snippetsRender
} from '../../clui/index.js';

const log = console.log;
let selectedSnippet = 0;
let snippetsLength = 0;
let all = false;

function callAndPrint(rl, query, config) {
    searchSnippetPwyllCall(query, config)
        .then((snippets) => {
            snippetsLength = snippets.length;
            console.clear();
            rl.write(null, { ctrl: true, name: 'u' });
            rl.prompt();
            rl.write(query);
            log('\n');
            snippetsRender(snippets, selectedSnippet, config, all);
        });
}

export default async function search({
    searchAll = false,
    update = false,
    del = false
} = {}) {
    try {
        const config = await configReader();

        await checkVersion(config);

        let promptString = `${config.username}:search@${config.pwyllUrl}>_ `;

        all = searchAll;
        // if all is true we do not want the userID,
        // the backend will search snippets for any user.
        if (searchAll) {
            config.userID = null;
            promptString = `anyone:search-all@${config.pwyllUrl}>_ `;
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
                if (selectedSnippet < snippetsLength - 1) {
                    selectedSnippet++;
                }
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'up':
                if (selectedSnippet - 1 >= 0) {
                    selectedSnippet--;
                }
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'right':
                selectedSnippet = snippetsLength - 1;
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'left':
                selectedSnippet = 0;
                callAndPrint(rl, queryBuffer.join(''), config);
                break;
            case 'return':
                break;
            default:
                if (objk.name === 'c' && objk.ctrl) {
                    cyaAndExit({ username: config.username });
                } else {
                    selectedSnippet = 0;
                    queryBuffer.push(key);
                    callAndPrint(rl, queryBuffer.join(''), config);
                }
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
                        const snippetObj = snippets[selectedSnippet];
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
        errorHandler(error);
        process.exit();
    }
}

