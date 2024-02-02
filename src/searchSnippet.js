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
    if (userID !== null) url = `${url}&userId=${userID}`
  
    const response = await axios.get(url);

    if (!response.data.length) {
      return snippets;
    } else {
      for (var i = 0; i < response.data.length; i++) {
        const snippet = {
          snippet: response.data[i].command,
          description: response.data[i].description,
          username: response.data[i].username,
          id: response.data[i]._id,
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
        //XXX: it is possible to add the user that created the snippet
      }
    } else {
      log(chalk.white('No results ') + chalk.grey(' -.-'));
    }
  });
}

function findRender(snippetObj) {
  console.clear();
  clipboardy.writeSync(snippetObj.snippet);
  log(`${snippetObj.snippet}`);
  process.exit();
}

export async function search({ 
  searchAll = false, 
  update = false, 
  del = false 
} = {}) {
  const config = configReader();

  let promptString = `${config.username}:search@${config.pwyllUrl}>_ `;

  // if all is true we do not want the userID, 
  // the backend will search snippets for any user.
  if (searchAll) {
    config.userID = null;
    promptString = `anyone:search@${config.pwyllUrl}>_ `;
  }
  if (update) {
    promptString = `${config.username}:update@${config.pwyllUrl}>_ `;
  }
  if (del) {
    promptString = `${config.username}:delete@${config.pwyllUrl}>_ `;
  }

  let queryBuffer = [];

	const rl = readline.createInterface({ 
    input: process.stdin, 
    output: process.stdout,
    prompt: promptString,
    terminal: true,
  });

  rl.prompt();
  callAndPrint(rl, queryBuffer.join(''), config);

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
      // Once the enter key was pressed we just take care about the first
      // search snippet result.
      if (snippets.length) {
        const snippetObj = snippets[0];
        if (del) {
          delSnippet(snippetObj);
        } else if (update) {
          updateSnippet(snippetObj);
        } else {
          findRender(snippetObj);
        }
      } 
    });
  });

  rl.on('close', () => {
    log(chalk.white('cya!') + chalk.grey(' :)'));
    process.exit();
  });
}

