/* eslint consistent-return: "off" */

import fs from 'node:fs';

import {
    errorHandler,
    PwyllCLIError
} from '../../handlers/errorHandler.js';
import { infoHandler } from '../../handlers/infoHandler.js';
import { exportSnippetsPwyllCall } from '../pwyllServerCalls.js';
import { configReader } from '../../handlers/configHandler.js';
import { checkVersion } from '../../utils/index.js';

export default async function exportsFromPwyll(file) {
    try {
        const config = await configReader();
        await checkVersion(config);
        if (fs.existsSync(file)) {
            throw new PwyllCLIError(`The export file ${file} already exists`);
        }
        await exportSnippetsPwyllCall(file, config);
        infoHandler(`snippets exporter to: ${file}`);
        return;
    } catch (err) {
        return errorHandler(err);
    }
}

