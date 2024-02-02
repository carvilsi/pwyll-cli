import axios from 'axios';
import readline from 'node:readline';
import chalk from 'chalk';
import clipboardy from 'clipboardy';
import { configReader,
         errorHandler, 
         infoHandler,
         lineDiv } from './util.js';

const log = console.log;

async function searchSnippetPwyllCall(pwyllUrl, userID, query) {
  let snippets = [];

  try {
    let url = `${pwyllUrl}/command/find?q=${query}`;
    if (userID !== null) url = `${pwyllUrl}/command/find?q=${query}&userId=${userID}`
  
    const response = await axios.get(url);

    if (!response.data.length) {
      return snippets;
    } else {
      for (var i = 0; i < response.data.length; i++) {
        const snippet = {
          snippet: response.data[i].command,
          description: response.data[i].description,
      }
        snippets.push(snippet);
    }
      return snippets;
    }
  } catch (err) {
    errorHandler(err.message);
    return snippets;
  }
}

function callAndPrint(rl, query, config) {
  searchSnippetPwyllCall(config.pwyllUrl, config.userID, query)
  .then((snippets) => {
    console.clear();
    rl.write(null, { ctrl: true, name: 'u' }); 
    rl.prompt();
    rl.write(query);
    log('\n');
    if (snippets.length) {
      log(chalk.white(lineDiv()));
      for (let i=0; i < snippets.length; i++) {
        // we want the first little bit more bright since is the 
        // one that will be selected when enter key will be pressed
        const cmd = i === 0 ? chalk.greenBright(snippets[i].snippet) :
                              chalk.green(snippets[i].snippet);
        
        log(cmd + chalk.grey(' | ') + 
            chalk.grey(snippets[i].description));
        log(chalk.grey(lineDiv()));
      }
    } else {
      log(chalk.white('No results ') + chalk.grey(' -.-'));
    }
  });
}

export async function search(options) {
  const config = configReader();

  // if all is true we do not want the userID, 
  // the backend will search snippets for any user.
  if (options.all) config.userID = null;

  let queryBuffer = [];

	const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout,
    prompt: 'pwyll> ',
    terminal: true,
  });

  rl.prompt();

  process.stdin.on('keypress', (key, objk) => {
    switch (objk.name) {
      case 'backspace':
      case 'delete':
        queryBuffer.pop();
        callAndPrint(rl, queryBuffer.join(''), config);
        break;
      case 'return':
        break;
      default:
        queryBuffer.push(key);
        callAndPrint(rl, queryBuffer.join(''), config);
    }
  });

  rl.on('line', (query) => {
    searchSnippetPwyllCall(config.pwyllUrl, config.userID, queryBuffer.join(''))
    .then((snippets) => {
      console.clear();
      clipboardy.writeSync(snippets[0].snippet);
      log(`${snippets[0].snippet}`);
      process.exit();
    });
  });

  rl.on('close', () => {
    log(chalk.white('cya!') + chalk.grey(' :)'));
    process.exit();
  });
}

