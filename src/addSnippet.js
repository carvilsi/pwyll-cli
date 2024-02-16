import prompts from 'prompts';

import { configReader,
    errorHandler,
    infoHandler,
    cyaAndExit } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';

export async function add() {
    try {
        const config = configReader();
        const questions = [
            {
                type: 'text',
                name: 'snippet',
                message: 'snippet:',
            },
            {
                type: 'text',
                name: 'description',
                message: 'description:',
            }
        ];

        const answers = await prompts(questions, { onCancel:cyaAndExit });
        const snippetObj = {
            snippet: answers.snippet,
            description: answers.description,
        };
        const response = await addSnippetPwyllCall(snippetObj, config);
        infoHandler(`snippet saved with ID: ${response.data}`);
    } catch (err) {
        if (typeof err.response.data !== 'undefined' &&
          err.response.data.message ===
          'Not possible to store a command for a non exiting user') {
            err.message = 'The user does not exists, create one';
        }
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

