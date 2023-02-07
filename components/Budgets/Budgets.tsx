import { View, Text, StyleSheet } from 'react-native';
import { db, auth } from '../../config';
import { CustomButton } from '..';
import { useEffect, useState } from 'react';
import { Budgets } from '../../interfaces/Budget';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useUser } from '../../hooks';
import { User } from '../../interfaces';
import { NewBudget } from '..';

export function BudgetsPage({ navigation }: any) {
  const [data, setData] = useState<Budgets[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
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
    setData(data);
  }

  const addData = async (budget: Budgets) => {
    const oldData = await getData();
    await setDoc(doc(db, 'budgets', user.id), {
      values: [
        ...oldData,
        budget
      ]
    });
  }

  const logout = () => {
    setUser({} as User);
    setData([]);
    signOut(auth);
    navigation.navigate('Home');
  }

  const saveState = (budget: Budgets) => {
    setData((x) => {
      return [...x, budget];
    })
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
      <View style={styles.btnBox}>
        <CustomButton title='Novo Gasto' onPress={() => setIsOpen(true)} />
        <CustomButton title='Logout' onPress={logout} />
      </View>

      <NewBudget isOpen={isOpen} setIsOpen={setIsOpen} addData={addData} saveState={saveState} />
    </View>
  )
}

const styles = StyleSheet.create({
  btnBox: {
    bottom: 0
  }
});