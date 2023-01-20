import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db, auth } from './config';
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const [user, setUser] = useState<{} | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
        setUser(user);
      } else {
        console.log('Not logged in')
        setUser(undefined);
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
      setUser(info);
      console.log(info);   
    } catch (error) {
      console.log(error);
    }
  }

  const login = async () => {
    try {
      const info = await signInWithEmailAndPassword(auth, email, password);
      setUser(info);
      setError('');
      console.log(info);   
    } catch (error) {
      if (error instanceof FirebaseError) {
        console.log(error.code);
        setError(mapAuthCodeToMessage(error.code))
      }
    }
  }

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, 'test'));
    querySnapshot.forEach((doc) => {
      setData([doc.data()])
    });
  }

  const addData = async () => {
    const docRef = await addDoc(collection(db, 'test'), {
      name: 'Andre Barretto',
      idade: 18
    });
  }

  return (
    <View style={styles.container}>
      {
        (
          user !== undefined ?
          <>
            <Text>Logado!</Text>
            <Button title='Logout' onPress={() => signOut(auth)} />
          </>
          :
          <>
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
            />
            <Button title='Cadastrar' onPress={signUp} />
            <Button title='Login' onPress={login} />
            {
              (
                error !== '' && (
                  <Text>{error}</Text>
                )
              )
            }
          </>
        )
      }
      <StatusBar style="auto" />
    </View>
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
  },
});
