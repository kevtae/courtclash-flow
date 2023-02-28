import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { verifySubmission, endChallenge } from "@functions/submission";

const Details = ({ submissionData }) => {
  const [verified, setVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [endChallengeLoading, setEndChallengeLoading] = useState(false);
  const [challengeEnded, setChallengeEnded] = useState(false);

  const onVerify = (id) => {
    setVerifyLoading(true);
    verifySubmission(id).then((res) => {
      console.log("verified res----", res.data);
      setVerified(true);
      setVerifyLoading(false);
    });
  };

  const onEndChallenge = () => {
    setEndChallengeLoading(true);
    endChallenge()
      .then((res) => {
        console.log("Challenge Ended Success: ", res.data);
        setChallengeEnded(true);
        setEndChallengeLoading(false);
      })
      .catch((e) => {
        console.log("Challenge Ended Error: ", e);
        setEndChallengeLoading(false);
      });
  };

  return (
    <Box>
      {Object.entries(submissionData).map((data, i) => {
        return (
          <Typography
            style={{ marginBottom: 30 }}
            variant={"body2"}
            fontWeight={700}
            gutterBottom
          >
            {data[0]}:{data[1]}
          </Typography>
        );
      })}
      {verifyLoading ? (
        <CircularProgress />
      ) : (
        <Button
          onClick={() => onVerify(submissionData.ID)}
          variant={"contained"}
          color={"primary"}
          size={"large"}
          fullWidth
        >
          {verified ? "Verified Already" : "Verify"}
        </Button>
      )}

      {endChallengeLoading ? (
        <CircularProgress color="error" />
      ) : (
        <Button
          onClick={() => onEndChallenge()}
          variant={"contained"}
          color={"error"}
          size={"large"}
          fullWidth
          style={{ marginTop: 20 }}
        >
          {challengeEnded ? "Challenge Ended" : "End Challenge"}
        </Button>
      )}
    </Box>
  );
};

export default Details;
