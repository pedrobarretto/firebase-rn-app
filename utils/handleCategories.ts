import { Budgets, Registers, Type } from '../interfaces';

export function handleDeleteCategories(deletedBudget: Budgets, oldData: Registers) {
  const newData = oldData.values.filter((x: Budgets) => x.id !== deletedBudget.id);

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
  
  return hasRemainingBudgets ? updatedCategories : updatedCategoriesWithoutDeletedCategory;
}