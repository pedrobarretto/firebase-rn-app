import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSnackBar } from '../../hooks';
import { LoadingButton } from '../LoadingButton/LoadingButton';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (bugDescription: string) => Promise<void>;
};

export function BugReportModal({ visible, onClose, onSubmit }: Props) {
  const [bugDescription, setBugDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setState } = useSnackBar();

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSubmit(bugDescription);
      setBugDescription('');
      setIsLoading(false);
    } catch (error) {
      setState({
        isSnackBarOpen: true,
        message: 'Erro ao reportar bug',
        type: 'error'
      });
    }
  };

  return (
    <Modal animationType='slide' transparent visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.input}
            placeholder='Descreva seu bug...'
            onChangeText={setBugDescription}
            value={bugDescription}
            multiline
            numberOfLines={4}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Fechar</Text>
            </TouchableOpacity>
            <LoadingButton
              title='Reportar bug'
              onPress={handleSubmit}
              isLoading={isLoading}
              onlyPropsStyle={true}
              btnStyle={styles.submitButton}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    maxHeight: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#ff9800',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
