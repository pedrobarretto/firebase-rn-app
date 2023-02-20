import { createNavigationContainerRef, NavigationContainerRef, NavigationContainerRefWithCurrent } from '@react-navigation/native';

type RootStackParamList = {
  [key: string]: undefined | Record<string, unknown>;
};

type NavigationRef = {
  navigate: (name: string, params?: Record<string, unknown>) => void;
  isReady: () => boolean;
};

export const navigationRef: NavigationContainerRefWithCurrent<RootStackParamList> & NavigationRef =
  createNavigationContainerRef<RootStackParamList>() as NavigationContainerRefWithCurrent<RootStackParamList> & NavigationRef;

export function navigate(name: string, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}