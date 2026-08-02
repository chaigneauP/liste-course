export type Item = {
  id: string;
  name: string;
};

export type ListStatus = 'active' | 'archived';

export type ShoppingList = {
  id: string;
  name: string;
  items: Item[];
  status: ListStatus;
  createdAt: string;
  updatedAt: string;
};
