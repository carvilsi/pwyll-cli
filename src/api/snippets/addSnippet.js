/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import { checkVersion } from '../../utils/index.js';
import { configReader } from '../../handlers/configHandler.js';
import { addSnippetPwyllCall } from '../pwyllServerCalls.js';
import { addQuestion } from '../../clui/userQuestions.js';
import { infoHandler } from '../../handlers/infoHandler.js';
import { errorHandler } from '../../handlers/errorHandler.js';

export default async function add(answers) {
    try {
        const config = await configReader();
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
        errorHandler(err);
    }
}
