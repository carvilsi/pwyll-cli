import prompts from 'prompts';

import { errorHandler, cleanup, infoHandler } from './util.js';
import { updateSnippetPwyllCall } from './pwyllServerCalls.js';

export async function updateSnippet(snippetObj, config) {
    try {
        const questions = [
            {
                type: 'text',
                name: 'snippet',
                message: 'snippet:',
                initial: snippetObj.snippet,
            },
            {
                type: 'text',
                name: 'description',
                message: 'description:',
                initial: snippetObj.description,
            }
        ];

        const answers = await prompts(questions, { onCancel:cleanup });
        snippetObj.snippet = answers.snippet;
        snippetObj.description = answers.description;
        const response = await updateSnippetPwyllCall(snippetObj, config);
        if (response.data) {
            infoHandler(`snippet with ID: ${snippetObj.id} has been updated`);
        } else {
            throw new Error(`something went wrong when updating the snippet with ID: ${snippetObj.id}`);
        }
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

