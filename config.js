import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// firebaseConfig = {
//   apiKey: (this one's easy, it's in the 'General' section in your project settings page, aka the Gear icon button),
//   authDomain: "{project_id}.firebaseapp.com", (without brackets)
//   databaseURL: "https://{project_id}.firebaseio.com",
//   projectId: (again, found in 'General' section in Project Settings),
//   storageBucket: "{project_id}.appspot.com",
//   messagingSenderId: (found in 'Cloud Messaging' section in Project Settings)

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };