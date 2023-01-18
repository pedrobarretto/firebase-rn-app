import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import { db } from './config';
import { collection, getDocs, addDoc } from "firebase/firestore"; 
import { useState } from 'react';

export default function App() {
  const [data, setData] = useState<any>([]);

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
        data.map((x: any) => {
          return (
            <Text key={x.idade}>{`Nome: ${x.name}. Idade: ${x.idade}`}</Text>
          )
        })
      }
      <Button title='Pegar Dados' onPress={getData} />
      <Button title='Add Dados' onPress={addData} />
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
});
