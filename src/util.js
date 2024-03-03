/* eslint no-console: "off" */

import chalk from 'chalk';
import { homedir } from 'node:os';
import path from 'node:path';
import fs from 'node:fs';
import semver from 'semver';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { retrieveInfo } from './pwyllServerCalls.js';

const log = console.log;

const CONFIG_FOLDER = `${homedir}${path.sep}.pwyll-cli`;
const CONFIG_FILE = `${CONFIG_FOLDER}${path.sep}pwyll-config.json`;
const PACKAGE_JSON = './../package.json';

// XXX: maybe replace these three functions with logmeplease
export function errorHandler(errorMessage) {
    log(`[${chalk.red('ERROR')}] ${errorMessage}`);
    throw new Error(errorMessage);
}

export function warningHandler(warningMessage) {
    log(`[${chalk.yellow('WARN')}] ${warningMessage}`);
}

export function infoHandler(infoMessage) {
    log(`[${chalk.green('INFO')}] ${infoMessage}`);
}

export function configHandler(urlServer, username, userID, secret) {
    try {
        const config = {
            pwyllUrl: urlServer,
            username: username,
            userID: userID,
            secret: secret,
        };
        if (!fs.existsSync(CONFIG_FOLDER)) {
            fs.mkdirSync(CONFIG_FOLDER);
        } else {
            warningHandler(`the configuration folder ${CONFIG_FOLDER} already exists`);
        }
        if (!fs.existsSync(CONFIG_FILE)) {
            fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
            infoHandler(`user ${username} created, with ID: ${userID} on pwyll at ${urlServer}`);
            infoHandler(`data saved at ${CONFIG_FILE}`);
        } else {
            throw new Error(`configuration file ${CONFIG_FILE} already exists, ` +
                    'if you need to modify it, please remove it and try again');
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

export async function checkVersion(config) {
    const pwyllInfo = await retrieveInfo(config);
    const pckg = JSON.parse(fs.readFileSync(path.join(__dirname, PACKAGE_JSON)));
    const isValidVersion = semver.satisfies(pwyllInfo.version, `^${pckg.version}`);
    if (!isValidVersion) {
        throw new Error(`${pckg.name}@${pckg.version} ` +
            'not compatible with server version for ' +
            `${pwyllInfo.name}@${pwyllInfo.version}` +
            ' try to update the client: $ npm isntall -g pwyll-cli');
    }
}

