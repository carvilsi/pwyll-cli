import axios from 'axios';
import readline from 'node:readline';
import colors from 'colors';
import clipboardy from 'clipboardy';

const pwyllUrl = 'http://127.0.0.1:46520';

async function pwyllCall(userID, query) {
  try {
    const response = await axios.get(`${pwyllUrl}/command/find?q=${query}&userId=${userID}`);
    let snippets = [];
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
  } catch (error) {
    console.log(error);
  }
}

function callAndPrint(rl, query) {
  pwyllCall('65b79e94feccf1b54511d1a2', query)
  .then((snippets) => {
    console.clear();
    rl.write(null, { ctrl: true, name: 'u' }); 
    rl.prompt();
    rl.write(query);
    console.log('\n');
    if (snippets.length) {
      for (let i=0; i < snippets.length; i++) {
        console.log(`${colors.green(snippets[i].snippet)} | ${colors.grey(snippets[i].description)}`);
      }
    } else {
      console.log(colors.white('No results ') + colors.grey(' -.-'));
    }
  });
}

(async () => {

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
        callAndPrint(rl, queryBuffer.join(''));
        break;
      case 'return':
        break;
      default:
        queryBuffer.push(key);
        callAndPrint(rl, queryBuffer.join(''));
    }
  });

  rl.on('line', (query) => {
    pwyllCall('65b79e94feccf1b54511d1a2', queryBuffer.join(''))
    .then((snippets) => {
      console.clear();
      clipboardy.writeSync(snippets[0].snippet);
      console.log(`${snippets[0].snippet}`);
      process.exit();
    });
  });

  rl.on('close', () => {
    console.log(colors.white('cya!') + colors.grey(' :)'));
    process.exit();
  });
})();

