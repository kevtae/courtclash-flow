import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import { Box, Card, List, ListItem, Grid, Typography } from "@mui/material";

import Container from "@components/common/Container";

import { getModule } from "@functions/course";

const pages = [
  {
    id: "general",
    href: "/account-general",
    title: "General",
  },
  {
    id: "security",
    href: "/account-security",
    title: "Security",
  },
  {
    id: "notifications",
    href: "/account-notifications",
    title: "Notifications",
  },
  {
    id: "billing",
    href: "/account-billing",
    title: "Billing Information",
  },
];

const Page = ({
  children,
  module,
  courses,
  currentCourse,
  setCurrentCourse,
}) => {
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(window && window.location ? window.location.pathname : "");
  }, []);

  const theme = useTheme();

  return (
    <Box>
      <Box bgcolor={"#6e36b5"} paddingY={4}>
        <Container>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            sx={{ color: "common.white" }}
          >
            {module.name}
          </Typography>
          <Typography variant="h6" sx={{ color: "common.white" }}>
            {module.description}
          </Typography>
        </Container>
      </Box>
      <Container paddingTop={"0 !important"} marginTop={-8}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Card sx={{ boxShadow: 3 }}>
              <Typography
                sx={{
                  paddingY: { xs: 1, md: 1 },
                  marginRight: { xs: 2, md: 0 },
                  paddingX: { xs: 4, md: 3 },
                }}
                variant="h6"
              >
                Sections
              </Typography>
              <List
                disablePadding
                sx={{
                  display: { xs: "inline-flex", md: "flex" },
                  flexDirection: { xs: "row", md: "column" },
                  overflow: "auto",
                  flexWrap: "nowrap",
                  width: "100%",
                  paddingY: { xs: 3, md: 4 },
                  paddingX: { xs: 4, md: 0 },
                }}
              >
                {courses.map((item, i) => {
                  return (
                    <ListItem
                      key={item.name}
                      component={"a"}
                      disableGutters
                      onClick={() => setCurrentCourse(item)}
                      sx={{
                        marginRight: { xs: 2, md: 0 },
                        flex: 0,
                        paddingX: { xs: 0, md: 3 },
                        borderLeft: {
                          xs: "none",
                          md: "2px solid transparent",
                        },
                        borderLeftColor: {
                          md:
                            currentCourse.number == item.number
                              ? theme.palette.primary.main
                              : "transparent",
                        },
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        noWrap
                        sx={{
                          fontWeight:
                            currentCourse.number == item.number && "bold",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </Card>
          </Grid>
          <Grid item xs={12} md={9}>
            <Card sx={{ boxShadow: 3, padding: 4 }}>{children}</Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

Page.propTypes = {
  children: PropTypes.node,
};

export default Page;
