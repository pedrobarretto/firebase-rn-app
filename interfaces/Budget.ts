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

export interface Registers {
  values: Budgets[];
  total: number;
}