/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import { errorHandler,
    configHandler,
    checkVersion } from './util.js';
import { signUpPwyllCall } from './pwyllServerCalls.js';
import { sigupQuestion } from './userQuestions.js';

export async function signUpPrompt(answers) {
    try {
        if (typeof answers === 'undefined') {
            answers = await sigupQuestion();
        }
        const url = answers.url.trim();
        const secret = answers.secret.trim();
        const username = answers.username.trim();
        await checkVersion({ pwyllUrl: url });
        if (secret !== answers.repeatSecret.trim()) {
            throw new Error('the provided passwords does not match, please repeat again');
        }
        const userID = await signUpPwyllCall(url, username, secret);
        configHandler(url, username, userID, secret);
        return userID;
    } catch (err) {
        errorHandler(err.message);
    }
}

