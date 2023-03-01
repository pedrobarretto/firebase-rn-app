import React, { useState } from 'react';
import { Modal, StyleSheet, TextInput, View, Text, TouchableOpacity, Platform } from 'react-native';
import { LoadingButton } from '..';
import { useSnackBar } from '../../hooks';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (oldPassword: string, newPassword: string) => Promise<unknown>;
}

export const ChangePasswordModal = ({ isOpen, onClose, onSubmit }: ChangePasswordModalProps) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setState } = useSnackBar();

  const handleOldPasswordChange = (text: string) => {
    setOldPassword(text);
  };

  const handleNewPasswordChange = (text: string) => {
    setNewPassword(text);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(oldPassword, newPassword);
    } catch (error) {
      setState({
        isSnackBarOpen: true,
        message: 'Erro ao alterar senha',
        type: 'error'
      })
    }
    setIsLoading(false);
  };

  return (
    <Modal visible={isOpen} animationType='slide' transparent={true}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder='Senha atual'
              value={oldPassword}
              onChangeText={handleOldPasswordChange}
              style={styles.input}
              secureTextEntry
            />
            <TextInput
              placeholder='Nova senha'
              value={newPassword}
              onChangeText={handleNewPasswordChange}
              style={styles.input}
              secureTextEntry
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Não</Text>
            </TouchableOpacity>
            <LoadingButton
              btnStyle={[styles.button, styles.confirmButton]}
              textStyle={{ color: '#fff' }}
              onPress={handleSubmit}
              title='Salvar'
              isLoading={isLoading}
              onlyPropsStyle={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

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
    elevation: 8
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%'
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
    backgroundColor: '#e35e00'
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    padding:10,
    backgroundColor: '#fff',
    borderRadius:5,
    paddingVertical: 8,
    width:'80%',
    height: 50,
    alignSelf:'center',
    textAlign:'left',
    justifyContent:'center',
    marginBottom: '5%',
    elevation: Platform.OS === 'ios' ? 2 : 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  inputContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});