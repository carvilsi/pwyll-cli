/* eslint no-console: "off" */
import chalk from 'chalk';

export class PwyllCLIError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, PwyllCLIError.prototype);
    }
}

export function errorHandler(error) {
    console.log(`[${chalk.red('ERROR')}] ${error.message}`);
    if (!(error instanceof PwyllCLIError)) {
        throw error;
    }
    return error.message;
}
