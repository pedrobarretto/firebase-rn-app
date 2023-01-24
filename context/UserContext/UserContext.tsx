import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../../interfaces';

interface UserProviderProps {
  children: ReactNode;
}

interface UserContextData {
  user: User;
  setUser: (user: User) => void;
}

export const UserContext = createContext({} as UserContextData);

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState({} as User);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
