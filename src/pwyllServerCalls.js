import axios from 'axios';
import fs from 'node:fs';
import { errorHandler } from './util.js';

// delete a snippet
export async function deleteSnippetPwyllCall(snippetObj, config) {
    const response =
    await axios.delete(
        `${config.pwyllUrl}/snippet/${snippetObj.id}/${config.userID}/${config.secret}`);
    return response;
}

// creating new snippet
export async function addSnippetPwyllCall(snippetObj, config) {
    const response = await axios.post(`${config.pwyllUrl}/snippet`, {
        snippet: snippetObj.snippet,
        description: snippetObj.description,
        userID: config.userID,
        secret: config.secret,
    });
    return response;
}

// sign up
export async function signUpPwyllCall(pwyllUrl, username, secret) {
    try {
        const response = await axios.post(`${pwyllUrl}/user`, {
            username: username,
            secret: secret,
        });
        const userID = response.data;
        return userID;
    } catch (error) {
        if (typeof error.response.data.message !== 'undefined') {
            throw new Error(error.response.data.message);
        } else {
            throw error;
        }
    }
}

// update a snippet
export async function updateSnippetPwyllCall(snippetObj, config) {
    return await axios.put(`${config.pwyllUrl}/snippet`, {
        snippet: snippetObj.snippet,
        description: snippetObj.description,
        userID: config.userID,
        id: snippetObj.id,
        secret: config.secret,
    });
}

// search snippets
export async function searchSnippetPwyllCall(query, config) {
    let snippets = [];

    try {
        let url = `${config.pwyllUrl}/snippet/find?q=${query}`;
        if (config.userID !== null) {
            url = `${url}&userID=${config.userID}`;
        }

        const response = await axios.get(url);

        if (!response.data.length) {
            return snippets;
        }
        for (let i = 0; i < response.data.length; i++) {
            const snippet = {
                snippet: response.data[i].snippet,
                description: response.data[i].description,
                username: response.data[i].username,
                id: response.data[i]._id,
            };
            snippets.push(snippet);
        }
        return snippets;
    } catch (err) {
        errorHandler(err.message);
        return snippets;
    }
}

// retrieve info for pwyll server
export async function retrieveInfo(config) {
    try {
        const url = `${config.pwyllUrl}/info`;
        const res = await axios.get(url, { timeout: 1000 });
        return res.data;
    } catch (error) {
        if ((/ECONNREFUSED/).test(error.message) || (/timeout of/).test(error.message)) {
            throw new Error(`No pwyll server running at ${config.pwyllUrl}`);
        } else {
            throw error;
        }
    }
}

// exports the snippets for a user
export function exportSnippetsPwyllCall(file, config) {
    return new Promise((resolve, reject) => {
        axios({
            method: 'GET',
            url: `${config.pwyllUrl}/snippet/export`,
            params: { userID: config.userID },
            responseType: 'stream',
        }).then((response) => {
            response.data
                .pipe(fs.createWriteStream(file))
                .on('finish', () => {
                    resolve();
                })
                .on('error', (error) => {
                    reject(error);
                });
        }).catch((error) => {
            reject(error);
        });
    });
}

