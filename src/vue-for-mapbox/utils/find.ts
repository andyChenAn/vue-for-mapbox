export default function find<T> (target: any , list: string[]): T {
  let res = {} as T;
  for (let key in target) {
    if (list.includes(key) && !!target[key]) {
      // @ts-ignore
      res[key] = target[key];
    }
  }
  return res;
};