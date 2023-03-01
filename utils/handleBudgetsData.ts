import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config';
import { Budgets, Categorie, Registers, Type } from '../interfaces';

export async function getData(id: string): Promise<Registers> {
  const docRef = doc(db, 'budgets', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log('Document data:', docSnap.data());
    return docSnap.data() as Registers;
  } else {
    console.log('No such document!');
    return { total: 0, values: [], categories: [] };
  }
}

export async function addData(budget: Budgets, userId: string) {
  const oldData = await getData(userId);
  let categories: Categorie[] = [...oldData.categories];

  const catExist = oldData.values.filter(x => x.category === budget.category);

  if (catExist.length !== 0) {
    console.log('Categorie already exists...');
    const [cat] = categories.filter(x => x.category === budget.category);
    console.log('Cat: ', cat);
    categories.forEach(x => {
      // FIXME: Melhorar essa porra
      if (x.category === budget.category) {
        if (x.type === Type.Income && budget.type === Type.Income) {
          x.total += budget.value;
          return categories;
        }

        if (x.type === Type.Spent && budget.type === Type.Spent) {
          x.total -= budget.value;
          return categories;
        }

        x.total -= budget.value;
        return categories;
      }
    });
  } else {
    console.log('Categorie does not exist. Will create it...')
    categories = [...categories, { category: budget.category, total: budget.value, type: budget.type}];
  }

  await setDoc(doc(db, 'budgets', userId), {
    total: budget.type === Type.Income?
          oldData.total += budget.value :
          oldData.total -= budget.value,
    values: [
      ...oldData.values,
      budget
    ],
    categories
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
    total: 0,
    categories: []
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