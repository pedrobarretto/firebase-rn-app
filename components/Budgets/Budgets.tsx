import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Text
} from 'react-native';
import { useEffect } from 'react';
import { useRegisters, useUser } from '../../hooks';
import { Budget } from './Budget';
import { currencyFormat, getData } from '../../utils';

export function BudgetsPage({ navigation }: any) {
  const { user, setUser } = useUser();
  const { register, setRegister } = useRegisters();

  useEffect(() => {
    startup();
  }, []);

  const startup = async () => {
    const data = await getData(user.id);
    setRegister(data);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total:
          {
            <Text style={
              register.total > 0 ?
              [styles.totalText, styles.positive] :
              [styles.totalText, styles.negative]
            }>
              {' '}{currencyFormat(register.total)}
            </Text>
          }
        </Text>
      </View>
      <View>
        <FlatList
          data={register.values}
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
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight - 20 : StatusBar.currentHeight
  },
  scrollView: {
    backgroundColor: 'pink'
  },
  mainConatinerStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  totalContainer: {
    padding: 10,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    margin: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600'
  },
  negative: {
    color: '#ff5e5e'
  },
  positive: {
    color: '#4eff63'
  }
});