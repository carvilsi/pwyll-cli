/* eslint no-console: "off" */
import path from 'node:path';
import * as fs from 'node:fs/promises';
import semver from 'semver';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

import { retrieveInfo } from '../api/pwyllServerCalls.js';
import { PwyllCLIError } from '../handlers/errorHandler.js';

const PACKAGE_JSON = './../../package.json';

export async function checkVersion(config) {
    const pwyllInfo = await retrieveInfo(config);
    const pckgFile = await fs.readFile(path.join(__dirname, PACKAGE_JSON));
    const pckg = JSON.parse(pckgFile);
    const major = semver.major(semver.coerce(pckg.version));
    const isValidVersion = semver.satisfies(semver.coerce(pwyllInfo.version), `^${major}.x`);
    if (!isValidVersion) {
        throw new PwyllCLIError(`${pckg.name}@${pckg.version} ` +
            'not compatible with server version for ' +
            `${pwyllInfo.name}@${pwyllInfo.version}` +
            ' try to update the client: $ npm isntall -g pwyll-cli');
    }
}

