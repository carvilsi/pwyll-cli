import prompts from 'prompts';
import chalk from 'chalk';

import { deleteSnippetPwyllCall } from './pwyllServerCalls.js';
import { cyaAndExit,
    cleanup,
    errorHandler,
    infoHandler } from './util.js';

function renderSnippet(snippetObj) {
    console.log(chalk.green(snippetObj.snippet) + chalk.grey(' | ') +
               chalk.grey(snippetObj.description));
}

export async function delSnippet(snippetObj, config) {
    try {
        renderSnippet(snippetObj);
        const questions = [
            {
                type: 'confirm',
                name: 'value',
                message: 'Do you want to delete this snippet?',
                initial: true,
            }
        ];

        const answers = await prompts(questions, { onCancel:cleanup });
        if (answers.value) {
            await deleteSnippetPwyllCall(snippetObj, config);
            infoHandler(`snippet delted with ID: ${snippetObj.id}`);
        } else {
            cyaAndExit({ sentence: 'OK then,', username: config.username });
        }
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}


