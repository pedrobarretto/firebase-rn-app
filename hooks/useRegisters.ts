import { useContext } from 'react';
import { BudgetsContext } from '../context';

export function useRegisters() {
  const context = useContext(BudgetsContext);
  return context;
}