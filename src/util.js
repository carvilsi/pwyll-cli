import chalk from 'chalk';
import { homedir } from 'os';
import path from 'path';
import fs from 'fs';

const log = console.log;

const CONFIG_FOLDER = `${homedir}${path.sep}.pwyll-cli`;
const CONFIG_FILE = `${CONFIG_FOLDER}${path.sep}pwyll-config.json`;

// XXX: maybe replace these three functions with logmeplease
export function errorHandler(errorMessage) {
    log(`[${chalk.red('ERROR')}] ${errorMessage}`);
}

export function warningHandler(warningMessage) {
    log(`[${chalk.yellow('WARN')}] ${warningMessage}`);
}

export function infoHandler(infoMessage) {
    log(`[${chalk.green('INFO')}] ${infoMessage}`);
}

export function configHandler(url, username, userID) {
    try {
        const config = {
            pwyllUrl: url,
            username: username,
            userID: userID,
        };
        if (!fs.existsSync(CONFIG_FOLDER)) {
            fs.mkdirSync(CONFIG_FOLDER);
        } else {
            warningHandler(`the configuration folder ${CONFIG_FOLDER} already exists`);
        }
        if (!fs.existsSync(CONFIG_FILE)) {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
            infoHandler(`user ${username} created, with ID: ${userID} on pwyll at ${url}`);
            infoHandler(`data saved at ${CONFIG_FILE}`);
        } else {
            errorHandler(`configuration file ${CONFIG_FILE} already exists, ` +
                    'if you need to modify it, please edit manually');
        }
    } catch (err) {
        errorHandler(err.message);
    }
}

export function configReader() {
    if (fs.existsSync(CONFIG_FILE)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
        return config;
    }
    throw new Error(`the configuration file ${CONFIG_FILE} does not exists, ` +
                    'create one with command \'$ ./bin/pwyll-cli.js signup ' +
                    '<url> <username>\'');
}

export function lineDiv() {
    const col = process.stdout.columns;
    const str = '-'.repeat(col);
    return str;
}

export function cyaAndExit({ sentence = '', username = '' } = {}) {
    log(chalk.white(`${sentence} ${username} cya!`.trim()) + chalk.grey(' :)'));
    process.exit();
}

export function cleanup() {
    console.clear();
}
