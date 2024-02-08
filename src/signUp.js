import { errorHandler, configHandler } from './util.js';
import { signUpPwyllCall } from './pwyllServerCalls.js';

export async function signUp(pwyllUrl, username) {
    try {
        const userID = await signUpPwyllCall(pwyllUrl, username);
        configHandler(pwyllUrl, username, userID);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

