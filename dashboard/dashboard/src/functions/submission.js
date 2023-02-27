import axios from "axios";

export const verifySubmission = async (submissionId) => {
  return await axios.get(
    `https://8eaa-144-121-228-37.ngrok.io/verify-submission?submissionId=${submissionId}`
  );
};

export const endSubmission = async () => {
  return await axios.get(`https://8eaa-144-121-228-37.ngrok.io/EndChallenge`);
};

export const getSubmissions = async () => {
  return await axios.get(
    `https://8eaa-144-121-228-37.ngrok.io/get-submission-notverify?challengeId=63f91efb6322941ff43065c1`
  );
};
