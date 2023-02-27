/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  env: {
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    AWS_IAM_USER_KEY: process.env.AWS_IAM_USER_KEY,
    AWS_IAM_USER_SECRET: process.env.AWS_IAM_USER_SECRET,
  },
};
