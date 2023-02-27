import React, { useState, useEffect, useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { alpha, useTheme } from "@mui/material/styles";

import { getCourse, getAllModule } from "@functions/course";

import Container from "@components/common/Container";

const ModuleList = () => {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    getAllModule().then((res) => {
      setModules(res.data.data.module);
    });
  }, []);

  const theme = useTheme();

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography
            variant={"h3"}
            fontWeight={700}
            sx={{ color: "white", lineHeight: 1 }}
          >
            Course Sections
          </Typography>
        </Grid>
        {modules.map((item, i) => {
          return (
            <Grid key={item.name} item xs={12} sm={6} md={4}>
              <Box display={"block"} width={1} height={1}>
                <Card
                  sx={{
                    width: 1,
                    height: 1,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "none",
                    bgcolor: "transparent",
                    backgroundImage: "none",
                  }}
                >
                  <CardMedia
                    title={item.name}
                    image={item.imgSrc}
                    sx={{
                      position: "relative",
                      height: 320,
                      overflow: "hidden",
                      borderRadius: 2,
                    }}
                  >
                    <Stack
                      direction={"row"}
                      spacing={1}
                      sx={{
                        position: "absolute",
                        top: "auto",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: 2,
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: theme.palette.error.light,
                          paddingY: "4px",
                          paddingX: "8px",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant={"caption"}
                          fontWeight={700}
                          sx={{
                            color: "white",
                            textTransform: "uppercase",
                            lineHeight: 1,
                          }}
                        >
                          {item.course.length} videos
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "#391666",
                          paddingY: "4px",
                          paddingX: "8px",
                          borderRadius: 1,
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant={"caption"}
                          fontWeight={700}
                          sx={{
                            color: "white",
                            textTransform: "uppercase",
                            lineHeight: 1,
                          }}
                        >
                          {item.totalReward} $KRAUSE
                        </Typography>
                      </Box>
                    </Stack>
                  </CardMedia>
                  <Box marginTop={2}>
                    <Typography fontWeight={700} color="white">
                      {item.name}
                    </Typography>
                    <Typography variant={"caption"} color={"#a3a3a2"}>
                      {item.description}
                    </Typography>
                  </Box>
                  <Button
                    href={`/modules/${item.number}`}
                    target="_blank"
                    size={"large"}
                    sx={{
                      color: "#0ac9b6",
                      marginTop: 1,
                      justifyContent: "space-between",
                    }}
                    fullWidth
                    endIcon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#078a7d"
                        width={20}
                        height={20}
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    }
                  >
                    See Details
                  </Button>
                </Card>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
};

export default ModuleList;
