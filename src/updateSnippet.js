import prompts from 'prompts';

import { errorHandler, infoHandler } from './util.js';
import { updateSnippetPwyllCall } from './pwyllServerCalls.js';
import { updateQuestion } from './userQuestions.js';

export async function updateSnippet(snippetObj, config, answers) {
    try {
        if (typeof answers === 'undefined') answers = updateQuestion();
        snippetObj.snippet = answers.snippet;
        snippetObj.description = answers.description;
        const response = await updateSnippetPwyllCall(snippetObj, config);
        if (response.data) {
            infoHandler(`snippet with ID: ${snippetObj.id} has been updated`);
            return response.data;
            //XXX: check this thing
        } else {
            throw new Error(`something went wrong when updating the snippet with ID: ${snippetObj.id}`);
        }
    } catch (err) {
        errorHandler(err.message);
    }
}

