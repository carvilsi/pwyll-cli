import fs from 'node:fs';
import JSONStream from 'JSONStream';
import path from 'node:path';

import { configReader,
    errorHandler,
    infoHandler,
    checkVersion } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';

export default async function importsToPwyll(file) {
    try {
        const config = configReader();
        await checkVersion(config);
        if (!fs.existsSync(file)) {
            throw new Error(`The file ${file} to import does not exists`);
        }
        if (path.extname(file) !== '.json') {
            throw new Error(`The provided file ${file} has not json extension`);
        }
        return new Promise((resolve, reject) => { 
            let snippets = 0;
            fs.createReadStream(file, 'utf8')
                .pipe(JSONStream.parse('*'))
                .on('data', async (data) => {
                    const snippetObj = {
                        snippet: data.snippet,
                        description: data.description,
                    };
                    snippets++;
                    console.log('here TADAN!');
                    await addSnippetPwyllCall(snippetObj, config);
                    console.log('WTH');
                })
                .on('end', () => {
                    console.log('THE stream ends');
                    infoHandler(`imported a total of ${snippets} snippets into pwyll`);
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        });
    } catch (err) {
        errorHandler(err.message);
    }
}

