import axios from 'axios';
import {API_URL} from '@env';

export const createOrGetUser = async email => {
  console.log(`${API_URL}/user`);
  return await axios.post(`${API_URL}/user`, {email});
};

export const getUserFunds = async address => {
  return await axios.post(`${API_URL}/user-get-balance?address=${address}`);
};
