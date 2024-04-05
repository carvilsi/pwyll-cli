/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import { errorHandler, infoHandler, cyaAndExit } from './util.js';
import { updateSnippetPwyllCall } from './pwyllServerCalls.js';
import { updateQuestion } from './userQuestions.js';

export default async function updateSnippet(snippetObj, config, answers) {
    try {
        // this check is just for testing purposes
        if (typeof answers === 'undefined') {
            answers = await updateQuestion(snippetObj);
        }
        // the user did not want to update
        if (!Object.prototype.hasOwnProperty.call(answers, 'snippet') ||
            !Object.prototype.hasOwnProperty.call(answers, 'snippet')) {
            cyaAndExit({ sentence: 'OK, then,', username: config.username });
        }
        snippetObj.snippet = answers.snippet;
        snippetObj.description = answers.description;
        const response = await updateSnippetPwyllCall(snippetObj, config);
        // the pwyll server side returns true if update was ok
        if (response.data) {
            infoHandler(`snippet with ID: ${snippetObj.id} has been updated`);
            return response.data;
        }
        throw new Error(`something went wrong when updating the snippet with ID: ${snippetObj.id}`);
    } catch (err) {
        errorHandler(err);
    }
}

