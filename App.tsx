import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { db, auth } from './config';
import {  doc, getDoc, setDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { User } from './interfaces';
import { CustomButton } from './components'
import { Budgets } from './interfaces/Budget';
import { UserProvider } from './context';
import { useUser } from './hooks';

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [data, setData] = useState<Budgets[]>([]);
  const [error, setError] = useState('');
  const { user, setUser } = useUser();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
        setUser({ email: String(user.email), id: user.uid, createdAt: new Date() });  // FIXME: Fix createdAt prop
        // setData(await getData());
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
      const info = await signInWithEmailAndPassword(auth, email, password);
      setError('');
      console.log(info);   
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        setError(mapAuthCodeToMessage(error.code))
      }
    }
  }

  return (
    <UserProvider>
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
    </UserProvider>
  );
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
