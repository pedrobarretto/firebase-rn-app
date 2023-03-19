import { createContext, ReactNode, useContext, useState } from 'react';
import { Budgets, Registers } from '../../interfaces';

interface BudgetsProviderProps {
  children: ReactNode;
}

interface BudgetsContextData {
  register: Registers;
  setRegister: (register: Registers) => void;
}

export const BudgetsContext = createContext([] as unknown as BudgetsContextData);

export function BudgetsProvider({ children }: BudgetsProviderProps) {
  const [register, setRegister] = useState<Registers>({
    total: 0,
    values: [],
    categories: []
  });

  return (
    <BudgetsContext.Provider value={{ register, setRegister }}>
      {children}
    </BudgetsContext.Provider>
  )
}
