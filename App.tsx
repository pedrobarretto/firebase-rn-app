import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { UserProvider } from './context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BudgetsPage, Home } from './components';

const Stack = createNativeStackNavigator();
// headerVisible: false -> Disable header
export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerBackVisible: false, headerShown: true }}>
            <Stack.Screen name='Home' component={Home} />
            <Stack.Screen name='Goals' component={BudgetsPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

