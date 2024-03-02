import prompts from 'prompts';
import chalk from 'chalk';

import { deleteSnippetPwyllCall } from './pwyllServerCalls.js';
import { deleteQuestion } from './userQuestions.js';
import { cyaAndExit,
    cleanup,
    errorHandler,
    infoHandler } from './util.js';

function renderSnippet(snippetObj) {
    console.log(chalk.green(snippetObj.snippet) + chalk.grey(' | ') +
               chalk.grey(snippetObj.description));
}

export async function delSnippet(snippetObj, config, answers) {
    try {
        renderSnippet(snippetObj);

        if (typeof answers === 'undefined') {
            answers = await deleteQuestion();
        }

        if (answers.value) {
            const response = await deleteSnippetPwyllCall(snippetObj, config);
            infoHandler(`snippet deleted with ID: ${snippetObj.id}`);
            return response.data;
        }
        cyaAndExit({ sentence: 'OK then,', username: config.username });
        return false;
    } catch (err) {
        errorHandler(err.message);
    }
}

