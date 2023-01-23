import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db, auth } from './config';
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { User } from './interfaces';

export default function App() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [data, setData] = useState<any>([]);
  const [user, setUser] = useState<User>({} as User);
  const [error, setError] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      console.log('Auth has changed');
      if (user) {
        console.log(`Setting user ${user.email}`);
        setUser({ email: String(user.email), id: user.uid, createdAt: new Date() });  // FIXME: Fix createdAt prop
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
      setUser({ id: info.user.uid, email: String(info.user.email), createdAt: new Date() }); // FIXME: Fix createdAt prop
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
    const docRef = doc(db, 'budgets', user.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data().values;
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return [];
    }
  }

  const addData = async () => {
    const oldData = await getData();
    const data = await setDoc(doc(db, 'budgets', user.id), {
      values: [
        ...oldData,
        {
          category: 'Payment',
          name: 'Mutant',
          type: 'Income',
          value: 1500
        }
      ]
    });
    console.log(data);
  }

  return (
    <View style={styles.container}>
      {
        (
          user?.id !== undefined ?
          <>
            <Text>Logado!</Text>
            <Button title='Logout' onPress={() => signOut(auth)} />
            <Button title='Pegar dados' onPress={() => getData()} />
            <Button title='Salvar dados' onPress={() => addData()} />
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
