import { View, Text, StyleSheet } from 'react-native';
import { Budgets, Type } from '../../interfaces';
import { currencyFormat, formatType } from '../../utils';

interface Props {
  budget: Budgets;
}

export function Budget({ budget }: Props) {
  return (
    <View key={budget.id} style={styles.box}>
      <View style={styles.collumn}>
        <Text style={styles.boldText}>{budget.name}</Text>
        <Text style={{ color: '#7d7d7d' }}>{budget.category}</Text>
      </View>
      <View style={styles.collumn}>
        <View style={budget.type === Type.Income ? styles.income : styles.spent}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{formatType(budget.type)}</Text>
        </View>
        <Text style={styles.boldText}>{currencyFormat(budget.value)}</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  box: {
    flex: 1,
    padding: 10,
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    marginBottom: 0,
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
  collumn: {
    display: 'flex',
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  boldText: {
    fontWeight: '600'
  },
  spent: {
    backgroundColor: '#ff5e5ecd',
    borderRadius: 10,
    width: 'auto',
    padding: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  income: {
    backgroundColor: '#4eff63cd',
    borderRadius: 10,
    width: 'auto',
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});