import { homedir } from 'node:os';
import path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import signUpPrompt from '../api/signUp.js';
import { errorHandler } from './errorHandler.js';
import { infoHandler } from './infoHandler.js';
import { warningHandler } from './warningHandler.js';
import { ConfigurationFileError } from './errorHandler.js';

const CONFIG_FOLDER = `${homedir}${path.sep}.pwyll-cli`;
const CONFIG_FILE = `${CONFIG_FOLDER}${path.sep}pwyll-config.json`;

export function configFileExists() {
    if (existsSync(CONFIG_FILE)) {
        throw new ConfigurationFileError(`configuration file ${CONFIG_FILE} already exists, ` +
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
