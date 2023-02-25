import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../../interfaces';
import { User as FirebaseUser } from '@firebase/auth';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  user: User;
  setUser: (user: User) => void;
  rawUser: FirebaseUser;
  setRawUser: (user: FirebaseUser) => void;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState({} as User);
  const [rawUser, setRawUser] = useState({} as FirebaseUser);

  return (
    <UserContext.Provider value={{ user, setUser, rawUser, setRawUser }}>
      {children}
    </UserContext.Provider>
  )
}
