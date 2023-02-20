import { StatusBar } from 'expo-status-bar';
import { FirebaseError } from 'firebase/app';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { CustomButton } from '..';
import { auth, db } from '../../config';
import { useUser } from '../../hooks';
import { User } from '../../interfaces';
import { BUDGETS } from '../../utils';

export function Home({ navigation }: any) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState('');
  const { user, setUser } = useUser();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
        // FIXME: Fix createdAt prop
        setUser({ email: String(user.email), id: user.uid, createdAt: new Date() });
        navigation.navigate(BUDGETS);
      } else {
        console.log('Not logged in')
        setUser({} as User);
      }
    })
  }, []);

  function mapAuthCodeToMessage(authCode: string) {
    switch (authCode) {
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/invalid-email':
        return 'Email incorreto ou nao existe';
      case 'auth/too-many-requests':
        return 'Esse usuario fez muitas requisicoes, aguarde um pouco ou tente entrar com outra conta'
      default:
        return 'Erro ao realizar login';
    }
  }

  const signUp = async () => {
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
    }
  }

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError('');
      
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        setError(mapAuthCodeToMessage(error.code))
      }
    }
  }
  
  return (
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
      <CustomButton title='Cadastrar' onPress={signUp} isDisabled={email.length === 0 || password.length === 0} />
      <CustomButton title='Login' onPress={login} isDisabled={email.length === 0 || password.length === 0} />
      {
        (
          error !== '' && (
            <Text>{error}</Text>
          )
        )
      }
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    padding:10,
    backgroundColor:'#7f7f7',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#111',
    borderRadius:5,
    paddingVertical: 8,
    width:'60%',
    alignSelf:'center',
    textAlign:"left",
    justifyContent:'center',
    marginBottom: '5%',
  }
});