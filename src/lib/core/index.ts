export const groupBy = <T>(obj: T, key: keyof T) => Object.groupBy(obj, (f: T) => f[key]);
