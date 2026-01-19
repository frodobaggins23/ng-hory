export const flatArrayFromMap = <T>(map: Record<string, T[]>): T[] => {
  return Object.values(map).reduce((acc, arr) => acc.concat(arr), []);
};

export const extractDataByKey = <T, K extends keyof T>(data: T[], key: K): T[K][] => {
  return data.map(item => item[key]);
};

export const filterDataByKey = <T, K extends keyof T>(
  data: T[],
  key: K,
  predicate: (value: T[K]) => boolean
): T[] => {
  return data.filter(item => predicate(item[key]));
};
