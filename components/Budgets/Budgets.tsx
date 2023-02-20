import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';
import { db, auth } from '../../config';
import { CustomButton } from '..';
import { useEffect, useState } from 'react';
import { Budgets } from '../../interfaces/Budget';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useBudgets, useUser } from '../../hooks';
import { User } from '../../interfaces';
import { Budget } from './Budget';
import { getData, HOME } from '../../utils';

export function BudgetsPage({ navigation }: any) {
  const { user, setUser } = useUser();
  const { budgets, setBudgets } = useBudgets();

  useEffect(() => {
    startup();
  }, []);

  const startup = async () => {
    const data = await getData(user.id);
    setBudgets(data);
  }

  const logout = () => {
    setUser({} as User);
    setBudgets([]);
    signOut(auth);
    navigation.navigate(HOME);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <FlatList
          data={budgets}
          renderItem={({item}) => <Budget budget={item} />}
          keyExtractor={item => item.id}
          ListFooterComponent={<View style={{height: 20}}/>}
        />
      </View>

      {/* <CustomButton title='Logout' onPress={logout} /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  scrollView: {
    backgroundColor: 'pink'
  },
  mainConatinerStyle: {
    flexDirection: 'column',
    flex: 1,
  }
});