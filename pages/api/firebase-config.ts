// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { NextApiRequest, NextApiResponse } from "next/types";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default async function handler() {
  console.log('api',process.env)
  const firebaseConfig = {
    apiKey: `${process.env.FIREBASE_API_KEY}`,
    authDomain: "jlb-investments.firebaseapp.com",
    projectId: "jlb-investments",
    storageBucket: "jlb-investments.appspot.com",
    messagingSenderId: "250755462166",
    appId: "1:250755462166:web:e60614c2b96091b828b137",
    measurementId: "G-SFR76BCE7B"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  return app
    
}
