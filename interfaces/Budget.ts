export interface Budgets {
  category: string;
  name: string;
  type: Type;
  value: number;
  id: string;
}

export enum Type {
  Income = 'Income',
  Spent = 'Spent',
  None = 'None'
}

export interface Categorie {
  category: string;
  total: number;
  type: Type;
}

export interface Registers {
  values: Budgets[];
  total: number;
  categories: Categorie[];
}
