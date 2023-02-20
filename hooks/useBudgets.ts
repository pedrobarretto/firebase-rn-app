import { useContext } from 'react';
import { BudgetsContext } from '../context';

export function useBudgets() {
  const context = useContext(BudgetsContext);
  return context;
}