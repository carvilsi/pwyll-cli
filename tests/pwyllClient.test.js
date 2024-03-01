import { assert } from 'chai';
import { equal } from 'assert';

import { add } from '../src/addSnippet.js';
import { delSnippet } from '../src/deleteSnippet.js';
import { updateSnippet } from '../src/updateSnippet.js';
import { configReader } from '../src/util.js';

describe('pwyll client', async () => {

    let snippetId;
    let config;

    it('should read the config file', async () => {
        config = configReader();

        assert.containsAllKeys(config, ['userID', 'username', 'secret', 'pwyllUrl']);
    });

    it('should add new snippet', async () => {
        const answers = {
            snippet: 'mocha tests/',
            description: 'to execute test with mocha over tests folder',
        };
        const response = await add(answers);
        snippetId = response.data;
        equal(snippetId.length, 24);
    });

    it('should update a snippet', async () => {
        const snippetObj = {
            snippet: 'mocha tests/',
            description: 'to execute test with mocha over tests folder',
            id: snippetId,
        };
        const answers = {
            snippet: './node_modules/mocha/bin/mocha.js test/',
            description: 'to execute test with local mocha over tests folder',
        };
        const response = await updateSnippet(snippetObj, config, answers);

        assert.isTrue(response, `the snippet with ID: ${snippetId} has been updated`);
    });

    it('should delete a snippet', async () => {
        const snippetObj = {
            snippet: 'something',
            description: 'an amazing description',
            id: snippetId,
        };
        const answers = { value: true };
        const response = await delSnippet(snippetObj, config, answers);

        assert.isTrue(response, `the snippet with ID: ${snippetId} has been deleted`);
    });
});

