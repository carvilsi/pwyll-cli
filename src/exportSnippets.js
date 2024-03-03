import fs from 'node:fs';

import { configReader,
    errorHandler,
    infoHandler,
    checkVersion } from './util.js';
import { exportSnippetsPwyllCall } from './pwyllServerCalls.js';

export default async function exportsFromPwyll(file) {
    try {
        const config = configReader();
        await checkVersion(config);
        console.log('In the name of lol');
        if (fs.existsSync(file)) {
            console.log('WTH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            infoHandler(`The export file ${file} already exists`);
            throw new Error(`The export file ${file} already exists`);
        }
        console.log('In the name of lol 1');
        await exportSnippetsPwyllCall(file, config);
        console.log('In the name of lol 2');
        infoHandler(`snippets exporter to: ${file}`);
        return;
    } catch (err) {
        errorHandler(err.message);
    }
}

