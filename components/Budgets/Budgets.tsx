import { View, Text } from 'react-native';
import { db, auth } from '../../config';
import { CustomButton } from '..';
import { useState } from 'react';
import { Budgets } from '../../interfaces/Budget';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import uuid from 'react-native-uuid';
import { useUser } from '../../hooks';

export function BudgetsPage() {
  const [data, setData] = useState<Budgets[]>([]);
  const { user, setUser } = useUser();

  const getData = async () => {
    const docRef = doc(db, 'budgets', user.id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return docSnap.data().values;
    } else {
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
          category: 'Food',
          name: 'Restaurante mexicano',
          type: 'Spent',
          value: 60,
          id: uuid.v4()
        }
      ]
    });
    console.log(data);
  }

  return (
    <View>
      {
        data.map((x) => {
          return (
            <View key={x.id}>
              <Text>{x.name}</Text>
              <Text>{x.category}</Text>
              <Text>{x.type}</Text>
              <Text>{x.value}</Text>
            </View>
          );
        })
      }
      <CustomButton title='Logout' onPress={() => signOut(auth)} />
      <CustomButton title='Pegar dados' onPress={() => getData()} />
      <CustomButton title='Salvar dados' onPress={() => addData()} />
    </View>
  )
}