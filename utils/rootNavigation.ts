import { createNavigationContainerRef, NavigationContainerRef, NavigationContainerRefWithCurrent } from '@react-navigation/native';

type RootStackParamList = {
  [key: string]: undefined | Record<string, unknown>;
};

type NavigationRef = {
  navigate: (name: string, params?: Record<string, unknown>) => void;
  isReady: () => boolean;
  getCurrentRouteName: () => string | undefined;
};

export const navigationRef: NavigationContainerRefWithCurrent<RootStackParamList> & NavigationRef =
  createNavigationContainerRef<RootStackParamList>() as NavigationContainerRefWithCurrent<RootStackParamList> & NavigationRef;

export function navigate(name: string, params?: Record<string, unknown>) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export function getRoute() {
  if (navigationRef.isReady()) {
    const route = navigationRef.getRootState().routes[navigationRef.getRootState().index];
    console.log('route.name: ', route.name);
    return route.name;
  }

  return '';
}