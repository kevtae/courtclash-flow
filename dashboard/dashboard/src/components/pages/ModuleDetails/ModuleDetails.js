// SETUP
import React, { useState, useCallback, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import ImageUploading from "react-images-uploading";

// UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

// SUBCOMPONENTS
import Page from "./Page";
import Main from "@containers/Main";

// FUNCTIONS
import { uploadMultipleFiles } from "@functions/storage";
import { postSubmission } from "@functions/submission";

const validationSchema = yup.object({
  email: yup.string().trim().required("Please specify your email"),
  discord: yup.string().trim().required("Please specify your Discord username"),
  key: yup.string().trim().required("Please specify your public ETH Key"),
  answer: yup
    .string()
    .trim()
    .max(500, "Should be less than 500 characters")
    .required("Please specify your answer"),
});

const ModuleDetails = ({ data }) => {
  const [images, setImages] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(data.course[0]);
  const [courses, setCourses] = useState(data.course);

  const [submitted, setSubmitted] = useState(false);

  const initialValues = {
    discord: "",
    answer: "",
    email: "",
    key: "",
  };

  const onSubmit = (values) => {
    uploadMultipleFiles(images, (imagesUrls) => {
      //   console.log(
      //     "alsndlasddsa--",
      //     data.number,
      //     currentCourse.number,
      //     values.discord,
      //     values.email,
      //     values.key,
      //     values.answer,
      //     imagesUrls[0],
      //     currentCourse.tokenReward
      //   );
      postSubmission(
        data.number,
        currentCourse.number,
        values.discord,
        values.email,
        values.key,
        values.answer,
        imagesUrls[0],
        currentCourse.tokenReward
      ).then((res) => {
        setImages([]);
        setSubmitted(true);
      });
    });
    return values;
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit,
  });

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    setImages(imageList);
  };

  return (
    <Main>
      <Page {...{ courses, currentCourse, setCurrentCourse, module: data }}>
        <Box>
          <Typography variant={"h6"} color={"text.primary"}>
            {currentCourse.name}
          </Typography>
          <Typography variant={"subtitle2"} color={"text.secondary"}>
            {currentCourse.description}
          </Typography>
          <ul>
            {currentCourse.externalLinks.map((link) => {
              return (
                <li key={link}>
                  <a
                    href={link}
                    style={{ color: "#391666" }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link}
                  </a>
                </li>
              );
            })}
          </ul>
          <Box
            display="inline-block"
            mt={2}
            sx={{
              bgcolor: "#391666",
              paddingY: "4px",
              paddingX: "8px",
              borderRadius: 2,
            }}
          >
            <Typography
              variant={"caption"}
              fontWeight={700}
              fontSize={16}
              sx={{
                color: "white",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              {currentCourse.tokenReward} $KRAUSE
            </Typography>
          </Box>
          <Box paddingY={4}>
            <Divider />
          </Box>
          <Grid
            container
            mb={4}
            style={{ position: "relative", paddingBottom: "56.25%" }}
          >
            <iframe
              src={`${currentCourse.video}`}
              style={{
                width: "100%",
                height: "100%",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              frameBorder="0"
              allowFullScreen
            />
          </Grid>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant={"subtitle2"}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter Email
                </Typography>
                <TextField
                  label="E.g: example@gmail.com *"
                  variant="outlined"
                  name={"email"}
                  fullWidth
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography
                  variant={"subtitle2"}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter Discord Name
                </Typography>
                <TextField
                  label="E.g: Username#1234"
                  variant="outlined"
                  name={"discord"}
                  fullWidth
                  value={formik.values.discord}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.discord && Boolean(formik.errors.discord)
                  }
                  helperText={formik.touched.discord && formik.errors.discord}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant={"subtitle2"}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter ETH Public Key Address
                </Typography>
                <TextField
                  label="E.g: 0x157C52A31E83E98A3555DB80ACCAB21AEB29AB7D *"
                  variant="outlined"
                  name={"key"}
                  fullWidth
                  value={formik.values.key}
                  onChange={formik.handleChange}
                  error={formik.touched.key && Boolean(formik.errors.key)}
                  helperText={formik.touched.key && formik.errors.key}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant={"subtitle2"}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter Answer
                </Typography>
                <TextField
                  label="Text Answer"
                  variant="outlined"
                  name={"answer"}
                  multiline
                  rows={5}
                  fullWidth
                  value={formik.values.answer}
                  onChange={formik.handleChange}
                  error={formik.touched.answer && Boolean(formik.errors.answer)}
                  helperText={formik.touched.answer && formik.errors.answer}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant={"subtitle2"}
                  sx={{ marginBottom: 2 }}
                  fontWeight={700}
                >
                  Enter Screenshot/Evidence of Task Completion
                </Typography>
                <ImageUploading
                  multiple
                  value={images}
                  onChange={onChange}
                  maxNumber={1}
                  dataURLKey="data_url"
                >
                  {({
                    imageList,
                    onImageUpload,
                    onImageRemoveAll,
                    onImageUpdate,
                    onImageRemove,
                    isDragging,
                    dragProps,
                  }) => (
                    // write your building UI
                    <div className="upload__image-wrapper">
                      <Button
                        style={isDragging ? { color: "red" } : undefined}
                        onClick={onImageUpload}
                        variant="outlined"
                        {...dragProps}
                      >
                        Click or Drop here
                      </Button>
                      &nbsp;
                      <Button variant="outlined" onClick={onImageRemoveAll}>
                        Remove all images
                      </Button>
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item">
                          <img src={image["data_url"]} alt="" width="100" />
                          <Box
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Button onClick={() => onImageUpdate(index)}>
                              Update
                            </Button>
                            <Button onClick={() => onImageRemove(index)}>
                              Remove
                            </Button>
                          </Box>
                        </div>
                      ))}
                    </div>
                  )}
                </ImageUploading>
              </Grid>

              <Grid item container xs={12}>
                {submitted ? (
                  <Button
                    size={"large"}
                    variant={"contained"}
                    disabled
                    style={{ backgroundColor: "grey" }}
                  >
                    Already Submitted
                  </Button>
                ) : (
                  <Button
                    size={"large"}
                    variant={"contained"}
                    type={"submit"}
                    style={{ backgroundColor: "#391666" }}
                  >
                    Submit
                  </Button>
                )}
              </Grid>
            </Grid>
          </form>
        </Box>
      </Page>
    </Main>
  );
};

export default ModuleDetails;
