/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import { errorHandler, infoHandler } from './util.js';
import { updateSnippetPwyllCall } from './pwyllServerCalls.js';
import { updateQuestion } from './userQuestions.js';

export default async function updateSnippet(snippetObj, config, answers) {
    try {
        if (typeof answers === 'undefined') {
            answers = await updateQuestion(snippetObj);
        }
        snippetObj.snippet = answers.snippet;
        snippetObj.description = answers.description;
        const response = await updateSnippetPwyllCall(snippetObj, config);
        if (response.data) {
            infoHandler(`snippet with ID: ${snippetObj.id} has been updated`);
            return response.data;
            // XXX: check this thing
        }
        throw new Error(`something went wrong when updating the snippet with ID: ${snippetObj.id}`);
    } catch (err) {
        errorHandler(err);
    }
}

