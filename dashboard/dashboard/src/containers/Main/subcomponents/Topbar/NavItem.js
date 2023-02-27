import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { alpha, useTheme } from "@mui/material/styles";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const NavItem = ({ title, id, items, colorInvert = false }) => {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openedPopoverId, setOpenedPopoverId] = useState(null);

  const handleClick = (event, popoverId) => {
    setAnchorEl(event.target);
    setOpenedPopoverId(popoverId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenedPopoverId(null);
  };

  const [activeLink, setActiveLink] = useState("");
  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : "");
  }, []);

  const linkColor = colorInvert ? "common.white" : "text.primary";

  return (
    <Box>
      <Box
        display={"flex"}
        alignItems={"center"}
        aria-describedby={id}
        sx={{ cursor: "pointer" }}
        onClick={(e) => handleClick(e, id)}
      >
        <Typography color={"white"}>{title}</Typography>
        <ExpandMoreIcon
          sx={{
            marginLeft: theme.spacing(1 / 4),
            width: 16,
            height: 16,
            transform: openedPopoverId === id ? "rotate(180deg)" : "none",
            color: "white",
          }}
        />
      </Box>
      <Popover
        elevation={3}
        id={id}
        open={openedPopoverId === id}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        sx={{
          ".MuiPaper-root": {
            maxWidth: 250,
            padding: 2,
            marginTop: 2,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTop: `3px solid ${theme.palette.primary.main}`,
          },
        }}
      >
        <Grid container spacing={0.5}>
          {items.map((p, i) => (
            <Grid item key={i} xs={12}>
              <Button
                component={"a"}
                href={p.href}
                target="_blank"
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  fontWeight: activeLink === p.href ? 600 : 400,
                  color: "#078a7d",
                }}
              >
                {p.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Popover>
    </Box>
  );
};

NavItem.propTypes = {
  title: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  colorInvert: PropTypes.bool,
};

export default NavItem;
