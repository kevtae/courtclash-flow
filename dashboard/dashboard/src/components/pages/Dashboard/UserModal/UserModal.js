import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

import Image from "./Image";
import Details from "./Details";

const UserModal = ({ open, setOpen, currentUser }) => {
  return (
    <Dialog onClose={() => setOpen(false)} open={open} maxWidth={"lg"}>
      <Box paddingY={{ xs: 1, sm: 2 }} paddingX={{ xs: 2, sm: 4 }}>
        <Box
          paddingY={{ xs: 1, sm: 2 }}
          display={"flex"}
          justifyContent={"flex-end"}
        >
          <Box
            component={"svg"}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width={24}
            height={24}
            onClick={() => setOpen(false)}
            sx={{ cursor: "pointer" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </Box>
        </Box>
        {currentUser &&
          currentUser[1].map((sub) => {
            return (
              <Box key={sub[0]} paddingY={2}>
                <Grid container spacing={{ xs: 2, md: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Image submissionData={sub} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Details submissionData={sub} />
                  </Grid>
                </Grid>
                <Divider
                  fullWidth
                  sx={{
                    marginTop: 10,
                    marginBottom: 10,
                    backgroundColor: "black",
                  }}
                />
              </Box>
            );
          })}
      </Box>
    </Dialog>
  );
};

export default UserModal;
