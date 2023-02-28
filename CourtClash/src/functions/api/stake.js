import axios from 'axios';
import {API_URL} from '@env';

export const getTotalStaked = async () => {
  return await axios.get(`${API_URL}/get-total-stake`);
};
