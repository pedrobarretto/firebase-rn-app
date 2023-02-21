import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { Budgets, Registers, Type } from '../interfaces';

export async function getData(id: string): Promise<Registers> {
  const docRef = doc(db, 'budgets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    return docSnap.data() as Registers;
  } else {
    console.log('No such document!');
    return { total: 0, values: [] };
  }
}

export async function addData(budget: Budgets, userId: string) {
  const oldData = await getData(userId);
  await setDoc(doc(db, 'budgets', userId), {
    total: budget.type === Type.Income?
          oldData.total += budget.value :
          oldData.total -= budget.value,
    values: [
      ...oldData.values,
      budget
    ]
  });
}

export async function deleteBudget(id: string, userId: string) {
  const oldData = await getData(userId);
  const newData = oldData.values.filter((x: Budgets) => x.id !== id);
  const [deletedBudget] = oldData.values.filter((x: Budgets) => x.id === id);
  await setDoc(doc(db, 'budgets', userId), {
    values: [...newData],
    total: oldData.total - deletedBudget.value
  });
}

export function calcTotal(total: number, budget: Budgets) {
  return (budget.type === Type.Income ? total + budget.value : total - budget.value);
}

export function calcTotalOnDelete(total: number, budget: Budgets) {
  return (budget.type === Type.Income ? total - budget.value : total + budget.value);
}