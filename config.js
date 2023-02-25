import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { 
  REACT_APP_API_KEY,
  REACT_APP_AUTH_DOMAIN,
  REACT_APP_DATABASE_URL,
  REACT_APP_PROJECT_ID,
  REACT_APP_STORAGE_BUCKET,
  REACT_APP_MESSAGING_SENDER_ID,
  REACT_APP_APP_ID 
  } from '@env';


// firebaseConfig = {
//   apiKey: (this one's easy, it's in the 'General' section in your project settings page, aka the Gear icon button),
//   authDomain: "{project_id}.firebaseapp.com", (without brackets)
//   databaseURL: "https://{project_id}.firebaseio.com",
//   projectId: (again, found in 'General' section in Project Settings),
//   storageBucket: "{project_id}.appspot.com",
//   messagingSenderId: (found in 'Cloud Messaging' section in Project Settings)

const firebaseConfig = {
  apiKey: REACT_APP_API_KEY,
  authDomain: REACT_APP_AUTH_DOMAIN,
  databaseURL: REACT_APP_DATABASE_URL,
  projectId: REACT_APP_PROJECT_ID,
  storageBucket: REACT_APP_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_MESSAGING_SENDER_ID,
  appId: REACT_APP_APP_ID
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };