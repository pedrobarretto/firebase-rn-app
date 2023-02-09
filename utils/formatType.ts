import { Type } from '../interfaces';

export function formatType(type: Type) {
  return (type === Type.Income ? 'Ganho' : 'Gasto');
}