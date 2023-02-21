import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Budgets, Type } from '../../interfaces/Budget';
import uuid from 'react-native-uuid';
import { useRegisters, useUser } from '../../hooks';
import { addData, BUDGETS, calcTotal, emptyBudget } from '../../utils';
import * as rootNavigation from '../../utils';
import { Entypo } from '@expo/vector-icons';
import { LoadingButton } from '..';

export function NewBudget() {
  const [budget, setBudget] = useState<Budgets>(emptyBudget);
  const { register, setRegister } = useRegisters();
  const { user } = useUser();
  const [isDisabled, setIsDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const saveData = async () => {
    setIsLoading(true);
    await addData({
      ...budget,
      id: String(uuid.v4())
    }, user.id);
    setRegister({
      values: [...register.values, budget],
      total: calcTotal(register.total, budget)
    });
    setBudget(emptyBudget);
    setIsLoading(false);
    rootNavigation.navigate(BUDGETS);
  }

  useEffect(() => {
    let canSave = true;
    const { category, name, type, value } = budget;
    
    if (
      name.length !== 0 &&
      category.length !== 0 &&
      category.length !== 0 &&
      type === Type.Income || type === Type.Spent &&
      value >= 1
    ) canSave = false;

    setIsDisabled(canSave);
  }, [budget]);

  const handleValueChange = (value: string) => {
    value = value.replace(',', '.');
    value = value.replace('-', '');

    setBudget({ ...budget, value: Number(value) });
  };

  return (
    <View style={styles.container}>
      <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: '600' }}>Novo registro</Text>
      <TextInput
        placeholder='Nome'
        value={budget.name}
        onChangeText={(text) => setBudget({ ...budget, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder='Categoria'
        value={budget.category}
        onChangeText={(text) => setBudget({ ...budget, category: text })}
        style={styles.input}
      />
      <TextInput
        placeholder='Valor'
        keyboardType='numeric'
        value={budget.value?.toString()}
        onChangeText={(text) => handleValueChange(text)}
        style={styles.input}
      />
      <View style={styles.box}>
        <Pressable style={budget.type === Type.Income ? styles.incomeBtnClicked : styles.incomeBtn} onPress={() => {
          setBudget({ ...budget, type: Type.Income })
        }}>
          <Text style={styles.btnText}>Ganho</Text>
        </Pressable>
        <Pressable style={budget.type === Type.Spent ? styles.spentBtnClicked : styles.spentBtn} onPress={() => {
          setBudget({ ...budget, type: Type.Spent })
        }}>
          <Text style={styles.btnText}>Gasto</Text>
        </Pressable>
      </View>

      <LoadingButton
        title='Salvar'
        onPress={saveData}
        btnStyle={{ backgroundColor: '#e35e00' }}
        textStyle={{ color: '#fff' }}
        icon={<Entypo name='save' size={24} color='#fff' />}
        isDisabled={isDisabled}
        isLoading={isLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    padding:10,
    backgroundColor:'#fff',
    borderRadius:5,
    paddingVertical: 8,
    width:'90%',
    alignSelf:'center',
    textAlign:"left",
    justifyContent:'center',
    marginBottom: '5%',
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '50%',
    paddingBottom: 15
  },
  spentBtn: {
    padding: 10,
    backgroundColor: '#ff7a7ab6',
    borderRadius: 10
  },
  spentBtnClicked: {
    padding: 10,
    backgroundColor: '#ff5e5ee9',
    borderRadius: 10
  },
  incomeBtn: {
    padding: 10,
    backgroundColor: '#7aff7fb6',
    borderRadius: 10
  },
  incomeBtnClicked: {
    padding: 10,
    backgroundColor: '#5eff64e9',
    borderRadius: 10
  },
  btnText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  }
});