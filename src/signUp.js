import prompts from 'prompts';

import { errorHandler, configHandler, cyaAndExit, checkVersion } from './util.js';
import { signUpPwyllCall } from './pwyllServerCalls.js';

export async function signUpPrompt() {
    try {
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

        const answers = await prompts(questions, { onCancel:cyaAndExit });
        const url = answers.url.trim();
        const secret = answers.secret.trim();
        const username = answers.username.trim();
        await checkVersion({ pwyllUrl: url });
        if (secret !== answers.repeatSecret.trim()) {
            throw new Error('the provided passwords does not match, please repeat again');
        }
        const userID = await signUpPwyllCall(url, username, secret);
        configHandler(url, username, userID, secret);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

