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
        <>
          <video width={450} controls>
            <source
              className="w-full"
              src={submissionData.videoLink}
              type="video/mp4"
            />
          </video>
          <br />
          <a
            className="text-blue-600 underline font-bold mt-2"
            target="_blank"
            rel="noreferrer"
            href={submissionData.videoLink}
          >
            Click Here If Video Not Showing
          </a>
        </>
      </Box>
    </Box>
  );
};

export default Image;
