import {AWS_BUCKET_NAME, AWS_IAM_USER_KEY, AWS_IAM_USER_SECRET} from '@env';
import fs from 'react-native-fs';
import {decode} from 'base64-arraybuffer';
const S3 = require('aws-sdk/clients/s3');
import 'react-native-get-random-values';
import {v4 as uuid} from 'uuid';

export const uploadFileOnS3 = async (file, fileType, callback) => {
  const s3bucket = new S3({
    accessKeyId: AWS_IAM_USER_KEY,
    secretAccessKey: AWS_IAM_USER_SECRET,
    Bucket: AWS_BUCKET_NAME,
    signatureVersion: 'v4',
  });

  const filePath = `${uuid()}${fileType}`;
  let contentDeposition = 'inline;filename="' + file.name + '"';
  const fPath = file.uri;

  const base64 = await fs.readFile(fPath, 'base64');
  //console.log(base64);

  const arrayBuffer = decode(base64);
  //console.log(arrayBuffer);
  s3bucket.createBucket(() => {
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: filePath,
      Body: arrayBuffer,
      ContentDisposition: contentDeposition,
      ContentType: file.type,
    };
    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log('Image Upload Failed: ', err);
      } else {
        console.log('Image Upload Success');
        callback(data);
      }
    });
  });
};
