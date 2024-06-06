/* eslint consistent-return: "off" */

import fs from 'node:fs';
import JSONStream from 'JSONStream';
import path from 'node:path';

import { addSnippetPwyllCall } from '../pwyllServerCalls.js';
import { errorHandler } from '../../handlers/errorHandler.js';
import { infoHandler } from '../../handlers/infoHandler.js';
import { configReader } from '../../handlers/configHandler.js';
import { checkVersion } from '../../utils/index.js';

// TODO: re-think this...
export default async function importsToPwyll(file) {
    try {
        const config = await configReader();
        await checkVersion(config);
        if (!fs.existsSync(file)) {
            throw new Error(`The file ${file} to import does not exists`);
        }
        if (path.extname(file) !== '.json') {
            throw new Error(`The provided file ${file} has not json extension`);
        }
        return new Promise((resolve, reject) => {
            const snippets = [];
            fs.createReadStream(file, 'utf8')
                .pipe(JSONStream.parse('*'))
                .on('data', (data) => {
                    const snippetObj = {
                        snippet: data.snippet,
                        description: data.description,
                    };
                    snippets.push(addSnippetPwyllCall(snippetObj, config));
                })
                .on('end', () => {
                    Promise.all(snippets)
                        .then(() => {
                            infoHandler(`imported a total of ${snippets.length} snippets into pwyll`);
                            return resolve();
                        })
                        .catch((error) => {
                            return reject(error);
                        });
                })
                .on('error', (error) => {
                    return reject(error);
                });
        });
    } catch (err) {
        errorHandler(err);
    }
}

