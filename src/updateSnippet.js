import prompts from 'prompts';
import axios from 'axios';
import { configReader,
         errorHandler, 
         infoHandler } from './util.js';

async function updateSnippetPwyllCall(
  pwyllUrl, 
  snippet, 
  description, 
  userID, 
  snippetID) {
  const response = await axios.put(`${pwyllUrl}/command`, {
    command: snippet,
    description: description,
    userId: userID,
    id: snippetID
  });
   infoHandler(`snippet updated with ID: ${response.data}`);
}

export async function update(snippetObj) {
 try {
   const config = configReader();
   const questions = [
     {
       type: 'text',
       name: 'snippet',
       message: 'snippet:',
       initial: snippetObj.snippet,
     },
     {
       type: 'text',
       name: 'description',
       message: 'description:',
       initial: snippetObj.description,
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

