/* eslint no-unused-expressions: "off" */

import { assert, expect } from 'chai';
import { equal } from 'assert';
import { it, describe } from 'mocha';
import fs from 'node:fs';

import testGlobals from './testGlobals.js';
import add from '../src/api/snippets/addSnippet.js';
import delSnippet from '../src/api/snippets/deleteSnippet.js';
import updateSnippet from '../src/api/snippets/updateSnippet.js';
import signUpPrompt from '../src/api/signUp.js';
import { searchSnippetPwyllCall } from '../src/api/pwyllServerCalls.js';
import exportsFromPwyll from '../src/api/snippets/exportSnippets.js';
import importsToPwyll from '../src/api/snippets/importSnippets.js';
import { configReader } from '../src/handlers/configHandler.js';

describe('pwyll client', async() => {
    let snippetId = null;
    let snippetSecondId = null;
    let config = null;
    const answersSignup = {
        url: testGlobals.__PYWLL_SERVER_URL__,
        username: testGlobals.__USER_NAME__,
        secret: testGlobals.__USER_SECRET__,
        repeatSecret: testGlobals.__USER_SECRET__,
    };

    it('should not signup a new user, since the user secret are different', async() => {
        answersSignup.secret = 'foo';
        answersSignup.repeatSecret = 'bar';
        try {
            await signUpPrompt(answersSignup);
        } catch (err) {
            equal(err.message, 'The provided secrets does not match, please repeat again');
        }
    });

    it('should not signup a new user, since the secret does not match the policy',
        async() => {
            answersSignup.secret = 'weak';
            answersSignup.repeatSecret = 'weak';
            try {
                await signUpPrompt(answersSignup);
            } catch (error) {
                expect((/does not meet the security policies/).test(error.toString())).to.be.true;
            }
        });

    it('should signup a new user', async() => {
        answersSignup.secret = testGlobals.__USER_SECRET__;
        answersSignup.repeatSecret = testGlobals.__USER_SECRET__;
        const response = await signUpPrompt(answersSignup);
        equal(response.length, 24);
    });

    it('should not signup a new user, since the config file already exists', async() => {
        answersSignup.username = 'Mr. Frodo Baggins';
        expect(async() => {
            await signUpPrompt(answersSignup);
        }).to.throw;
    });

    it('should read the config file', async() => {
        config = await configReader();
        assert.containsAllKeys(config, [ 'userID', 'username', 'secret', 'pwyllUrl' ]);
    });

    it('should add new snippet', async() => {
        const answers = {
            snippet: testGlobals.__SNIPPET_OBJECT__.snippet,
            description: testGlobals.__SNIPPET_OBJECT__.description,
        };
        const response = await add(answers);
        snippetId = response.data;
        equal(snippetId.length, 24);
    });

    it('should update a snippet', async() => {
        const snippetObj = {
            snippet: testGlobals.__SNIPPET_OBJECT__.snippet,
            description: testGlobals.__SNIPPET_OBJECT__.description,
            id: snippetId,
        };
        const answers = {
            snippet: testGlobals.__SECOND_SNIPPET_OBJECT__.snippet,
            description: testGlobals.__SECOND_SNIPPET_OBJECT__.description,
        };
        const response = await updateSnippet(snippetObj, config, answers);

        assert.isTrue(response, `the snippet with ID: ${snippetId} has been updated`);
    });

    it('should find the snippet', async() => {
        const snippets = await searchSnippetPwyllCall('nodemon', config);
        equal(snippets[0].snippet, testGlobals.__SECOND_SNIPPET_OBJECT__.snippet);
        equal(snippets[0].description, testGlobals.__SECOND_SNIPPET_OBJECT__.description);
        equal(snippets[0].username, testGlobals.__USER_NAME__);
        equal(snippets[0].id, snippetId);
    });

    it('should add another snippet', async() => {
        const answers = {
            snippet: testGlobals.__SNIPPET_OBJECT__.snippet,
            description: testGlobals.__SNIPPET_OBJECT__.description,
        };
        const response = await add(answers);
        snippetSecondId = response.data;
        equal(snippetSecondId.length, 24);
    });

    it('should export all the snippets for the user', async() => {
        await exportsFromPwyll(testGlobals.__EXPORT_FILE__);
        equal(fs.existsSync(testGlobals.__EXPORT_FILE__), true);
        const snippets = JSON.parse(fs.readFileSync(testGlobals.__EXPORT_FILE__));
        equal(snippets.length, 2);
        let i = 0;
        equal(snippets[i].snippet, testGlobals.__SECOND_SNIPPET_OBJECT__.snippet);
        equal(snippets[i].description, testGlobals.__SECOND_SNIPPET_OBJECT__.description);
        equal(snippets[i].user.username, testGlobals.__USER_NAME__);
        equal(snippets[i]._id, snippetId);
        i++;
        equal(snippets[i].snippet, testGlobals.__SNIPPET_OBJECT__.snippet);
        equal(snippets[i].description, testGlobals.__SNIPPET_OBJECT__.description);
        equal(snippets[i].user.username, testGlobals.__USER_NAME__);
        equal(snippets[i]._id, snippetSecondId);
    });

    it('should fail when export since the export file already exists', async() => {
        expect(async() => {
            await exportsFromPwyll(testGlobals.__EXPORT_FILE__);
        }).to.throw;
        // TODO: check expec/throw not matching the error message...
    });

    it('should import a json file with snippets for user', async() => {
        await importsToPwyll(testGlobals.__IMPORT_FILE__);
        const snippetsImported = JSON.parse(fs.readFileSync(testGlobals.__IMPORT_FILE__));
        const snippets = await searchSnippetPwyllCall('exa', config);
        equal(snippets[0].snippet, snippetsImported[1].snippet);
        equal(snippets[0].description, snippetsImported[1].description);
        equal(snippets[0].username, testGlobals.__USER_NAME__);
    });

    it('should not import because the file does not exists', async() => {
        try {
            await importsToPwyll(testGlobals.__DOOMIE_IMPORT_FILE__);
        } catch (err) {
            equal(err.message, `The file ${testGlobals.__DOOMIE_IMPORT_FILE__} to import does not exists`);
        }
    });

    it('should not import because the file is not a json', async() => {
        expect(async() => {
            await importsToPwyll(testGlobals.__FAKE_IMPORT_FILE__);
        }).to.throw;
    });

    it('should delete a snippet', async() => {
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

