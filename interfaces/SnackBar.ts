export type SnackbarType = 'success' | 'error' | 'warning';

export interface SnackbarProps {
  message: string;
  type: SnackbarType;
  onDismiss?: () => void;
  isSnackBarOpen: boolean;
};