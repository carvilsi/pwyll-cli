import fs from 'node:fs';

import { configReader,
    errorHandler,
    infoHandler,
    checkVersion } from './util.js';
import { exportSnippetsPwyllCall } from './pwyllServerCalls.js';

export default async function exportsFromPwyll(file) {
    try {
        const config = await configReader();
        await checkVersion(config);
        if (fs.existsSync(file)) {
            throw new Error(`The export file ${file} already exists`);
        }
        await exportSnippetsPwyllCall(file, config);
        infoHandler(`snippets exporter to: ${file}`);
        return;
    } catch (err) {
        errorHandler(err);
    }
}

