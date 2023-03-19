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
      // Posso mudar para:
      // if (x.type !== budget.type) {
      //   x.total -= budget.value;
      //   return categories;
      // }

      // x.total += budget.value;
      // return categories;

      if (x.category === budget.category) {
        if (x.type === Type.Income && budget.type === Type.Income) {
          x.total += budget.value;
          return categories;
        }

        if (x.type === Type.Spent && budget.type === Type.Spent) {
          x.total += budget.value;
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

export async function deleteBudgetChatGPT(id: string, userId: string) {
  const oldData = await getData(userId);
  const [deletedBudget] = oldData.values.filter((x: Budgets) => x.id === id);
  const newData = oldData.values.filter((x: Budgets) => x.id !== id);

  console.log('deletedBudget: ', deletedBudget);

  // Calculate the updated totals for each category
  const updatedCategories = oldData.categories.map((category) => {
    if (category.category === deletedBudget.category) {
      const typeMultiplier = deletedBudget.type === Type.Spent ? -1 : 1;
      const updatedTotal = category.total + typeMultiplier * deletedBudget.value;
      return {
        ...category,
        total: updatedTotal,
      };
    } else {
      return category;
    }
  });

  // Remove the category if the deleted budget was the last one in that category
  const categoryCount = newData.reduce((counts: Record<string, number>, item) => {
    const category = item.category;
    counts[category] = (counts[category] || 0) + 1;
    return counts;
  }, {});
  const hasRemainingBudgets = categoryCount[deletedBudget.category] > 0;
  const updatedCategoriesWithoutDeletedCategory = updatedCategories.filter((category) => category.category !== deletedBudget.category);

  // Update the document in Firestore
  await setDoc(doc(db, 'budgets', userId), {
    values: [...newData],
    total: newData.length === 0 ? 0 : handleCalcTotalOnDeleteBudget(oldData.total, deletedBudget),
    categories: hasRemainingBudgets ? updatedCategories : updatedCategoriesWithoutDeletedCategory,
  });
}

export async function deleteBudget(id: string, userId: string) {
  const oldData = await getData(userId);
  let categories = oldData.categories;
  const [deletedBudget] = oldData.values.filter((x: Budgets) => x.id === id);
  const newData = oldData.values.filter((x: Budgets) => x.id !== id);

  console.log('deletedBudget: ', deletedBudget);

  const categoryCounts: Record<string, number> = oldData.values.reduce((counts: Record<string, number>, item) => {
    const category = item.category;
    if (category in counts) {
      counts[category]++;
    } else {
      counts[category] = 1;
    }
    return counts;
  }, {});

  console.log('categoryCounts: ', categoryCounts);

  // Foi deletado o ultimo registro da categoria
  if (categoryCounts[deletedBudget.category] - 1 === 0) {
    categories = categories.filter(x => x.category !== deletedBudget.category);
  } else {
    // Ainda existem registros com a mesma categoria
    categories.map(cat => {
      if (cat.category === deletedBudget.category) {
        cat.type === Type.Spent ? cat.total -= deletedBudget.value :cat.total += deletedBudget.value;
      }
    })
  }

  await setDoc(doc(db, 'budgets', userId), {
    values: [...newData],
    total:
      newData.length === 0 ?
      0 :
      handleCalcTotalOnDeleteBudget(oldData.total, deletedBudget),
    categories
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

  // if (total < 0) return 0;

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