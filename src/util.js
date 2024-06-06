/* eslint no-console: "off" */

import chalk from 'chalk';
import facetxt from 'facetxt';
import { homedir } from 'node:os';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import semver from 'semver';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { retrieveInfo } from './pwyllServerCalls.js';
import signUpPrompt from './signUp.js';

const log = console.log;

const CONFIG_FOLDER = `${homedir}${path.sep}.pwyll-cli`;
const CONFIG_FILE = `${CONFIG_FOLDER}${path.sep}pwyll-config.json`;
const PACKAGE_JSON = './../package.json';

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

export class ConfigurationFileExistsError extends Error {
    constructor(m) {
        super(m);
        Object.setPrototypeOf(this, ConfigurationFileExistsError.prototype);
    }
}

// XXX: maybe replace these three functions with logmeplease
export function errorHandler(error) {
    log(`[${chalk.red('ERROR')}] ${error.message}`);
    if (!(error instanceof VersionError) &&
        !(error instanceof InvalidPasswordError) &&
        !(error instanceof ConfigurationFileExistsError)) {
        throw error;
    }
}

export function warningHandler(warningMessage) {
    log(`[${chalk.yellow('WARN')}] ${warningMessage}`);
}

export function infoHandler(infoMessage) {
    log(`[${chalk.green('INFO')}] ${infoMessage}`);
}

export function configFileExists() {
    if (existsSync(CONFIG_FILE)) {
        throw new ConfigurationFileExistsError(`configuration file ${CONFIG_FILE} already exists, ` +
                    'if you need to modify it, please remove it and try again');
    }
}

export async function configHandler(urlServer, username, userID, secret) {
    try {
        const config = {
            pwyllUrl: urlServer,
            username: username,
            userID: userID,
            secret: secret,
        };
        if (!existsSync(CONFIG_FOLDER)) {
            await fs.mkdir(CONFIG_FOLDER);
        } else {
            warningHandler(`the configuration folder ${CONFIG_FOLDER} already exists`);
        }
        configFileExists();
        await fs.writeFile(CONFIG_FILE, JSON.stringify(config));
        infoHandler(`user ${username} created, with ID: ${userID} on pwyll at ${urlServer}`);
        infoHandler(`data saved at ${CONFIG_FILE}`);
        return;
    } catch (err) {
        errorHandler(err);
    }
}

export async function configReader() {
    if (existsSync(CONFIG_FILE)) {
        const configFile = await fs.readFile(CONFIG_FILE);
        const config = JSON.parse(configFile);
        return config;
    }
    warningHandler(`the configuration file ${CONFIG_FILE} does not exists, ` +
                    'let\'s create one');
    await signUpPrompt();
    return await configReader();
}

export function lineDiv() {
    const col = process.stdout.columns;
    const str = '-'.repeat(col);
    return str;
}

export function cyaAndExit({ sentence = '', username = '' } = {}) {
    console.clear();
    const smile = sentence.length > 0 ? facetxt.like('shrug') : facetxt.like('smile');
    log(chalk.white(`${sentence} cya ${username}!`.trim()) + chalk.grey(` ${smile}`));
    process.exit();
}

export function cleanup() {
    console.clear();
}

export async function checkVersion(config) {
    const pwyllInfo = await retrieveInfo(config);
    const pckgFile = await fs.readFile(path.join(__dirname, PACKAGE_JSON));
    const pckg = JSON.parse(pckgFile);
    const major = semver.major(pckg.version);
    const isValidVersion = semver.satisfies(pwyllInfo.version, `^${major}.x`);
    if (!isValidVersion) {
        throw new VersionError(`${pckg.name}@${pckg.version} ` +
            'not compatible with server version for ' +
            `${pwyllInfo.name}@${pwyllInfo.version}` +
            ' try to update the client: $ npm isntall -g pwyll-cli');
    }
}

