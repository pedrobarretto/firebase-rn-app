import { StatusBar } from 'expo-status-bar';
import { BudgetsProvider, UserProvider } from './context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetsPage, Footer, Home, NewBudget, Settings } from './components';
import { BUDGETS, HOME, navigationRef, NEW_BUDGETS, SETTINGS } from './utils';

const Stack = createNativeStackNavigator();

// headerVisible: false -> Disable header

export default function App() {
  return (
    <UserProvider>
      <BudgetsProvider>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator screenOptions={{ headerBackVisible: false, headerShown: true }}>
              <Stack.Screen name={HOME} component={Home} />
              <Stack.Screen name={BUDGETS} component={BudgetsPage} />
              <Stack.Screen name={NEW_BUDGETS} component={NewBudget} />
              <Stack.Screen name={SETTINGS} component={Settings} />
          </Stack.Navigator>
          
          <Footer />
        </NavigationContainer>
      </BudgetsProvider>
    </UserProvider>
  );
}

