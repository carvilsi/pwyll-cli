import fs from 'node:fs';
import JSONStream from 'JSONStream';
import path from 'node:path';

import { configReader,
    errorHandler,
    infoHandler,
    checkVersion } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';

export async function imports(file) {
    try {
        const config = configReader();
        await checkVersion(config);
        if (!fs.existsSync(file)) {
            throw new Error(`The file ${file} to import does not exists`);
        }
        if (path.extname(file) !== '.json') {
            throw new Error(`The provided file ${file} has not json extension`);
        }
        let snippets = 0;
        const readStream = fs.createReadStream(file, 'utf8')
            .pipe(JSONStream.parse('*'));
        readStream.on('data', async(data) => {
            const snippetObj = {
                snippet: data.snippet,
                description: data.description,
            };
            snippets++;
            await addSnippetPwyllCall(snippetObj, config);
        });
        readStream.on('end', () => {
            infoHandler(`imported a total of ${snippets} snippets into pwyll`);
        });
    } catch (err) {
        errorHandler(err.message);
    }
}

