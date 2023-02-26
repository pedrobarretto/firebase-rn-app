import { FirebaseError } from 'firebase/app';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Platform } from 'react-native';
import { useSnackBar } from '../../hooks';
import { HOME } from '../../utils';
import * as rootNavigation from '../../utils';
import { LoadingButton } from '../LoadingButton/LoadingButton';

interface ConfirmExcludeAccountModalProps {
  isOpen: boolean;
  text: string;
  onConfirm: (password: string) => Promise<unknown>;
  onCancel: () => void;
}

export function ConfirmExcludeAccount({ text, onConfirm, onCancel, isOpen }: ConfirmExcludeAccountModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { setState } = useSnackBar();

  const onClose = () => {
    setPassword('');
    onCancel();
  }

  const mapError = (error: string) => {
    console.log('error: ', error);
    switch (error) {
      case 'auth/wrong-password':
        return 'Senha incorreta';
      default:
        return 'Erro ao deletar conta';
    }
  }

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm(password);
      setIsLoading(false);
      onCancel();
      rootNavigation.navigate(HOME);
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.error(error);
        setState({
          isSnackBarOpen: true,
          message: mapError(error.code),
          type: 'error'
        });
      }
      setIsLoading(false);
    }
  }
  
  return (
    <Modal visible={isOpen} animationType='slide' transparent={true}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <Text style={styles.title}>Digite sua senha atual para continuar</Text>
          <TextInput
              placeholder='Senha atual'
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={styles.input}
              secureTextEntry
            />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Não</Text>
            </TouchableOpacity>
            <LoadingButton
              btnStyle={[styles.button, styles.confirmButton]}
              textStyle={{ color: '#fff' }}
              onPress={handleConfirm}
              title='Deletar Conta'
              isLoading={isLoading}
              onlyPropsStyle={true}
              isDisabled={password.length === 0}
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
    width: '80%'
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
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