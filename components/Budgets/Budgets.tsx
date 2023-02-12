import { View, Text, StyleSheet, Pressable } from 'react-native';
import { db, auth } from '../../config';
import { CustomButton } from '..';
import { useEffect, useState } from 'react';
import { Budgets } from '../../interfaces/Budget';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useUser } from '../../hooks';
import { User } from '../../interfaces';
import { NewBudget } from '..';
import { Budget } from './Budget';

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
    <View style={styles.container}>
      <View>
        {
          data.map((x) => {
            return (
              <Budget key={x.id} budget={x} />
            );
          })
        }
      </View>
      <View>
        <Pressable style={styles.floatingMenuButtonStyle} onPress={() => setIsOpen(true)}>
          <Text style={styles.btnText}>+</Text>
        </Pressable>
      </View>

      {/* <CustomButton title='Logout' onPress={logout} /> */}
      <NewBudget isOpen={isOpen} setIsOpen={setIsOpen} addData={addData} saveState={saveState} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    
  },
  mainConatinerStyle: {
    flexDirection: 'column',
    flex: 1,
  },
  floatingMenuButtonStyle: {
    position: 'absolute',
    bottom: 0,
    top: 170,
    right: 10,
    elevation: 3,
    backgroundColor: 'rgb(227, 94, 0)',
    padding: 10,
    borderRadius: 50,
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 32,
  }
});