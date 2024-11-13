// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/api/firebase/firebaseConfig';
import { firebasePopUpSignIn, firebaseLogout } from '../lib/api/firebase/firebaseAuth';

interface AuthContextProps {
    user: User | null;
    popUpLogin: () => Promise<void>;
    logout: () => Promise<void>;
  }

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const popUpLogin = async () => {
    const loginUser = await firebasePopUpSignIn()
    if(loginUser){
        setUser(loginUser)
    }

  }

  const logout = async () => {
    await firebaseLogout()
  }


  return (
    <AuthContext.Provider value={{ user, popUpLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
