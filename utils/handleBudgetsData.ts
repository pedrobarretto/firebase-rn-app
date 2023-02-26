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
  const [deletedBudget] = oldData.values.filter((x: Budgets) => x.id === id);
  const newData = oldData.values.filter((x: Budgets) => x.id !== id);
  await setDoc(doc(db, 'budgets', userId), {
    values: [...newData],
    total:
      newData.length === 0 ?
      0 :
      handleCalcTotalOnDeleteBudget(oldData.total, deletedBudget)
  });
}

export async function deleteAllBudgets(userId: string) {
  await setDoc(doc(db, 'budgets', userId), {
    values: [],
    total: 0
  });
}

export function handleCalcTotalOnDeleteBudget(total: number, budget: Budgets) {
  const { value } = budget;

  if (total < 0) return 0;

  if (budget.type === Type.Spent) {
    return total + value;
  }

  return total - value;
}

export function calcTotal(total: number, budget: Budgets) {
  return (budget.type === Type.Income ? total + budget.value : total - budget.value);
}

export function calcTotalOnDelete(total: number, budget: Budgets) {
  return (budget.type === Type.Income ? total - budget.value : total + budget.value);
}