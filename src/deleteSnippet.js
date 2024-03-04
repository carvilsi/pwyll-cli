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
        if (typeof answers === 'undefined') {
            console.clear();
        }
        deleteSnippetRender(snippetObj, config);

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

