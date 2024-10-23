// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase-admin/app";
import { NextApiRequest, NextApiResponse } from "next/types";
import {getAuth} from 'firebase-admin/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export default async function handler(req:NextApiRequest,res:NextApiResponse) {
  console.log('api',process.env.FIREBASE_API_KEY)
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

  try{
    let app
    if(!getApps().length){
      app = await initializeApp(firebaseConfig);
    }else{
      app = getApps()[0]
    }
    let auth = getAuth(app)
    console.log('auth',auth)
    res.status(200).json(
      {
        message: 'firebase route working as expected',
        app: app,
        auth: auth
      }
    )
  }catch(error){
    res.status(500).json(
      {
        message: 'error starting firebase app initialization',
        error: error
      }
    )
  }


  
    
}
