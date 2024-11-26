// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/api/firebase/firebaseConfig';
import { firebasePopUpSignIn, firebaseLogout } from '../lib/api/firebase/firebaseAuth';

interface AuthContextProps {
    user: User | null;
    profileFullName: string | null;
    profileFirstName: string | null;
    popUpLogin: () => Promise<void>;
    logout: () => Promise<void>;
  }

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profileFullName,setProfileFullName] = useState<string | null>(null)
  const [profileFirstName,setProfileFirstName] = useState<string | null>(null)  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      //start the chain of events based on sign-in persistence
      if(firebaseUser){
        setProfileFullName(firebaseUser.displayName)
        setProfileFirstName(firebaseUser.displayName!.split(" ")[0])
      }

    });
    return () => unsubscribe();
  }, []);

  const popUpLogin = async () => {
    const loginUser = await firebasePopUpSignIn()
    if(loginUser){
        setUser(loginUser)
        setProfileFullName(loginUser.displayName)
        setProfileFirstName(loginUser.displayName!.split(" ")[0])

    }

  }

  const logout = async () => {
    await firebaseLogout()
    setUser(null)
    setProfileFullName(null)
    setProfileFirstName(null)
  }


  return (
    <AuthContext.Provider value={{ user, profileFullName, profileFirstName, popUpLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
