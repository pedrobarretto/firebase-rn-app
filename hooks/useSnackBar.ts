import { useContext } from 'react';
import { SnackBarContext } from '../context';

export function useSnackBar() {
  const context = useContext(SnackBarContext);
  return context;
}