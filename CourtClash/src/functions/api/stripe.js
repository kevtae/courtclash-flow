import axios from 'axios';
import {API_URL} from '@env';

export const getPaymentInfo = async address => {
  console.log('addres---', address);
  return await axios.get(
    `${API_URL}/get-client-secret?address=${address}`,
    {address},
    {headers: {}},
  );
};
