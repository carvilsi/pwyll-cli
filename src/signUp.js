import axios from 'axios';
import { errorHandler, configHandler } from './util.js';

async function signUpPwyllCall(pwyllUrl, username) {
  try {
    const response = await axios.post(`${pwyllUrl}/user`, { username: username });
    const userID = response.data;
    return userID;
  } catch (error) {
    if (typeof error.response.data.message !== 'undefined') {
      throw new Error(error.response.data.message);
    } else {
      throw error;
    }
  }
}

export async function signUp(pwyllUrl, username) {
 try {
  const userID = await signUpPwyllCall(pwyllUrl, username);
  configHandler(pwyllUrl, username, userID);
 } catch (err) {
   errorHandler(err.message);
 } finally {
  process.exit();
 }
}

