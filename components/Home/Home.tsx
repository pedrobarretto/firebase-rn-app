import { StatusBar } from 'expo-status-bar';
import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback } from 'react-native';
import { LoadingButton } from '..';
import { auth, db } from '../../config';
import { useSnackBar, useUser } from '../../hooks';
import { User } from '../../interfaces';
import { BUDGETS, dismissKeyboard, isEmailValid, mapErrorCodeToMessage } from '../../utils';

export function Home({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');
  const { setUser, setRawUser } = useUser();
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const { state, setState } = useSnackBar();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
        // FIXME: Fix createdAt prop
        setRawUser(user);
        setUser({ email: String(user.email), id: user.uid, createdAt: new Date() });
        navigation.navigate(BUDGETS);
      } else {
        console.log('Not logged in')
        setUser({} as User);
        setRawUser({} as FirebaseUser);
      }
    })
  }, []);

  const signUp = async () => {
    setIsRegisterLoading(true);
    try {
      const info = await createUserWithEmailAndPassword(auth, email, password);
      const createdAt = new Date();
      await setDoc(doc(db, 'users', info.user.uid), {
        email,
        createdAt,
        id: info.user.uid
      });
      setUser({ id: info.user.uid, email, createdAt });
      console.log(info);
    } catch (error) {
      console.log(error);
      if (error instanceof FirebaseError) {
        setState({
          isSnackBarOpen: true,
          message: mapErrorCodeToMessage(error.code),
          type: 'error'
        });
      }
    }
    setIsRegisterLoading(false);
  }

  const login = async () => {
    setIsLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
    } catch (error) {
      if (error instanceof FirebaseError) {
        setState({
          isSnackBarOpen: true,
          message: mapErrorCodeToMessage(error.code),
          type: 'error'
        });
      }
    }
    setIsLoginLoading(false);
  }
  
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAvoidingView
        style={styles.keyBoardAvoidContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          <TextInput
            placeholder='Email'
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
            />
          <TextInput 
            placeholder='Senha'
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry={true}
          />
          <LoadingButton
            title='Cadastrar'
            onPress={signUp}
            isDisabled={email.length === 0 || password.length === 0}
            btnStyle={{ backgroundColor: '#e35e00'  }}
            textStyle={{ color: '#fff' }}
            isLoading={isRegisterLoading}
          />
          <LoadingButton
            title='Login'
            onPress={login}
            isDisabled={email.length === 0 || password.length === 0}
            btnStyle={{ backgroundColor: '#e35e00'  }}
            textStyle={{ color: '#fff' }}
            isLoading={isLoginLoading}
          />
          {
            (
              error !== '' && (
                <Text>{error}</Text>
              )
            )
          }
          <StatusBar style="auto" />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%'
  },
  keyBoardAvoidContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding:10,
    backgroundColor: '#fff',
    borderRadius:5,
    paddingVertical: 8,
    width:'80%',
    height: 50,
    alignSelf:'center',
    textAlign:"left",
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
  }
});