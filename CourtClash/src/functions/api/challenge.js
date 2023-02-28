import axios from 'axios';
import {API_URL} from '@env';

export const getChallenges = async () => {
  return await axios.get(`${API_URL}/challenge`);
};

export const getSubmissions = async challengeId => {
  return await axios.get(
    `${API_URL}/get-submission?challengeId=${challengeId}`,
  );
};

export const submitChallenge = async (userID, challengeID, VideoLink) => {
  return await axios.post(`${API_URL}/create-submission`, {
    userID,
    challengeID,
    VideoLink,
  });
};

export const getUserSubmissions = async userId => {
  return await axios.get(`${API_URL}/get-user-submission?userId=${userId}`);
};
