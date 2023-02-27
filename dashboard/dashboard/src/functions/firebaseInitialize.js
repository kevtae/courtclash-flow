import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: "AIzaSyDHqAYe2sD565t9_GZkoYxckSfnI8OWXfA",
  authDomain: "krause-house.firebaseapp.com",
  projectId: "krause-house",
  storageBucket: "krause-house.appspot.com",
  messagingSenderId: "574028843421",
  appId: "1:574028843421:web:802ec0d190b8711d08c774",
  measurementId: "G-6QJ5L31RXS",
};

const firebaseApp = initializeApp(firebaseConfig);

// Get a reference to the storage service, which is used to create references in your storage bucket
export const storage = getStorage(firebaseApp);
