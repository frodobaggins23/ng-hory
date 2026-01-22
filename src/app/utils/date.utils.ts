export const isDateInYear = (dateStr: string, year: number): boolean => {
  const date = new Date(dateStr);
  return date.getFullYear() === year;
};

export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};
