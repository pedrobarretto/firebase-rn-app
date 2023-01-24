import { View, Text } from 'react-native';
import { db, auth } from '../../config';
import { CustomButton } from '..';
import { useEffect, useState } from 'react';
import { Budgets } from '../../interfaces/Budget';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import uuid from 'react-native-uuid';
import { useUser } from '../../hooks';
import { User } from '../../interfaces';

export function BudgetsPage({ navigation }: any) {
  const [data, setData] = useState<Budgets[]>([]);
  const { user, setUser } = useUser();

  useEffect(() => {
    startup();
  }, []);

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

  const startup = async () => {
    const data = await getData();
    console.log(data);
    setData(data);
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

  const logout = () => {
    setUser({} as User);
    setData([]);
    signOut(auth);
    navigation.navigate('Home');
  }

  return (
    <View>
      {
        data.map((x) => {
          return (
            <View key={x.id}>
              <Text key={x.id + '-' + x.name}>{x.name}</Text>
              <Text key={x.id + '-' + x.category}>{x.category}</Text>
              <Text key={x.id + '-' + x.type}>{x.type}</Text>
              <Text key={x.id + '-' + 'value'}>{x.value}</Text>
            </View>
          );
        })
      }
      <CustomButton title='Logout' onPress={logout} />
      <CustomButton title='Pegar dados' onPress={getData} />
      <CustomButton title='Salvar dados' onPress={addData} />
    </View>
  )
}