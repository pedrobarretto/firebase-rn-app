import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { db, auth } from './config';
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function App() {
  const [email, setEmail] = useState<string>('Email here');
  const [password, setPassword] = useState<string>('');
  const [data, setData] = useState<any>([]);

  const signUp = async () => {
    try {
      const info = await createUserWithEmailAndPassword(auth, email, password);
      console.log(info);   
    } catch (error) {
      console.log(error);
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
      <TextInput 
        placeholder='Email'
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <Button title='Create Account' onPress={signUp} />
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
    width: 250,
    height: 44,
    padding: 10,
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#e8e8e8'
  },
});
