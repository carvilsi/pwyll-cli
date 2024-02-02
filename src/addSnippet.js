import prompts from 'prompts';

import { configReader, errorHandler } from './util.js';
import { addSnippetPwyllCall } from './pwyllServerCalls.js';

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
   const snippetObj = {
     snippet: answers.snippet,
     description: answers.description,
   }
   await addSnippetPwyllCall(snippetObj, config);
 } catch (err) {
   errorHandler(err.message);
 } finally {
   process.exit();
 }
}

function cleanup() {
  console.clear();
}

