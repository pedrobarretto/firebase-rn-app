import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { useSnackBar } from '../../hooks';
import { LoadingButton } from '../LoadingButton/LoadingButton';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  text: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export function ConfirmDelete({ text, onConfirm, onCancel, isOpen }: ConfirmDeleteModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { setState } = useSnackBar();

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setState({
        isSnackBarOpen: true,
        message: 'Erro ao realizar exclusão',
        type: 'error'
      });
      setIsLoading(false);
    }
  }
  
  return (
    <Modal visible={isOpen} animationType='slide' transparent={true}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Só para confirmar!</Text>
          <Text style={styles.text}>{text}</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Não</Text>
            </TouchableOpacity>
            <LoadingButton
              btnStyle={[styles.button, styles.confirmButton]}
              textStyle={{ color: '#fff' }}
              onPress={handleConfirm}
              title='Sim'
              isLoading={isLoading}
              onlyPropsStyle={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#CCCCCC',
  },
  confirmButton: {
    backgroundColor: 'red'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});