import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import { Budgets } from '../../interfaces/Budget';
import { CustomButton } from '../Button/Button';

interface Props {
  isOpen: boolean;
  setIsOpen: (x: boolean) => void;
}

export function NewBudget({ isOpen, setIsOpen }: Props) {
  const [budget, setBudget] = useState<Budgets>({} as Budgets);

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
            <Text>Novo gasto!</Text>
            <TextInput
              placeholder='Nome'
              value={budget.name}
              onChangeText={(text) => setBudget({ ...budget, name: text })}
              style={styles.input}
            />
            <TextInput
              placeholder='Categoria'
              value={budget.name}
              onChangeText={(text) => setBudget({ ...budget, name: text })}
              style={styles.input}
            />
            <View style={styles.box}>
              <Pressable style={styles.spentBtn}>
                <Text>Gasto</Text>
              </Pressable>
              <Pressable>
                <Text>Ganho</Text>
              </Pressable>
            </View>

            <CustomButton
              title='Salvar'
              onPress={() => setIsOpen(false)}/>
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
    alignItems: 'center',
    marginTop: 22
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
      height: 2,
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
    width: '50%'
  },
  spentBtn: {
    padding: 10,
    backgroundColor: '#7aff7fb6',
    borderRadius: 10
  }
});