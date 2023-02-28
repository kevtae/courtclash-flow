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
  const [currentChallenge, setCurrentChallenge] = useState();

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = () => {
    getSubmissions().then((res) => {
      if (res.data.data.data != null) {
        let formattedSubmissions = {};
        res.data.data.data.map((sub) => {
          let userSubmissions = formattedSubmissions[sub.ChallengeID];
          if (userSubmissions) {
            formattedSubmissions[sub.ChallengeID] = [...userSubmissions, sub];
          } else {
            formattedSubmissions[sub.ChallengeID] = [sub];
          }
        });
        setSubmissions(formattedSubmissions);
      } else {
        setSubmissions([]);
      }
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
            backgroundImage: `linear-gradient(rgba(0,0,0,.7), rgba(0,0,0,.7)), url("https://cdn.discordapp.com/attachments/997270112400838766/1080051481861967933/DL_A_wallpaper_or_background_picture_of_a_basketball_court_wher_2dec05c3-c322-4e32-9636-dd01a2e381cb.png")`,
          }}
        />
        <Container>
          <Button
            style={{ backgroundColor: "#f7c77e", fontWeight: "bold" }}
            variant="contained"
            onClick={fetchSubmissions}
          >
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
                      Challenge ID
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      color={"text.secondary"}
                      variant={"caption"}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase" }}
                    >
                      Status
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
                        <Typography
                          color={"text.secondary"}
                          variant={"subtitle2"}
                        >
                          {item[1][0].ChallengeID}
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
                          {item[1][0].isVerified ? "Completed" : "Pending"}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => {
                          setCurrentChallenge(item);
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
          <UserModal {...{ open, setOpen, currentChallenge }} />
        </Container>
      </Box>
    </Main>
  );
};

export default Dashboard;
