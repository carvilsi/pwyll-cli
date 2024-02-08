import axios from 'axios';
import { infoHandler,
    errorHandler } from './util.js';

// delete a snippet
export async function deleteSnippetPwyllCall(snippetObj, config) {
    const response =
    await axios.delete(
        `${config.pwyllUrl}/command/${snippetObj.id}/${config.userID}`);
    return response;
}

// creating new snippet
export async function addSnippetPwyllCall(snippetObj, config) {
    const response = await axios.post(`${config.pwyllUrl}/command`, {
        command: snippetObj.snippet,
        description: snippetObj.description,
        userId: config.userID,
    });
    return response;
}

// sign up
export async function signUpPwyllCall(pwyllUrl, username) {
    try {
        const response = await axios.post(`${pwyllUrl}/user`,
            { username: username });
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
    console.dir(snippetObj);
    const response = await axios.put(`${config.pwyllUrl}/command`, {
        command: snippetObj.snippet,
        description: snippetObj.description,
        userId: config.userID,
        id: snippetObj.id,
    });
    infoHandler(`snippet updated with ID: ${response.data}`);
}

// search snippets
export async function searchSnippetPwyllCall(query, config) {
    let snippets = [];

    try {
        let url = `${config.pwyllUrl}/command/find?q=${query}`;
        if (config.userID !== null) {
            url = `${url}&userId=${config.userID}`;
        }

        const response = await axios.get(url);

        if (!response.data.length) {
            return snippets;
        }
        for (let i = 0; i < response.data.length; i++) {
            const snippet = {
                snippet: response.data[i].command,
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

