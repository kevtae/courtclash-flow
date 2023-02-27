import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import NoSsr from "@mui/material/NoSsr";

import Main from "@containers/Main";
import Container from "@components/common/Container";
import { ModuleList } from "./subcomponents";

const Modules = () => {
  const theme = useTheme();

  const styles = (bgImage) => ({
    position: "absolute",
    objectFit: "cover",
    /* support for plugin https://github.com/bfred-it/object-fit-images */
    fontFamily: "object-fit: cover;",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    backgroundImage: `url(${bgImage})`,
    filter: theme.palette.mode === "dark" ? "brightness(0.7)" : "none",
  });

  return (
    <Main>
      <Box
        minHeight={"100vh"}
        display={"flex"}
        alignItems={"center"}
        bgcolor={"alternate.main"}
        marginTop={-13}
        paddingTop={13}
      >
        <ModuleList />
      </Box>
    </Main>
  );
};

export default Modules;
