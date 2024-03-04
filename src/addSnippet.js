/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import { configReader,
    errorHandler,
    infoHandler,
    checkVersion } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';
import { addQuestion } from './userQuestions.js';

export default async function add(answers) {
    try {
        const config = configReader();
        await checkVersion(config);
        if (typeof answers === 'undefined') {
            answers = await addQuestion();
        }
        const snippetObj = {
            snippet: answers.snippet,
            description: answers.description,
        };
        const response = await addSnippetPwyllCall(snippetObj, config);
        infoHandler(`snippet saved with ID: ${response.data}`);
        return response;
    } catch (err) {
        errorHandler(err.message);
    }
}

