import React, { useEffect, useState } from "react";
import { alpha, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Main from "@containers/Main";
import Container from "@components/common/Container";

import { getSubmissions } from "@functions/submission";

import UserModal from "./UserModal";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = () => {
    getSubmissions().then((res) => {
      let formattedSubmissions = {};
      res.data.data.submission.map((sub) => {
        let userSubmissions = formattedSubmissions[sub.key];
        if (userSubmissions) {
          formattedSubmissions[sub.key] = [...userSubmissions, sub];
        } else {
          formattedSubmissions[sub.key] = [sub];
        }
      });
      setSubmissions(formattedSubmissions);
    });
  };

  useEffect(() => {
    const jarallaxInit = async () => {
      const jarallaxElems = document.querySelectorAll(".jarallax");
      if (!jarallaxElems || (jarallaxElems && jarallaxElems.length === 0)) {
        return;
      }

      const { jarallax } = await import("jarallax");
      jarallax(jarallaxElems, { speed: 0.2 });
    };

    jarallaxInit();
  });

  const scrollTo = (id) => {
    setTimeout(() => {
      const element = document.querySelector(`#${id}`);
      if (!element) {
        return;
      }

      window.scrollTo({ left: 0, top: element.offsetTop, behavior: "smooth" });
    });
  };

  const theme = useTheme();

  return (
    <Main>
      <Box
        className={"jarallax"}
        data-jarallax
        data-speed="0.2"
        position={"relative"}
        minHeight={"100vh"}
        display={"flex"}
        id="agency__portfolio-item--js-scroll"
      >
        <Box
          className={"jarallax-img"}
          sx={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url("https://krausehousework.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Ffb60b4c6-a8fe-401d-aab5-6fea422d915c%2FUntitled.png?table=block&id=70ee1753-e972-4d1d-8060-9fe32ef622db&spaceId=9116b053-c794-4602-ac43-cffa72f470cf&width=2000&userId=&cache=v2")`,
          }}
        />
        <Container>
          <Button variant="contained" onClick={fetchSubmissions}>
            Refresh
          </Button>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 750 }} aria-label="simple table">
              <TableHead sx={{ bgcolor: "alternate.main" }}>
                <TableRow>
                  <TableCell>
                    <Typography
                      color={"text.secondary"}
                      variant={"caption"}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase" }}
                    >
                      User
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={"text.secondary"}
                      variant={"caption"}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase" }}
                    >
                      Module
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={"text.secondary"}
                      variant={"caption"}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase" }}
                    >
                      Public Key
                    </Typography>
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(submissions).map((item, i) => {
                  const key = item[0];
                  const { discordId, moduleNum, checked, email } = item[1][0];
                  return (
                    <TableRow
                      key={key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <List sx={{ p: 0, m: 0 }}>
                          <ListItem sx={{ p: 0, m: 0 }}>
                            <ListItemText
                              primary={discordId}
                              secondary={email}
                            />
                          </ListItem>
                        </List>
                      </TableCell>
                      <TableCell>
                        <Typography>Module Number: {moduleNum}</Typography>
                        <Typography
                          color={"text.secondary"}
                          variant={"subtitle2"}
                        >
                          Total Tasks: {item[1].length}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant={"caption"}
                          fontWeight={700}
                          sx={{
                            bgcolor: alpha(theme.palette.success.light, 0.1),
                            color: theme.palette.success.dark,
                            paddingX: 1.5,
                            paddingY: 0.5,
                            borderRadius: 4,
                            display: "inline",
                          }}
                        >
                          {key}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setCurrentUser(item);
                          setOpen(true);
                        }}
                      >
                        <Typography
                          color={"primary"}
                          variant={"subtitle2"}
                          fontWeight={700}
                          sx={{ cursor: "pointer" }}
                        >
                          Preview
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <UserModal {...{ open, setOpen, currentUser }} />
        </Container>
      </Box>
    </Main>
  );
};

export default Dashboard;
