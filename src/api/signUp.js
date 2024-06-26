/* eslint consistent-return: "off" */
/* eslint no-param-reassign: "off" */

import {
    errorHandler,
    PwyllCLIError,
} from '../handlers/errorHandler.js';
import { signUpPwyllCall } from './pwyllServerCalls.js';
import { sigupQuestion } from '../clui/userQuestions.js';
import {
    configFileExists,
    configHandler
} from '../handlers/configHandler.js';
import { checkVersion } from '../utils/index.js';

export default async function signUpPrompt(answers) {
    try {
        configFileExists();
        if (typeof answers === 'undefined') {
            answers = await sigupQuestion();
        }
        const url = answers.url.trim();
        const secret = answers.secret.trim();
        const username = answers.username.trim();
        await checkVersion({ pwyllUrl: url });
        if (secret !== answers.repeatSecret.trim()) {
            throw new PwyllCLIError(
                'The provided secrets does not match, please repeat again');
        }
        const userID = await signUpPwyllCall(url, username, secret);
        await configHandler(url, username, userID, secret);
        return userID;
    } catch (err) {
        return errorHandler(err);
    }
}

