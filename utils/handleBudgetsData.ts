import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { Budgets } from '../interfaces';

export const getData = async (id: string) => {
  const docRef = doc(db, 'budgets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data().values;
  } else {
    console.log("No such document!");
    return [];
  }
}

export const addData = async (budget: Budgets, userId: string) => {
  const oldData = await getData(userId);
  await setDoc(doc(db, 'budgets', userId), {
    values: [
      ...oldData,
      budget
    ]
  });
}