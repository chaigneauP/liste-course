export type Item = {
  id: string;
  name: string;
  checked?: boolean;
};

export function createItem(id: string, name: string): Item {
  return { id, name: name.trim() };
}
