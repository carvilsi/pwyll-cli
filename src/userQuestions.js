import prompts from 'prompts';

import { cyaAndExit, cleanup } from './util.js';

export async function addQuestion() {
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
    return await prompts(questions, { onCancel: cyaAndExit });
}

export async function deleteQuestion() {
    const questions = [
        {
            type: 'confirm',
            name: 'value',
            message: 'Do you want to delete this snippet?',
            initial: true,
        }
    ];

    return await prompts(questions, { onCancel: cleanup });
}

export async function updateQuestion() {
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

    return await prompts(questions, { onCancel: cleanup });
}

export async function sigupQuestion() {
    const questions = [
        {
            type: 'text',
            name: 'url',
            message: 'pwyll url:',
            initial: 'http://localhost:46520'
        },
        {
            type: 'text',
            name: 'username',
            message: 'username:',
        },
        {
            type: 'password',
            name: 'secret',
            message: 'type your secret:',
        },
        {
            type: 'password',
            name: 'repeatSecret',
            message: 'type your secret again:',
        }
    ];

    return await prompts(questions, { onCancel: cyaAndExit });
}
