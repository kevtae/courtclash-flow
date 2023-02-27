import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import Container from "@components/common/Container";

const CTA = () => {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up("md"), {
    defaultMatches: true,
  });

  return (
    <Container>
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretched", sm: "flex-start" }}
        justifyContent={"center"}
      >
        <Button
          component={"a"}
          variant="contained"
          color="primary"
          sx={{ backgroundColor: "#078a7d" }}
          size="large"
          fullWidth={isMd ? false : true}
          href={"/modules"}
          target="_blank"
        >
          Start Learning
        </Button>
        <Box
          marginTop={{ xs: 2, sm: 0 }}
          marginLeft={{ sm: 2 }}
          width={{ xs: "100%", md: "auto" }}
        >
          <Button
            component={"a"}
            href={"https://discord.com/invite/3bJwMCUEbe"}
            target="_blank"
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#5865F2" }}
            size="large"
            fullWidth={isMd ? false : true}
          >
            Join Discord
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CTA;
