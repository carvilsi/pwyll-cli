import Chance from 'chance';

const chance = new Chance();

const testGlobals = {
    __PYWLL_SERVER_URL__: 'http://localhost:46520',
    __USER_NAME__: chance.name().replace(' ', '_'),
    __USER_SECRET__: '6Nwa.TS1q$7X51k4ZnZHHmH',
    __SNIPPET_OBJECT__: {
        snippet: 'nodemon -e js,ts -x ts-node --files src/index.ts',
        description: 'dev mode nodemon typescript ts-node',
    },
    __SECOND_SNIPPET_OBJECT__: {
        snippet: 'nodemon src/',
        description: 'generic nodemon for source folder changes',
    },
    __EXPORT_FILE__: './tests/files/export-file.json',
    __IMPORT_FILE__: './tests/files/import-file.json',
    __FAKE_IMPORT_FILE__: './tests/pwllClient.test.js',
    __DOOMIE_IMPORT_FILE__: 'foo.json',
    __DOOMIE_IMPORT_FILE_NO_JSON_EXTENSION__: 'foo.bar',
};

export default testGlobals;
