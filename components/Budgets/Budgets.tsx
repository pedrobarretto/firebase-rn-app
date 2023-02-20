import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';
import { useEffect } from 'react';
import { useBudgets, useUser } from '../../hooks';
import { Budget } from './Budget';
import { getData } from '../../utils';

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