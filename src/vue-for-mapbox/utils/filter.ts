export default function filter (obj: {[key: string]: any}) {
  let res: {[key: string]: any} = {};
  for (let key in obj) {
    if (obj[key]) {
      res[key] = obj[key];
    }
  }
  return res;
}