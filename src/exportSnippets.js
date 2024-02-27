import fs from 'node:fs';

import { configReader,
    errorHandler,
    infoHandler,
    cyaAndExit,
    checkVersion } from './util.js';
import { exportSnippetsPwyllCall } from './pwyllServerCalls.js';

export async function exports(file) {
    try {
        const config = configReader();
        await checkVersion(config);
        if (fs.existsSync(file)) throw new Error(`The export file ${file} already exists`);
        await exportSnippetsPwyllCall(file, config);
        infoHandler(`snippets exporter to: ${file}`);
    } catch (err) {
        errorHandler(err.message);
    } finally {
        process.exit();
    }
}

