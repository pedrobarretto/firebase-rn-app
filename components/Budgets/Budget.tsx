import { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRegisters, useSnackBar, useUser } from '../../hooks';
import { Budgets, Type } from '../../interfaces';
import { calcTotalOnDelete, currencyFormat, deleteBudget, deleteBudgetChatGPT, formatType, handleDeleteCategories } from '../../utils';
import { ConfirmDelete } from '../ConfirmDelete/ConfirmDelete';

interface Props {
  budget: Budgets;
}

export function Budget({ budget }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const { user } = useUser();
  const { register, setRegister } = useRegisters();

  const handleLongPress = () => {
    setIsDeleteModalOpen(true);
  }

  const onCancel = () => {
    setIsDeleteModalOpen(false);
  }

  const onConfirm = async () => {
    const oldData = register;
    const newBudgets = register.values.filter((x: Budgets) => x.id !== budget.id);
    await deleteBudgetChatGPT(budget.id, user.id);
    setRegister({
      values: [...newBudgets],
      total: calcTotalOnDelete(register.total, budget),
      categories: handleDeleteCategories(budget, oldData)
    });
    setIsDeleteModalOpen(false);
  }

  return (
    <>
      {
        budget && (
          <>
            <Pressable key={budget.id} style={styles.box} onLongPress={handleLongPress}>
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
          </Pressable>

          <ConfirmDelete
            isOpen={isDeleteModalOpen}
            onCancel={onCancel}
            text={`Você tem certeza que quer deletar o ${formatType(budget.type)} "${budget.name}"?`}
            onConfirm={onConfirm}
          />
        </>
        )
      }
    </>
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