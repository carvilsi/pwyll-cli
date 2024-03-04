/* eslint no-console: "off" */

import chalk from 'chalk';
import clipboardy from 'clipboardy';

import { lineDiv } from './util.js';

const log = console.log;
const SELECT_SYMBOL = '|>';

function colorizeRender(snippetObj, config, selected) {
    let snippetRender = selected ? chalk.greenBright(snippetObj.snippet) :
        chalk.green(snippetObj.snippet);
    let descriptionRender = selected ? chalk.whiteBright(snippetObj.description) :
        chalk.white(snippetObj.description);
    if (typeof config.colors !== 'undefined') {
        if (typeof config.colors.enabled === 'undefined') {
            throw new Error('wrong colors configuration, missing enabled');
        }
        if (!config.colors.enabled) {
            snippetRender = selected ? chalk.whiteBright(snippetObj.snippet) :
                chalk.white(snippetObj.snippet);
            descriptionRender = selected ? chalk.whiteBright(snippetObj.description) :
                chalk.grey(snippetObj.description);
        } else if (typeof config.colors.selectedSnippet !== 'undefined' &&
                typeof config.colors.selectedDescription !== 'undefined' &&
                typeof config.colors.snippet !== 'undefined' &&
                typeof config.colors.description !== 'undefined'
        ) {
            snippetRender = selected ?
                chalk[config.colors.selectedSnippet](snippetObj.snippet) :
                chalk[config.colors.snippet](snippetObj.snippet);
            descriptionRender = selected ?
                chalk[config.colors.selectedDescription](snippetObj.description) :
                chalk[config.colors.selectedDescription](snippetObj.description);
        }
    }
    if (selected) {
        return `${SELECT_SYMBOL} ${descriptionRender}\n` +
            `${SELECT_SYMBOL} ${snippetRender}`;
    }
    return `${descriptionRender}\n${snippetRender}`;
}

export function searchRender(snippetObj, config) {
    console.clear();
    clipboardy.writeSync(snippetObj.snippet);
    log(`${snippetObj.snippet}`);
    log(chalk.grey('(copied to clipboard)'));
    process.exit();
}

// XXX: it is possible to add the user that created the snippet
export function snippetsRender(snippets, selectedSnippet, config) {
    if (snippets.length) {
        log(chalk.white(lineDiv()));
        for (let i = 0; i < snippets.length; i++) {
            log(colorizeRender(snippets[i], config, i === selectedSnippet));
            log(chalk.grey(lineDiv()));
        }
    } else {
        log(chalk.white('No results ') + chalk.grey(' -.-'));
    }
}

export function deleteSnippetRender(snippetObj, config) {
    log(colorizeRender(snippetObj, config, false));
}
