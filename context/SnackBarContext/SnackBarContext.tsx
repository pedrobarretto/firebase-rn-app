import { createContext, ReactNode, useContext, useState } from 'react';
import { SnackbarProps } from '../../interfaces';

interface SnackBarProviderProps {
  children: ReactNode;
}

interface SnackBarContextData {
  state: SnackbarProps;
  setState: (state: SnackbarProps) => void;
}

export const SnackBarContext = createContext([] as unknown as SnackBarContextData);

export function SnackBarProvider({ children }: SnackBarProviderProps) {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [state, setState] = useState<SnackbarProps>({
    message: '',
    type: 'error',
    isSnackBarOpen: false
  });

  return (
    <SnackBarContext.Provider
      value={{
        state,
        setState
    }}>
      {children}
    </SnackBarContext.Provider>
  )
}
