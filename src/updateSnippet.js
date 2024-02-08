import prompts from 'prompts';

import { errorHandler, cleanup } from './util.js';
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
        await updateSnippetPwyllCall(snippetObj, config);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

