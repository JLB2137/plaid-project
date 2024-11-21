import { signInWithPopup, GoogleAuthProvider, UserInfo, setPersistence, browserLocalPersistence, signOut, User } from "firebase/auth";
import {auth} from './firebaseConfig'

  //initialize auth
  const provider = new GoogleAuthProvider();

  export const firebasePopUpSignIn = async (): Promise<User | null> => {
      
      
      try {
        setPersistence(auth,browserLocalPersistence)
        const result = await signInWithPopup(auth, provider)
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        const user: UserInfo = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
        
        return result.user
      }

      catch(error) {
        // Handle Firebase error structure
        if (error instanceof Error) {
          const errorCode = (error as any).code;
          const errorMessage = error.message;
          const email = (error as any).customData?.email;
          const credential = GoogleAuthProvider.credentialFromError(error as any);

          console.error("Sign-in error code:", errorCode);
          console.error("Sign-in error message:", errorMessage);
          if (email) console.error("Sign-in email:", email);
          if (credential) console.error("Sign-in credential:", credential);
        } else {
          console.error("Unknown error during sign-in:", error);
        }

        return null; // Return null on error
      
      }
  }

  export const firebaseLogout = async (): Promise<void> => {
    return await signOut(auth);
  };

