import Chance from 'chance';

const chance = new Chance();

const testGlobals = {
    __PYWLL_SERVER_URL__: 'http://localhost:46520',
    __USER_NAME__: chance.name(),
    __USER_SECRET__: 'user test super secret',
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
};

export default testGlobals;
