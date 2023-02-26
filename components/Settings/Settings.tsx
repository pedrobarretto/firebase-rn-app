import { deleteUser, signOut, User as Firebaseuser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { auth, db } from '../../config';
import { useRegisters, useSnackBar, useUser } from '../../hooks';
import { User } from '../../interfaces';
import * as rootNavigation from '../../utils';
import { deleteAllBudgets, HOME } from '../../utils';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { BugReportModal, ConfirmDelete } from '..';
import { AntDesign } from '@expo/vector-icons';

export function Settings() {
  const { rawUser, user, setUser, setRawUser } = useUser();
  const { setRegister } = useRegisters();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { setState } = useSnackBar();
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

  const handleDeleteAccount = async (userPassword?: string) => {
    try {
      const authCredential = EmailAuthProvider.credential(
        user.email,
        'Senha123'
      );

      await reauthenticateWithCredential(rawUser, authCredential);

      // TODO: Se der erro na linha 63, a linha 59 terá sido executada.
      // await deleteUser(rawUser);
      await auth.currentUser?.delete();

      const userRef = doc(db, 'users', user.id);
      await deleteDoc(userRef);

      const budgetRef = doc(db, 'budgets', user.id);
      await deleteDoc(budgetRef);

      setUser({} as User);
      setRegister({ values: [], total: 0 });
      setRawUser({} as Firebaseuser);
      rootNavigation.navigate(HOME);
    } catch (error) {
      console.log(error);
      setState({
        isSnackBarOpen: true,
        message: 'Erro ao deletar conta',
        type: 'error'
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>Logado como: {user.email}</Text>
        <Text style={styles.text}>
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
        }} onPress={() => setIsDeleteModalOpen(true)}>
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
<<<<<<< HEAD
        isOpen={isDeleteModalOpen}
        text={'Você tem certeza que gostaria de deletar sua conta?'}
        onConfirm={handleDeleteAccount}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
      <BugReportModal
        visible={isBugModalOpen}
        onSubmit={handleReportBug}
        onClose={onClose} />
=======
        isOpen={isDeleteBudgetsOpen}
        onCancel={() => setIsDeleteBudgetsOpen(false)}
        text={'Você tem certeza que gostaria de deletar todos os seus ganhos e gastos?'}
        onConfirm={handleDeleteRecords}
      />
      <BugReportModal visible={isBugModalOpen} onSubmit={handleReportBug} onClose={onClose} />
>>>>>>> main
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
  text: {
    fontWeight: '600',
    fontSize: 16
  }
});