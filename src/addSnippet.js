import prompts from 'prompts';

import { configReader,
    errorHandler,
    infoHandler,
    cyaAndExit,
    checkVersion } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';

export async function add() {
    try {
        const config = configReader();
        await checkVersion(config);
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
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

