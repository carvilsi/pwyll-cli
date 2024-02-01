import prompts from 'prompts';
import axios from 'axios';
import { configReader,
         errorHandler, 
         infoHandler } from './util.js';

async function addSnippetPwyllCall(pwyllUrl, snippet, description, userID) {
  const response = await axios.post(`${pwyllUrl}/command`, {
    command: snippet,
    description: description,
    userId: userID,
  });
   infoHandler(`snippet saved with ID: ${response.data}`);
}

export async function add() {
 try {
   const config = configReader();
   const questions = [
     {
       type: 'text',
       name: 'snippet',
       message: 'snippet:',
     },
     {
       type: 'text',
       name: 'description',
       message: 'description:',
     }
   ];

   const answers = await prompts(questions, { onCancel:cleanup });
   await addSnippetPwyllCall(config.pwyllUrl, answers.snippet, 
     answers.description, config.userID);
 } catch (err) {
   errorHandler(err.message);
 } finally {
   process.exit();
 }
}

function cleanup() {
  console.clear();
}

