import axios from "axios";

const API_URL = "https://6a95-144-121-228-39.ngrok.io";

export const verifySubmission = async (submissionId) => {
  return await axios.post(
    `${API_URL}/verify-submission?submissionId=${submissionId}`
  );
};

export const endChallenge = async () => {
  return await axios.get(`${API_URL}/end-challenge`);
};

export const getSubmissions = async () => {
  return await axios.get(
    `${API_URL}/get-submission-notverify?challengeId=63f91efb6322941ff43065c1`
  );
};
