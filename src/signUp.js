import prompts from 'prompts';

import { errorHandler, configHandler, cyaAndExit } from './util.js';
import { signUpPwyllCall } from './pwyllServerCalls.js';

async function signUp(pwyllUrl, username) {
    try {
        const userID = await signUpPwyllCall(pwyllUrl, username);
        configHandler(pwyllUrl, username, userID);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

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
                name: 'password',
                message: 'type your password:',
            },
            {
                type: 'password',
                name: 'repeatPassword',
                message: 'type your password again:',
            }
        ];

        const answers = await prompts(questions, { onCancel:cyaAndExit });
        console.dir(answers);
        if (answers.password !== answers.repeatPassword) {
            throw new Error('the provided passwords does not match, please repeat again');
        }
        await signUp(answers.url, answers.username);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

