import axios from "axios";

export const postSubmission = async (
  moduleNum,
  courseNum,
  discordId,
  email,
  key,
  answerText,
  answerSC,
  tokenReward
) => {
  const body = {
    moduleNum: moduleNum,
    courseNum: courseNum,
    discordId: discordId,
    email: email,
    key: key,
    answerText: answerText,
    answerSC: answerSC,
    tokenReward: tokenReward,
  };
  return await axios.post(
    `https://khu.cambitapp.com/api/create-submission`,
    body,
    {}
  );
};

export const getSubmissions = async () => {
  return await axios.get(
    `https://khu.cambitapp.com/api/7adfk42lv/get-submission`
  );
};

export const verifySubmission = async (id, valid) => {
  return await axios.patch(
    `https://khu.cambitapp.com/api/7adfk42lv/edit-submission/${id}?valid=${valid}`
  );
};
