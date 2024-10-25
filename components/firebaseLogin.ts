import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default async function firebaseLogin() {
    

    const firebaseConfig = {
      apiKey: 'AIzaSyCYYK43AFwmfljp0JeA3PajLePFv_tSYzU',
      authDomain: "jlb-investments.firebaseapp.com",
      projectId: "jlb-investments",
      storageBucket: "jlb-investments.appspot.com",
      messagingSenderId: "250755462166",
      appId: "1:250755462166:web:e60614c2b96091b828b137",
      measurementId: "G-SFR76BCE7B"
    };
    let app
    //check if app has already been initialized
    if(!getApps().length){
      app = await initializeApp(firebaseConfig);
    }else{
      app = getApps()[0]
    }

  //initialize auth
    const provider = new GoogleAuthProvider();
    const auth = getAuth()
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user: UserInfo = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        setUser(user)
        setSignInStatus('Link Accounts')
                
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });

  



  }