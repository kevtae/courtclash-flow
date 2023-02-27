import React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha, useTheme } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";

import NavItem from "./NavItem";

const Topbar = ({ onSidebarOpen, pages, colorInvert = false }) => {
  const theme = useTheme();
  const { mode } = theme.palette;
  const { modules: modulesPages } = pages;

  return (
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      width={1}
    >
      <Box
        display={"flex"}
        component="a"
        href="/"
        target="_blank"
        title="KrauseHouse"
        width={{ xs: 150, md: 200 }}
      >
        <Box
          component={"img"}
          src={
            "https://krausehousework.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F5d6df956-6d95-474d-8fed-981d5fda16df%2FKrause_House_Logo_Linear_Shadow.png?table=block&id=7d1a21e3-6e15-4ffe-9806-4b27faf49732&spaceId=9116b053-c794-4602-ac43-cffa72f470cf&width=2000&userId=&cache=v2"
          }
          height={1}
          width={1}
        />
      </Box>
      {/* <Box sx={{ display: { xs: "none", md: "flex" } }} alignItems={"center"}>
        <Box>
          <NavItem
            title={"Start Learning"}
            id={"modules"}
            items={modulesPages}
            colorInvert={colorInvert}
          />
        </Box>
      </Box> */}
      <Box sx={{ display: { xs: "block", md: "none" } }} alignItems={"center"}>
        <Button
          onClick={() => onSidebarOpen()}
          aria-label="Menu"
          variant={"outlined"}
          sx={{
            borderRadius: 2,
            minWidth: "auto",
            padding: 1,
            borderColor: alpha(theme.palette.divider, 0.2),
          }}
        >
          <MenuIcon />
        </Button>
      </Box>
    </Box>
  );
};

Topbar.propTypes = {
  onSidebarOpen: PropTypes.func,
  pages: PropTypes.object,
  colorInvert: PropTypes.bool,
};

export default Topbar;
