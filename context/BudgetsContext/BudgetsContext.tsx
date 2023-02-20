import { createContext, ReactNode, useContext, useState } from 'react';
import { Budgets } from '../../interfaces';

interface BudgetsProviderProps {
  children: ReactNode;
}

interface BudgetsContextData {
  budgets: Budgets[];
  setBudgets: (budgets: Budgets[]) => void;
}

export const BudgetsContext = createContext([] as unknown as BudgetsContextData);

export function BudgetsProvider({ children }: BudgetsProviderProps) {
  const [budgets, setBudgets] = useState<Budgets[]>([]);

  return (
    <BudgetsContext.Provider value={{ budgets, setBudgets }}>
      {children}
    </BudgetsContext.Provider>
  )
}
