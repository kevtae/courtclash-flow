import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

const Image = ({ submissionData }) => {
  return (
    <Box>
      <Box
        sx={{
          marginBottom: 2,
          width: 1,
          height: "auto",
          "& img": {
            width: 1,
            height: 1,
            objectFit: "cover",
            borderRadius: 2,
          },
        }}
      >
        <img src={submissionData.answerSC} alt={submissionData.answerText} />
      </Box>
    </Box>
  );
};

export default Image;
