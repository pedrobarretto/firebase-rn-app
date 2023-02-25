import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { auth, db } from '../../config';
import { useRegisters, useUser } from '../../hooks';
import { User } from '../../interfaces';
import * as rootNavigation from '../../utils';
import { deleteAllBudgets, HOME } from '../../utils';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { BugReportModal } from '../BugReportModal/BugReportModal';
import { AntDesign } from '@expo/vector-icons';
import { ConfirmDelete } from '../ConfirmDelete/ConfirmDelete';

export function Settings() {
  const { user, setUser } = useUser();
  const { setRegister } = useRegisters();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isDeleteBudgetsOpen, setIsDeleteBudgetsOpen] = useState(false);

  const handleLogout = () => {
    setUser({} as User);
    setRegister({ values: [], total: 0 });
    signOut(auth);
    rootNavigation.navigate(HOME);
  }

  const handleReportBug = async (text: string) => {
    const documentRef = collection(db, 'bugs');
    await addDoc(documentRef, {
      user: { ...user },
      text
    });
    onClose();
  };

  const onClose = () => {
    setIsBugModalOpen(false);
  }

  const handleGitHubPress = () => {
    Linking.openURL('https://github.com/pedrobarretto/');
  };

  const handleLinkedInPress = () => {
    Linking.openURL('https://www.linkedin.com/in/pedrobarretto/');
  };

  const handleDeleteRecords = async () => {
    await deleteAllBudgets(user.id);
    setRegister({ values: [], total: 0 });
    setIsDeleteBudgetsOpen(false);
  }

  const handleDeleteAccount = () => {
    console.log('Delete Account pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text>
          Este app é um MVP. Caso encontre bugs, agradeço se
          reportar! Isso irá ajudar no desenvolvimento
          das próximas versões.
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Feather name='log-out' size={24} color='black' />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.button, backgroundColor: '#028e4d' }} onPress={() => setIsBugModalOpen(true)}>
        <Entypo name='bug' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Reportar um Bug</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.button,
        backgroundColor: '#e35e00'
      }} onPress={() => setIsDeleteBudgetsOpen(true)}>
        <Entypo name='new-message' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Recomeçar registros</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
          ...styles.button,
          backgroundColor: '#ff3939'
        }} onPress={handleDeleteAccount}>
        <Feather name='trash-2' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Excluir Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: '#0e76a8'
        }}
        onPress={handleLinkedInPress}
      >
        <AntDesign name='linkedin-square' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>LinkedIn</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: '#211F1F'
        }}
        onPress={handleGitHubPress}
      >
        <AntDesign name='github' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>GitHub</Text>
      </TouchableOpacity>

      <ConfirmDelete
        isOpen={isDeleteBudgetsOpen}
        onCancel={() => setIsDeleteBudgetsOpen(false)}
        text={'Você tem certeza que gostaria de deletar todos os seus ganhos e gastos?'}
        onConfirm={handleDeleteRecords}
      />
      <BugReportModal visible={isBugModalOpen} onSubmit={handleReportBug} onClose={onClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
});