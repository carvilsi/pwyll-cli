import chalk from 'chalk';

const log = console.log;

export class VersionError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, VersionError.prototype);
    }
}

export class InvalidUserError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, InvalidUserError.prototype);
    }
}

export class InvalidPasswordError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, InvalidPasswordError.prototype);
    }
}

export class ConfigurationFileError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ConfigurationFileError.prototype);
    }
}

export class ExportSnippetError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ExportSnippetError.prototype);
    }
}

// XXX: maybe replace these three functions with logmeplease
export function errorHandler(error) {
    log(`[${chalk.red('ERROR')}] ${error.message}`);
    if (!(error instanceof VersionError) &&
        !(error instanceof InvalidPasswordError) &&
        !(error instanceof ExportSnippetError) &&
        !(error instanceof ConfigurationFileError)) {
        throw error;
    }
}