import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  const { mode } = theme.palette;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={1}
          flexDirection={{ xs: "column", sm: "row" }}
        >
          <Box
            display={"flex"}
            component="a"
            href="/"
            target="_blank"
            width={150}
          >
            <Box
              component={"img"}
              src={
                "https://cdn.discordapp.com/attachments/961018550699556914/1080042984361431080/logo-words.png"
              }
              height={1}
              width={1}
            />
          </Box>
          {/* <Box display="flex" flexWrap={"wrap"} alignItems={"center"}>
            <Box marginTop={1} marginRight={2}>
              <Link
                underline="none"
                component="a"
                target="_blank"
                href="/"
                color="white"
                variant={"subtitle2"}
              >
                Home
              </Link>
            </Box>
          </Box> */}
        </Box>
      </Grid>
      <Grid item xs={12}>
        {/* <Typography
          align={"center"}
          variant={"subtitle2"}
          color="white"
          gutterBottom
        >
          &copy; KrauseHouse, 2022. All rights reserved
        </Typography>
        <Typography
          align={"center"}
          variant={"caption"}
          color="white"
          component={"p"}
        >
          We&apos;re a community of hoop fanatics just crazy enough to buy an
          NBA team.
        </Typography> */}
      </Grid>
    </Grid>
  );
};

export default Footer;
