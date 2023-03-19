import { StatusBar } from 'expo-status-bar';
import { BudgetsProvider, SnackBarProvider, UserProvider } from './context';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Footer, SnackBar } from './components';
import { Home, Settings, NewBudget, BudgetsPage, Metrics } from './pages';
import { BUDGETS, HOME, METRICS, navigationRef, NEW_BUDGETS, SETTINGS } from './utils';

const Stack = createNativeStackNavigator();

// headerVisible: false -> Disable header

export default function App() {
  return (
    <SnackBarProvider>
      <UserProvider>
        <BudgetsProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerBackVisible: false, headerShown: true }}>
                <Stack.Screen name={HOME} component={Home} />
                <Stack.Screen name={BUDGETS} component={BudgetsPage} />
                <Stack.Screen name={NEW_BUDGETS} component={NewBudget} />
                <Stack.Screen name={SETTINGS} component={Settings} />
                <Stack.Screen name={METRICS} component={Metrics} />
            </Stack.Navigator>
            <SnackBar />
            <Footer />
          </NavigationContainer>
        </BudgetsProvider>
      </UserProvider>
    </SnackBarProvider>
  );
}

