/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */
/* eslint no-console: "off" */

import { deleteSnippetPwyllCall } from './pwyllServerCalls.js';
import { deleteQuestion } from './userQuestions.js';
import { cyaAndExit,
    errorHandler,
    infoHandler } from './util.js';
import { deleteSnippetRender } from './clui.js';

export default async function delSnippet(snippetObj, config, answers) {
    try {
        // to not clear the console on tests, but keep it clean for user
        if (typeof answers === 'undefined') {
            console.clear();
        }
        deleteSnippetRender(snippetObj, config);
        if (typeof answers === 'undefined') {
            answers = await deleteQuestion();
        }
        // if the user answered yes or not
        if (answers.value) {
            const response = await deleteSnippetPwyllCall(snippetObj, config);
            infoHandler(`snippet deleted with ID: ${snippetObj.id}`);
            return response.data;
        }
        cyaAndExit({ sentence: 'OK, do not delete then,', username: config.username });
    } catch (err) {
        errorHandler(err);
    }
}

