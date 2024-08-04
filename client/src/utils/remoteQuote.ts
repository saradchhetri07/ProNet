export const removeQuote = (name: string) => {
  if (name.startsWith('"') && name.endsWith('"')) {
    name = name.substring(1, name.length - 1);
  }
  return name;
};
