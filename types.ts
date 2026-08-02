export type Item = {
  id: string;
  name: string;
};

export type ShoppingList = {
  id: string;
  name: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
};
