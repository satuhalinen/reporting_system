import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "reporting-b086c.firebaseapp.com",
  projectId: "reporting-b086c",
  storageBucket: "reporting-b086c.appspot.com",
  messagingSenderId: "405672782843",
  appId: "1:405672782843:web:71ead9475e6ae0e54c795e",
};
export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
