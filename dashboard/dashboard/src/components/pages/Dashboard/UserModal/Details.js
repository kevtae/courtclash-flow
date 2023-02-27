import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { verifySubmission } from "@functions/submission";

const Details = ({ submissionData }) => {
  const [verified, setVerified] = useState(false);
  const [rejected, setRejected] = useState(false);

  const onVerify = (id, valid) => {
    verifySubmission(id, valid).then((res) => {
      valid ? setVerified(true) : setRejected(true);
    });
  };

  return (
    <Box>
      <Typography variant={"h5"} fontWeight={700} gutterBottom>
        Module Number: {submissionData.moduleNum}
      </Typography>
      <Typography variant={"h6"} color={"text.secondary"}>
        Course Number: {submissionData.courseNum}
      </Typography>
      <Box
        marginTop={2}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant={"h6"} fontWeight={700}>
          Reward: ${submissionData.tokenReward} KRAUSE
        </Typography>
      </Box>
      <Box marginTop={2}>
        <Typography fontWeight="bold">Discord:</Typography>
        <Typography>{submissionData.discordId}</Typography>
      </Box>
      <Box marginTop={2}>
        <Typography fontWeight="bold">Email:</Typography>
        <Typography>{submissionData.email}</Typography>
      </Box>
      <Box marginTop={2}>
        <Typography fontWeight="bold">Public Key:</Typography>
        <Typography>
          {submissionData.key} saldn alsn dasln dalsn dlan dlasndoawnonsaon w
          naod naod naobd as oads
        </Typography>
      </Box>
      {verified ? (
        <Button
          onClick={() => onVerify(submissionData._id, true)}
          variant={"contained"}
          color={"primary"}
          size={"large"}
          disabled
          fullWidth
        >
          Verified Already
        </Button>
      ) : rejected ? (
        <Button
          onClick={() => onVerify(submissionData._id, true)}
          variant={"contained"}
          color={"primary"}
          size={"large"}
          disabled
          fullWidth
        >
          Rejected Already
        </Button>
      ) : (
        <>
          <Button
            onClick={() => onVerify(submissionData._id, true)}
            variant={"contained"}
            color={"primary"}
            size={"large"}
            fullWidth
          >
            Verify
          </Button>
          <Button
            onClick={() => onVerify(submissionData._id, false)}
            variant={"contained"}
            color={"error"}
            size={"large"}
            fullWidth
          >
            Reject
          </Button>
        </>
      )}
    </Box>
  );
};

export default Details;
