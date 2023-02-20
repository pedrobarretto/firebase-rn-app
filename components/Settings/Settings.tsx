import { signOut } from 'firebase/auth';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../../config';
import { useBudgets, useUser } from '../../hooks';
import { User } from '../../interfaces';
import * as rootNavigation from '../../utils';
import { HOME } from '../../utils';
import { Feather } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { addDoc, collection } from 'firebase/firestore';
import { useState } from 'react';
import { BugReportModal } from '../BugReportModal/BugReportModal';

export function Settings() {
  const { user, setUser } = useUser();
  const { setBudgets } = useBudgets();
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);

  const handleLogout = () => {
    setUser({} as User);
    setBudgets([]);
    signOut(auth);
    rootNavigation.navigate(HOME);
  }

  const handleDeleteAccount = () => {
    console.log('Delete Account pressed');
  };

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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Feather name="log-out" size={24} color="black" />
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
        <Feather name="trash-2" size={24} color="black" />
        <Text style={styles.buttonText}>Excluir Conta</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => setIsBugModalOpen(true)}>
        <Entypo name="bug" size={24} color="black" />
        <Text style={styles.buttonText}>Reportar um Bug</Text>
      </TouchableOpacity>

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