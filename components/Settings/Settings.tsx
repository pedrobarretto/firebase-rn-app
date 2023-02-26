import { signOut, User as Firebaseuser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updatePassword } from 'firebase/auth';
import { ChangePasswordModal, ConfirmExcludeAccount } from '..';
import { FirebaseError } from 'firebase/app';

export function Settings() {
  const { rawUser, user, setUser, setRawUser } = useUser();
  const { setRegister } = useRegisters();
  const { setState } = useSnackBar();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteBudgetsOpen, setIsDeleteBudgetsOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

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

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    try {
      const authCredential = EmailAuthProvider.credential(
        user.email,
        oldPassword
      );
      await reauthenticateWithCredential(rawUser, authCredential);
  
      await updatePassword(rawUser, newPassword);
      setIsChangePasswordOpen(false);
    } catch (error) {
      return error;
    }
  }

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
      <TouchableOpacity style={{ ...styles.button, backgroundColor: '#e35e00' }} onPress={() => setIsChangePasswordOpen(true)}>
        <MaterialCommunityIcons name='key-change' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Alterar senha</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{
        ...styles.button,
        backgroundColor: '#e35e00'
      }} onPress={() => setIsDeleteBudgetsOpen(true)}>
        <Entypo name='new-message' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Recomeçar registros</Text>
      </TouchableOpacity>
      <TouchableOpacity style={{ ...styles.button, backgroundColor: '#028e4d' }} onPress={() => setIsBugModalOpen(true)}>
        <Entypo name='bug' size={24} color='#fff' />
        <Text style={{ ...styles.buttonText, color: '#fff' }}>Reportar um Bug</Text>
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

      <ChangePasswordModal
        onClose={() => setIsChangePasswordOpen(false)}
        onSubmit={handleChangePassword}
        isOpen={isChangePasswordOpen}
      />
      <ConfirmExcludeAccount
        isOpen={isDeleteModalOpen}
        text={'Você tem certeza que gostaria de deletar sua conta?'}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
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
  text: {
    fontWeight: '600',
    fontSize: 16
  }
});