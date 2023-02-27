import { v4 as uuidv4 } from "uuid";
import { uploadString, ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseInitialize";

export const uploadMultipleFiles = async (files, callback) => {
  let images = [];
  files.map((file) => {
    const storageRef = ref(storage, `${uuidv4()}`);

    uploadString(storageRef, file.data_url.split("base64,")[1], "base64", {
      contentType: "image/jpeg",
    }).then(async (snapshot) => {
      let url = await getDownloadURL(snapshot.ref);
      images.push(url);
      if (images.length == files.length) callback(images);
    });
  });
};
