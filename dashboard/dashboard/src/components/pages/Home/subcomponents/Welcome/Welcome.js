import React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

import CTA from "./CTA";

const Welcome = () => {
  const theme = useTheme();

  const GridItemHeadlineBlock = () => (
    <Box>
      <Typography
        variant="h3"
        align={"center"}
        gutterBottom
        sx={{
          fontWeight: 900,
          color: theme.palette.common.white,
        }}
      >
        Learn about Krause House & Web3 basics to earn Krause tokens
      </Typography>
      <Typography
        variant="h6"
        component="p"
        color="text.secondary"
        align={"center"}
        sx={{
          fontWeight: 400,
          color: theme.palette.common.white,
        }}
      >
        Start learning and earning Krause tokens today by watching our super
        quick and easy mini lessons
      </Typography>
      <CTA />
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretched", sm: "flex-start" }}
        justifyContent={"center"}
      >
        <Box
          sx={{ height: "40vh", aspectRatio: 1 }}
          component="img"
          src={
            "https://krausehousework.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fbd1c8f01-7f9e-469f-a473-e5a1c19ec839%2FKrause_House_Logo_Stacked_Shadow.png?table=block&id=db4b2659-f44b-4916-9066-65cd84b5dadc&spaceId=9116b053-c794-4602-ac43-cffa72f470cf&width=2000&userId=&cache=v2"
          }
          alt="..."
        />
      </Box>
    </Box>
  );
  return (
    <Box>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent={"center"}
          >
            <GridItemHeadlineBlock />
          </Box>
        </Grid>
        {/* <Grid item xs={12}>
          <Box
            width="100%"
            height="100%"
            display="flex"
            justifyContent={"center"}
          >
            <GridItemPartnersBlock />
          </Box>
        </Grid> */}
      </Grid>
    </Box>
  );
};

export default Welcome;
