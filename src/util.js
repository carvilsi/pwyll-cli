import colors from 'colors';
import { homedir } from 'os';
import path from 'path';
import fs from 'fs';

const CONFIG_FOLDER = `${homedir}${path.sep}.pwyll-cli`;
const CONFIG_FILE = `${CONFIG_FOLDER}${path.sep}pwyll-config.json`;

//XXX: maybe replace these three functions with logmeplease
export function errorHandler(errorMessage) {
  console.log(`[${colors.red('ERROR')}] ${errorMessage}`);
}

export function warningHandler(warningMessage) {
  console.log(`[${colors.yellow('WARN')}] ${warningMessage}`);
}

export function infoHandler(infoMessage) {
  console.log(`[${colors.green('INFO')}] ${infoMessage}`);
}

export function configHandler(url, username, userID) {
   try {
     const config = {
       pywllServer: url,
       username: username,
       userID: userID,
     }
     if (!fs.existsSync(CONFIG_FOLDER)) {
       fs.mkdirSync(CONFIG_FOLDER);
     } else {
       warningHandler(`the configuration folder ${CONFIG_FOLDER} already exists`);
     }
     if (!fs.existsSync(CONFIG_FILE)) {
       fs.writeFileSync(CONFIG_FILE, JSON.stringify(config));
       infoHandler(`user ${username} created, with ID: ${userID} on pwyll at ${url}`);
       infoHandler(`data saved at ${CONFIG_FILE}`);
     } else {
       errorHandler(`configuration file ${CONFIG_FILE} already exists,
        if you need to modify it, please edit manually`);
     }
   } catch (err) {
     errorHandler(err.message);
   }
}

