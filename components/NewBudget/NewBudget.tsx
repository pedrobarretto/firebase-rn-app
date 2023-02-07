import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Budgets, Type } from '../../interfaces/Budget';
import { CustomButton } from '../Button/Button';
import uuid from 'react-native-uuid';

interface Props {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
  addData: (x: Budgets) => Promise<void>;
  saveState: (x: Budgets) => void;
}

export function NewBudget({ isOpen, setIsOpen, addData, saveState }: Props) {
  const [budget, setBudget] = useState<Budgets>({} as Budgets);

  const saveData = async () => {
    await addData({
      ...budget,
      id: String(uuid.v4())
    });
    saveState(budget);
    setIsOpen(false);
  }

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: '600' }}>Novo gasto</Text>
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
              value={budget.value}
              onChangeText={(text) => setBudget({ ...budget, value: Number(text) })}
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

            <CustomButton
              title='Salvar'
              onPress={saveData}/>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    padding:10,
    backgroundColor:'#7f7f7',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#111',
    borderRadius:5,
    paddingVertical: 8,
    width:'60%',
    alignSelf:'center',
    textAlign:"left",
    justifyContent:'center',
    marginBottom: '5%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%'
  },
  box: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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